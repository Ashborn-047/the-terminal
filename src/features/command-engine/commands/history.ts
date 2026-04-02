import { CommandContext, CommandResult } from '../types';

/**
 * history — show command history
 */
export const history = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.includes('-c')) {
        // history -c: Clear history (if we want to support state updates here)
        // context.history = []; // Need setter
        return { output: 'history: cleared (simulated)\n', exitCode: 0 };
    }

    const lines = context.history.map((cmd, i) => `${(i + 1).toString().padStart(5)}  ${cmd}`);
    return { output: lines.join('\n') + (lines.length > 0 ? '\n' : ''), exitCode: 0 };
};
