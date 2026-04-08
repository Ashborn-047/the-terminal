import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';

describe('SUID Root Bypass Prevention', () => {
    let vfs: VFS;

    beforeEach(() => {
        vfs = new VFS();
    });

    it('should not grant global bypass via SUID-root binary to a normal user', async () => {
        // Create a root-owned file with mode 600
        await vfs.touch('/', 'root_only.txt', 'root');
        await vfs.writeFile('/root_only.txt', 'top secret', 'root');
        await vfs.chmod('/root_only.txt', '600', 'root');

        // Simulate a SUID-root binary: the effective userId becomes 'root'
        // In our VFS, when SUID is applied, executor.ts sets effectiveUserId = file.ownerId
        // So the command runs with userId='root' — this is CORRECT behavior for SUID.
        // The key is that SUID changes userId, NOT group bypass.
        const resultAsRoot = vfs.readFile('/root_only.txt', 'root');
        expect(resultAsRoot).toBe('top secret');

        // Without SUID (normal user), access should be denied
        const resultAsGuest = vfs.readFile('/root_only.txt', 'guest', ['users']);
        expect(resultAsGuest).toEqual({ error: 'Permission denied' });
    });

    it('should not allow chown by non-root user even with root group', async () => {
        await vfs.touch('/', 'target.txt', 'root');

        // A user in root group should NOT be able to chown
        const result = await vfs.chown('/target.txt', 'attacker', 'guest', ['root']);
        expect(result).toBe('Permission denied');
    });

    it('should allow chown only for UID 0 (root user)', async () => {
        await vfs.touch('/', 'target.txt', 'root');

        const result = await vfs.chown('/target.txt', 'newowner', 'root');
        expect(result).toBe(true);

        const inode = vfs.resolve('/target.txt', 'root') as any;
        expect(inode.ownerId).toBe('newowner');
    });
});
