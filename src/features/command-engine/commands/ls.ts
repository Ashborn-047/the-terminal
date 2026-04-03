import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';
import { formatError } from '../../../utils/error_codes';

export const ls = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let showAll = false;
    let longFormat = false;
    let recursive = false;
    let humanReadable = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-')) {
            if (arg.includes('a')) showAll = true;
            if (arg.includes('l')) longFormat = true;
            if (arg.includes('R')) recursive = true;
            if (arg.includes('h')) humanReadable = true;
        } else {
            paths.push(arg);
        }
    }

    if (paths.length === 0) paths.push(context.cwd);

    const colorRoot = '\x1b[1;34m'; // Blue for dirs
    const colorFile = '\x1b[0m';    // Default
    const colorLink = '\x1b[1;36m'; // Cyan for links
    const colorReset = '\x1b[0m';

    const outputLines: string[] = [];
    const errors: string[] = [];
    let exitCode = 0;

    const listDir = (dirPath: string, isRecursiveCall: boolean = false) => {
        const result = context.vfs.resolve(dirPath, context.userId, undefined, true, 0, context.groups);
        if (typeof result === 'string') {
            errors.push(formatError('NO_SUCH_FILE_OR_DIRECTORY')); // Fix: formatError only needs 1 arg
            exitCode = 1;
            return;
        }

        const inode = result as Inode;
        if (inode.type !== 'directory' || !inode.children) {
            outputLines.push(inode.name);
            return;
        }

        if (recursive || paths.length > 1 || isRecursiveCall) {
            outputLines.push(`${dirPath}:`);
        }

        const childrenResult = context.vfs.listChildren(dirPath, context.userId, context.groups);
        if (typeof childrenResult === 'string') {
            errors.push(`ls: cannot open directory '${dirPath}': ${childrenResult}`);
            exitCode = 1;
            return;
        }

        let children = childrenResult || [];
        if (!showAll) children = children.filter(n => !n.name.startsWith('.'));

        if (longFormat) {
            for (const child of children) {
                const typeChar = child.type === 'directory' ? 'd' : (child.type === 'symlink' ? 'l' : '-');
                const permStr = formatPermissions(child.permissions);
                const rawSize = child.type === 'file' ? (child.size || 0) : 0;
                const sizeStr = humanReadable ? formatHumanSize(rawSize) : String(rawSize).padStart(5);
                const date = new Date(child.modifiedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                const color = child.type === 'directory' ? colorRoot : (child.type === 'symlink' ? colorLink : colorFile);
                const suffix = child.type === 'symlink' ? ` -> ${child.target || ''}` : '';
                outputLines.push(`${typeChar}${permStr} 1 ${child.ownerId} ${child.groupId} ${sizeStr} ${date} ${color}${child.name}${colorReset}${suffix}`);
            }
        } else {
            const list = children.map(n => {
                const color = n.type === 'directory' ? colorRoot : (n.type === 'symlink' ? colorLink : colorFile);
                return `${color}${n.name}${colorReset}${n.type === 'directory' ? '/' : ''}`;
            });
            outputLines.push(list.join('  '));
        }

        if (recursive) {
            outputLines.push('');
            for (const child of children) {
                if (child.type === 'directory' && child.name !== '.' && child.name !== '..') {
                    const childPath = dirPath === '/' ? `/${child.name}` : `${dirPath}/${child.name}`;
                    listDir(childPath, true);
                }
            }
        }
    };

    function formatPermissions(p: any): string {
        const fmt = (s: any) => `${s.read ? 'r' : '-'}${s.write ? 'w' : '-'}${s.execute ? 'x' : '-'}`;
        // Support setuid/setgid display (simplified for now)
        let ownerX = p.owner.execute ? 'x' : '-';
        if (p.setuid) ownerX = p.owner.execute ? 's' : 'S';
        
        let groupX = p.group.execute ? 'x' : '-';
        if (p.setgid) groupX = p.group.execute ? 's' : 'S';

        let othersX = p.others.execute ? 'x' : '-';
        if (p.sticky) othersX = p.others.execute ? 't' : 'T';

        return `${p.owner.read ? 'r' : '-'}${p.owner.write ? 'w' : '-'}${ownerX}${p.group.read ? 'r' : '-'}${p.group.write ? 'w' : '-'}${groupX}${p.others.read ? 'r' : '-'}${p.others.write ? 'w' : '-'}${othersX}`;
    }

    function formatHumanSize(bytes: number): string {
        if (bytes < 1024) return String(bytes).padStart(5);
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`.padStart(5);
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`.padStart(5);
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`.padStart(5);
    }

    for (const p of paths) {
        const fullPath = context.resolvePath(p);
        listDir(fullPath);
    }

    return {
        output: outputLines.join('\n').trim(),
        error: errors.join('\n').trim(),
        exitCode
    };
};
