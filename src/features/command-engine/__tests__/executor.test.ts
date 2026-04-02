import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands'; // Register commands via modular index

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
            groups: ['root'],
            env: { HOME: '/home/root' },
            history: [],
            processes: [],
            jobs: [],
            aliases: {},
            updateEnv: () => { },
            updateProcesses: () => { },
            updateJobs: () => { },
            updateAliases: () => { },
            onSignal: () => () => { },
            removeSignalHandler: () => { },
            isInterrupted: () => false,
        };
    });

    it('should execute basic commands', async () => {
        const pipeline = CommandParser.parse('echo "hello"');
        const result = await executor.execute(pipeline, context);
        expect(result.output.trim()).toBe('hello');
        expect(result.exitCode).toBe(0);
    });

    it('should handle pipes', async () => {
        const pipeline = CommandParser.parse('echo "line 1\nline 2" | grep "line 2"');
        const result = await executor.execute(pipeline, context);
        expect(result.output.trim()).toBe('line 2');
    });

    it('should handle output redirection', async () => {
        const pipeline = CommandParser.parse('echo "content" > test.txt');
        await executor.execute(pipeline, context);
        expect(vfs.readFile('/test.txt', 'root')).toBe('content\n');
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
        expect(result.output.trim()).toBe('hello antigravity');
    });

    it('should handle command error formatting', async () => {
        // This test verifies that errors are formatted correctly and captured in result.error.
        const pipeline = CommandParser.parse('ls non_existent');
        const result = await executor.execute(pipeline, context);
        expect(result.error).toContain('No such file or directory');
    });

    it('should handle grep command', async () => {
        vfs.writeFile('/test.txt', 'line 1\nsearch target\nline 3', 'root');
        const pipeline = CommandParser.parse('grep "target" test.txt');
        const result = await executor.execute(pipeline, context);
        expect(result.output.trim()).toBe('search target');
    });

    it('should handle globbing (ls *.txt)', async () => {
        vfs.touch('/', 'a.txt', 'root');
        vfs.touch('/', 'b.log', 'root');

        const pipeline = CommandParser.parse('ls *.txt');
        const result = await executor.execute(pipeline, context);
        expect(result.output).toContain('a.txt');
        expect(result.output).not.toContain('b.log');
    });

    it('should handle chmod command', async () => {
        vfs.writeFile('/script.sh', 'echo hi', 'root');
        const pipeline = CommandParser.parse('chmod 755 script.sh');
        await executor.execute(pipeline, context);

        const inode: any = vfs.resolve('/script.sh', 'root');
        expect(inode.permissions.owner.execute).toBe(true);
        expect(inode.permissions.others.write).toBe(false);
    });

    it('should handle chown command', async () => {
        vfs.writeFile('/file.txt', 'data', 'root');
        const pipeline = CommandParser.parse('chown guest file.txt');
        await executor.execute(pipeline, context);

        const inode: any = vfs.resolve('/file.txt', 'root');
        expect(inode.ownerId).toBe('guest');
    });

    it('should handle ln -s command', async () => {
        vfs.writeFile('/original.txt', 'data', 'root');
        const pipeline = CommandParser.parse('ln -s original.txt link.txt');
        await executor.execute(pipeline, context);

        // To verify it's a symlink, get its inode directly without resolving (which follows symlinks)
        const rootDir: any = vfs.resolve('/', 'root');
        const linkId = rootDir.children.find((id: string) => vfs.getInode(id)?.name === 'link.txt');
        const linkInode = vfs.getInode(linkId);

        expect(linkInode?.type).toBe('symlink');
        expect(linkInode?.target).toBe('original.txt');
    });

    it('should handle Permission Denied for unauthorized access', async () => {
        // Create a file owned by root with 700 permissions
        vfs.writeFile('/root_secret.txt', 'secret data', 'root');
        vfs.chmod('/root_secret.txt', '700', 'root');

        // Attempt to read it as a guest user
        context.userId = 'guest';
        const pipeline = CommandParser.parse('cat /root_secret.txt');
        const result = await executor.execute(pipeline, context);

        expect(result.exitCode).toBe(1);
        expect(result.error).toContain('cat: /root_secret.txt: Permission denied');
    });

    it('should handle Command Not Found errors', async () => {
        const pipeline = CommandParser.parse('nonexistentcommand arg1');
        const result = await executor.execute(pipeline, context);

        expect(result.exitCode).toBe(127);
        expect(result.error).toContain('Command not found');
    });
});
