import { CommandContext, CommandResult } from '../types';
import pm from 'picomatch';

export const find = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let searchPath = '.';
    let namePattern: string | undefined = undefined;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-name' && i + 1 < args.length) {
            namePattern = args[++i];
        } else if (!args[i].startsWith('-')) {
            searchPath = args[i];
        }
    }

    const results: string[] = [];
    const isMatch = namePattern ? pm(namePattern) : () => true;

    const walk = async (path: string) => {
        const res = context.vfs.resolve(path, context.userId, undefined, true, 0, context.groups);
        if (typeof res === 'string') return;

        if (isMatch(res.name)) {
            results.push(path);
        }

        if (res.type === 'directory') {
            const childrenResult = context.vfs.listChildren(path, context.userId, context.groups);
            if (Array.isArray(childrenResult)) {
                for (const child of childrenResult) {
                    await walk(path === '/' ? `/${child.name}` : `${path}/${child.name}`);
                }
            }
        }
    };

    const fullSearchPath = context.resolvePath(searchPath);
    await walk(fullSearchPath);
    return { output: results.sort().join('\n'), exitCode: 0 };
};
