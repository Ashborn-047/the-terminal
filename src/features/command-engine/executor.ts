import { VFS } from '../vfs/vfs';
import { CommandContext, CommandResult, CommandPipeline, CommandAction, Signal } from './types';
import { CommandRegistry } from './registry';
import { CommandParser } from './parser';
import { formatError } from '../../utils/error_codes';
import { useTerminalStore } from '../../stores/terminalStore';


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
        let lastOutput: string | AsyncGenerator<string> = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        const signal = abortController?.signal;

        // Track foreground process
        const initialPid = Math.floor(Math.random() * 1000) + 9000;
        const terminalStore = useTerminalStore.getState();
        terminalStore.setForegroundProcess(initialPid);

        try {
            for (let i = 0; i < pipeline.actions.length; i++) {
            const action = pipeline.actions[i];
            const isLast = i === pipeline.actions.length - 1;

            const commandFn = CommandRegistry.get(action.name);
            if (!commandFn) {
                return { output: '', error: formatError('COMMAND_NOT_FOUND'), exitCode: 127 };
            }

            // Handle substitutions $(command)
            const resolvedArgs = await this.resolveSubstitutions(action.args, context);

            // Expand environment variables
            const expandedArgs = CommandParser.expand(resolvedArgs, context.env);
            const resolvedRedirPath = action.redirectionPath ? (await this.resolveSubstitutions([action.redirectionPath], context))[0] : undefined;
            const expandedRedirPath = resolvedRedirPath ? CommandParser.expand([resolvedRedirPath], context.env)[0] : undefined;

            // Execute the command
            let input = lastOutput;
            if (action.redirectionType === 'input' && expandedRedirPath) {
                const fullPath = this.getAbsolutePath(expandedRedirPath, context.cwd);
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

            // Create a PID for the current execution if not already provided
            // For now, let's use a temporary high PID for foreground tasks
            // For now, let's use the pipeline-wide PID
            const executionPid = initialPid;
            const terminalStore = useTerminalStore.getState();

            const enrichedContext: CommandContext = {
                ...context,
                onSignal: (handler) => terminalStore.onSignal(executionPid, handler),
                removeSignalHandler: (handler) => {
                    // This is handled by the cleanup in onSignal's return
                    // but for compatibility we keep it
                },
                isInterrupted: () => signal?.aborted || false,
            };

            const result = await commandFn(expandedArgs, enrichedContext, input);
            lastResult = result;

            if (result.exitCode !== 0 && action.redirectionType !== 'stderr' && action.redirectionType !== 'both' && !isLast) {
                return result;
            }

            // If this is the last command, we need a string result for the UI
            if (isLast) {
                if (result.stream) {
                    let finalOutput = '';
                    for await (const chunk of result.stream) {
                        finalOutput += chunk;
                    }
                    lastResult.output = finalOutput;
                }
            } else {
                // If not last, set the next input
                lastOutput = result.stream || result.output;
            }

            // Handle redirection (only if it's the last command or explicitly redirected per action)
            if (action.redirectionType !== 'none' && expandedRedirPath) {
                const outputToRedirect = lastResult.output; // We collected it above if it was a stream
                if (action.redirectionType === 'overwrite' || action.redirectionType === 'append') {
                    const fullPath = this.getAbsolutePath(expandedRedirPath, context.cwd);
                    const writeResult = this.handleRedirection(
                        fullPath,
                        outputToRedirect,
                        action.redirectionType,
                        context.userId
                    );
                    if (typeof writeResult === 'object' && 'error' in writeResult) {
                        return { output: outputToRedirect, error: writeResult.error, exitCode: 1 };
                    }
                }
            }
        }

        // Background check
        if (pipeline.actions.length > 0 && pipeline.actions[pipeline.actions.length - 1].background) {
            const pid = Math.floor(Math.random() * 9000) + 1000;
            const bgAction = pipeline.actions[pipeline.actions.length - 1];
            context.updateProcesses([
                ...context.processes,
                { pid, name: bgAction.name, user: context.userId, startTime: Date.now() }
            ]);
            return { output: `[1] ${pid}\n`, exitCode: 0 };
        }

        return lastResult;
        } finally {
            terminalStore.setForegroundProcess(null);
        }
    }

    private async resolveSubstitutions(args: string[], context: CommandContext): Promise<string[]> {
        const resolved: string[] = [];
        // Updated regex to handle $(...) as a single token, in addition to quotes
        const regex = /\$\((?:[^)(]|\([^)(]*\))*\)|[^\s"']+|"([^"]*)"|'([^']*)'/g;
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

    private handleRedirection(path: string, content: string, type: 'overwrite' | 'append', userId: string) {
        if (type === 'overwrite') {
            return this.vfs.writeFile(path, content, userId);
        } else {
            const currentContent = this.vfs.readFile(path, userId);
            const existing = typeof currentContent === 'string' ? currentContent : '';
            return this.vfs.writeFile(path, existing + content, userId);
        }
    }
}
