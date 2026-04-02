import { CommandContext, CommandResult } from '../types';

export const ln = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const symbolic = args.includes('-s');
    const paths = args.filter(a => !a.startsWith('-'));
    if (paths.length < 2) return { output: '', error: 'ln: missing operand', exitCode: 1 };
    if (!symbolic) return { output: '', error: 'ln: hard links not supported, use -s', exitCode: 1 };

    const target = paths[0], linkName = paths[1];
    const parts = linkName.split('/').filter(p => p.length > 0);
    const name = parts.pop() || '', parentPath = linkName.startsWith('/') ? '/' + parts.join('/') : (parts.length > 0 ? parts.join('/') : context.cwd);
    
    const result = context.vfs.ln(parentPath || context.cwd, name, target, context.userId, symbolic, context.groups);
    if (typeof result === 'string') return { output: '', error: `ln: ${result}`, exitCode: 1 };
    return { output: '', exitCode: 0 };
};
