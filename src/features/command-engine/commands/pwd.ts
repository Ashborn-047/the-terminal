import { CommandContext, CommandResult } from '../types';

export const pwd = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    return { output: context.cwd, exitCode: 0 };
};
