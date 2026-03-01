import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../vfs';
import { Inode } from '../types';

describe('VFS Core Operations', () => {
    let vfs: VFS;

    beforeEach(() => {
        vfs = new VFS();
    });

    it('should initialize with root directory', () => {
        const root = vfs.getInode(vfs.getRootId());
        expect(root).toBeDefined();
        expect(root?.name).toBe('/');
        expect(root?.type).toBe('directory');
    });

    it('should create and read a file', () => {
        vfs.touch('/', 'test.txt', 'root');
        vfs.writeFile('/test.txt', 'hello world', 'root');
        const content = vfs.readFile('/test.txt', 'root');
        expect(content).toBe('hello world');
    });

    it('should create directories and resolve nested paths', () => {
        vfs.mkdir('/', 'home', 'root');
        vfs.mkdir('/home', 'user', 'root');
        vfs.touch('/home/user', 'profile.txt', 'root');

        const result = vfs.resolve('/home/user/profile.txt', 'root');
        expect(typeof result).not.toBe('string');
        expect((result as Inode).name).toBe('profile.txt');
    });

    it('should respect permissions', () => {
        vfs.mkdir('/', 'private', 'root');
        vfs.chmod('/private', '700', 'root'); // root-only

        const result = vfs.listChildren('/private', 'guest');
        expect(result).toBe('Permission denied');
    });

    it('should handle symlinks', () => {
        vfs.touch('/', 'target.txt', 'root');
        vfs.writeFile('/target.txt', 'target content', 'root');
        vfs.ln('/', 'link.txt', '/target.txt', 'root');

        const content = vfs.readFile('/link.txt', 'root');
        expect(content).toBe('target content');
    });

    it('should serialize and deserialize', () => {
        vfs.touch('/', 'persist.txt', 'root');
        vfs.writeFile('/persist.txt', 'data', 'root');

        const serialized = vfs.serialize();
        const newVfs = new VFS();
        newVfs.deserialize(serialized);

        expect(newVfs.readFile('/persist.txt', 'root')).toBe('data');
    });

    it('should load snapshots', () => {
        vfs.loadSnapshot('hpc-base');
        const homeNode = vfs.resolve('/home', 'root');
        expect(typeof homeNode).not.toBe('string');
        expect((homeNode as Inode).name).toBe('home');
    });
});
