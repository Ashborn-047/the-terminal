import { CommandContext, CommandResult } from '../types';
import { formatError } from '../../../utils/error_codes';

export const mkdir = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let recursive = false;
    let mode: string | undefined = undefined;
    const targets: string[] = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-p') { recursive = true; continue; }
        if (arg === '-m' && i + 1 < args.length) { mode = args[++i]; continue; }
        if (arg.startsWith('-')) continue;
        targets.push(arg);
    }

    if (targets.length === 0) return { output: '', error: 'mkdir: missing operand', exitCode: 1 };

    for (const dir of targets) {
        if (recursive) {
            const parts = dir.split('/').filter(p => p.length > 0);
            let currentPath = dir.startsWith('/') ? '' : context.cwd;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const checkPath = currentPath === '' ? '/' + part : (currentPath === '/' ? '/' + part : currentPath + '/' + part);
                if (!context.vfs.exists(checkPath, context.userId, context.groups)) {
                    const parent = currentPath === '' ? '/' : currentPath;
                    const result = context.vfs.mkdir(parent, part, context.userId, mode, context.groups);
                    if (typeof result === 'string') return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
                }
                currentPath = checkPath;
            }
        } else {
            const parts = dir.split('/').filter(p => p.length > 0);
            const name = parts.pop() || '';
            const parentRelative = parts.join('/');
            const parentPath = dir.startsWith('/') ? '/' + parentRelative : (parentRelative ? context.cwd + '/' + parentRelative : context.cwd);
            const result = context.vfs.mkdir(parentPath, name, context.userId, mode, context.groups);
            if (typeof result === 'string') return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
        }
    }
    return { output: '', exitCode: 0 };
};
