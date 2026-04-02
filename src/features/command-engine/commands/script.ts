import { CommandContext, CommandResult } from '../types';

/**
 * script — make typescript of terminal session
 */
export const script = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const filename = args[0] || 'typescript';
    if (args.includes('-q')) {
        // quiet
        return { output: '', exitCode: 0 };
    }

    return {
        output: `Script started, output log file is '${filename}'\n` +
                `Script done, output log file is '${filename}'\n`, 
        exitCode: 0
    };
};
