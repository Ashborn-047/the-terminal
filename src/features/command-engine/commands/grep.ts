import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';
import { readStream } from '../utils';

export const grep = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let caseInsensitive = false;
    let invert = false;
    let lineNumbers = false;
    let countOnly = false;
    let recursive = false;
    const nonFlags: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-') && arg !== '--') {
            if (arg.includes('i')) caseInsensitive = true;
            if (arg.includes('v')) invert = true;
            if (arg.includes('n')) lineNumbers = true;
            if (arg.includes('c')) countOnly = true;
            if (arg.includes('r') || arg.includes('R')) recursive = true;
        } else {
            nonFlags.push(arg);
        }
    }

    if (nonFlags.length < 1) return { output: '', error: 'Usage: grep [options] PATTERN [FILE...]', exitCode: 2 };

    const pattern = nonFlags[0];
    const filePaths = nonFlags.slice(1);
    const outputLines: string[] = [];

    const searchContent = (content: string, prefix: string) => {
        const lines = content.split('\n');
        let matchCount = 0;
        let regex: RegExp;
        try { regex = new RegExp(pattern, caseInsensitive ? 'i' : ''); } catch (e) { return 0; }

        for (let i = 0; i < lines.length; i++) {
            if (context.isInterrupted()) break;
            const line = lines[i];
            let matches = regex.test(line);
            if (invert) matches = !matches;
            if (matches) {
                matchCount++;
                if (!countOnly) {
                    const lineNum = lineNumbers ? `${i + 1}:` : '';
                    outputLines.push(`${prefix}${lineNum}${line}`);
                }
            }
        }
        return matchCount;
    };

    const processPath = async (path: string): Promise<void> => {
        const resolved = context.vfs.resolve(path, context.userId, context.groups);
        if (typeof resolved === 'string') return;
        const inode = resolved as Inode;

        if (inode.type === 'file') {
            if (context.isInterrupted()) return;
            const content = context.vfs.readFile(path, context.userId, context.groups);
            if (typeof content === 'string') {
                const prefix = (filePaths.length > 1 || recursive) ? `${path}:` : '';
                const matchCount = searchContent(content, prefix);
                if (countOnly) outputLines.push(`${prefix}${matchCount}`);
            }
        } else if (inode.type === 'directory' && recursive && inode.children) {
            for (const childId of inode.children) {
                if (context.isInterrupted()) return;
                const child = context.vfs.getInode(childId);
                if (child) {
                    const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                    await processPath(childPath);
                }
            }
        }
    };

    if (filePaths.length === 0) {
        const content = await readStream(input);
        searchContent(content, '');
    } else {
        for (const fp of filePaths) await processPath(fp);
    }

    return { output: outputLines.join('\n'), exitCode: outputLines.length > 0 ? 0 : 1 };
};
