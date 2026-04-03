import { CommandContext, CommandResult } from '../types';

export const cp = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let recursive = false;
    let interactive = false;
    let force = false;
    let preserve = false;
    const targets: string[] = [];

    for (const arg of args) {
        if (arg === '-r' || arg === '-R') recursive = true;
        else if (arg === '-i') interactive = true;
        else if (arg === '-f') force = true;
        else if (arg === '-p') preserve = true;
        else if (!arg.startsWith('-')) targets.push(arg);
    }

    if (targets.length < 2) return { output: '', error: 'cp: missing file operand', exitCode: 1 };

    const destPathRaw = targets.pop()!;
    const destPath = context.resolvePath(destPathRaw);
    for (const srcPath of targets) {
        const fullSrc = context.resolvePath(srcPath);
        if (interactive && !force && context.vfs.exists(destPath, context.userId, context.groups) && context.prompt) {
            const confirmed = await context.prompt(`cp: overwrite '${destPath}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }
        const result = context.vfs.cp(fullSrc, destPath, recursive, context.userId, context.groups);
        if (typeof result === 'string') return { output: '', error: `cp: ${result}`, exitCode: 1 };
        
        if (preserve) {
            const srcMeta = context.vfs.getMetadata(fullSrc, context.userId, context.groups);
            const isDestDir = context.vfs.isDirectory(destPath, context.userId, context.groups);
            const destFinalPath = isDestDir ? (destPath === '/' ? `/${fullSrc.split('/').pop()}` : `${destPath}/${fullSrc.split('/').pop()}`) : destPath;
            const destMeta = context.vfs.getMetadata(destFinalPath, context.userId, context.groups);
            if (typeof srcMeta !== 'string' && typeof destMeta !== 'string') {
                destMeta.permissions = { ...srcMeta.permissions };
                destMeta.modifiedAt = srcMeta.modifiedAt;
            }
        }
    }
    return { output: '', exitCode: 0 };
};
