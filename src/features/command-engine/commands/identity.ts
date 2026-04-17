import { CommandContext, CommandResult } from '../types';
import { CommandRegistry } from '../registry';
import { formatError } from '../../../utils/error_codes';

const parsePasswd = (content: string) => {
    return content.split('\n').filter(l => l.includes(':')).map(line => {
        const [username, x, uid, gid, comment, home, shell] = line.split(':');
        return { username, uid: parseInt(uid), gid: parseInt(gid), comment, home, shell };
    });
};

const parseGroup = (content: string) => {
    return content.split('\n').filter(l => l.includes(':')).map(line => {
        const [groupname, x, gid, members] = line.split(':');
        return { groupname, gid: parseInt(gid), members: members ? members.split(',') : [] };
    });
};

async function readSystemFile(vfs: any, path: string, userId: string, groups: string[]): Promise<string> {
    const result = await vfs.readFile(path, userId, groups);
    if (typeof result === 'string') return result;
    
    // Hybrid iteration to support both standard ReadableStream and AsyncIterables
    let content = '';
    if (typeof result.getReader === 'function') {
        const reader = result.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                content += value;
            }
        } finally {
            reader.releaseLock();
        }
    } else if ((result as any)[Symbol.asyncIterator]) {
        for await (const chunk of result as any) {
            content += chunk;
        }
    }
    return content;
}

export const id = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    try {
        const passwdContent = await readSystemFile(context.vfs, '/etc/passwd', 'root', ['root']);
        const groupContent = await readSystemFile(context.vfs, '/etc/group', 'root', ['root']);

        const users = parsePasswd(passwdContent);
        const groups = parseGroup(groupContent);
        
        console.log(`[DEBUG ID] context.userId: ${context.userId}, users found: ${users.length}, root found: ${!!users.find(u => u.username === 'root')}`);

        const showUidOnly = args.includes('-u');
        const showUsernameOnly = args.includes('-un');
        const filteredArgs = args.filter(a => !a.startsWith('-'));
        
        let targetUser = users.find(u => u.username === context.userId || u.uid === parseInt(context.userId));
        if (filteredArgs.length > 0) {
            targetUser = users.find(u => u.username === filteredArgs[0]);
            if (!targetUser) return { output: '', error: `id: '${filteredArgs[0]}': no such user`, exitCode: 1 };
        }

        if (!targetUser) {
            if (showUidOnly) return { output: `${context.userId}\n`, exitCode: 0 };
            return { output: `uid=${context.userId} gid=${context.userId} groups=${context.groups.join(',')}\n`, exitCode: 0 };
        }

        if (showUidOnly) {
            if (showUsernameOnly) return { output: `${targetUser.username}\n`, exitCode: 0 };
            return { output: `${targetUser.uid}\n`, exitCode: 0 };
        }

        const primaryGroup = groups.find(g => g.gid === targetUser!.gid) || { groupname: targetUser.username, gid: targetUser.gid };
        const supplementaryGroups = groups.filter(g => g.members.includes(targetUser!.username) || g.gid === targetUser!.gid);

        const groupStr = supplementaryGroups.map(g => `${g.gid}(${g.groupname})`).join(',');
        return {
            output: `uid=${targetUser.uid}(${targetUser.username}) gid=${targetUser.gid}(${primaryGroup.groupname}) groups=${groupStr}\n`,
            exitCode: 0
        };
    } catch (err) {
        return { output: '', error: 'id: internal error reading system files', exitCode: 1 };
    }
};

export const groups = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    try {
        const groupContent = await readSystemFile(context.vfs, '/etc/group', 'root', ['root']);
        const groups = parseGroup(groupContent);
        const username = args.length > 0 ? args[0] : context.userId;

        const userGroups = groups.filter(g => g.members.includes(username) || g.groupname === username);
        if (userGroups.length === 0 && args.length > 0) {
            return { output: '', error: `groups: '${args[0]}': no such user`, exitCode: 1 };
        }

        return {
            output: userGroups.map(g => g.groupname).join(' ') + '\n',
            exitCode: 0
        };
    } catch (err) {
        return { output: '', error: 'groups: internal error reading system files', exitCode: 1 };
    }
};
