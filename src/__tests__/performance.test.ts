import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../features/vfs/vfs';

/**
 * Performance Benchmarks for VFS and Command Operations
 * 
 * These tests measure execution time for operations under load
 * to ensure the app remains responsive with large filesystems.
 */
describe('Performance Benchmarks', () => {
    let vfs: VFS;
    const userId = 'guest';

    beforeEach(() => {
        vfs = new VFS();
    });

    describe('VFS — Large Directory Operations', () => {
        it('should create 500 files in under 500ms', () => {
            const start = performance.now();
            for (let i = 0; i < 500; i++) {
                vfs.writeFile(`/home/guest/file_${i}.txt`, `Content of file ${i}`, userId);
            }
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(500);
            console.log(`  → Created 500 files in ${elapsed.toFixed(1)}ms`);
        });

        it('should list a directory with 500 files in under 100ms', () => {
            // Setup: create 500 files
            for (let i = 0; i < 500; i++) {
                vfs.writeFile(`/home/guest/file_${i}.txt`, `Content ${i}`, userId);
            }

            const start = performance.now();
            const result = vfs.listChildren('/home/guest', userId);
            const elapsed = performance.now() - start;

            expect(result).toBeDefined();
            expect(elapsed).toBeLessThan(100);
            console.log(`  → Listed 500 files in ${elapsed.toFixed(1)}ms`);
        });

        it('should create deeply nested directories (20 levels) in under 200ms', () => {
            let path = '/home/guest';
            const start = performance.now();
            for (let i = 0; i < 20; i++) {
                path += `/level_${i}`;
                vfs.mkdir(path.substring(0, path.lastIndexOf('/')), `level_${i}`, userId);
            }
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(200);
            console.log(`  → Created 20 nested directories in ${elapsed.toFixed(1)}ms`);
        });

        it('should resolve paths with .. segments efficiently', () => {
            // Create nested structure
            vfs.mkdir('/home/guest', 'a', userId);
            vfs.mkdir('/home/guest/a', 'b', userId);
            vfs.mkdir('/home/guest/a/b', 'c', userId);
            vfs.writeFile('/home/guest/a/b/c/target.txt', 'found it', userId);

            const start = performance.now();
            for (let i = 0; i < 1000; i++) {
                vfs.resolve('/home/guest/a/b/c/../../../a/b/c/target.txt', userId);
            }
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(200);
            console.log(`  → 1000 path resolutions with .. in ${elapsed.toFixed(1)}ms`);
        });
    });

    describe('VFS — File I/O Performance', () => {
        it('should read/write large file content (100KB) in under 50ms', () => {
            const largeContent = 'X'.repeat(100 * 1024); // 100KB

            const writeStart = performance.now();
            vfs.writeFile('/home/guest/bigfile.txt', largeContent, userId);
            const writeElapsed = performance.now() - writeStart;

            const readStart = performance.now();
            const content = vfs.readFile('/home/guest/bigfile.txt', userId);
            const readElapsed = performance.now() - readStart;

            expect(content).toBe(largeContent);
            expect(writeElapsed).toBeLessThan(50);
            expect(readElapsed).toBeLessThan(50);
            console.log(`  → Write 100KB: ${writeElapsed.toFixed(1)}ms, Read: ${readElapsed.toFixed(1)}ms`);
        });

        it('should copy a directory with 100 files in under 500ms', () => {
            // Setup: create source dir with 100 files
            vfs.mkdir('/home/guest', 'source', userId);
            for (let i = 0; i < 100; i++) {
                vfs.writeFile(`/home/guest/source/file_${i}.txt`, `Data ${i}`, userId);
            }

            const start = performance.now();
            vfs.cp('/home/guest/source', '/home/guest/dest', true, userId);
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(500);
            console.log(`  → Copied 100-file directory in ${elapsed.toFixed(1)}ms`);
        });

        it('should recursively remove a directory with 200 files in under 300ms', () => {
            // Setup
            vfs.mkdir('/home/guest', 'tobedeleted', userId);
            for (let i = 0; i < 200; i++) {
                vfs.writeFile(`/home/guest/tobedeleted/file_${i}.txt`, `Data ${i}`, userId);
            }

            const start = performance.now();
            vfs.rm('/home/guest/tobedeleted', true, userId);
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(300);
            console.log(`  → Removed 200 files recursively in ${elapsed.toFixed(1)}ms`);
        });
    });

    describe('VFS — Permission Operations', () => {
        it('should check permissions on 1000 files in under 100ms', () => {
            // Setup
            for (let i = 0; i < 100; i++) {
                vfs.writeFile(`/home/guest/perm_${i}.txt`, 'test', userId);
                vfs.chmod(`/home/guest/perm_${i}.txt`, '644', userId);
            }

            const inode = vfs.resolve('/home/guest/perm_0.txt', userId) as any;
            const start = performance.now();
            for (let i = 0; i < 100; i++) {
                for (let j = 0; j < 10; j++) {
                    vfs.hasPermission(inode, userId, 'read');
                }
            }
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(100);
            console.log(`  → 1000 permission checks in ${elapsed.toFixed(1)}ms`);
        });
    });

    describe('Gamification — Computation Performance', () => {
        it('should compute level from XP for 10000 lookups in under 50ms', async () => {
            const { levelFromXP } = await import('../stores/gamificationStore');

            const start = performance.now();
            for (let i = 0; i < 10000; i++) {
                levelFromXP(Math.floor(Math.random() * 100000));
            }
            const elapsed = performance.now() - start;

            expect(elapsed).toBeLessThan(50);
            console.log(`  → 10000 levelFromXP lookups in ${elapsed.toFixed(1)}ms`);
        });
    });
});
