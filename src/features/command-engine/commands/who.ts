import { CommandContext, CommandResult } from '../types';

export const who = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const now = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    return {
        output: `${context.userId}\t tty1\t ${now}\n`,
        exitCode: 0
    };
};
