import { VFS } from '../../vfs/vfs';
import { 
    ASTNode, 
    NodeType, 
    CommandNode, 
    PipelineNode, 
    LogicalNode, 
    IfNode, 
    ForNode, 
    WhileNode, 
    SubshellNode 
} from './ast';
import { ShellEnvironment } from './environment';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { CommandRegistry } from '../registry';
import { CommandContext, CommandResult } from '../types';
import { formatError } from '../../../utils/error_codes';
import { useTerminalStore } from '../../../stores/terminalStore';

export class ShellExecutor {
    private vfs: VFS;

    constructor(vfs: VFS) {
        this.vfs = vfs;
    }

    public async execute(node: ASTNode, context: CommandContext, env: ShellEnvironment, isRoot: boolean = true): Promise<CommandResult> {
        this.lastContext = context;
        if (context.isInterrupted()) {
            return { output: '', exitCode: 130 };
        }

        let result: CommandResult;
        switch (node.type) {
            case NodeType.COMMAND: {
                const cmdNode = node as CommandNode;
                if (cmdNode.background) {
                    result = await this.launchBackgroundJob(cmdNode, context, env);
                } else {
                    result = await this.executeCommand(cmdNode, context, env);
                }
                break;
            }
            case NodeType.PIPELINE: {
                const pipeNode = node as PipelineNode;
                // If the last command in pipeline is backgrounded, the whole pipeline is
                if (pipeNode.commands[pipeNode.commands.length - 1].background) {
                    result = await this.launchBackgroundJob(pipeNode, context, env);
                } else {
                    result = await this.executePipeline(pipeNode, context, env);
                }
                break;
            }
            case NodeType.LOGICAL_AND:
                result = await this.executeLogical(node as LogicalNode, context, env, '&&');
                break;
            case NodeType.LOGICAL_OR:
                result = await this.executeLogical(node as LogicalNode, context, env, '||');
                break;
            case NodeType.IF:
                result = await this.executeIf(node as IfNode, context, env);
                break;
            case NodeType.FOR:
                result = await this.executeFor(node as ForNode, context, env);
                break;
            case NodeType.WHILE:
                result = await this.executeWhile(node as WhileNode, context, env);
                break;
            case NodeType.SUBSHELL:
                result = await this.executeSubshell(node as SubshellNode, context, env);
                break;
            case NodeType.SEQUENCE:
                // For sequences at the root, we might have multiple nodes
                const seq = (node as any).nodes as ASTNode[];
                let lastResult: CommandResult = { output: '', exitCode: 0 };
                for (const n of seq) {
                    lastResult = await this.execute(n, context, env, false);
                    if (context.isInterrupted()) break;
                }
                result = lastResult;
                break;
            default:
                throw new Error(`Unsupported node type: ${NodeType[node.type]}`);
        }

        // Exhaust stream at the top level for complete output reconciliation
        if (isRoot && result.stream) {
            result.output = result.output || '';
            try {
                for await (const chunk of result.stream) {
                    result.output += chunk;
                }
            } catch (e) {
                console.error("Error exhausting stream:", e);
            }
            result.stream = undefined;
        }

        return result;
    }

    private async executeCommand(node: CommandNode, context: CommandContext, env: ShellEnvironment, pipeInput?: string | AsyncGenerator<string>): Promise<CommandResult> {
        // 1. Expand variables in name and args
        const expandedName = await this.expand(node.name, env);
        const expandedArgs = await Promise.all(node.args.map(arg => this.expand(arg, env)));

        // 2. Resolve Command
        const commandFn = CommandRegistry.get(expandedName);
        if (!commandFn) {
            return { 
                output: '', 
                error: `bash: ${expandedName}: command not found`, 
                exitCode: 127 
            };
        }

        // 3. Setup Redirections
        // (Simplified for Wave 2 - in real shell we would dup fds)
        let inputOverwrite = '';
        const redirections = node.redirections;

        for (const redir of redirections) {
            if (redir.type === 'input') {
                const path = await this.expand(redir.path, env);
                const content = this.vfs.readFile(context.resolvePath(path), context.userId, context.groups);
                if (typeof content === 'string') {
                    inputOverwrite = content;
                } else {
                    return { output: '', error: `bash: ${path}: ${this.formatVfsError(content.error)}`, exitCode: 1 };
                }
            } else if (redir.type === 'heredoc') {
                let content = redir.path; // Already captured by parser
                if (redir.stripTabs) {
                    content = content.split('\n').map(line => line.replace(/^\t+/, '')).join('\n');
                }
                if (redir.expand) {
                    content = await this.expand(content, env);
                }
                inputOverwrite = content;
            }
        }

        // 4. Setup Signal Helpers & Context
        // We capture the jobId for this command if it has one (or will have one)
        let currentJobId: number | undefined = (node as any).jobId;

        const waitIfSuspended = async () => {
            if (!currentJobId) return;
            const job = context.jobManager.getJob(currentJobId);
            if (job && job.state === 'STOPPED') {
                await context.jobManager.waitForResume(currentJobId);
            }
        };

        // Run Command
        try {
            const activeContext: CommandContext = {
                ...context,
                isInterrupted: () => context.jobManager?.isJobInterrupted(expandedName) || context.isInterrupted?.() || false,
                waitIfSuspended: waitIfSuspended,
                onSignal: (handler) => {
                    // This is a proxy to the current foreground job if needed
                }
            };
            const result = await commandFn(expandedArgs, activeContext, inputOverwrite || pipeInput || '');
            
            // 5. Handle Output Redirections
            for (const redir of redirections) {
                const path = await this.expand(redir.path, env);
                const fullPath = context.resolvePath(path);
                if (redir.type === 'overwrite' || redir.type === 'append') {
                    const writeRes = await this.vfs.writeFile(
                        fullPath, 
                        result.output || '', 
                        context.userId, 
                        context.groups, 
                        redir.type === 'append'
                    );
                    if (typeof writeRes === 'object' && writeRes !== null && 'error' in writeRes) {
                        return { output: '', error: `bash: ${path}: ${this.formatVfsError((writeRes as any).error)}`, exitCode: 1 };
                    }
                    result.output = ''; 
                } else if (redir.type === 'stderr') {
                    const writeRes = await this.vfs.writeFile(fullPath, result.error || '', context.userId, context.groups);
                    if (typeof writeRes === 'object' && writeRes !== null && 'error' in writeRes) {
                        return { output: '', error: `bash: ${path}: ${this.formatVfsError((writeRes as any).error)}`, exitCode: 1 };
                    }
                    result.error = undefined;
                } else if (redir.type === 'both') {
                    const combined = (result.output || '') + (result.error || '');
                    const writeRes = await this.vfs.writeFile(fullPath, combined, context.userId, context.groups);
                    if (typeof writeRes === 'object' && writeRes !== null && 'error' in writeRes) {
                        return { output: '', error: `bash: ${path}: ${this.formatVfsError((writeRes as any).error)}`, exitCode: 1 };
                    }
                    result.output = '';
                    result.error = undefined;
                }
            }

            return result;
        } catch (e) {
            console.error(`Command execution error (${expandedName}):`, e);
            return { output: '', error: `bash: ${expandedName}: internal error`, exitCode: 1 };
        }
    }

    private async executePipeline(node: PipelineNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        let currentInput: string | AsyncGenerator<string> = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        for (let i = 0; i < node.commands.length; i++) {
            const cmdNode = node.commands[i];
            const isLast = i === node.commands.length - 1;

            const result = await this.executeCommand(cmdNode, context, env, currentInput);
            
            // If it's not the last command, we need to pass its output/stream to the next one
            if (!isLast) {
                if (result.stream) {
                    currentInput = result.stream;
                } else {
                    currentInput = result.output;
                }
            } else {
                lastResult = result;
            }
        }

        return lastResult;
    }

    private async executeLogical(node: LogicalNode, context: CommandContext, env: ShellEnvironment, op: '&&' | '||'): Promise<CommandResult> {
        const leftResult = await this.execute(node.left, context, env);
        
        if (op === '&&' && leftResult.exitCode === 0) {
            return this.execute(node.right, context, env);
        }
        if (op === '||' && leftResult.exitCode !== 0) {
            return this.execute(node.right, context, env);
        }

        return leftResult;
    }

    private async executeIf(node: IfNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        const condResult = await this.execute(node.condition, context, env);
        if (condResult.exitCode === 0) {
            return this.execute(node.thenBranch, context, env);
        } else if (node.elseBranch) {
            return this.execute(node.elseBranch, context, env);
        }
        return { output: '', exitCode: 0 };
    }

    private async executeFor(node: ForNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        let lastResult: CommandResult = { output: '', exitCode: 0 };
        for (const item of node.items) {
            const childEnv = env.createChild();
            childEnv.set(node.variable, await this.expand(item, env));
            lastResult = await this.execute(node.body, context, childEnv);
            if (context.isInterrupted()) break;
        }
        return lastResult;
    }

    private async executeWhile(node: WhileNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        let lastResult: CommandResult = { output: '', exitCode: 0 };
        while (true) {
            const condResult = await this.execute(node.condition, context, env);
            if (condResult.exitCode !== 0) break;
            
            lastResult = await this.execute(node.body, context, env);
            if (context.isInterrupted()) break;
        }
        return lastResult;
    }

    private async executeSubshell(node: SubshellNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        const childEnv = env.createChild();
        return this.execute(node.pipeline, context, childEnv, false);
    }

    private async expand(text: string, env: ShellEnvironment): Promise<string> {
        let result = text;
        
        // 1. Variable expansion
        result = result.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => env.get(name) || "")
                       .replace(/\${([a-zA-Z_][a-zA-Z0-9_]*)}/g, (_, name) => env.get(name) || "");
                       
        // 2. Command substitution $(...)
        // (Recursive call to execute)
        const subshellMatches = [...result.matchAll(/\$\(([^)]+)\)/g)];
        for (const match of subshellMatches) {
            const fullMatch = match[0];
            const cmdText = match[1];
            
            // Create a temporary context for the subshell
            // In a real subshell we would use a copy of context
            // For now we just parse and run
            const lexer = new Lexer(cmdText);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();
            
            // We need a dummy context here or reuse existing
            // Reusing existing might be slightly unsafe but works for now
            const subResult = await this.execute(ast, { ...this.lastContext! } as any, env);
            result = result.replace(fullMatch, subResult.output.trim());
        }
        
        return result;
    }
    
    private async launchBackgroundJob(node: CommandNode | PipelineNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        const commandText = this.getCommandText(node);
        const terminalStore = useTerminalStore.getState();
        
        // Phase 3.3 FIX: Reuse PID from context to prevent double-consumption
        const pid = context.pid || terminalStore.getNextPid();
        
        // Reuse jobId if provided by useTerminal (which it should be for top-level commands)
        const jobId = context.jobId || (context.jobManager as any).nextJobId;
        (node as any).jobId = jobId;

        const promise = node.type === NodeType.COMMAND 
            ? this.executeCommand(node as CommandNode, context, env)
            : this.executePipeline(node as PipelineNode, context, env);

        // If we reused context.jobId, the job is already added in useTerminal
        // We just need to update it from foreground to background
        let job;
        const existingJob = context.jobManager.getJob(jobId);
        if (existingJob) {
            job = existingJob;
            context.jobManager.setBackground(jobId, true); // Move existing job to background
        } else {
            job = context.jobManager.addJob(commandText, [{ pid, name: commandText.split(' ')[0], promise }], false);
        }
        
        return {
            output: `[${job.id}] ${pid}\n`,
            exitCode: 0
        };
    }

    private getCommandText(node: ASTNode): string {
        if (node.type === NodeType.COMMAND) {
            const cmd = node as CommandNode;
            return [cmd.name, ...cmd.args].join(' ');
        }
        if (node.type === NodeType.PIPELINE) {
            return (node as PipelineNode).commands.map(c => this.getCommandText(c)).join(' | ');
        }
        return 'unknown';
    }

    private lastContext?: CommandContext;

    private formatVfsError(errno: string): string {
      switch(errno) {
        case 'ENOENT': return 'No such file or directory';
        case 'EACCES': return 'Permission denied';
        case 'EPERM': return 'Operation not permitted';
        case 'EISDIR': return 'Is a directory';
        case 'ENOTDIR': return 'Not a directory';
        default: return errno;
      }
    }
}
