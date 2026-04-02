import { VFS } from '../vfs/vfs';
import { CommandContext, CommandResult, CommandPipeline, Signal, Job, Process } from './types';
import { CommandRegistry } from './registry';
import { CommandParser } from './parser';
import { formatError } from '../../utils/error_codes';
import { useTerminalStore } from '../../stores/terminalStore';
import picomatch from 'picomatch';

export class CommandExecutor {
    private vfs: VFS;

    constructor(vfs: VFS) {
        this.vfs = vfs;
    }

    private getAbsolutePath(path: string, cwd: string): string {
        if (path.startsWith('/')) return path;
        if (cwd === '/') return '/' + path;
        return cwd + '/' + path;
    }

    public async execute(pipeline: CommandPipeline, context: CommandContext, abortController?: AbortController): Promise<CommandResult> {
        // Alias expansion: expand the first word if it matches an alias
        // Note: in a real shell, this happens before parsing and recursively.
        let updatedPipeline = pipeline;
        if (pipeline.actions.length > 0) {
            const firstAction = pipeline.actions[0];
            let expandedName = firstAction.name;
            let expanded = true;
            const visited = new Set<string>();

            while (expanded && context.aliases[expandedName]) {
                if (visited.has(expandedName)) break; // Prevent infinite loop
                visited.add(expandedName);
                expandedName = context.aliases[expandedName];
            }

            if (expandedName !== firstAction.name) {
                // If it expanded to multiple words, we'd need to re-parse.
                // For now, support simple 1-to-1 or 1-to-string mapping.
                updatedPipeline = CommandParser.parse(expandedName + (firstAction.args.length ? ' ' + firstAction.args.join(' ') : ''));
            }
        }

        const terminalStore = useTerminalStore.getState();
        const isBackground = updatedPipeline.actions.some(a => a.background);

        if (isBackground) {
            const jid = terminalStore.jobs.length + 1;
            const pid = Math.floor(Math.random() * 9000) + 1000;
            const commandStr = updatedPipeline.actions.map(a => a.name + (a.args.length ? ' ' + a.args.join(' ') : '')).join(' | ');

            const job: Job = { jid, pid, command: commandStr, status: 'Running', isBackground: true };
            terminalStore.addJob(job);

            // Execute in background
            this.executeAsync(updatedPipeline, context, pid, jid);

            return { output: `[${jid}] ${pid}\n`, exitCode: 0 };
        }

        return this.executeForeground(updatedPipeline, context, abortController);
    }

    private async executeForeground(pipeline: CommandPipeline, context: CommandContext, abortController?: AbortController): Promise<CommandResult> {
        let lastOutput: string | AsyncGenerator<string> = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        const signal = abortController?.signal;

        // Track foreground process
        const initialPid = Math.floor(Math.random() * 1000) + 9000;
        const terminalStore = useTerminalStore.getState();
        terminalStore.setForegroundProcess(initialPid);

        try {
            for (let i = 0; i < pipeline.actions.length; i++) {
                if (signal?.aborted) {
                    return { output: lastResult.output, exitCode: 130 };
                }
                const action = pipeline.actions[i];
                const isLast = i === pipeline.actions.length - 1;

                const command = CommandRegistry.get(action.name);
                if (!command) {
                    return {
                        output: '',
                        error: formatError('COMMAND_NOT_FOUND', action.name),
                        exitCode: 127
                    };
                }

                // Handle substitutions $(command)
                const resolvedArgs = await this.resolveSubstitutions(action.args, context);

                // Expand environment variables
                const envExpandedArgs = CommandParser.expand(resolvedArgs, context.env);

                // Handle shell globbing (e.g., *, ?)
                const expandedArgs = this.resolveGlobbing(envExpandedArgs, context);

                const resolvedRedirPath = action.redirectionPath ? (await this.resolveSubstitutions([action.redirectionPath], context))[0] : undefined;
                const expandedRedirPath = resolvedRedirPath ? CommandParser.expand([resolvedRedirPath], context.env)[0] : undefined;

                // Execute the command
                let currentInput: string | AsyncGenerator<string> = lastOutput;
                if (action.redirectionType === 'input' && expandedRedirPath) {
                    const fullPath = this.getAbsolutePath(expandedRedirPath, context.cwd);
                    const fileContent = this.vfs.readFile(fullPath, context.userId, context.groups);
                    currentInput = typeof fileContent === 'string' ? fileContent : '';
                } else if (action.redirectionType === 'heredoc' && action.redirectionPath) {
                    const delimiter = action.redirectionPath;
                    let heredocLines = [];
                    if (context.prompt) {
                        let line = '';
                        while (true) {
                            line = await context.prompt('> ');
                            if (line === delimiter) break;
                            heredocLines.push(line);
                        }
                    }
                    currentInput = heredocLines.join('\n');
                }

                // Create a PID for the current execution
                const executionPid = initialPid;
                const enrichedContext: CommandContext = {
                    ...context,
                    onSignal: (handler) => terminalStore.onSignal(executionPid, handler),
                    removeSignalHandler: (handler) => {
                        // Cleanup is handled by terminalStore
                    },
                    isInterrupted: () => signal?.aborted || false,
                };

                // Realism: SUID bit check
                let effectiveUserId = context.userId;
                const maybeVfsPath = this.getAbsolutePath(action.name, context.cwd);
                const maybeVfsInode = this.vfs.getMetadata(maybeVfsPath, context.userId, context.groups);

                if (typeof maybeVfsInode !== 'string' && maybeVfsInode.type === 'file') {
                    if (maybeVfsInode.permissions.setuid) {
                        // Realism: SUID is ignored for shebang (#!) scripts on modern Linux
                        const content = this.vfs.readFile(maybeVfsPath, context.userId, context.groups);
                        const isScript = typeof content === 'string' && content.startsWith('#!');
                        
                        if (!isScript) {
                            effectiveUserId = maybeVfsInode.ownerId;
                        }
                    }
                }

                enrichedContext.userId = effectiveUserId;
                enrichedContext.groups = [...context.groups];
                if (!enrichedContext.groups.includes(effectiveUserId)) {
                    enrichedContext.groups.push(effectiveUserId);
                }

                const result: CommandResult = await command(expandedArgs, enrichedContext, currentInput);
                lastResult = result;

                if (result.exitCode !== 0 && action.redirectionType !== 'stderr' && action.redirectionType !== 'both' && !isLast) {
                    return result;
                }

                // If this is the last command, we handle output or streaming
                if (isLast) {
                    if (result.stream) {
                        let finalOutput = '';
                        for await (const chunk of result.stream) {
                            if (signal?.aborted) break;
                            finalOutput += chunk;
                        }
                        lastResult.output = finalOutput;
                    }
                } else {
                    // If not last, set input for next command in pipeline
                    lastOutput = result.stream || result.output;
                }

                // Handle redirection
                if (action.redirectionType !== 'none' && expandedRedirPath) {
                    const outputToRedirect = lastResult.output;
                    if (action.redirectionType === 'overwrite' || action.redirectionType === 'append') {
                        const fullPath = this.getAbsolutePath(expandedRedirPath, context.cwd);
                        const writeResult = this.handleRedirection(
                            fullPath,
                            outputToRedirect,
                            action.redirectionType,
                            context.userId,
                            context.groups
                        );
                        if (typeof writeResult === 'object' && 'error' in writeResult) {
                            return { output: outputToRedirect, error: writeResult.error, exitCode: 1 };
                        }
                    }
                }
            }
            return lastResult;
        } catch (e) {
            return {
                output: '',
                error: `exec: internal error: ${e}`,
                exitCode: 1
            };
        } finally {
            terminalStore.setForegroundProcess(null);
        }
    }

    private async executeAsync(pipeline: CommandPipeline, context: CommandContext, pid: number, jid: number) {
        const terminalStore = useTerminalStore.getState();
        try {
            const result = await this.executeForeground(pipeline, context);
            terminalStore.updateJobStatus(jid, 'Done');
            // In a real terminal, we'd print [jid]+ Done ... here if it was interactive
        } catch (e) {
            terminalStore.updateJobStatus(jid, 'Terminated');
        }
    }

    private async resolveSubstitutions(args: string[], context: CommandContext): Promise<string[]> {
        const resolved: string[] = [];
        for (const arg of args) {
            let current = arg;
            let match;
            // Match $(...)
            while ((match = current.match(/\$\(([^)]+)\)/))) {
                const subCommand = match[1];
                const pipeline = CommandParser.parse(subCommand);
                const result = await this.execute(pipeline, context);
                // Replace $(...) with result output, trimmed and words joined by single space
                const replacement = result.output.trim().replace(/\s+/g, ' ');
                current = current.replace(match[0], replacement);
            }
            resolved.push(current);
        }
        return resolved;
    }

    private resolveGlobbing(args: string[], context: CommandContext): string[] {
        const result: string[] = [];
        for (const arg of args) {
            // Check if it looks like a glob (fast check first)
            if (!arg.includes('*') && !arg.includes('?') && !arg.includes('[') && !arg.includes('{')) {
                result.push(arg);
                continue;
            }

            // High-fidelity check using picomatch
            if (!picomatch.scan(arg).isGlob) {
                result.push(arg);
                continue;
            }

            try {
                // Determine search base (highest directory without a glob)
                const scan = picomatch.scan(arg);
                const baseDir = scan.base === '.' ? context.cwd : this.getAbsolutePath(scan.base, context.cwd);
                const pattern = scan.glob;

                // Recursive walker to handle ** patterns
                const matches: string[] = [];
                const walk = (currentPath: string) => {
                    const children = this.vfs.listChildren(currentPath, context.userId, context.groups);
                    if (typeof children === 'string' || children === null) return;

                    for (const child of children) {
                        const childPath = currentPath === '/' ? `/${child.name}` : `${currentPath}/${child.name}`;
                        const relativeToScanBase = scan.base === '.' 
                            ? child.name 
                            : childPath.substring(this.getAbsolutePath(scan.base, context.cwd).length).replace(/^\//, '');

                        if (picomatch(arg)(childPath) || picomatch(arg)(relativeToScanBase)) {
                            matches.push(childPath);
                        }

                        if (child.type === 'directory') {
                            walk(childPath);
                        }
                    }
                };

                walk(baseDir);

                if (matches.length > 0) {
                    // Sort matches for consistent output
                    result.push(...matches.sort());
                } else {
                    // Nullglob: leave pattern literal if no matches
                    result.push(arg);
                }
            } catch (e) {
                result.push(arg);
            }
        }
        return result;
    }

    private handleRedirection(path: string, content: string, type: 'overwrite' | 'append', userId: string, groups: string[]) {
        if (type === 'overwrite') {
            return this.vfs.writeFile(path, content, userId, groups);
        } else {
            const currentContent = this.vfs.readFile(path, userId, groups);
            const existing = typeof currentContent === 'string' ? currentContent : '';
            return this.vfs.writeFile(path, existing + content, userId, groups);
        }
    }
}
