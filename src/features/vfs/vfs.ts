import { v4 as uuidv4 } from 'uuid';
import {
    Inode,
    InodePermissions,
    FileType,
    VFSSnapshot,
    VFSPermissions
} from './types';
import { snapshots } from './snapshots';
import { formatError } from '../../utils/error_codes';
import { logger } from '../../utils/logger';

export const DEFAULT_DIR_PERMISSIONS: InodePermissions = {
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
};

export const DEFAULT_FILE_PERMISSIONS: InodePermissions = {
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
};

/** Convert InodePermissions to octal string like "755" or "1755" */
export function permissionsToOctal(perms: InodePermissions): string {
    const toDigit = (p: VFSPermissions) =>
        (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
    const special = (perms.setuid ? 4 : 0) + (perms.setgid ? 2 : 0) + (perms.sticky ? 1 : 0);
    const pStr = `${toDigit(perms.owner)}${toDigit(perms.group)}${toDigit(perms.others)}`;
    return special > 0 ? `${special}${pStr}` : pStr;
}

/** Convert octal string like "755" or "1755" to InodePermissions */
export function octalToPermissions(mode: string): InodePermissions | null {
    if (!/^[0-7]{3,4}$/.test(mode)) return null;
    let special = 0;
    let pStr = mode;
    if (mode.length === 4) {
        special = parseInt(mode[0], 10);
        pStr = mode.slice(1);
    }
    const parse = (ch: string): VFSPermissions => {
        const v = parseInt(ch, 10);
        return { read: (v & 4) !== 0, write: (v & 2) !== 0, execute: (v & 1) !== 0 };
    };
    return {
        owner: parse(pStr[0]),
        group: parse(pStr[1]),
        others: parse(pStr[2]),
        setuid: (special & 4) !== 0,
        setgid: (special & 2) !== 0,
        sticky: (special & 1) !== 0,
    };
}

const MAX_SYMLINK_DEPTH = 20;

export class VFS {
    private rootId: string;
    private inodes: Record<string, Inode>;
    private umask: string = '0022';

    constructor(snapshot?: VFSSnapshot) {
        if (snapshot) {
            this.rootId = snapshot.rootId;
            this.inodes = { ...snapshot.inodes };
        } else {
            const rootInode: Inode = {
                id: uuidv4(),
                type: 'directory',
                name: '/',
                permissions: { ...DEFAULT_DIR_PERMISSIONS },
                ownerId: 'root',
                groupId: 'root',
                size: 0,
                createdAt: Date.now(),
                modifiedAt: Date.now(),
                children: [],
            };
            this.rootId = rootInode.id;
            this.inodes = { [rootInode.id]: rootInode };
            this.initializeDefaultFS();
        }
    }

    /**
     * VFS Serialization — per Doc 2 §3.1
     */
    public serialize(): string {
        return JSON.stringify({ rootId: this.rootId, inodes: this.inodes });
    }

    public deserialize(data: string): void {
        try {
            const newSnapshot: VFSSnapshot = JSON.parse(data);
            this.rootId = newSnapshot.rootId;
            this.inodes = newSnapshot.inodes;
        } catch (e) {
            console.error('Failed to deserialize VFS:', e);
        }
    }

    public loadSnapshot(name: string): void {
        const snapshot = snapshots[name];
        if (snapshot) {
            this.rootId = snapshot.rootId;
            this.inodes = JSON.parse(JSON.stringify(snapshot.inodes));
        } else {
            console.warn(`Snapshot "${name}" not found.`);
        }
    }

    public setUmask(mode: string): boolean {
        if (!/^[0-7]{3,4}$/.test(mode)) return false;
        this.umask = mode.padStart(4, '0');
        return true;
    }

    public getUmask(): string {
        return this.umask;
    }

    private applyUmask(perms: InodePermissions): InodePermissions {
        const mask = octalToPermissions(this.umask);
        if (!mask) return perms;

        return {
            owner: {
                read: perms.owner.read && !mask.owner.read,
                write: perms.owner.write && !mask.owner.write,
                execute: perms.owner.execute && !mask.owner.execute,
            },
            group: {
                read: perms.group.read && !mask.group.read,
                write: perms.group.write && !mask.group.write,
                execute: perms.group.execute && !mask.group.execute,
            },
            others: {
                read: perms.others.read && !mask.others.read,
                write: perms.others.write && !mask.others.write,
                execute: perms.others.execute && !mask.others.execute,
            }
        };
    }

    private initializeDefaultFS() {
        this.mkdir('/', 'bin', 'root');
        this.mkdir('/', 'etc', 'root');
        this.mkdir('/', 'home', 'root');
        this.mkdir('/home', 'guest', 'guest');
        this.mkdir('/', 'tmp', 'root');
        this.mkdir('/', 'var', 'root');
        this.mkdir('/var', 'log', 'root');
        this.mkdir('/', 'proc', 'root');
        this.mkdir('/', 'usr', 'root');
        this.mkdir('/usr', 'bin', 'root');
        this.mkdir('/usr', 'local', 'root');

        this.touch('/etc', 'hostname', 'root');
        this.writeFile('/etc/hostname', 'the-terminal', 'root');
        this.touch('/etc', 'passwd', 'root');
        this.writeFile('/etc/passwd',
            'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:Guest:/home/guest:/bin/bash',
            'root'
        );
        this.touch('/etc', 'group', 'root');
        this.writeFile('/etc/group', 'root:x:0:\nusers:x:100:\nguest:x:1000:', 'root');
        this.touch('/var/log', 'syslog', 'root');
        this.writeFile('/var/log/syslog',
            'Feb 28 10:00:01 the-terminal systemd[1]: Started The Terminal.\nFeb 28 10:00:02 the-terminal kernel: Linux version 6.1.0',
            'root'
        );
    }

    // Accessors
    public getRootId(): string { return this.rootId; }

    private hasPermission(inode: Inode, userId: string, type: keyof VFSPermissions): boolean {
        if (userId === 'root') return true;
        if (inode.ownerId === userId) return inode.permissions.owner[type];
        // Note: simplified group check
        if (inode.groupId === userId) return inode.permissions.group[type];
        return inode.permissions.others[type];
    }

    public resolve(
        path: string,
        userId: string = 'root',
        startNodeId: string = this.rootId,
        followSymlinks: boolean = true,
        _depth: number = 0
    ): Inode | string {
        if (_depth > MAX_SYMLINK_DEPTH) return 'Too many levels of symbolic links';
        if (path === '/') return this.inodes[this.rootId];

        const parts = path.split('/').filter(p => p.length > 0);
        let currentId = path.startsWith('/') ? this.rootId : startNodeId;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const currentInode = this.inodes[currentId];

            if (!currentInode) return formatError('FILE_NOT_FOUND');

            if (part === '.') continue;
            if (part === '..') {
                const parentId = this.findParentId(currentId);
                currentId = parentId || this.rootId;
                continue;
            }

            if (currentInode.type !== 'directory' || !currentInode.children) {
                return formatError('NOT_A_DIRECTORY');
            }

            if (!this.hasPermission(currentInode, userId, 'execute')) {
                logger.security('PERMISSION_DENIED', { path, part, userId, action: 'execute' });
                return formatError('PERMISSION_DENIED');
            }

            const childId = currentInode.children.find(id => this.inodes[id]?.name === part);
            if (!childId) return formatError('FILE_NOT_FOUND');

            const childInode = this.inodes[childId];

            if (childInode.type === 'symlink' && followSymlinks) {
                const target = childInode.target || '';
                const resolved = this.resolve(target, userId, currentId, true, _depth + 1);
                if (typeof resolved === 'string') return resolved;

                if (i < parts.length - 1) {
                    const remaining = parts.slice(i + 1).join('/');
                    return this.resolve(remaining, userId, resolved.id, true, _depth + 1);
                }
                return resolved;
            }

            currentId = childId;
        }

        return this.inodes[currentId];
    }

    public readFile(path: string, userId: string = 'root'): string | { error: string } {
        const result = this.resolve(path, userId);
        if (typeof result === 'string') return { error: result };

        const inode = result as Inode;
        if (inode.type === 'directory') return { error: formatError('IS_DIRECTORY') };

        if (!this.hasPermission(inode, userId, 'read')) {
            logger.security('PERMISSION_DENIED', { path, userId, action: 'read' });
            return { error: formatError('PERMISSION_DENIED') };
        }
        return inode.content || '';
    }

    public writeFile(path: string, content: string, userId: string = 'root'): boolean | { error: string } {
        let result = this.resolve(path, userId);

        if (typeof result === 'string') {
            if (result === formatError('FILE_NOT_FOUND')) {
                // Try to create the file
                const parts = path.split('/').filter(p => p.length > 0);
                const name = parts.pop() || '';
                const parentPath = path.startsWith('/') ? '/' + parts.join('/') : parts.join('/') || '/';

                const touchResult = this.touch(parentPath, name, userId);
                if (typeof touchResult === 'string') return { error: touchResult };
                result = touchResult;
            } else {
                return { error: result };
            }
        }

        const inode = result as Inode;
        if (inode.type !== 'file') return { error: 'Not a file' };

        if (!this.hasPermission(inode, userId, 'write')) {
            logger.security('PERMISSION_DENIED', { path, userId, action: 'write' });
            return { error: formatError('PERMISSION_DENIED') };
        }

        inode.content = content;
        inode.size = content.length;
        inode.modifiedAt = Date.now();
        return true;
    }

    public mkdir(parentPath: string, name: string, ownerId: string = 'root', mode?: string): Inode | string {
        const parentResult = this.resolve(parentPath, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = parentResult as Inode;
        if (parentInode.type !== 'directory') return 'Not a directory';

        if (parentInode.children?.some(id => this.inodes[id]?.name === name)) {
            return formatError('DIRECTORY_ALREADY_EXISTS');
        }

        const newId = uuidv4();
        const initialPerms = mode ? octalToPermissions(mode) : DEFAULT_DIR_PERMISSIONS;
        if (!initialPerms) return 'Invalid mode';

        const newInode: Inode = {
            id: newId,
            type: 'directory',
            name,
            permissions: mode ? initialPerms : this.applyUmask({ ...DEFAULT_DIR_PERMISSIONS }),
            ownerId,
            groupId: ownerId,
            size: 0,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            children: [],
        };

        this.inodes[newId] = newInode;
        parentInode.children = parentInode.children || [];
        parentInode.children.push(newId);
        parentInode.modifiedAt = Date.now();
        return newInode;
    }

    public touch(parentPath: string, name: string, ownerId: string = 'root'): Inode | string {
        const parentResult = this.resolve(parentPath, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = parentResult as Inode;
        if (parentInode.type !== 'directory') return 'Not a directory';

        const existingId = parentInode.children?.find(id => this.inodes[id]?.name === name);
        if (existingId) {
            this.inodes[existingId].modifiedAt = Date.now();
            return this.inodes[existingId];
        }

        const newId = uuidv4();
        const newInode: Inode = {
            id: newId,
            type: 'file',
            name,
            permissions: this.applyUmask({ ...DEFAULT_FILE_PERMISSIONS }),
            ownerId,
            groupId: ownerId,
            size: 0,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            content: '',
        };

        this.inodes[newId] = newInode;
        parentInode.children = parentInode.children || [];
        parentInode.children.push(newId);
        parentInode.modifiedAt = Date.now();
        return newInode;
    }

    public ln(parentPath: string, name: string, target: string, ownerId: string = 'root', symbolic: boolean = false): Inode | string {
        const parentResult = this.resolve(parentPath, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = parentResult as Inode;
        if (parentInode.type !== 'directory') return 'Not a directory';

        if (parentInode.children?.some(id => this.inodes[id]?.name === name)) {
            return formatError('DIRECTORY_ALREADY_EXISTS');
        }

        const targetResult = this.resolve(target, ownerId);
        if (!symbolic && typeof targetResult === 'string') return targetResult;
        if (!symbolic && (targetResult as Inode).type === 'directory') return 'hard link not allowed for directory';

        const newId = uuidv4();
        const newInode: Inode = symbolic ? {
            id: newId,
            type: 'symlink',
            name,
            permissions: { ...DEFAULT_FILE_PERMISSIONS },
            ownerId,
            groupId: ownerId,
            size: target.length,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            target,
        } : {
            ...(targetResult as Inode),
            id: newId,
            name,
            modifiedAt: Date.now(),
        };

        this.inodes[newId] = newInode;
        parentInode.children = parentInode.children || [];
        parentInode.children.push(newId);
        parentInode.modifiedAt = Date.now();
        return newInode;
    }

    public rm(path: string, recursive: boolean = false, userId: string = 'root'): boolean | string {
        const result = this.resolve(path, userId, this.rootId, false);
        if (typeof result === 'string') return result;

        const inode = result as Inode;
        if (inode.id === this.rootId) return 'Cannot remove root directory';

        if (inode.type === 'directory' && !recursive && (inode.children?.length || 0) > 0) {
            return 'Directory not empty';
        }

        const parentId = this.findParentId(inode.id);
        if (!parentId) return 'Internal error: parent not found';

        const parentInode = this.inodes[parentId];

        // Sticky bit check: only owner of file/dir or root can delete
        if (parentInode.permissions.sticky && userId !== 'root') {
            if (inode.ownerId !== userId && parentInode.ownerId !== userId) {
                return 'Operation not permitted (Sticky bit set)';
            }
        }

        if (!this.hasPermission(parentInode, userId, 'write')) {
            return 'Permission denied';
        }

        if (inode.type === 'directory' && recursive && inode.children) {
            const children = [...inode.children];
            for (const childId of children) {
                const child = this.inodes[childId];
                if (child) {
                    const childPath = `${path === '/' ? '' : path}/${child.name}`;
                    this.rm(childPath, true, userId);
                }
            }
        }

        parentInode.children = parentInode.children?.filter(id => id !== inode.id);
        parentInode.modifiedAt = Date.now();
        delete this.inodes[inode.id];
        return true;
    }

    public chmod(path: string, mode: string, userId: string = 'root'): boolean | string {
        const result = this.resolve(path, userId);
        if (typeof result === 'string') return result;

        const inode = result as Inode;
        if (inode.ownerId !== userId && userId !== 'root') return 'Permission denied';

        const perms = octalToPermissions(mode);
        if (!perms) return 'Invalid mode';

        inode.permissions = perms;
        inode.modifiedAt = Date.now();
        return true;
    }

    public chown(path: string, newOwner: string, userId: string = 'root'): boolean | string {
        if (userId !== 'root') return 'Permission denied';

        const result = this.resolve(path, userId);
        if (typeof result === 'string') return result;

        const inode = result as Inode;
        inode.ownerId = newOwner;
        inode.modifiedAt = Date.now();
        return true;
    }

    private findParentId(inodeId: string): string | null {
        for (const id in this.inodes) {
            if (this.inodes[id].children?.includes(inodeId)) return id;
        }
        return null;
    }

    public listChildren(path: string, userId: string = 'root'): Inode[] | null | string {
        const r = this.resolve(path, userId);
        if (typeof r === 'string') return r;
        if (r.type !== 'directory') return 'Not a directory';

        if (!this.hasPermission(r, userId, 'read')) {
            return 'Permission denied';
        }

        return (r.children || [])
            .map(id => this.inodes[id])
            .filter((n): n is Inode => !!n);
    }

    public getPath(id: string): string {
        const inode = this.inodes[id];
        if (!inode) return '';
        if (id === this.rootId) return '/';
        const parentId = this.findParentId(id);
        if (!parentId) return '';
        const parentPath = this.getPath(parentId);
        return parentPath === '/' ? `/${inode.name}` : `${parentPath}/${inode.name}`;
    }

    public cp(srcPath: string, destPath: string, recursive: boolean = false, userId: string = 'root'): boolean | string {
        const srcResult = this.resolve(srcPath, userId);
        if (typeof srcResult === 'string') return srcResult;

        const srcInode = srcResult as Inode;
        if (srcInode.type === 'directory' && !recursive) return 'omitting directory';

        const destParts = destPath.split('/').filter(p => p.length > 0);
        const destName = destParts.pop() || '';
        const destParentPath = destPath.startsWith('/') ? '/' + destParts.join('/') : destParts.join('/');

        const destParentResult = this.resolve(destParentPath || '/', userId);
        if (typeof destParentResult === 'string') return destParentResult;
        const destParentInode = destParentResult as Inode;

        const copyRecursive = (inode: Inode, parentId: string, newName: string): void => {
            const newId = uuidv4();
            const copy: Inode = {
                ...inode,
                id: newId,
                name: newName,
                createdAt: Date.now(),
                modifiedAt: Date.now(),
                children: inode.type === 'directory' ? [] : undefined,
            };
            this.inodes[newId] = copy;
            this.inodes[parentId].children?.push(newId);

            if (inode.type === 'directory' && inode.children) {
                for (const childId of inode.children) {
                    const child = this.inodes[childId];
                    if (child) copyRecursive(child, newId, child.name);
                }
            }
        };

        copyRecursive(srcInode, destParentInode.id, destName);
        destParentInode.modifiedAt = Date.now();
        return true;
    }

    public mv(srcPath: string, destPath: string, userId: string = 'root'): boolean | string {
        const srcResult = this.resolve(srcPath, userId);
        if (typeof srcResult === 'string') return srcResult;
        const srcInode = srcResult as Inode;

        const destParts = destPath.split('/').filter(p => p.length > 0);
        const destName = destParts.pop() || '';
        const destParentPath = destPath.startsWith('/') ? '/' + destParts.join('/') : destParts.join('/');

        const destParentResult = this.resolve(destParentPath || '/', userId);
        if (typeof destParentResult === 'string') return destParentResult;
        const destParentInode = destParentResult as Inode;

        if (destParentInode.children?.some(id => this.inodes[id]?.name === destName)) {
            return 'Destination already exists';
        }

        const oldParentId = this.findParentId(srcInode.id);
        if (oldParentId) {
            const oldParent = this.inodes[oldParentId];
            oldParent.children = oldParent.children?.filter(id => id !== srcInode.id);
            oldParent.modifiedAt = Date.now();
        }

        srcInode.name = destName;
        destParentInode.children = destParentInode.children || [];
        destParentInode.children.push(srcInode.id);
        destParentInode.modifiedAt = Date.now();
        srcInode.modifiedAt = Date.now();
        return true;
    }

    public getSnapshot(): VFSSnapshot {
        return { rootId: this.rootId, inodes: { ...this.inodes } };
    }

    public getInode(id: string): Inode | null {
        return this.inodes[id] || null;
    }

    public getMetadata(path: string, userId: string = 'root'): Inode | string {
        const result = this.resolve(path, userId);
        return result;
    }

    public exists(path: string, userId: string = 'root'): boolean {
        return typeof this.resolve(path, userId) !== 'string';
    }

    public isDirectory(path: string, userId: string = 'root'): boolean {
        const res = this.resolve(path, userId);
        return typeof res !== 'string' && res.type === 'directory';
    }

    public isFile(path: string, userId: string = 'root'): boolean {
        const res = this.resolve(path, userId);
        return typeof res !== 'string' && res.type === 'file';
    }
}
