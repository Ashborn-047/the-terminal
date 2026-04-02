import { CommandContext, CommandResult } from '../types';
import { formatError } from '../../../utils/error_codes';

export const rmdir = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'rmdir: missing operand', exitCode: 1 };

    let output = '';
    let exitCode = 0;

    for (const arg of args) {
        const fullPath = arg.startsWith('/') ? arg : (context.cwd === '/' ? '/' + arg : context.cwd + '/' + arg);
        
        // VFS.rm handles empty check if recursive=false
        const result = context.vfs.rm(fullPath, false, context.userId, context.groups);
        if (typeof result === 'string') {
            output += `rmdir: failed to remove '${arg}': ${result}\n`;
            exitCode = 1;
        }
    }

    return { output, exitCode };
};

export const dirname = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'dirname: missing operand', exitCode: 1 };

    const path = args[0];
    if (path === '/') return { output: '/\n', exitCode: 0 };
    
    const parts = path.split('/').filter(p => p.length > 0);
    if (parts.length <= 1) return { output: '.\n', exitCode: 0 };
    
    const dir = (path.startsWith('/') ? '/' : '') + parts.slice(0, -1).join('/');
    return { output: dir + '\n', exitCode: 0 };
};

export const basename = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'basename: missing operand', exitCode: 1 };

    const path = args[0];
    const suffix = args.length > 1 ? args[1] : '';
    
    let base = path.split('/').filter(p => p.length > 0).pop() || '/';
    if (suffix && base.endsWith(suffix)) {
        base = base.substring(0, base.length - suffix.length);
    }
    
    return { output: base + '\n', exitCode: 0 };
};
