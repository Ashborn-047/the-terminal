import { CommandContext, CommandResult } from '../types';

export const ln = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const symbolic = args.includes('-s');
    const paths = args.filter(a => !a.startsWith('-'));
    if (paths.length < 2) return { output: '', error: 'ln: missing operand', exitCode: 1 };

    const target = paths[0], linkName = paths[1];
    const fullLinkPath = context.resolvePath(linkName);
    const parts = fullLinkPath.split('/').filter(p => p.length > 0);
    const name = parts.pop() || '';
    const parentDir = '/' + parts.join('/') || '/';
    
    // Pass symbolic flag to VFS
    const result = context.vfs.ln(parentDir, name, target, context.userId, symbolic, context.groups);
    if (typeof result === 'string') return { output: '', error: `ln: ${result}`, exitCode: 1 };
    return { output: '', exitCode: 0 };
};
