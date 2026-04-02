import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';

export const du = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const targets = args.length > 0 ? args.filter(a => !a.startsWith('-')) : ['.'];
    const humanReadable = args.includes('-h');
    let output = '';

    const formatSize = (bytes: number) => {
        if (!humanReadable) return Math.ceil(bytes / 1024).toString();
        const units = ['B', 'K', 'M', 'G', 'T'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)}${units[unitIndex]}`;
    };

    const calculateSize = (inode: Inode): number => {
        if (inode.type === 'file') return inode.size || 0;
        if (inode.type === 'directory' && inode.children) {
            return (inode.children as string[]).reduce((acc: number, childId: string) => {
                const child = context.vfs.getInode(childId);
                return acc + (child ? calculateSize(child) : 0);
            }, 4096); // Directories have a base size of 4K in Linux
        }
        return 0;
    };

    for (const target of targets) {
        const fullPath = target.startsWith('/') ? target : (context.cwd === '/' ? '/' + target : context.cwd + '/' + target);
        const result = context.vfs.resolve(fullPath, context.userId, context.groups);
        
        if (typeof result === 'string') {
            output += `du: cannot access '${target}': No such file or directory\n`;
            continue;
        }

        const size = calculateSize(result as Inode);
        output += `${formatSize(size)}\t${target}\n`;
    }

    return { output, exitCode: 0 };
};
