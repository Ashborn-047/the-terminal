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
        const fullPath = context.resolvePath(dir);
        const parts = fullPath.split('/').filter(p => p.length > 0);
        
        let currentPath = '/';
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;
            const checkPath = currentPath === '/' ? `/${part}` : `${currentPath}/${part}`;
            
            if (!context.vfs.exists(checkPath, context.userId, context.groups)) {
                if (!recursive && !isLast) {
                    return { output: '', error: `mkdir: cannot create directory '${dir}': No such file or directory`, exitCode: 1 };
                }
                const result = context.vfs.mkdir(currentPath, part, context.userId, isLast ? mode : undefined, context.groups);
                if (typeof result === 'string') return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
            } else if (isLast && !recursive) {
                return { output: '', error: `mkdir: cannot create directory '${dir}': File exists`, exitCode: 1 };
            }
            currentPath = checkPath;
        }
    }
    return { output: '', exitCode: 0 };
};
