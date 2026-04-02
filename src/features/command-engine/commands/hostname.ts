import { CommandContext, CommandResult } from '../types';

export const hostname = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const hostnamePath = '/etc/hostname';
    const content = context.vfs.readFile(hostnamePath, context.userId, context.groups);

    if (typeof content === 'string') {
        return { output: content.trim() + '\n', exitCode: 0 };
    }

    // Default if file missing
    return { output: 'the-terminal\n', exitCode: 0 };
};
