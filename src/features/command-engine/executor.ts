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

    private async exhaustStream(stream: ReadableStream<string> | any): Promise<string> {
        let content = '';
        if (!stream) return content;

        if (typeof stream.getReader === 'function') {
            const reader = stream.getReader();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    content += value;
                }
            } finally {
                reader.releaseLock();
            }
        } else if (stream[Symbol.asyncIterator]) {
            for await (const chunk of stream) {
                content += chunk;
            }
        }
        return content;
    }

    public async execute(pipeline: CommandPipeline, context: CommandContext, abortController?: AbortController): Promise<CommandResult> {
        let lastOutput: string | AsyncGenerator<string> = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        const signal = abortController?.signal;

        // Track foreground process
        const terminalStore = useTerminalStore.getState();
        const initialPid = terminalStore.getNextPid();
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
                    const meta = this.vfs.getMetadata(scriptPath, context.userId, context.groups);
                    
                    if (typeof meta !== 'string' && meta.type === 'file') {
                        commandFn = async (args, ctx, input) => {
                            // Re-fetch metadata inside the execution scope to ensure we have current content
                            const currentMeta = this.vfs.getMetadata(scriptPath, ctx.userId, ctx.groups);
                            if (typeof currentMeta === 'string' || currentMeta.type !== 'file') {
                                return { output: '', error: `bash: ${scriptPath}: No such file or directory`, exitCode: 127 };
                            }

                            const content = currentMeta.content || '';
                            const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#!'));
                            let finalOutput = '';
                            let finalError = '';
                            let lastExitCode = 0;
                            
                            for (const line of lines) {
                                console.log(`[DEBUG SCRIPT] Executing line: "${line}" with userId: ${ctx.userId}`);
                                // Support compound commands (;, &&, ||)
                                try {
                                    const segments = CommandParser.parseCompound(line);
                                    for (const segment of segments) {
                                        const result = await this.execute(segment.pipeline, ctx);
                                        
                                        let segmentOutput = result.output || '';
                                        if (result.stream) {
                                            segmentOutput += await this.exhaustStream(result.stream);
                                        }
                                        
                                        console.log(`[DEBUG SCRIPT] Result for segment: "${segmentOutput}", error: "${result.error}", exitCode: ${result.exitCode}`);
                                        finalOutput += segmentOutput;
                                        if (result.error) {
                                            finalError = (finalError || '') + (finalError ? '\n' : '') + result.error;
                                        }
                                        lastExitCode = result.exitCode;
                                        
                                        if (segment.operator === '&&' && lastExitCode !== 0) break;
                                        if (segment.operator === '||' && lastExitCode === 0) break;
                                    }
                                } catch (e) {
                                    finalError = (finalError || '') + (finalError ? '\n' : '') + (e as Error).message;
                                    lastExitCode = 1;
                                }
                                
                                if (lastExitCode !== 0) break;
                            }
                            console.log(`[DEBUG SCRIPT] Final script output: "${finalOutput}"`);
                            return { output: finalOutput, error: finalError || undefined, exitCode: lastExitCode };
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
                const commandAbortController = new AbortController();

                if (signal) {
                    signal.addEventListener('abort', () => commandAbortController.abort());
                }

                let signalCleanup: (() => void) | null = null;

                const enrichedContext: CommandContext = {
                    ...context,
                    abortSignal: commandAbortController.signal,
                    onSignal: (handler) => {
                        signalCleanup = terminalStore.onSignal(executionPid, (sig) => {
                            if (sig === Signal.SIGKILL || sig === Signal.SIGTERM || sig === Signal.SIGINT) {
                                commandAbortController.abort(sig);
                            }
                            handler(sig);
                        });
                    },
                    removeSignalHandler: () => {
                        if (signalCleanup) {
                            signalCleanup();
                            signalCleanup = null;
                        }
                    },
                    isInterrupted: () => signal?.aborted || commandAbortController.signal.aborted || false,
                    resolvePath: (path: string) => getAbsolutePath(path, context.cwd),
                    waitIfSuspended: async () => {
                        const jobId = context.jobId;
                        if (jobId && context.jobManager) {
                            await context.jobManager.waitForResume(jobId);
                        }
                    }
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
                    const bgPid = terminalStore.getNextPid();
                    const bgAbortController = new AbortController();
                    
                    const bgSignalCleanup = terminalStore.onSignal(bgPid, (sig) => {
                        if (sig === Signal.SIGKILL || sig === Signal.SIGTERM || sig === Signal.SIGINT) {
                            bgAbortController.abort(sig);
                        }
                    });

                    const bgContext: CommandContext = {
                        ...enrichedContext,
                        abortSignal: bgAbortController.signal,
                        onSignal: (handler) => terminalStore.onSignal(bgPid, handler),
                        isInterrupted: () => bgAbortController.signal.aborted,
                        processes: []
                    };
                    
                    const bgPromise = commandFn(expandedArgs, bgContext, input);

                    const job = context.jobManager.addJob(action.name, [{
                        pid: bgPid,
                        name: action.name,
                        promise: bgPromise
                    }], false);

                    context.updateProcesses([
                        ...context.processes,
                        { pid: bgPid, name: action.name, user: context.userId, startTime: Date.now() }
                    ]);

                    bgPromise
                        .catch(e => console.error('Background job error:', e))
                        .finally(() => {
                            bgSignalCleanup();
                        });

                    return { output: `[${job.id}] ${bgPid}\n`, exitCode: 0 };
                }

                const fgProcess = { pid: executionPid, name: action.name, user: context.userId, startTime: Date.now() };
                context.updateProcesses([...context.processes, fgProcess]);

                const autoSignalCleanup = terminalStore.onSignal(executionPid, (sig) => {
                    if (sig === Signal.SIGKILL || sig === Signal.SIGTERM || sig === Signal.SIGINT) {
                        commandAbortController.abort(sig);
                    }
                });

                try {
                    const result = await commandFn(expandedArgs, enrichedContext, input);
                    lastResult = result;
                } finally {
                    autoSignalCleanup();
                    context.updateProcesses(context.processes.filter(p => p.pid !== executionPid));
                    if (signalCleanup) {
                        (signalCleanup as () => void)();
                        signalCleanup = null;
                    }
                }

                if (lastResult.exitCode !== 0 && action.redirectionType !== 'stderr' && action.redirectionType !== 'both' && !isLast) {
                    return lastResult;
                }

                if (isLast) {
                    // Automatically exhaust stream for the final pipeline action for non-streaming callers
                    if (lastResult.stream) {
                        const finalOutput = await this.exhaustStream(lastResult.stream);
                        lastResult.output = (lastResult.output || '') + finalOutput;
                        lastResult.stream = null;
                    }
                } else {
                    lastOutput = lastResult.stream || lastResult.output;
                }

                // Handle redirection
                if (action.redirectionType !== 'none' && action.redirectionType !== 'input' && expandedRedirPath) {
                    const fullPath = getAbsolutePath(expandedRedirPath, context.cwd);
                    let contentToRedir = '';
                    let shouldAppend = action.redirectionType === 'append';

                    if (action.redirectionType === 'overwrite' || action.redirectionType === 'append') {
                        contentToRedir = lastResult.output;
                        lastResult.output = ''; 
                    } else if (action.redirectionType === 'stderr') {
                        contentToRedir = lastResult.error || '';
                        lastResult.error = undefined;
                    } else if (action.redirectionType === 'both') {
                        contentToRedir = (lastResult.output || '') + (lastResult.error || '');
                        lastResult.output = '';
                        lastResult.error = undefined;
                    }

                    if (contentToRedir || action.redirectionType === 'overwrite' || action.redirectionType === 'append' || action.redirectionType === 'both') {
                        const writeResult = await this.vfs.writeFile(fullPath, contentToRedir, context.userId, context.groups, shouldAppend);
                        if (typeof writeResult === 'object' && writeResult !== null && 'error' in writeResult) {
                            return { output: lastResult.output, error: writeResult.error, exitCode: 1 };
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
                let finalOutput = result.output;
                if (result.stream) {
                    finalOutput += await this.exhaustStream(result.stream);
                }
                const replacement = finalOutput.trim().replace(/\s+/g, ' ');
                current = current.replace(match[0], replacement);
            }
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
                    result.push(arg);
                }
            } catch (e) {
                result.push(arg);
            }
        }
        return result;
    }
}
