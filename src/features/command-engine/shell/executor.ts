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

export class ShellExecutor {
    private vfs: VFS;

    constructor(vfs: VFS) {
        this.vfs = vfs;
    }

    public async execute(node: ASTNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        this.lastContext = context;
        if (context.isInterrupted()) {
            return { output: '', exitCode: 130 };
        }

        switch (node.type) {
            case NodeType.COMMAND:
                return this.executeCommand(node as CommandNode, context, env);
            case NodeType.PIPELINE:
                return this.executePipeline(node as PipelineNode, context, env);
            case NodeType.LOGICAL_AND:
                return this.executeLogical(node as LogicalNode, context, env, '&&');
            case NodeType.LOGICAL_OR:
                return this.executeLogical(node as LogicalNode, context, env, '||');
            case NodeType.IF:
                return this.executeIf(node as IfNode, context, env);
            case NodeType.FOR:
                return this.executeFor(node as ForNode, context, env);
            case NodeType.WHILE:
                return this.executeWhile(node as WhileNode, context, env);
            case NodeType.SUBSHELL:
                return this.executeSubshell(node as SubshellNode, context, env);
            case NodeType.SEQUENCE:
                // For sequences at the root, we might have multiple nodes
                const seq = (node as any).nodes as ASTNode[];
                let lastResult: CommandResult = { output: '', exitCode: 0 };
                for (const n of seq) {
                    lastResult = await this.execute(n, context, env);
                    if (context.isInterrupted()) break;
                }
                return lastResult;
            default:
                throw new Error(`Unsupported node type: ${NodeType[node.type]}`);
        }
    }

    private async executeCommand(node: CommandNode, context: CommandContext, env: ShellEnvironment, pipeInput?: string): Promise<CommandResult> {
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
            }
        }

        // 4. Run Command
        try {
            const result = await commandFn(expandedArgs, context, inputOverwrite || pipeInput || '');
            
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
            return { output: '', error: `bash: ${expandedName}: internal error`, exitCode: 1 };
        }
    }

    private async executePipeline(node: PipelineNode, context: CommandContext, env: ShellEnvironment): Promise<CommandResult> {
        let lastInput = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        for (let i = 0; i < node.commands.length; i++) {
            const cmdNode = node.commands[i];
            const isLast = i === node.commands.length - 1;

            const result = await this.executeCommand(cmdNode, context, env, lastInput);
            if (result.exitCode !== 0 && !isLast) {
                // Pipelines usually keep going but subsequent commands might fail if they expect input
            }
            lastInput = result.output;
            lastResult = result;
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
        return this.execute(node.pipeline, context, childEnv);
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
