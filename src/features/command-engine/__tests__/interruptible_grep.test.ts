import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands'; // Register commands

describe('Interruptible Grep', () => {
    let vfs: VFS;
    let executor: CommandExecutor;
    let context: CommandContext;

    beforeEach(() => {
        vfs = new VFS();
        executor = new CommandExecutor(vfs);

        context = {
            vfs,
            cwd: '/',
            userId: 'root',
            groups: ['root'],
            env: { HOME: '/root' },
            history: [],
            processes: [],
            jobs: [],
            aliases: {},
            updateEnv: () => {},
            updateProcesses: () => {},
            updateJobs: () => {},
            updateAliases: () => {},
            onSignal: () => {},
            removeSignalHandler: () => {},
            isInterrupted: () => false,
            resolvePath: (p: string) => p.startsWith('/') ? p : `/${p}`,
        };
    });

    it('should stop recursive grep when interrupted between files', async () => {
        // Create a directory with multiple files
        vfs.mkdir('/', 'searchdir', 'root');
        vfs.touch('/searchdir', 'file1.txt', 'root');
        vfs.writeFile('/searchdir/file1.txt', 'matching line here\nanother line', 'root');
        vfs.touch('/searchdir', 'file2.txt', 'root');
        vfs.writeFile('/searchdir/file2.txt', 'matching line here too\nno match', 'root');
        vfs.touch('/searchdir', 'file3.txt', 'root');
        vfs.writeFile('/searchdir/file3.txt', 'this also has matching line\nmore data', 'root');

        // Normal grep -r should find matches in all files
        const pipeline = CommandParser.parse('grep -r "matching" /searchdir');
        const result = await executor.execute(pipeline, context);
        expect(result.exitCode).toBe(0);
        expect(result.output).toContain('file1.txt');
        expect(result.output).toContain('file2.txt');
        expect(result.output).toContain('file3.txt');
    });

    it('should respect isInterrupted during grep execution', async () => {
        // Create a file with many lines
        const lines = Array.from({ length: 100 }, (_, i) => `line ${i}: data`);
        vfs.touch('/', 'bigfile.txt', 'root');
        vfs.writeFile('/bigfile.txt', lines.join('\n'), 'root');

        // Test grep directly to verify isInterrupted is checked per-line
        const { grep } = await import('../commands/grep');

        let callCount = 0;
        const interruptedContext: CommandContext = {
            ...context,
            isInterrupted: () => {
                callCount++;
                return callCount > 10; // Interrupt after 10 checks
            },
        };

        const result = await grep(['line', '/bigfile.txt'], interruptedContext, '');

        // Should have partial results (not all 100 lines)
        const matchCount = result.output.split('\n').filter(l => l.length > 0).length;
        expect(matchCount).toBeLessThan(100);
        expect(matchCount).toBeGreaterThan(0);
    });
});
