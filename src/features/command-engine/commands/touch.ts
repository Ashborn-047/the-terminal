import { CommandContext, CommandResult } from '../types';

export const touch = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'touch: missing operand', exitCode: 1 };
    for (const name of args) {
        context.vfs.touch(context.cwd, name, context.userId, context.groups);
    }
    return { output: '', exitCode: 0 };
};
