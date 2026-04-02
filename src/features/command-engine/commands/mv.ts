import { CommandContext, CommandResult } from '../types';

export const mv = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let interactive = false;
    let force = false;
    const targets: string[] = [];

    for (const arg of args) {
        if (arg === '-i') interactive = true;
        else if (arg === '-f') force = true;
        else if (!arg.startsWith('-')) targets.push(arg);
    }

    if (targets.length < 2) return { output: '', error: 'mv: missing operand', exitCode: 1 };

    const destPath = targets.pop()!;
    for (const srcPath of targets) {
        if (interactive && !force && context.vfs.exists(destPath, context.userId, context.groups) && context.prompt) {
            const confirmed = await context.prompt(`mv: overwrite '${destPath}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }
        const result = context.vfs.mv(srcPath, destPath, context.userId, context.groups);
        if (typeof result === 'string') {
            if (force && result === 'Destination already exists') {
                context.vfs.rm(destPath, true, context.userId, context.groups);
                const retryResult = context.vfs.mv(srcPath, destPath, context.userId, context.groups);
                if (typeof retryResult === 'string') return { output: '', error: `mv: ${retryResult}`, exitCode: 1 };
                continue;
            }
            return { output: '', error: `mv: ${result}`, exitCode: 1 };
        }
    }
    return { output: '', exitCode: 0 };
};
