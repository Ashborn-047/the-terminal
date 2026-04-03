import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';

export const chmod = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length < 2) return { output: '', error: 'chmod: missing operand', exitCode: 1 };
    const recursive = args.includes('-R');
    const filteredArgs = args.filter(a => a !== '-R');
    const mode = filteredArgs[0];
    const paths = filteredArgs.slice(1);

    const applyMode = (path: string, inode: Inode) => {
        // Ownership check: only owner or root can chmod
        if (inode.ownerId !== context.userId && context.userId !== 'root') {
            return `chmod: changing permissions of '${path}': Operation not permitted`;
        }
        
        if (/^[0-7]{3,4}$/.test(mode)) {
            context.vfs.chmod(path, mode, context.userId, context.groups);
        } else {
            const newPermissions = parseSymbolicMode(mode, inode.permissions);
            if (!newPermissions) return `chmod: invalid mode: '${mode}'`;
            inode.permissions = newPermissions;
            // Note: symbolic mode currently doesn't easily handle setuid/setgid/sticky in this impl
        }
        return null;
    };

    const walk = (path: string): string | null => {
        const resolved = context.vfs.resolve(path, context.userId, undefined, true, 0, context.groups);
        if (typeof resolved === 'string') return resolved;
        const inode = resolved as Inode;
        const err = applyMode(path, inode);
        if (err) return err;
        if (recursive && inode.type === 'directory' && inode.children) {
            for (const childId of inode.children) {
                const child = context.vfs.getInode(childId);
                if (child) {
                    const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                    const walkErr = walk(childPath);
                    if (walkErr) return walkErr;
                }
            }
        }
        return null;
    };

    for (const path of paths) {
        const fullPath = context.resolvePath(path);
        const err = walk(fullPath);
        if (err) return { output: '', error: err, exitCode: 1 };
    }
    return { output: '', exitCode: 0 };
};

function parseSymbolicMode(mode: string, current: any): any | null {
    const perms = JSON.parse(JSON.stringify(current));
    const parts = mode.split(',');
    for (const part of parts) {
        const match = part.match(/^([ugoa]*)([+=-])([rwx]*)$/);
        if (!match) return null;
        const [, recipients, op, requested] = match;
        const targets: ('owner' | 'group' | 'others')[] = [];
        if (!recipients || recipients.includes('a')) targets.push('owner', 'group', 'others');
        else {
            if (recipients.includes('u')) targets.push('owner');
            if (recipients.includes('g')) targets.push('group');
            if (recipients.includes('o')) targets.push('others');
        }
        const r = requested.includes('r'), w = requested.includes('w'), x = requested.includes('x');
        for (const t of targets) {
            if (op === '+') { if (r) perms[t].read = true; if (w) perms[t].write = true; if (x) perms[t].execute = true; }
            else if (op === '-') { if (r) perms[t].read = false; if (w) perms[t].write = false; if (x) perms[t].execute = false; }
            else if (op === '=') { perms[t].read = r; perms[t].write = w; perms[t].execute = x; }
        }
    }
    return perms;
}
