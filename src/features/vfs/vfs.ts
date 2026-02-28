import { v4 as uuidv4 } from 'uuid';
import { Inode, InodePermissions, FileType, VFSSnapshot, VFSPermissions } from './types';

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

/** Convert InodePermissions to octal string like "755" */
export function permissionsToOctal(perms: InodePermissions): string {
    const toDigit = (p: VFSPermissions) =>
        (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
    return `${toDigit(perms.owner)}${toDigit(perms.group)}${toDigit(perms.others)}`;
}

/** Convert octal string like "755" to InodePermissions */
export function octalToPermissions(mode: string): InodePermissions | null {
    if (!/^[0-7]{3}$/.test(mode)) return null;
    const parse = (ch: string): VFSPermissions => {
        const v = parseInt(ch, 10);
        return { read: (v & 4) !== 0, write: (v & 2) !== 0, execute: (v & 1) !== 0 };
    };
    return { owner: parse(mode[0]), group: parse(mode[1]), others: parse(mode[2]) };
}

const MAX_SYMLINK_DEPTH = 20;

export class VFS {
    private rootId: string;
    private inodes: Record<string, Inode>;

    constructor(snapshot?: VFSSnapshot) {
        if (snapshot) {
            this.rootId = snapshot.rootId;
            this.inodes = snapshot.inodes;
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

    // ======================================================================
    // Default Filesystem — matches command_engine_vfs.md §2.4 "default" snapshot
    // ======================================================================
    private initializeDefaultFS() {
        // Standard directories
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

        // System files
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

    // ======================================================================
    // Accessors
    // ======================================================================
    public getRootId(): string { return this.rootId; }
    public getInode(id: string): Inode | undefined { return this.inodes[id]; }

    // ======================================================================
    // Permissions — doc §2.3 checkPermission
    // ======================================================================
    private hasPermission(inode: Inode, userId: string, type: keyof VFSPermissions): boolean {
        if (userId === 'root') return true;
        if (inode.ownerId === userId) return inode.permissions.owner[type];
        if (inode.groupId === userId) return inode.permissions.group[type];
        return inode.permissions.others[type];
    }

    // ======================================================================
    // Path Resolution — doc §2.3 resolve() with symlink following, . and ..
    // ======================================================================
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

            if (!currentInode) return 'No such file or directory';

            // Handle . and ..
            if (part === '.') continue;
            if (part === '..') {
                const parentId = this.findParentId(currentId);
                currentId = parentId || this.rootId;
                continue;
            }

            if (currentInode.type !== 'directory' || !currentInode.children) {
                return 'Not a directory';
            }

            if (!this.hasPermission(currentInode, userId, 'execute')) {
                return 'Permission denied';
            }

            const childId = currentInode.children.find(id => this.inodes[id]?.name === part);
            if (!childId) return 'No such file or directory';

            const childInode = this.inodes[childId];

            // Symlink following
            if (childInode.type === 'symlink' && followSymlinks) {
                const target = childInode.target || '';
                const resolved = this.resolve(target, userId, currentId, true, _depth + 1);
                if (typeof resolved === 'string') return resolved;

                // If more parts remain, continue resolving from the symlink target
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

    // ======================================================================
    // File Reading & Writing
    // ======================================================================
    public readFile(path: string, userId: string = 'root'): string | { error: string } {
        const result = this.resolve(path, userId);
        if (typeof result === 'string') return { error: result };

        const inode = result as Inode;
        if (inode.type === 'directory') return { error: 'Is a directory' };
        if (inode.type === 'symlink') return { error: 'Is a symbolic link' };

        if (!this.hasPermission(inode, userId, 'read')) {
            return { error: 'Permission denied' };
        }
        return inode.content || '';
    }

    public writeFile(path: string, content: string, userId: string = 'root'): boolean | { error: string } {
        const result = this.resolve(path, userId);
        if (typeof result === 'string') return { error: result };

        const inode = result as Inode;
        if (inode.type !== 'file') return { error: 'Is a directory' };

        if (!this.hasPermission(inode, userId, 'write')) {
            return { error: 'Permission denied' };
        }

        this.inodes[inode.id].content = content;
        this.inodes[inode.id].size = content.length;
        this.inodes[inode.id].modifiedAt = Date.now();
        return true;
    }

    // ======================================================================
    // Directory & File Creation
    // ======================================================================
    public mkdir(parentPath: string, name: string, ownerId: string = 'root'): Inode | string {
        const parentResult = this.resolve(parentPath, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = parentResult as Inode;
        if (parentInode.type !== 'directory') return 'Not a directory';

        if (parentInode.children?.some(id => this.inodes[id]?.name === name)) {
            return 'File exists';
        }

        const newInode: Inode = {
            id: uuidv4(), type: 'directory', name,
            permissions: { ...DEFAULT_DIR_PERMISSIONS },
            ownerId, groupId: ownerId, size: 0,
            createdAt: Date.now(), modifiedAt: Date.now(), children: [],
        };

        this.inodes[newInode.id] = newInode;
        parentInode.children = parentInode.children || [];
        parentInode.children.push(newInode.id);
        parentInode.modifiedAt = Date.now();
        return newInode;
    }

    public touch(parentPath: string, name: string, ownerId: string = 'root'): Inode | string {
        const parentResult = this.resolve(parentPath, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = parentResult as Inode;
        if (parentInode.type !== 'directory') return 'Not a directory';

        // If file exists, just update timestamp (real `touch` behavior)
        const existingId = parentInode.children?.find(id => this.inodes[id]?.name === name);
        if (existingId) {
            this.inodes[existingId].modifiedAt = Date.now();
            return this.inodes[existingId];
        }

        const newInode: Inode = {
            id: uuidv4(), type: 'file', name,
            permissions: { ...DEFAULT_FILE_PERMISSIONS },
            ownerId, groupId: ownerId, size: 0,
            createdAt: Date.now(), modifiedAt: Date.now(), content: '',
        };

        this.inodes[newInode.id] = newInode;
        parentInode.children = parentInode.children || [];
        parentInode.children.push(newInode.id);
        parentInode.modifiedAt = Date.now();
        return newInode;
    }

    // ======================================================================
    // Symlink Creation — doc §2.2 SymlinkInode
    // ======================================================================
    public ln(parentPath: string, name: string, target: string, ownerId: string = 'root'): Inode | string {
        const parentResult = this.resolve(parentPath, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = parentResult as Inode;
        if (parentInode.type !== 'directory') return 'Not a directory';

        if (parentInode.children?.some(id => this.inodes[id]?.name === name)) {
            return 'File exists';
        }

        const newInode: Inode = {
            id: uuidv4(), type: 'symlink', name,
            permissions: { ...DEFAULT_DIR_PERMISSIONS }, // symlinks typically have 777
            ownerId, groupId: ownerId, size: target.length,
            createdAt: Date.now(), modifiedAt: Date.now(), target,
        };

        this.inodes[newInode.id] = newInode;
        parentInode.children = parentInode.children || [];
        parentInode.children.push(newInode.id);
        parentInode.modifiedAt = Date.now();
        return newInode;
    }

    // ======================================================================
    // Remove
    // ======================================================================
    public rm(path: string, recursive: boolean = false, userId: string = 'root'): boolean | string {
        const result = this.resolve(path, userId);
        if (typeof result === 'string') return result;

        const inode = result as Inode;
        if (inode.id === this.rootId) return 'Cannot remove root directory';

        if (inode.type === 'directory' && !recursive && (inode.children?.length || 0) > 0) {
            return 'Directory not empty';
        }

        const parentId = this.findParentId(inode.id);
        if (!parentId) return 'Internal error: parent not found';
        const parentInode = this.inodes[parentId];
        if (!this.hasPermission(parentInode, userId, 'write')) return 'Permission denied';

        if (inode.type === 'directory' && recursive) {
            const children = [...(inode.children || [])];
            for (const childId of children) {
                if (this.inodes[childId]) {
                    const childPath = `${path === '/' ? '' : path}/${this.inodes[childId].name}`;
                    this.rm(childPath, true, userId);
                }
            }
        }

        parentInode.children = parentInode.children?.filter(id => id !== inode.id);
        parentInode.modifiedAt = Date.now();
        delete this.inodes[inode.id];
        return true;
    }

    // ======================================================================
    // chmod / chown — doc §3.5, gamification_framework achievement "Permission Master"
    // ======================================================================
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

    // ======================================================================
    // Copy
    // ======================================================================
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
                ...inode, id: newId, name: newName,
                createdAt: Date.now(), modifiedAt: Date.now(),
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

    // ======================================================================
    // Move / Rename
    // ======================================================================
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

    // ======================================================================
    // Utility helpers — doc §2.3
    // ======================================================================
    private findParentId(inodeId: string): string | null {
        for (const id in this.inodes) {
            if (this.inodes[id].children?.includes(inodeId)) return id;
        }
        return null;
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

    /** Check if a path exists (convenience for Lab Engine verification) */
    public exists(path: string, userId: string = 'root'): boolean {
        return typeof this.resolve(path, userId) !== 'string';
    }

    /** Check if path is a directory */
    public isDirectory(path: string, userId: string = 'root'): boolean {
        const r = this.resolve(path, userId);
        return typeof r !== 'string' && r.type === 'directory';
    }

    /** Check if path is a file */
    public isFile(path: string, userId: string = 'root'): boolean {
        const r = this.resolve(path, userId);
        return typeof r !== 'string' && r.type === 'file';
    }

    /** List children names of a directory (used by tab completion & ls) */
    public listChildren(path: string, userId: string = 'root'): Inode[] | null {
        const r = this.resolve(path, userId);
        if (typeof r === 'string' || r.type !== 'directory') return null;
        return (r.children || [])
            .map(id => this.inodes[id])
            .filter((n): n is Inode => !!n);
    }

    public getSnapshot(): VFSSnapshot {
        return { rootId: this.rootId, inodes: { ...this.inodes } };
    }
}
