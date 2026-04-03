import { CommandContext, CommandResult } from '../types';

export const rm = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let recursive = false;
    let force = false;
    let interactive = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg === '-r' || arg === '-R') recursive = true;
        else if (arg === '-f') force = true;
        else if (arg === '-i') interactive = true;
        else if (arg === '-rf' || arg === '-fr') { recursive = true; force = true; }
        else if (!arg.startsWith('-')) paths.push(arg);
    }

    if (paths.length === 0) {
        if (force) return { output: '', exitCode: 0 };
        return { output: '', error: 'rm: missing operand', exitCode: 1 };
    }

    for (const path of paths) {
        const fullPath = context.resolvePath(path);
        if (interactive && !force && context.prompt) {
            const confirmed = await context.prompt(`rm: remove file '${path}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }
        const result = context.vfs.rm(fullPath, recursive, context.userId, context.groups);
        if (typeof result === 'string') {
            if (force && result === 'No such file or directory') continue;
            return { output: '', error: `rm: cannot remove '${path}': ${result}`, exitCode: 1 };
        }
    }
    return { output: '', exitCode: 0 };
};
