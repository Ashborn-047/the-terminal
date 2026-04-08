import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VFS } from '../vfs';
import { Inode } from '../types';

// Mock spacetime to prevent rollback on mutation calls
vi.mock('../../lib/spacetime', () => ({
    spacetime: {
        createFile: vi.fn().mockResolvedValue({}),
        writeFile: vi.fn().mockResolvedValue({}),
        deleteFile: vi.fn().mockResolvedValue({}),
        moveFile: vi.fn().mockResolvedValue({}),
        chmod: vi.fn().mockResolvedValue({}),
    }
}));

describe('VFS Core Operations', () => {
    let vfs: VFS;

    beforeEach(() => {
        vfs = new VFS();
    });

    it('should initialize with root directory', () => {
        const root = vfs.resolve('/', 'root');
        expect(typeof root).not.toBe('string');
        const rootInode = root as (Inode & { name: string });
        expect(rootInode.name).toBe('/');
        expect(rootInode.type).toBe('directory');
    });

    it('should create and read a file', async () => {
        await vfs.touch('/', 'test.txt', 'root');
        await vfs.writeFile('/test.txt', 'hello world', 'root');
        const content = vfs.readFile('/test.txt', 'root');
        expect(content).toBe('hello world');
    });

    it('should create directories and resolve nested paths', async () => {
        await vfs.mkdir('/', 'home', 'root');
        await vfs.mkdir('/home', 'user', 'root');
        await vfs.touch('/home/user', 'profile.txt', 'root');

        const result = vfs.resolve('/home/user/profile.txt', 'root');
        expect(typeof result).not.toBe('string');
        expect((result as any).name).toBe('profile.txt');
    });

    it('should respect permissions', async () => {
        await vfs.mkdir('/', 'private', 'root');
        await vfs.chmod('/private', '700', 'root'); // root-only

        const result = vfs.listChildren('/private', 'guest');
        expect(result).toBe('Permission denied');
    });

    it('should NOT list children of a directory without READ permission', async () => {
        await vfs.mkdir('/', 'secret', 'root');
        await vfs.chmod('/secret', '700', 'root'); // root-only
        
        // guest should fail
        const result = vfs.listChildren('/secret', 'guest');
        expect(result).toBe('Permission denied');
    });

    it('should restrict /proc listing based on user permissions', async () => {
        // Mock a process provider that filters based on userId
        // In the real system, processProvider returns all procs, 
        // but listChildren should eventually filter them if we want isolation.
        // For now, we test that static proc entries are always visible.
        
        const procResult = vfs.listChildren('/proc', 'guest');
        if (typeof procResult === 'string') throw new Error(procResult);
        
        const names = procResult.map(n => n.name);
        expect(names).toContain('uptime');
        expect(names).toContain('version');
        expect(names).toContain('meminfo');
    });

    it('should handle symlinks', async () => {
        await vfs.touch('/', 'target.txt', 'root');
        await vfs.writeFile('/target.txt', 'target content', 'root');
        await vfs.ln('/', 'link.txt', '/target.txt', 'root');

        const content = vfs.readFile('/link.txt', 'root');
        expect(content).toBe('target content');
    });

    it('should serialize and deserialize', async () => {
        await vfs.touch('/', 'persist.txt', 'root');
        await vfs.writeFile('/persist.txt', 'data', 'root');

        const serialized = vfs.serialize();
        const newVfs = new VFS();
        newVfs.deserialize(serialized);

        expect(newVfs.readFile('/persist.txt', 'root')).toBe('data');
    });

    it('should load snapshots', () => {
        vfs.loadSnapshot('hpc-base');
        const homeNode = vfs.resolve('/home', 'root');
        if (typeof homeNode === 'string') {
            throw new Error(`Failed to resolve /home: ${homeNode}`);
        }
        expect(homeNode.name).toBe('home');
    });
});
