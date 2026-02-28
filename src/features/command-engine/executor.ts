import { VFS } from '../vfs/vfs';
import { CommandContext, CommandPipeline, CommandResult } from './types';
import { CommandRegistry } from './registry';

export class CommandExecutor {
    private vfs: VFS;

    constructor(vfs: VFS) {
        this.vfs = vfs;
    }

    public async execute(pipeline: CommandPipeline, context: CommandContext): Promise<CommandResult> {
        let lastOutput = '';
        let lastResult: CommandResult = { output: '', exitCode: 0 };

        for (let i = 0; i < pipeline.actions.length; i++) {
            const action = pipeline.actions[i];
            const commandFn = CommandRegistry.get(action.name);

            if (!commandFn) {
                return {
                    output: lastOutput,
                    error: `Command not found: ${action.name}`,
                    exitCode: 127,
                };
            }

            // Execute the command
            const result = await commandFn(action.args, context, lastOutput);
            lastResult = result;

            if (result.exitCode !== 0) {
                return result;
            }

            // Handle redirection for the last stage or any stage (usually only the last one)
            if (action.redirectionType !== 'none' && action.redirectionPath) {
                const writeResult = this.handleRedirection(
                    action.redirectionPath,
                    result.output,
                    action.redirectionType,
                    context.userId
                );

                if (typeof writeResult === 'object' && 'error' in writeResult) {
                    return {
                        output: result.output,
                        error: writeResult.error,
                        exitCode: 1,
                    };
                }

                // Redirection consumes the output for the next stage in a pipeline
                lastOutput = '';
            } else {
                lastOutput = result.output;
            }
        }

        return {
            ...lastResult,
            output: lastOutput, // This will be empty if redirected, or the final output
        };
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
