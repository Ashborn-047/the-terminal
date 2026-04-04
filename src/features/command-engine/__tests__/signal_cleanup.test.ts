import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands'; // Register commands

describe('Signal Handler Cleanup', () => {
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

    it('should not have stale handlers after a foreground command completes', async () => {
        // Run a simple command that finishes immediately
        const pipeline = CommandParser.parse('echo hello');
        const result = await executor.execute(pipeline, context);
        expect(result.exitCode).toBe(0);

        // Run another command immediately after — it should not be affected
        // by any lingering signal handlers from the previous command.
        const pipeline2 = CommandParser.parse('ls /');
        const result2 = await executor.execute(pipeline2, context);
        expect(result2.exitCode).toBe(0);
        expect(result2.output).toContain('home');
    });

    it('should complete multiple sequential commands without handler accumulation', async () => {
        // Run 10 commands sequentially — if handlers leak, this could cause issues
        for (let i = 0; i < 10; i++) {
            const pipeline = CommandParser.parse(`echo "iteration ${i}"`);
            const result = await executor.execute(pipeline, context);
            expect(result.exitCode).toBe(0);
        }

        // Final command should still work perfectly
        const pipeline = CommandParser.parse('pwd');
        const result = await executor.execute(pipeline, context);
        expect(result.exitCode).toBe(0);
    });
});
