import { VFS } from '../vfs/vfs';
import { CommandContext, CommandResult, CommandPipeline, CommandAction } from './types';
import { CommandRegistry } from './registry';
import { CommandParser } from './parser';

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

    public async execute(pipeline: CommandPipeline, context: CommandContext): Promise<CommandResult> {
        let lastOutput = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        for (const action of pipeline.actions) {
            const commandFn = CommandRegistry.get(action.name); // Kept CommandRegistry.get as this.registry is not defined
            if (!commandFn) {
                return { output: '', error: `Command not found: ${action.name}`, exitCode: 127 };
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
            }

            const result = await commandFn(expandedArgs, context, input);
            lastResult = result;

            if (result.exitCode !== 0 && action.redirectionType !== 'stderr' && action.redirectionType !== 'both') {
                return result;
            }

            // Handle redirection
            if (action.redirectionType !== 'none' && expandedRedirPath) {
                if (action.redirectionType === 'overwrite' || action.redirectionType === 'append') {
                    const fullPath = this.getAbsolutePath(expandedRedirPath, context.cwd);
                    const writeResult = this.handleRedirection(
                        fullPath,
                        result.output,
                        action.redirectionType,
                        context.userId
                    );
                    if (typeof writeResult === 'object' && 'error' in writeResult) {
                        return { output: result.output, error: writeResult.error, exitCode: 1 };
                    }
                    lastOutput = '';
                } else if (action.redirectionType === 'stderr' || action.redirectionType === 'both') {
                    // Route error to file
                    if (result.error) {
                        const fullPath = this.getAbsolutePath(expandedRedirPath, context.cwd);
                        this.vfs.writeFile(fullPath, result.error, context.userId);
                    }
                    lastOutput = (action.redirectionType === 'both') ? '' : result.output;
                } else {
                    lastOutput = result.output;
                }
            } else {
                lastOutput = result.output;
            }
        }

        return {
            ...lastResult,
            output: lastOutput, // This will be empty if redirected, or the final output
        };
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
