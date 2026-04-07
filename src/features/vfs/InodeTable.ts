import { Inode } from './types';

/**
 * AsyncMutex: Prevents race conditions during metadata updates.
 */
class AsyncMutex {
    private queue: Promise<void> = Promise.resolve();

    async lock(): Promise<() => void> {
        let release: () => void;
        const next = new Promise<void>((resolve) => {
            release = resolve;
        });
        const wait = this.queue;
        this.queue = wait.then(() => next);
        await wait;
        return release!;
    }
}

/**
 * InodeTable: Authoritative metadata store for the POSIX-compliant VFS.
 */
export class InodeTable {
    private inodes: Record<string, Inode> = {};
    private mutex = new AsyncMutex();
    private isDirty = false;

    constructor(initialInodes?: Record<string, Inode>) {
        if (initialInodes) {
            this.inodes = { ...initialInodes };
        }
    }

    async getInode(id: string): Promise<Inode | null> {
        const release = await this.mutex.lock();
        try {
            return this.inodes[id] ? { ...this.inodes[id] } : null;
        } finally {
            release();
        }
    }

    async setInode(inode: Inode): Promise<void> {
        const release = await this.mutex.lock();
        try {
            this.inodes[inode.id] = { ...inode };
            this.isDirty = true;
        } finally {
            release();
        }
    }

    async updateInode(id: string, update: Partial<Inode>): Promise<void> {
        const release = await this.mutex.lock();
        try {
            if (this.inodes[id]) {
                const now = Date.now();
                this.inodes[id] = { 
                    ...this.inodes[id], 
                    ...update, 
                    ctime: now, // Metadata change time
                    mtime: update.content !== undefined ? now : this.inodes[id].mtime
                };
                this.isDirty = true;
            }
        } finally {
            release();
        }
    }

    async deleteInode(id: string): Promise<void> {
        const release = await this.mutex.lock();
        try {
            delete this.inodes[id];
            this.isDirty = true;
        } finally {
            release();
        }
    }

    async incrementLink(id: string): Promise<number> {
        const release = await this.mutex.lock();
        try {
            if (this.inodes[id]) {
                this.inodes[id].nlink++;
                this.isDirty = true;
                return this.inodes[id].nlink;
            }
            return 0;
        } finally {
            release();
        }
    }

    async decrementLink(id: string): Promise<number> {
        const release = await this.mutex.lock();
        try {
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
        } finally {
            release();
        }
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
