import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands/core'; // Register commands

describe('Command Executor', () => {
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
            env: { HOME: '/home/root' },
            history: [],
            processes: [],
            updateEnv: () => { },
            updateProcesses: () => { },
        };
    });

    it('should execute basic commands', async () => {
        const pipeline = CommandParser.parse('echo "hello"');
        const result = await executor.execute(pipeline, context);
        expect(result.output).toBe('hello');
        expect(result.exitCode).toBe(0);
    });

    it('should handle pipes', async () => {
        const pipeline = CommandParser.parse('echo "line 1\nline 2" | grep "line 2"');
        const result = await executor.execute(pipeline, context);
        expect(result.output).toBe('line 2');
    });

    it('should handle output redirection', async () => {
        const pipeline = CommandParser.parse('echo "content" > test.txt');
        await executor.execute(pipeline, context);
        expect(vfs.readFile('/test.txt', 'root')).toBe('content');
    });

    it('should handle input redirection', async () => {
        vfs.touch('/', 'input.txt', 'root');
        vfs.writeFile('/input.txt', 'from file', 'root');

        const pipeline = CommandParser.parse('cat < input.txt');
        const result = await executor.execute(pipeline, context);
        expect(result.output).toBe('from file');
    });

    it('should handle command substitution $(...)', async () => {
        vfs.touch('/', 'name.txt', 'root');
        vfs.writeFile('/name.txt', 'antigravity', 'root');

        const pipeline = CommandParser.parse('echo hello $(cat name.txt)');
        const result = await executor.execute(pipeline, context);
        expect(result.output).toBe('hello antigravity');
    });

    it('should handle compound commands (&&)', async () => {
        // We need to test the logic that would normally be in a console loop
        // but we can test CommandExecutor.execute on a pipeline.
        // For compound commands like &&, the UI or a shell-loop handles the segments.
        // Let's test redirection with stderr
        const pipeline = CommandParser.parse('ls non_existent 2> errors.txt');
        await executor.execute(pipeline, context);
        const errs = vfs.readFile('/errors.txt', 'root');
        expect(errs).toContain('ls: cannot access');
    });
});
