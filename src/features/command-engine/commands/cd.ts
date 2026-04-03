import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';
import { formatError } from '../../../utils/error_codes';

export const cd = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let path = args.length > 0 ? args[0] : '/home/' + context.userId;
    if (path === '~' || path.startsWith('~/')) {
        path = '/home/' + context.userId + path.slice(1);
    }

    const result = context.vfs.resolve(path, context.userId, undefined, true, 0, context.groups);
    if (typeof result === 'string') {
        return { output: '', error: formatError('NO_SUCH_FILE_OR_DIRECTORY'), exitCode: 1 };
    }

    const inode = result as Inode;
    if (inode.type !== 'directory') {
        return { output: '', error: `cd: ${path}: Not a directory`, exitCode: 1 };
    }

    return { output: context.vfs.getPath(inode.id), exitCode: 0 };
};
