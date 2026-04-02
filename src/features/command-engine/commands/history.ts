import { CommandContext, CommandResult } from '../types';

export const history = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const lines = context.history.map((cmd, i) => `  ${i + 1}  ${cmd}`);
    return { output: lines.join('\n'), exitCode: 0 };
};
