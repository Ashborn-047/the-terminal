import { Inode, VFSSnapshot, InodePermissions } from './types';

const DEFAULT_DIR_PERMISSIONS: InodePermissions = {
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
};

const DEFAULT_FILE_PERMISSIONS: InodePermissions = {
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
};

function createDirectory(id: string, name: string, ownerId: string = 'root', children: string[] = []): Inode {
    return {
        id,
        type: 'directory',
        name,
        permissions: { ...DEFAULT_DIR_PERMISSIONS },
        ownerId,
        groupId: ownerId,
        size: 0,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        children,
    };
}

function createFile(id: string, name: string, content: string = '', ownerId: string = 'root'): Inode {
    return {
        id,
        type: 'file',
        name,
        permissions: { ...DEFAULT_FILE_PERMISSIONS },
        ownerId,
        groupId: ownerId,
        size: content.length,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        content,
    };
}

/**
 * Predefined VFS snapshots as required by Doc 2 §3.
 */
export const snapshots: Record<string, VFSSnapshot> = {
    'default': {
        rootId: 'root',
        inodes: {
            'root': createDirectory('root', '/', 'root', ['bin', 'etc', 'home', 'tmp', 'var', 'usr']),
            'bin': createDirectory('bin', 'bin', 'root'),
            'etc': createDirectory('etc', 'etc', 'root', ['hostname', 'passwd', 'group']),
            'hostname': createFile('hostname', 'hostname', 'the-terminal', 'root'),
            'passwd': createFile('passwd', 'passwd', 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:Guest:/home/guest:/bin/bash', 'root'),
            'group': createFile('group', 'group', 'root:x:0:\nusers:x:100:\nguest:x:1000:', 'root'),
            'home': createDirectory('home', 'home', 'root', ['guest']),
            'guest': createDirectory('guest', 'guest', 'guest'),
            'tmp': createDirectory('tmp', 'tmp', 'root'),
            'var': createDirectory('var', 'var', 'root', ['log']),
            'log': createDirectory('log', 'log', 'root', ['syslog']),
            'syslog': createFile('syslog', 'syslog', 'Feb 28 10:00:01 systemd[1]: Started.\n', 'root'),
            'usr': createDirectory('usr', 'usr', 'root', ['bin', 'local']),
            'usr_bin': createDirectory('usr_bin', 'bin', 'root'),
            'usr_local': createDirectory('usr_local', 'local', 'root'),
        }
    },
    'hpc-base': {
        rootId: 'root',
        inodes: {
            'root': createDirectory('root', '/', 'root', ['home', 'shared', 'etc']),
            'home': createDirectory('home', 'home', 'root', ['guest']),
            'guest': createDirectory('guest', 'guest', 'guest', ['work', 'data']),
            'work': createDirectory('work', 'work', 'guest'),
            'data': createDirectory('data', 'data', 'guest'),
            'shared': createDirectory('shared', 'shared', 'root'),
            'etc': createDirectory('etc', 'etc', 'root'),
        }
    }
};
