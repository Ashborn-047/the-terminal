import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';
import { formatError } from '../../../utils/error_codes';

export const stat = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'stat: missing operand', exitCode: 1 };

    let formatStr = '';
    const paths: string[] = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-c' || args[i] === '--format') {
            formatStr = args[++i];
        } else if (args[i].startsWith('--format=')) {
            formatStr = args[i].split('=')[1];
        } else if (!args[i].startsWith('-')) {
            paths.push(args[i]);
        }
    }

    if (paths.length === 0) return { output: '', error: 'stat: missing operand', exitCode: 1 };

    const outputLines: string[] = [];
    const errors: string[] = [];
    let exitCode = 0;

    for (const p of paths) {
        const fullPath = context.resolvePath(p);
        const result = context.vfs.resolve(fullPath, context.userId, undefined, true, 0, context.groups);

        if (typeof result === 'string') {
            errors.push(`stat: cannot stat '${p}': ${formatError('NO_SUCH_FILE_OR_DIRECTORY')}`);
            exitCode = 1;
            continue;
        }

        const inode = result as (Inode & { name: string });

        if (formatStr) {
            // Support basic format strings: %i (inode), %n (name), %s (size), %F (type)
            let formatted = formatStr
                .replace(/%i/g, String(inode.id))
                .replace(/%n/g, inode.name)
                .replace(/%s/g, String(inode.size || 0))
                .replace(/%F/g, inode.type === 'directory' ? 'directory' : (inode.type === 'symlink' ? 'symbolic link' : 'regular file'));
            outputLines.push(formatted);
        } else {
            // Standard stat output
            const typeStr = inode.type === 'directory' ? 'directory' : (inode.type === 'symlink' ? 'symbolic link' : 'regular file');
            const date = new Date(inode.mtime).toISOString();
            outputLines.push(`  File: ${inode.name}`);
            outputLines.push(`  Size: ${inode.size || 0}  Type: ${typeStr}`);
            outputLines.push(`Device: 0/0  Inode: ${inode.id}  Links: ${inode.nlink}`);
            outputLines.push(`Access: (${formatOctalPermissions(inode.permissions)}/???)  Uid: (${inode.ownerId}/???)  Gid: (${inode.groupId}/???)`);
            outputLines.push(`Modify: ${date}`);
        }
    }

    return {
        output: outputLines.join('\n').trim(),
        error: errors.join('\n').trim(),
        exitCode
    };
};

function formatOctalPermissions(p: any): string {
    let mode = 0;
    if (p.owner.read) mode |= 0o400;
    if (p.owner.write) mode |= 0o200;
    if (p.owner.execute) mode |= 0o100;
    if (p.group.read) mode |= 0o040;
    if (p.group.write) mode |= 0o020;
    if (p.group.execute) mode |= 0o010;
    if (p.others.read) mode |= 0o004;
    if (p.others.write) mode |= 0o002;
    if (p.others.execute) mode |= 0o001;
    // Add special bits
    if (p.setuid) mode |= 0o4000;
    if (p.setgid) mode |= 0o2000;
    if (p.sticky) mode |= 0o1000;
    return mode.toString(8).padStart(4, '0');
}
