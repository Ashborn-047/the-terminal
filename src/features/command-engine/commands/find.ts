import { CommandContext, CommandResult } from '../types';

export const find = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const searchPath = args[0] || context.cwd;
    const results: string[] = [];
    const walk = async (path: string) => {
        const res = context.vfs.resolve(path, context.userId, context.groups);
        if (typeof res === 'string') return;
        results.push(path);
        if (res.type === 'directory' && res.children) {
            for (const cid of res.children) {
                const child = context.vfs.getInode(cid);
                if (child) {
                    await walk(path === '/' ? `/${child.name}` : `${path}/${child.name}`);
                }
            }
        }
    };
    await walk(searchPath);
    return { output: results.join('\n'), exitCode: 0 };
};
