import { CommandContext, CommandResult } from '../types';

export const chown = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length < 2) return { output: '', error: 'chown: missing operand', exitCode: 1 };
    
    // Only root can chown
    if (context.userId !== 'root') {
        return { output: '', error: 'chown: changing ownership: Operation not permitted', exitCode: 1 };
    }

    const owner = args[0];
    const paths = args.slice(1);
    for (const path of paths) {
        const fullPath = context.resolvePath(path);
        const result = context.vfs.chown(fullPath, owner, context.userId, context.groups);
        if (typeof result === 'string') return { output: '', error: `chown: ${result}`, exitCode: 1 };
    }
    return { output: '', exitCode: 0 };
};
