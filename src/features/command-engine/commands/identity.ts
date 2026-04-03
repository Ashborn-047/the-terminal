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

export const id = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const passwdContent = context.vfs.readFile('/etc/passwd', 'root', ['root']);
    const groupContent = context.vfs.readFile('/etc/group', 'root', ['root']);

    if (typeof passwdContent !== 'string' || typeof groupContent !== 'string') {
        return { output: '', error: 'id: cannot read /etc/passwd or /etc/group', exitCode: 1 };
    }

    const users = parsePasswd(passwdContent);
    const groups = parseGroup(groupContent);

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
};

export const groups = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const groupContent = context.vfs.readFile('/etc/group', 'root', ['root']);
    if (typeof groupContent !== 'string') return { output: '', error: 'groups: cannot read /etc/group', exitCode: 1 };

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
};
