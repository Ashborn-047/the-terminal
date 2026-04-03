import { VFS } from '../vfs/vfs';
import { CommandContext, CommandResult, CommandPipeline, CommandAction, Signal } from './types';
import { CommandRegistry } from './registry';
import { CommandParser } from './parser';
import { formatError } from '../../utils/error_codes';
import { useTerminalStore } from '../../stores/terminalStore';
import { getAbsolutePath } from './utils';
import pm from 'picomatch';

export class CommandExecutor {
    private vfs: VFS;

    constructor(vfs: VFS) {
        this.vfs = vfs;
    }


    public async execute(pipeline: CommandPipeline, context: CommandContext, abortController?: AbortController): Promise<CommandResult> {
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

                let commandFn = CommandRegistry.get(action.name);
                if (!commandFn) {
                    // Script Fallback: If it's a file in VFS, interpret it line-by-line
                    const scriptPath = getAbsolutePath(action.name, context.cwd);
                    const inode = this.vfs.getMetadata(scriptPath, context.userId, context.groups);
                    if (typeof inode !== 'string' && inode.type === 'file') {
                        commandFn = async (args, ctx, input) => {
                            const lines = (inode.content || '').split('\n').filter(l => l.trim() && !l.startsWith('#!'));
                            let finalResult: CommandResult = { output: '', exitCode: 0 };
                            for (const line of lines) {
                                // Simple line-by-line execution
                                const p = CommandParser.parse(line);
                                // Pass current input only to the first command? 
                                // Standard bash script doesn't pass stdin to every line.
                                finalResult = await this.execute(p, ctx);
                            }
                            return finalResult;
                        };
                    } else {
                        return { output: '', error: formatError('COMMAND_NOT_FOUND'), exitCode: 127 };
                    }
                }

                // Handle substitutions $(command)
                const resolvedArgs = await this.resolveSubstitutions(action.args, context);

                // Expand environment variables
                const envExpandedArgs = CommandParser.expand(resolvedArgs, context.env);

                // Handle shell globbing (e.g., *, ?, **)
                const expandedArgs = this.resolveGlobbing(envExpandedArgs, context);

                const resolvedRedirPath = action.redirectionPath ? (await this.resolveSubstitutions([action.redirectionPath], context))[0] : undefined;
                const expandedRedirPath = resolvedRedirPath ? CommandParser.expand([resolvedRedirPath], context.env)[0] : undefined;

                // Execute the command
                let input = lastOutput;
                if (action.redirectionType === 'input' && expandedRedirPath) {
                    const fullPath = getAbsolutePath(expandedRedirPath, context.cwd);
                    const fileContent = this.vfs.readFile(fullPath, context.userId);
                    input = typeof fileContent === 'string' ? fileContent : '';
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
                    input = heredocLines.join('\n');
                }

                const executionPid = initialPid;

                // Add AbortController for true high-fidelity signal propagation
                const abortController = new AbortController();

                // Tie standard DOM signal to context for commands that support it natively
                if (signal) {
                    signal.addEventListener('abort', () => abortController.abort());
                }

                const enrichedContext: CommandContext = {
                    ...context,
                    abortSignal: abortController.signal,
                    onSignal: (handler) => terminalStore.onSignal(executionPid, (sig) => {
                        // True kernel simulation: propagate SIGKILL/SIGTERM directly to the AbortController
                        if (sig === Signal.SIGKILL || sig === Signal.SIGTERM || sig === Signal.SIGINT) {
                            abortController.abort(sig);
                        }
                        handler(sig);
                    }),
                    removeSignalHandler: (handler) => {
                        // This is handled by the cleanup in onSignal's return
                    },
                    isInterrupted: () => signal?.aborted || abortController.signal.aborted || false,
                    resolvePath: (path: string) => getAbsolutePath(path, context.cwd),
                };

                // SUID / SGID Check
                let effectiveUserId = context.userId;
                let effectiveGroups = [...context.groups];

                const maybeVfsPath = getAbsolutePath(action.name, context.cwd);
                const maybeVfsInode = this.vfs.getMetadata(maybeVfsPath, context.userId, context.groups);

                if (typeof maybeVfsInode !== 'string' && maybeVfsInode.type === 'file') {
                    if (maybeVfsInode.permissions.setuid) {
                        effectiveUserId = maybeVfsInode.ownerId;
                    }
                    if (maybeVfsInode.permissions.setgid) {
                        effectiveGroups.push(maybeVfsInode.groupId);
                    }
                }

                enrichedContext.userId = effectiveUserId;
                enrichedContext.groups = effectiveGroups;

                if (isLast && action.background) {
                    const pid = Math.floor(Math.random() * 9000) + 1000;
                    const jid = context.jobs.length + 1;
                    const newJob = { jid, pid, command: action.name, status: 'Running' as const, isBackground: true };
                    
                    context.updateProcesses([
                        ...context.processes,
                        { pid, name: action.name, user: context.userId, startTime: Date.now() }
                    ]);
                    context.updateJobs([...context.jobs, newJob]);

                    // Run the command without awaiting it
                    commandFn(expandedArgs, enrichedContext, input).catch(e => console.error('Background job error:', e));
                    return { output: `[1] ${pid}\n`, exitCode: 0 };
                }

                const result = await commandFn(expandedArgs, enrichedContext, input);
                lastResult = result;

                if (result.exitCode !== 0 && action.redirectionType !== 'stderr' && action.redirectionType !== 'both' && !isLast) {
                    return result;
                }

                if (isLast) {
                    if (result.stream) {
                        let finalOutput = '';
                        for await (const chunk of result.stream) {
                            finalOutput += chunk;
                        }
                        lastResult.output = finalOutput;
                    }
                } else {
                    lastOutput = result.stream || result.output;
                }

                // Handle redirection
                if (action.redirectionType !== 'none' && expandedRedirPath) {
                    const outputToRedirect = lastResult.output;
                    if (action.redirectionType === 'overwrite' || action.redirectionType === 'append') {
                        const fullPath = getAbsolutePath(expandedRedirPath, context.cwd);
                        const writeResult = this.vfs.writeFile(fullPath, outputToRedirect, context.userId, context.groups);
                        if (typeof writeResult === 'object' && 'error' in writeResult) {
                            return { output: outputToRedirect, error: writeResult.error, exitCode: 1 };
                        }
                    }
                }
            }

            if (signal?.aborted) {
                return { ...lastResult, exitCode: 130 };
            }
            return lastResult;
        } finally {
            terminalStore.setForegroundProcess(null);
        }
    }

    private async resolveSubstitutions(args: string[], context: CommandContext): Promise<string[]> {
        const resolved: string[] = [];
        for (const arg of args) {
            let current = arg;
            let match;
            while ((match = current.match(/\$\(([^)]+)\)/))) {
                const subCommand = match[1];
                const pipeline = CommandParser.parse(subCommand);
                const result = await this.execute(pipeline, context);
                const replacement = result.output.trim().replace(/\s+/g, ' ');
                current = current.replace(match[0], replacement);
            }
            // Strip quotes
            if ((current.startsWith("'") && current.endsWith("'")) || (current.startsWith('"') && current.endsWith('"'))) {
                current = current.substring(1, current.length - 1);
            }
            resolved.push(current);
        }
        return resolved;
    }

    private resolveGlobbing(args: string[], context: CommandContext): string[] {
        const result: string[] = [];
        for (const arg of args) {
            if (!pm.scan(arg).isGlob) {
                result.push(arg);
                continue;
            }

            try {
                const scan = (pm as any).scan(arg);
                const baseDir = getAbsolutePath(scan.base, context.cwd);
                
                // Recursive walker to handle ** patterns
                const matches: string[] = [];
                const walk = (currentPath: string) => {
                    const children = this.vfs.listChildren(currentPath, context.userId, context.groups);
                    if (!Array.isArray(children)) return;

                    const matchFn = pm(arg, { dot: true });
                    for (const child of children) {
                        const childPath = currentPath === '/' ? `/${child.name}` : `${currentPath}/${child.name}`;
                        const relativeToScanBase = scan.base === '.' 
                            ? child.name 
                            : childPath.substring(baseDir.length).replace(/^\//, '');

                        if (matchFn(childPath) || matchFn(relativeToScanBase)) {
                            matches.push(childPath);
                        }

                        if (child.type === 'directory') {
                            walk(childPath);
                        }
                    }
                };

                walk(baseDir);

                if (matches.length > 0) {
                    result.push(...matches.sort());
                } else {
                    result.push(arg); // Standard Bash: keep as-is if no match
                }
            } catch (e) {
                result.push(arg);
            }
        }
        return result;
    }
}
