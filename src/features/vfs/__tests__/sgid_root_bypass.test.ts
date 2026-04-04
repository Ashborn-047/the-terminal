import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';

describe('SGID Root Bypass Prevention', () => {
    let vfs: VFS;

    beforeEach(() => {
        vfs = new VFS();
    });

    it('should NOT grant full bypass to a user in the root group', () => {
        // Create a file owned by root:root with mode 600 (rw-------)
        vfs.touch('/', 'root_secret.txt', 'root');
        vfs.writeFile('/root_secret.txt', 'classified data', 'root');
        vfs.chmod('/root_secret.txt', '600', 'root');

        // A normal user whose groups include 'root' (simulating SGID-root binary)
        // should NOT be able to read this file — only UID 0 bypasses.
        const result = vfs.readFile('/root_secret.txt', 'guest', ['root']);
        expect(result).toEqual({ error: 'Permission denied' });
    });

    it('should allow root group access only via group permissions', () => {
        // Create a file owned by root:root with mode 640 (rw-r-----)
        vfs.touch('/', 'group_readable.txt', 'root');
        vfs.writeFile('/group_readable.txt', 'group data', 'root');
        vfs.chmod('/group_readable.txt', '640', 'root');

        // A user in the 'root' group should be able to read via group permissions
        const result = vfs.readFile('/group_readable.txt', 'guest', ['root']);
        expect(result).toBe('group data');
    });

    it('should deny write to root group member when group write is off', () => {
        // File with mode 640 — group has read but NOT write
        vfs.touch('/', 'readonly_group.txt', 'root');
        vfs.writeFile('/readonly_group.txt', 'original', 'root');
        vfs.chmod('/readonly_group.txt', '640', 'root');

        // Write attempt by root group member should fail
        const result = vfs.writeFile('/readonly_group.txt', 'hacked', 'guest', ['root']);
        expect(result).toEqual({ error: 'Permission denied.' });

        // Content should be unchanged
        expect(vfs.readFile('/readonly_group.txt', 'root')).toBe('original');
    });

    it('should deny access to root group member on mode 600 file', () => {
        vfs.touch('/', 'private.txt', 'root');
        vfs.writeFile('/private.txt', 'secret', 'root');
        vfs.chmod('/private.txt', '600', 'root');

        // Root group member: no group read permission (mode 600 = rw-------)
        const result = vfs.readFile('/private.txt', 'attacker', ['root']);
        expect(result).toEqual({ error: 'Permission denied' });
    });
});
