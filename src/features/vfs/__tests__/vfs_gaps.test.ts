import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VFS } from '../vfs';
import { Inode, VFSPermissions } from '../types';

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

describe('Wave 1 Restoration Gaps', () => {
    let vfs: VFS;

    beforeEach(() => {
        vfs = new VFS();
    });

    describe('Sticky Bit Enforcement', () => {
        beforeEach(async () => {
            // Create /tmp with sticky bit (1777)
            await vfs.mkdir('/', 'tmp', 'root');
            await vfs.chmod('/tmp', '1777', 'root');
        });

        it('prevents non-owner from deleting file in sticky directory', async () => {
            await vfs.touch('/tmp', 'alice.txt', 'alice');
            const result = await vfs.rm('/tmp/alice.txt', false, 'bob');
            expect(result).toBe('Operation not permitted (Sticky bit set)');
        });

        it('allows owner to delete own file in sticky directory', async () => {
            await vfs.touch('/tmp', 'alice.txt', 'alice');
            const result = await vfs.rm('/tmp/alice.txt', false, 'alice');
            expect(result).toBe(true);
            expect(vfs.exists('/tmp/alice.txt')).toBe(false);
        });

        it('allows root to delete any file in sticky directory', async () => {
            await vfs.touch('/tmp', 'alice.txt', 'alice');
            const result = await vfs.rm('/tmp/alice.txt', false, 'root');
            expect(result).toBe(true);
            expect(vfs.exists('/tmp/alice.txt')).toBe(false);
        });

        it('prevents non-owner from moving file OUT of sticky directory', async () => {
            await vfs.mkdir('/', 'home', 'root');
            await vfs.touch('/tmp', 'alice.txt', 'alice');
            
            const result = await vfs.mv('/tmp/alice.txt', '/home/alice.txt', 'bob');
            expect(result).toBe('Permission denied.');
            expect(vfs.exists('/tmp/alice.txt')).toBe(true);
        });

        it('allows owner to move own file out of sticky directory', async () => {
            await vfs.mkdir('/', 'home', 'root');
            await vfs.touch('/tmp', 'alice.txt', 'alice');
            
            const result = await vfs.mv('/tmp/alice.txt', '/home/alice.txt', 'alice');
            expect(result).toBe(true);
            expect(vfs.exists('/tmp/alice.txt')).toBe(false);
            expect(vfs.exists('/home/alice.txt', 'alice')).toBe(true);
        });
    });

    describe('Umask Persistence', () => {
        it('applies umask when creating files', async () => {
            vfs.setUmask('0077');
            await vfs.touch('/', 'secret.txt', 'alice');
            const metadata = vfs.getMetadata('/secret.txt', 'root') as Inode;
            
            // Default file perms are 666. 666 & ~077 = 600
            expect(metadata.permissions.owner.read).toBe(true);
            expect(metadata.permissions.owner.write).toBe(true);
            expect(metadata.permissions.group.read).toBe(false);
            expect(metadata.permissions.others.read).toBe(false);
        });

        it('applies umask when creating directories', async () => {
            vfs.setUmask('0022');
            await vfs.mkdir('/', 'newdir', 'alice');
            const metadata = vfs.getMetadata('/newdir', 'root') as Inode;
            
            // Default dir perms are 777. 777 & ~022 = 755
            expect(metadata.permissions.owner.read).toBe(true);
            expect(metadata.permissions.group.read).toBe(true);
            expect(metadata.permissions.group.write).toBe(false);
            expect(metadata.permissions.others.read).toBe(true);
            expect(metadata.permissions.others.write).toBe(false);
        });

        it('serializes and deserializes umask correctly', () => {
            vfs.setUmask('0027');
            const snapshot = vfs.serialize();
            expect(JSON.parse(snapshot).umask).toBe('0027');

            const newVfs = new VFS();
            newVfs.deserialize(snapshot);
            expect(newVfs.getUmask()).toBe('0027');
        });
    });

    describe('ACL Engine Foundation', () => {
        it('honors named user ACL over others permissions', async () => {
            await vfs.touch('/', 'shared.txt', 'alice');
            await vfs.chmod('/shared.txt', '600', 'alice'); // Owner only
            
            const inode = vfs.getMetadata('/shared.txt', 'root') as Inode;
            inode.acls = {
                'user:bob': { read: true, write: true, execute: false }
            };
            
            expect(vfs.hasPermission(inode, 'bob', 'read')).toBe(true);
            expect(vfs.hasPermission(inode, 'bob', 'write')).toBe(true);
            expect(vfs.hasPermission(inode, 'charlie', 'read')).toBe(false);
        });

        it('honors group ACL for user in group', async () => {
            await vfs.touch('/', 'project.txt', 'alice');
            await vfs.chmod('/project.txt', '600', 'alice');
            
            const inode = vfs.getMetadata('/project.txt', 'root') as Inode;
            inode.acls = {
                'group:devs': { read: true, write: false, execute: false }
            };
            
            expect(vfs.hasPermission(inode, 'charlie', 'read', ['devs'])).toBe(true);
            expect(vfs.hasPermission(inode, 'charlie', 'write', ['devs'])).toBe(false);
            expect(vfs.hasPermission(inode, 'charlie', 'read', ['other'])).toBe(false);
        });
    });
});
