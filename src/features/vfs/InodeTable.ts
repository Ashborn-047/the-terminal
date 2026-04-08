import { Inode } from './types';

/**
 * InodeTable: Authoritative metadata store for the POSIX-compliant VFS.
 * Synchronous in-memory lookup preserves existing JS atomic execution 
 * guarantees without requiring a massive async rewrite of the Command Engine.
 */
export class InodeTable {
    private inodes: Record<string, Inode> = {};
    private isDirty = false;

    constructor(initialInodes?: Record<string, Inode>) {
        if (initialInodes) {
            this.inodes = { ...initialInodes };
        }
    }

    getInode(id: string): Inode | null {
        return this.inodes[id] ? { ...this.inodes[id] } : null;
    }
    
    // Internal reference for fast directory listing without deep copies
    getInodeRef(id: string): Inode | null {
        return this.inodes[id] || null;
    }

    setInode(inode: Inode): void {
        this.inodes[inode.id] = { ...inode };
        this.isDirty = true;
    }

    updateInode(id: string, update: Partial<Inode>): void {
        const current = this.inodes[id];
        if (current) {
            const now = Date.now();
            this.inodes[id] = { 
                ...current, 
                ...update, 
                ctime: now, 
                mtime: update.content !== undefined ? now : current.mtime
            };
            this.isDirty = true;
        }
    }

    deleteInode(id: string): void {
        delete this.inodes[id];
        this.isDirty = true;
    }

    incrementLink(id: string): number {
        if (this.inodes[id]) {
            this.inodes[id].nlink++;
            this.isDirty = true;
            return this.inodes[id].nlink;
        }
        return 0;
    }

    decrementLink(id: string): number {
        if (this.inodes[id]) {
            this.inodes[id].nlink--;
            this.isDirty = true;
            const count = this.inodes[id].nlink;
            if (count <= 0) {
                delete this.inodes[id];
            }
            return count;
        }
        return 0;
    }

    serialize(): string {
        return JSON.stringify(this.inodes);
    }

    static deserialize(data: string): InodeTable {
        try {
            const inodes = JSON.parse(data);
            return new InodeTable(inodes);
        } catch (e) {
            console.error('Failed to deserialize InodeTable:', e);
            return new InodeTable();
        }
    }

    flushDirty(): Record<string, Inode> | null {
        if (!this.isDirty) return null;
        this.isDirty = false;
        return { ...this.inodes };
    }
}
