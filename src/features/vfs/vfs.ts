import { v4 as uuidv4 } from 'uuid';
import {
    Inode,
    InodePermissions,
    Dentry,
    FileType,
    VFSSnapshot,
    VFSPermissions
} from './types';
import { InodeTable } from './InodeTable';
import { snapshots } from './snapshots';
import { formatError } from '../../utils/error_codes';
import { logger } from '../../utils/logger';
import { spacetime } from '../../lib/spacetime';

interface ShadowState {
    dentries: Record<string, Dentry>;
    inodeTable: Record<string, Inode>;
}

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

export function permissionsToOctal(perms: InodePermissions): string {
    const toDigit = (p: VFSPermissions) =>
        (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
    const special = (perms.setuid ? 4 : 0) + (perms.setgid ? 2 : 0) + (perms.sticky ? 1 : 0);
    const pStr = `${toDigit(perms.owner)}${toDigit(perms.group)}${toDigit(perms.others)}`;
    return special > 0 ? `${special}${pStr}` : pStr;
}

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
    private rootDentryId: string;
    private dentries: Record<string, Dentry> = {};
    private inodeTable: InodeTable;
    
    // O(1) Dentry Traversal Cache (`${parentId}:${name}` -> DentryId)
    private dentryIndex: Map<string, string> = new Map();

    private umask: string = '0022';
    private processProvider: () => any[] = () => [];
    private syscallListeners: ((syscall: string, args: any[], result: any) => void)[] = [];
    private procDentryId: string | null = null;

    constructor(snapshot?: VFSSnapshot) {
        if (snapshot && snapshot.dentries && snapshot.inodeTable) {
            this.rootDentryId = snapshot.rootDentryId;
            this.dentries = { ...snapshot.dentries };
            this.inodeTable = new InodeTable(snapshot.inodeTable as any);
            this.rebuildIndices();
        } else {
            const rootInodeId = uuidv4();
            const now = Date.now();
            const rootInode: Inode = {
                id: rootInodeId,
                type: 'directory',
                permissions: { ...DEFAULT_DIR_PERMISSIONS },
                ownerId: 'root',
                groupId: 'root',
                nlink: 1,
                size: 0,
                atime: now,
                mtime: now,
                ctime: now,
            };

            const rootDentry: Dentry = {
                id: uuidv4(),
                name: '',
                inodeId: rootInodeId,
                parentId: null,
                children: []
            };

            this.rootDentryId = rootDentry.id;
            this.dentries[this.rootDentryId] = rootDentry;
            this.inodeTable = new InodeTable({ [rootInodeId]: rootInode });
            this.rebuildIndices();
            this.initializeDefaultFS();
            this.mountProc();
        }
    }

    private mountProc(): void {
        const dentry = Array.from(Object.values(this.dentries)).find(d => d.name === 'proc' && d.parentId === this.rootDentryId);
        if (dentry) {
            this.procDentryId = dentry.id;
        } else {
            const procInode = this.mkdirSync('/', 'proc', 'root', '555');
            if (typeof procInode !== 'string') {
                const newDentry = Array.from(Object.values(this.dentries)).find(d => d.name === 'proc' && d.parentId === this.rootDentryId);
                if (newDentry) this.procDentryId = newDentry.id;
            }
        }
    }

    /**
     * Internal synchronous version of touch for bootstrap/internal use.
     * Guaranteed to update local memory states immediately.
     */
    private touchSync(parentPath: string, name: string, ownerId: string = 'root', groups: string[] = []): Inode | string {
        const parentResult = this.resolveDentry(parentPath, this.rootDentryId, true, 0, ownerId, groups);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = this.inodeTable.getInodeRef(parentResult.inodeId);
        if (!parentInode || parentInode.type !== 'directory') return 'Not a directory';

        const existingDentryId = this.dentryIndex.get(`${parentResult.id}:${name}`);
        if (existingDentryId) {
            const existingInodeId = this.dentries[existingDentryId].inodeId;
            this.inodeTable.updateInode(existingInodeId, { mtime: Date.now() });
            return this.inodeTable.getInodeRef(existingInodeId)!;
        }

        const newId = uuidv4();
        const now = Date.now();
        const newInode: Inode = {
            id: newId,
            type: 'file',
            permissions: { ...DEFAULT_FILE_PERMISSIONS },
            ownerId,
            groupId: ownerId,
            nlink: 1,
            size: 0,
            atime: now,
            mtime: now,
            ctime: now,
        };

        this.inodeTable.setInode(newInode);
        this.addDentry(parentResult.id, name, newId);
        this.inodeTable.updateInode(parentInode.id, { mtime: now, ctime: now });
        return newInode;
    }

    private mkdirSync(parentPath: string, name: string, ownerId: string = 'root', mode?: string, groups: string[] = []): Inode | string {
        const parentResult = this.resolveDentry(parentPath, this.rootDentryId, true, 0, ownerId, groups);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = this.inodeTable.getInodeRef(parentResult.inodeId);
        if (!parentInode || parentInode.type !== 'directory') return 'Not a directory';

        if (this.dentryIndex.has(`${parentResult.id}:${name}`)) return formatError('DIRECTORY_ALREADY_EXISTS');

        const newId = uuidv4();
        const now = Date.now();
        const newInode: Inode = {
            id: newId,
            type: 'directory',
            permissions: mode ? this.parseOctalMode(parseInt(mode, 8)) : { ...DEFAULT_DIR_PERMISSIONS },
            ownerId,
            groupId: ownerId,
            nlink: 2,
            size: 4096,
            atime: now,
            mtime: now,
            ctime: now,
        };

        this.inodeTable.setInode(newInode);
        this.addDentry(parentResult.id, name, newId);
        this.inodeTable.updateInode(parentInode.id, { mtime: now, ctime: now });
        return newInode;
    }

    private parseOctalMode(mode: number): InodePermissions {
        const m = mode;
        const special = (m >> 9) & 7;
        return {
            owner: { read: !!(m & 0o400), write: !!(m & 0o200), execute: !!(m & 0o100) },
            group: { read: !!(m & 0o040), write: !!(m & 0o020), execute: !!(m & 0o010) },
            others: { read: !!(m & 0o004), write: !!(m & 0o002), execute: !!(m & 0o001) },
            setuid: !!(special & 4),
            setgid: !!(special & 2),
            sticky: !!(special & 1),
        };
    }

    private parseStringMode(mode: string, current: InodePermissions): InodePermissions {
        // Basic implementation for symbolic modes (u/g/o/a +/- r/w/x)
        // For now, if it looks like an octal string, use that.
        if (/^[0-7]+$/.test(mode)) {
            const perms = octalToPermissions(mode);
            return perms || current;
        }
        
        // TODO: Full symbolic mode parser. For Phase 3.1, octal is the primary requirement.
        return current; 
    }

    private rebuildIndices(): void {
        this.dentryIndex.clear();
        for (const d of Object.values(this.dentries)) {
            if (d.parentId) {
                this.dentryIndex.set(`${d.parentId}:${d.name}`, d.id);
            }
        }
    }

    /**
     * MANDATORY WAVE 3 BLOOCKER: 
     * Creates a new VFS instance from a base image (snapshot).
     */
    public static async createFromSnapshot(snapshot: VFSSnapshot): Promise<VFS> {
        const vfs = new VFS();
        await vfs.restoreFromSnapshot(snapshot);
        return vfs;
    }

    /**
     * MANDATORY WAVE 3 BLOOCKER:
     * Restores this VFS instance from a serialized snapshot.
     */
    public async restoreFromSnapshot(snapshot: VFSSnapshot): Promise<void> {
        this.rootDentryId = snapshot.rootDentryId;
        this.dentries = JSON.parse(JSON.stringify(snapshot.dentries));
        this.inodeTable = new InodeTable(snapshot.inodeTable as any);
        this.umask = snapshot.umask || '0022';
        this.rebuildIndices();
    }

    public serialize(): string {
        return JSON.stringify({ 
            rootDentryId: this.rootDentryId, 
            dentries: this.dentries,
            inodeTable: JSON.parse(this.inodeTable.serialize()),
            umask: this.umask
        });
    }

    public deserialize(data: string): void {
        try {
            const newSnapshot = JSON.parse(data);
            if (newSnapshot.dentries) {
                this.rootDentryId = newSnapshot.rootDentryId;
                this.dentries = newSnapshot.dentries;
                this.inodeTable = new InodeTable(newSnapshot.inodeTable);
                this.umask = newSnapshot.umask || '0022';
                this.rebuildIndices();
            } else {
                 // Failsafe for older direct-inode snapshots.
                 console.warn("Legacy snapshot detected. VFS schema migrated; legacy states skipped.");
            }
        } catch (e) {
            console.error('Failed to deserialize VFS:', e);
        }
    }

    public loadSnapshot(name: string): void {
        const snapshot = snapshots[name];
        if (!snapshot) {
            console.warn(`Snapshot "${name}" not found.`);
            return;
        }

        if (snapshot.dentries) {
            // New format
            this.rootDentryId = snapshot.rootDentryId;
            this.dentries = JSON.parse(JSON.stringify(snapshot.dentries));
            this.inodeTable = new InodeTable(snapshot.inodeTable as any);
            this.rebuildIndices();
        } else if ((snapshot as any).inodes) {
            // Legacy format - migrate on the fly
            this.migrateLegacySnapshot(snapshot as any);
        } else {
            console.warn(`Snapshot "${name}" is incompatible.`);
        }
    }


    private migrateLegacySnapshot(legacy: { rootId: string, inodes: Record<string, any> }): void {
        this.dentries = {};
        this.dentryIndex.clear();
        const newInodes: Record<string, Inode> = {};
        
        // 1. Create Inodes (strip children, they go to dentries)
        for (const [id, inode] of Object.entries(legacy.inodes)) {
            const { children, ...rest } = inode;
            newInodes[id] = { 
                ...rest,
                id // ensure id is set
            };
        }
        this.inodeTable = new InodeTable(newInodes);

        // 2. Recursively build dentries
        const buildDentries = (inodeId: string, name: string, parentId: string | null): string => {
            const dentryId = Math.random().toString(36).substring(7);
            const dentry: Dentry = {
                id: dentryId,
                inodeId,
                name,
                parentId
            };
            this.dentries[dentryId] = dentry;
            
            const inode = legacy.inodes[inodeId];
            if (inode && inode.type === 'directory' && inode.children) {
                for (const childId of inode.children) {
                    const childInode = legacy.inodes[childId];
                    if (childInode) {
                        buildDentries(childId, childInode.name, dentryId);
                    }
                }
            }
            return dentryId;
        };

        this.rootDentryId = buildDentries(legacy.rootId, '', null);
        this.rebuildIndices();
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

    private addDentry(parentDentryId: string, name: string, inodeId: string): Dentry {
        const newDentry: Dentry = {
            id: uuidv4(),
            name,
            inodeId,
            parentId: parentDentryId,
            children: []
        };
        this.dentries[newDentry.id] = newDentry;
        
        const parentDentry = this.dentries[parentDentryId];
        if (parentDentry) {
            parentDentry.children = parentDentry.children || [];
            parentDentry.children.push(newDentry.id);
            const key = `${parentDentryId}:${name}`;
            this.dentryIndex.set(key, newDentry.id);
        } else {
             console.warn(`VFS ADD FAIL: Parent ${parentDentryId} not found for ${name}`);
        }
        return newDentry;
    }

    public createVirtualFile(
        parentPath: string,
        name: string,
        handler: (userId: string) => string,
        ownerId: string = 'root'
    ): Inode | string {
        const parentResult = this.resolveDentry(parentPath, this.rootDentryId, true, 0, ownerId);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = this.inodeTable.getInodeRef(parentResult.inodeId);
        if (parentInode?.type !== 'directory') return 'Not a directory';

        const newId = uuidv4();
        const now = Date.now();
        const newInode: Inode = {
            id: newId,
            type: 'file',
            permissions: { ...DEFAULT_FILE_PERMISSIONS }, // Typically 644
            ownerId,
            groupId: ownerId,
            nlink: 1,
            size: 0,
            atime: now,
            mtime: now,
            ctime: now,
            isVirtual: true,
            handler,
        };

        this.inodeTable.setInode(newInode);
        this.addDentry(parentResult.id, name, newId);
        this.inodeTable.updateInode(parentInode.id, { mtime: now });
        
        return newInode;
    }

    public setProcessProvider(provider: () => any[]): void {
        this.processProvider = provider;
    }

    private initializeDefaultFS() {
        this.mkdirSync('/', 'bin', 'root', '755', []);
        this.mkdirSync('/', 'etc', 'root', '755', []);
        this.mkdirSync('/', 'home', 'root', '755', []);
        this.mkdirSync('/home', 'guest', 'guest', '755', []);
        this.mkdirSync('/', 'tmp', 'root', '777', []);
        this.mkdirSync('/', 'var', 'root', '755', []);
        this.mkdirSync('/var', 'log', 'root', '755', []);
        this.mkdirSync('/', 'proc', 'root', '555', []);
        this.mkdirSync('/', 'dev', 'root', '755', []);
        this.mkdirSync('/', 'usr', 'root', '755', []);
        this.mkdirSync('/usr', 'bin', 'root', '755', []);
        this.mkdirSync('/usr', 'local', 'root', '755', []);

        this.touchSync('/etc', 'hostname', 'root');
        this.touchSync('/etc', 'passwd', 'root');
        this.touchSync('/etc', 'group', 'root');
        this.touchSync('/var/log', 'syslog', 'root');

        // Note: writeFile still async but we only need the directory structure sync for memory safety
        this.writeFile('/etc/hostname', 'the-terminal\n', 'root', [], false, true);
        this.writeFile('/etc/passwd', 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:Guest:/home/guest:/bin/bash', 'root', [], false, true);
        this.writeFile('/etc/group', 'root:x:0:\nusers:x:100:\nguest:x:1000:', 'root', [], false, true);
        this.writeFile('/var/log/syslog', 'Feb 28 10:00:01 systemd[1]: Started The Terminal.\n', 'root', [], false, true);

        const bootTime = Date.now();
        this.createVirtualFile('/proc', 'version', () => 'Linux version 6.1.0-the-terminal (gcc version 12.2.0) #1 SMP PREEMPT_DYNAMIC Mon Mar 30 15:00:00 UTC 2026\n');
        this.createVirtualFile('/proc', 'uptime', () => {
            const uptimeSeconds = (Date.now() - bootTime) / 1000;
            return `${uptimeSeconds.toFixed(2)} ${uptimeSeconds.toFixed(2)}\n`;
        });
        this.createVirtualFile('/proc', 'stat', () => {
            const procs = this.processProvider();
            const totalLoad = procs.length * 100;
            return `cpu  ${totalLoad} 0 492 10293 293 0 10 0 0 0\nprocesses ${procs.length + 42}\n`;
        });
        this.createVirtualFile('/proc', 'meminfo', () => 'MemTotal: 16384000 kB\nMemFree: 8192000 kB\nMemAvailable: 12288000 kB\nBuffers: 204800 kB\nCached: 4096000 kB\n');
        this.createVirtualFile('/dev', 'null', () => '');
        this.createVirtualFile('/dev', 'zero', () => '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
    }

    public getRootId(): string { 
        return this.dentries[this.rootDentryId].inodeId; 
    }

    public hasPermission(inode: Inode, userId: string, type: keyof VFSPermissions, groups: string[] = []): boolean {
        if (userId === 'root') return true;
        
        // 1. Owner check
        const perms = inode.permissions || (inode.type === 'directory' ? DEFAULT_DIR_PERMISSIONS : DEFAULT_FILE_PERMISSIONS);
        if (inode.ownerId === userId) return perms.owner[type];

        // 2. ACL checks (named user, then group)
        if (inode.acls) {
            // Named user ACL takes precedence
            const userAcl = inode.acls[`user:${userId}`];
            if (userAcl) return userAcl[type];

            // Group ACLs
            for (const [key, aclPerms] of Object.entries(inode.acls)) {
                if (key.startsWith('group:')) {
                    const groupName = key.slice(6);
                    if (groups.includes(groupName)) return aclPerms[type];
                }
            }
        }

        // 3. Standard group permission
        if (groups.includes(inode.groupId)) return perms.group[type];

        // 4. Others permission
        return perms.others[type];
    }

    /**
     * Check if a user can delete or rename an entry within a directory.
     * Sticky bit: only owner of the file or owner of the directory (or root) can delete/rename.
     */
    private canModifyEntry(parentInode: Inode, targetInode: Inode, userId: string): boolean {
        if (userId === 'root') return true;

        // If parent directory has sticky bit set
        if (parentInode.permissions.sticky) {
            // User must own the target file OR own the parent directory
            if (targetInode.ownerId !== userId && parentInode.ownerId !== userId) {
                return false;
            }
        }

        return true;
    }

    private resolveDentry(
        path: string,
        startDentryId: string = this.rootDentryId,
        followSymlinks: boolean = true,
        _depth: number = 0,
        userId: string = 'root',
        groups: string[] = []
    ): Dentry | string {
        if (_depth > MAX_SYMLINK_DEPTH) return 'Too many levels of symbolic links';
        if (path === '/' || path === '' || path === '.') return this.dentries[this.rootDentryId];

        const parts = path.split('/').filter(p => p.length > 0);
        let currentDentry = (path.startsWith('/') || !startDentryId) 
            ? this.dentries[this.rootDentryId] 
            : (this.dentries[startDentryId] || this.dentries[this.rootDentryId]);

        if (!currentDentry) {
            console.error(`VFS CRITICAL: Root dentry ${this.rootDentryId} missing from index.`);
            return formatError('FILE_NOT_FOUND');
        }

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const currentInode = this.inodeTable.getInodeRef(currentDentry.inodeId);
            if (!currentInode) return formatError('FILE_NOT_FOUND');

            if (part === '.') continue;
            if (part === '..') {
                const parentId = currentDentry.parentId || this.rootDentryId;
                currentDentry = this.dentries[parentId];
                continue;
            }

            if (currentInode.type !== 'directory') return formatError('NOT_A_DIRECTORY');

            if (!this.hasPermission(currentInode, userId, 'execute', groups)) {
                logger.security('PERMISSION_DENIED', { path, part, userId, action: 'execute' });
                return formatError('PERMISSION_DENIED');
            }

            const indexKey = `${currentDentry.id}:${part}`;
            const childDentryId = this.dentryIndex.get(indexKey);
            
            if (!childDentryId) {
                return formatError('FILE_NOT_FOUND');
            }

            let childDentry = this.dentries[childDentryId];
            const childInode = this.inodeTable.getInodeRef(childDentry.inodeId);

            if (childInode && childInode.type === 'symlink' && followSymlinks) {
                const target = childInode.target || '';
                const resolved = this.resolveDentry(target, this.rootDentryId, true, _depth + 1, userId, groups);
                if (typeof resolved === 'string') return resolved;
                
                if (i < parts.length - 1) {
                    const remaining = parts.slice(i + 1).join('/');
                    return this.resolveDentry(remaining, resolved.id, true, _depth + 1, userId, groups);
                }
                childDentry = resolved;
            }

            currentDentry = childDentry;
        }

        return currentDentry;
    }

    public resolve(
        path: string,
        userId: string = 'root',
        startNodeId?: string, // Ignored in newer api but kept for signature comp
        followSymlinks: boolean = true,
        _depth: number = 0,
        groups: string[] = []
    ): (Inode & { name: string }) | string {
        const result = this.resolveDentry(path, this.rootDentryId, followSymlinks, _depth, userId, groups);
        if (typeof result === 'string') return result;
        const inode = this.inodeTable.getInodeRef(result.inodeId);
        if (!inode) return formatError('FILE_NOT_FOUND');
        return { ...inode, name: result.name };
    }

    public async writeFile(path: string, content: string, userId: string = 'root', groups: string[] = [], append: boolean = false, isBootstrap: boolean = false): Promise<boolean | { error: string }> {
        try {
            let result = this.resolveDentry(path, this.rootDentryId, true, 0, userId, groups);

            if (typeof result === 'string') {
                if (result === formatError('FILE_NOT_FOUND')) {
                    const parts = path.split('/').filter(p => p.length > 0);
                    const name = parts.pop() || '';
                    const parentPath = path.startsWith('/') ? '/' + parts.join('/') : parts.join('/') || '/';

                    // Internal touch: Always use isBootstrap=true to avoid internal deadlocks/over-accounting
                    const touchResult = await this.touch(parentPath, name, userId, groups, true);
                    if (typeof touchResult === 'string') {
                        return { error: touchResult };
                    }
                    
                    const dentryResult = this.resolveDentry(path, this.rootDentryId, true, 0, userId, groups);
                    if (typeof dentryResult === 'string') {
                        return { error: dentryResult };
                    }
                    result = dentryResult;
                } else {
                    return { error: result };
                }
            }

            const inode = this.inodeTable.getInodeRef((result as Dentry).inodeId);
            if (inode?.type !== 'file') {
                return { error: 'Not a file' };
            }

            if (!this.hasPermission(inode, userId, 'write', groups)) {
                logger.security('PERMISSION_DENIED', { path, userId, action: 'write' });
                return { error: formatError('PERMISSION_DENIED') };
            }

            const newContent = append ? (inode.content || '') + content : content;
            this.inodeTable.updateInode(inode.id, { content: newContent, size: newContent.length });

            if (!isBootstrap) {
                await spacetime.writeFile({ path, content, append });
            }
            return true;
        } catch (err) {
            return { error: 'SpacetimeDB conflict: write reverted' };
        }
    }

    public async mkdir(parentPath: string, name: string, ownerId: string = 'root', mode?: string, groups: string[] = [], isBootstrap: boolean = false): Promise<Inode | string> {
        try {
            const parentResult = this.resolveDentry(parentPath, this.rootDentryId, true, 0, ownerId, groups);
            if (typeof parentResult === 'string') return parentResult;

            const parentInode = this.inodeTable.getInodeRef(parentResult.inodeId);
            if (!parentInode || parentInode.type !== 'directory') return 'Not a directory';

            if (this.dentryIndex.has(`${parentResult.id}:${name}`)) return formatError('DIRECTORY_ALREADY_EXISTS');

            const newId = uuidv4();
            const initialPerms = mode ? this.parseOctalMode(parseInt(mode, 8)) : DEFAULT_DIR_PERMISSIONS;
            if (!initialPerms) return 'Invalid mode';

            const now = Date.now();
            const newInode: Inode = {
                id: newId,
                type: 'directory',
                permissions: mode ? initialPerms : this.applyUmask({ ...DEFAULT_DIR_PERMISSIONS }),
                ownerId,
                groupId: ownerId,
                nlink: 1,
                size: 0,
                atime: now,
                mtime: now,
                ctime: now,
            };

            this.inodeTable.setInode(newInode);
            this.addDentry(parentResult.id, name, newId);
            this.inodeTable.updateInode(parentInode.id, { mtime: now, ctime: now });

            if (!isBootstrap) {
                await spacetime.createFile({ path: (parentPath === '/' ? '' : parentPath) + '/' + name, content: '' });
            }
            return newInode;
        } catch (err) {
            return 'SpacetimeDB conflict: mkdir reverted';
        }
    }

    public async touch(parentPath: string, name: string, ownerId: string = 'root', groups: string[] = [], isBootstrap: boolean = false): Promise<Inode | string> {
        try {
            const parentResult = this.resolveDentry(parentPath, this.rootDentryId, true, 0, ownerId, groups);
            if (typeof parentResult === 'string') {
                return parentResult;
            }

            const parentInode = this.inodeTable.getInodeRef(parentResult.inodeId);
            if (!parentInode || parentInode.type !== 'directory') {
                return 'Not a directory';
            }

            const existingDentryId = this.dentryIndex.get(`${parentResult.id}:${name}`);
            if (existingDentryId) {
                const existingInodeId = this.dentries[existingDentryId].inodeId;
                this.inodeTable.updateInode(existingInodeId, { mtime: Date.now() });
                return this.inodeTable.getInodeRef(existingInodeId)!;
            }

            const newId = uuidv4();
            const now = Date.now();
            const newInode: Inode = {
                id: newId,
                type: 'file',
                permissions: this.applyUmask({ ...DEFAULT_FILE_PERMISSIONS }),
                ownerId,
                groupId: ownerId,
                nlink: 1,
                size: 0,
                atime: now,
                mtime: now,
                ctime: now,
                content: '',
            };

            this.inodeTable.setInode(newInode);
            this.addDentry(parentResult.id, name, newId);
            this.inodeTable.updateInode(parentInode.id, { mtime: now, ctime: now });

            if (!isBootstrap) {
                await spacetime.createFile({ path: (parentPath === '/' ? '' : parentPath) + '/' + name, content: '' });
            }
            return newInode;
        } catch (err) {
            return 'SpacetimeDB conflict: touch reverted';
        }
    }

    public ln(parentPath: string, name: string, target: string, ownerId: string = 'root', symbolic: boolean = false, groups: string[] = []): Inode | string {
        const parentResult = this.resolveDentry(parentPath, this.rootDentryId, true, 0, ownerId, groups);
        if (typeof parentResult === 'string') return parentResult;

        const parentInode = this.inodeTable.getInodeRef(parentResult.inodeId);
        if (parentInode?.type !== 'directory') return 'Not a directory';

        if (this.dentryIndex.has(`${parentResult.id}:${name}`)) {
            return formatError('DIRECTORY_ALREADY_EXISTS');
        }

        const targetResult = this.resolve(target, ownerId);
        if (!symbolic && typeof targetResult === 'string') return targetResult;
        if (!symbolic && (targetResult as Inode).type === 'directory') return 'hard link not allowed for directory';

        if (symbolic) {
            const newId = uuidv4();
            const now = Date.now();
            const newInode: Inode = {
                id: newId,
                type: 'symlink',
                permissions: { ...DEFAULT_FILE_PERMISSIONS },
                ownerId,
                groupId: ownerId,
                nlink: 1,
                size: target.length,
                atime: now,
                mtime: now,
                ctime: now,
                target,
            };
            this.inodeTable.setInode(newInode);
            this.addDentry(parentResult.id, name, newId);
            return newInode;
        } else {
            // Strict POSIX hardlinks via Inode decoupling!
            const targetInode = targetResult as Inode;
            this.inodeTable.incrementLink(targetInode.id);
            this.addDentry(parentResult.id, name, targetInode.id);
            this.inodeTable.updateInode(targetInode.id, { ctime: Date.now() });
            return targetInode;
        }
    }

    /**
     * MANDATORY WAVE 3 BLOOCKER:
     * Standard symlink implementation with (target, linkpath) signature.
     */
    public async symlink(target: string, linkpath: string, ownerId: string = 'root'): Promise<void> {
        const parts = linkpath.split('/').filter(p => p.length > 0);
        const name = parts.pop() || '';
        const parentPath = linkpath.startsWith('/') ? '/' + parts.join('/') : parts.join('/') || '/';
        
        const result = this.ln(parentPath, name, target, ownerId, true);
        if (typeof result === 'string') {
            throw new Error(result);
        }
        
        await spacetime.createFile({ path: linkpath, content: target, isSymlink: true });
    }

    public async rm(path: string, recursive: boolean = false, userId: string = 'root', groups: string[] = []): Promise<boolean | string> {
        try {
            const dentryResult = this.resolveDentry(path, this.rootDentryId, false, 0, userId, groups);
            if (typeof dentryResult === 'string') return dentryResult;

            if (dentryResult.id === this.rootDentryId) return 'Cannot remove root directory';

            const inode = this.inodeTable.getInodeRef(dentryResult.inodeId);
            if (!inode) return 'Internal error: inode missing';

            if (inode.type === 'directory' && !recursive && (dentryResult.children?.length || 0) > 0) {
                return 'Directory not empty';
            }

            const parentDentry = this.dentries[dentryResult.parentId!];
            const parentInode = this.inodeTable.getInodeRef(parentDentry.inodeId);
            if (!parentInode) return 'Internal error: parent inode missing';

            if (!this.canModifyEntry(parentInode, inode, userId)) {
                return 'Operation not permitted (Sticky bit set)';
            }

            if (!this.hasPermission(parentInode, userId, 'write', groups)) return 'Permission denied.';

            if (inode.type === 'directory' && recursive && dentryResult.children) {
                const children = [...dentryResult.children];
                for (const childId of children) {
                    const childDentry = this.dentries[childId];
                    if (childDentry) {
                        const childPath = `${path === '/' ? '' : path}/${childDentry.name}`;
                        await this.rm(childPath, true, userId);
                    }
                }
            }

            parentDentry.children = parentDentry.children?.filter(id => id !== dentryResult.id);
            this.inodeTable.updateInode(parentInode.id, { mtime: Date.now(), ctime: Date.now() });
            
            this.dentryIndex.delete(`${parentDentry.id}:${dentryResult.name}`);
            delete this.dentries[dentryResult.id];

            this.inodeTable.decrementLink(inode.id);
            await spacetime.deleteFile({ path });
            
            return true;
        } catch (err) {
            return 'SpacetimeDB conflict: rm reverted';
        }
    }
    public async chmod(path: string, mode: string | number, userId: string = 'root', groups: string[] = []): Promise<boolean | string> {
        try {
            const result = this.resolve(path, userId, this.rootDentryId, true, 0, groups);
            if (typeof result === 'string') return result;

            const inode = result as Inode;
            if (userId !== 'root' && inode.ownerId !== userId) return 'Operation not permitted';

            const perms = typeof mode === 'number' ? this.parseOctalMode(mode) : this.parseStringMode(mode, inode.permissions);
            if (!perms) return 'Invalid mode';

            this.inodeTable.updateInode(inode.id, { permissions: perms, ctime: Date.now() });
            await spacetime.chmod({ path, mode: typeof mode === 'number' ? mode.toString(8) : mode });
            return true;
        } catch (err) {
            return 'SpacetimeDB conflict: chmod reverted';
        }
    }

    public async chown(path: string, newOwner: string, userId: string = 'root', groups: string[] = []): Promise<boolean | string> {
        if (userId !== 'root') return 'Permission denied.';

        try {
            const result = this.resolve(path, userId, this.rootDentryId, true, 0, groups);
            if (typeof result === 'string') return result;

            const inode = result as Inode;
            this.inodeTable.updateInode(inode.id, { ownerId: newOwner, ctime: Date.now() });
            
            return true;
        } catch (err) {
            return 'SpacetimeDB conflict: chown reverted';
        }
    }

    public readFile(path: string, userId: string = 'root', groups: string[] = []): string | { error: string } {
        const resolved = this.resolve(path, userId, this.rootDentryId, true, 0, groups);
        if (typeof resolved === 'string') {
            this.notifySyscall('openat', [path, 'O_RDONLY'], -2);
            return { error: resolved };
        }
        
        if (!this.hasPermission(resolved, userId, 'read', groups)) {
            this.notifySyscall('openat', [path, 'O_RDONLY'], -13);
            return { error: 'Permission denied.' };
        }

        this.notifySyscall('openat', [path, 'O_RDONLY'], 3);
        this.notifySyscall('read', [3, resolved.content || '', 1024], resolved.content?.length || 0);
        this.notifySyscall('close', [3], 0);

        return resolved.content || '';
    }

    public listChildren(path: string, userId: string = 'root', groups: string[] = []): { name: string, type: FileType, inodeId: string }[] | string {
        const dentry = this.resolveDentry(path, this.rootDentryId, true, 0, userId, groups);
        if (typeof dentry === 'string') return dentry;

        const inode = this.inodeTable.getInodeRef(dentry.inodeId);
        if (!inode || inode.type !== 'directory') return formatError('NOT_A_DIRECTORY');

        // Phase 3.3 Regression Fix: Enforce READ permission to list directory contents
        if (!this.hasPermission(inode, userId, 'read', groups)) {
            return formatError('PERMISSION_DENIED');
        }

        // Dynamic ProcFS Handling
        if (this.procDentryId && dentry.id === this.procDentryId) {
            const procs = this.processProvider();
            const procEntries = procs.map(p => ({
                name: p.pid.toString(),
                type: 'directory' as FileType,
                inodeId: `proc-${p.pid}`
            }));
            const staticEntries = [
                { name: 'uptime', type: 'file' as FileType, inodeId: 'proc-uptime' },
                { name: 'version', type: 'file' as FileType, inodeId: 'proc-version' },
                { name: 'meminfo', type: 'file' as FileType, inodeId: 'proc-meminfo' },
                { name: 'stat', type: 'file' as FileType, inodeId: 'proc-stat' }
            ];
            return [...procEntries, ...staticEntries];
        }

        // Standard VFS children
        return (dentry.children || []).map(id => {
            const child = this.dentries[id];
            const childInode = this.inodeTable.getInodeRef(child.inodeId);
            return {
                name: child.name,
                type: (childInode?.type || 'file') as FileType,
                inodeId: child.inodeId
            };
        });
    }
    

    public async cp(srcPath: string, destPath: string, recursive: boolean = false, userId: string = 'root', groups: string[] = []): Promise<boolean | string> {
        try {
            const srcResult = this.resolveDentry(srcPath, this.rootDentryId, true, 0, userId, groups);
            if (typeof srcResult === 'string') return srcResult;
            const srcInode = this.inodeTable.getInodeRef(srcResult.inodeId)!;

            if (srcInode.type === 'directory' && !recursive) return 'omitting directory';

            const destParts = destPath.split('/').filter(p => p.length > 0);
            const destName = destParts.pop() || '';
            const destParentPath = destPath.startsWith('/') ? '/' + destParts.join('/') : destParts.join('/');

            const destParentResult = this.resolveDentry(destParentPath || '/', this.rootDentryId, true, 0, userId, groups);
            if (typeof destParentResult === 'string') return destParentResult;

            const copyRecursive = (inode: Inode, parentDentryId: string, newName: string): void => {
                const newId = uuidv4();
                const copy: Inode = {
                    ...inode,
                    id: newId,
                    ctime: Date.now(),
                    mtime: Date.now()
                };
                this.inodeTable.setInode(copy);
                const newDentry = this.addDentry(parentDentryId, newName, newId);

                if (inode.type === 'directory') {
                    const srcDentry = Object.values(this.dentries).find(d => d.inodeId === inode.id);
                    if (srcDentry && srcDentry.children) {
                        for (const childId of srcDentry.children) {
                            const childDentry = this.dentries[childId];
                            const childInode = this.inodeTable.getInodeRef(childDentry.inodeId);
                            if (childInode) copyRecursive(childInode, newDentry.id, childDentry.name);
                        }
                    }
                }
            };

            copyRecursive(srcInode, destParentResult.id, destName);
            this.inodeTable.updateInode(destParentResult.inodeId, { mtime: Date.now() });

            return true;
        } catch (err) {
            return 'SpacetimeDB conflict: cp reverted';
        }
    }

    public async mv(srcPath: string, destPath: string, userId: string = 'root', groups: string[] = []): Promise<boolean | string> {
        try {
            const srcResult = this.resolveDentry(srcPath, this.rootDentryId, true, 0, userId, groups);
            if (typeof srcResult === 'string') return srcResult;

            const destParts = destPath.split('/').filter(p => p.length > 0);
            const destName = destParts.pop() || '';
            const destParentPath = destPath.startsWith('/') ? '/' + destParts.join('/') : destParts.join('/');

            const destParentResult = this.resolveDentry(destParentPath || '/', this.rootDentryId, true, 0, userId, groups);
            if (typeof destParentResult === 'string') return destParentResult;

            if (this.dentryIndex.has(`${destParentResult.id}:${destName}`)) return 'Destination already exists';

            const oldParentDentry = this.dentries[srcResult.parentId!];
            if (!oldParentDentry) return 'Internal error: source parent missing';

            const oldParentInode = this.inodeTable.getInodeRef(oldParentDentry.inodeId)!;
            const srcInode = this.inodeTable.getInodeRef(srcResult.inodeId)!;

            if (!this.canModifyEntry(oldParentInode, srcInode, userId) || !this.hasPermission(oldParentInode, userId, 'write', groups)) {
                return formatError('PERMISSION_DENIED');
            }

            if (oldParentDentry) {
                oldParentDentry.children = oldParentDentry.children?.filter(id => id !== srcResult.id);
                this.dentryIndex.delete(`${oldParentDentry.id}:${srcResult.name}`);
                this.inodeTable.updateInode(oldParentDentry.inodeId, { mtime: Date.now() });
            }


            srcResult.name = destName;
            srcResult.parentId = destParentResult.id;
            
            destParentResult.children = destParentResult.children || [];
            destParentResult.children.push(srcResult.id);
            this.dentryIndex.set(`${destParentResult.id}:${destName}`, srcResult.id);
            this.inodeTable.updateInode(destParentResult.inodeId, { mtime: Date.now() });

            await spacetime.moveFile({ src: srcPath, dst: destPath });
            
            return true;
        } catch (err) {
            return 'SpacetimeDB conflict: mv reverted';
        }
    }

    public getSnapshot(): VFSSnapshot {
        // Build lightweight serialization wrapper since Table maintains memory
        return JSON.parse(this.serialize());
    }

    public getInode(id: string): Inode | null {
        return this.inodeTable.getInodeRef(id);
    }

    public getMetadata(path: string, userId: string = 'root', groups: string[] = []): Inode | string {
        return this.resolve(path, userId, this.rootDentryId, true, 0, groups);
    }

    public exists(path: string, userId: string = 'root', groups: string[] = []): boolean {
        return typeof this.resolve(path, userId, this.rootDentryId, true, 0, groups) !== 'string';
    }

    public isDirectory(path: string, userId: string = 'root', groups: string[] = []): boolean {
        const res = this.resolve(path, userId, this.rootDentryId, true, 0, groups);
        return typeof res !== 'string' && res.type === 'directory';
    }

    public isFile(path: string, userId: string = 'root', groups: string[] = []): boolean {
        const res = this.resolve(path, userId, this.rootDentryId, true, 0, groups);
        return typeof res !== 'string' && res.type === 'file';
    }

    public ensureUserHome(username: string): void {
        const homePath = '/home/' + username;
        if (!this.exists(homePath)) {
            this.mkdir('/home', username, 'root');
            const result = this.resolve(homePath, 'root');
            if (typeof result !== 'string') {
                this.inodeTable.updateInode(result.id, { ownerId: username, groupId: username });
            }
        }
    }

    public addSyscallListener(listener: (syscall: string, args: any[], result: any) => void): void {
        this.syscallListeners.push(listener);
    }

    public removeSyscallListener(listener: (syscall: string, args: any[], result: any) => void): void {
        this.syscallListeners = this.syscallListeners.filter(l => l !== listener);
    }

    private notifySyscall(syscall: string, args: any[], result: any): void {
        this.syscallListeners.forEach(listener => listener(syscall, args, result));
    }

    public getPath(inodeId: string): string {
        const dentry = Object.values(this.dentries).find(d => d.inodeId === inodeId);
        if (!dentry) return '';

        if (dentry.id === this.rootDentryId) return '/';

        const parts: string[] = [];
        let current: Dentry | undefined = dentry;
        
        while (current && current.id !== this.rootDentryId) {
            parts.unshift(current.name);
            current = current.parentId ? this.dentries[current.parentId] : undefined;
        }
        
        return '/' + parts.join('/');
    }
}
