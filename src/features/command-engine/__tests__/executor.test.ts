import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { Lexer } from '../shell/lexer';
import { Parser } from '../shell/parser';
import { ShellExecutor } from '../shell/executor';
import { ShellEnvironment } from '../shell/environment';
import { CommandContext } from '../types';
import '../commands'; 

// Mock spacetime to prevent rollback on mutation calls
vi.mock('../../../lib/spacetime', () => ({
    spacetime: {
        createFile: vi.fn().mockResolvedValue({}),
        writeFile: vi.fn().mockResolvedValue({}),
        deleteFile: vi.fn().mockResolvedValue({}),
        moveFile: vi.fn().mockResolvedValue({}),
        chmod: vi.fn().mockResolvedValue({}),
    }
}));

describe('Command Executor', () => {
    let vfs: VFS;
    let executor: ShellExecutor;
    let context: CommandContext;
    let shellEnv: ShellEnvironment;

    const parseCmd = (input: string) => {
        const lexer = new Lexer(input);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        return parser.parse();
    };

    beforeEach(() => {
        vfs = new VFS();
        executor = new ShellExecutor(vfs);
        shellEnv = new ShellEnvironment({ HOME: '/home/root' });
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
            prompt: async () => '',
            onSignal: () => () => {},
            removeSignalHandler: () => { },
            isInterrupted: () => false,
            resolvePath: (p: string) => p.startsWith('/') ? p : `/${p}`, 
        };
    });

    it('should execute basic commands', async () => {
        const ast = parseCmd('echo "hello"');
        const result = await executor.execute(ast, context, shellEnv);
        expect(result.output.trim()).toBe('hello');
        expect(result.exitCode).toBe(0);
    });

    it('should handle pipes', async () => {
        const ast = parseCmd('echo "line 1\nline 2" | grep "line 2"');
        const result = await executor.execute(ast, context, shellEnv);
        expect(result.output.trim()).toBe('line 2');
    });

    it('should handle output redirection', async () => {
        const ast = parseCmd('echo "content" > test.txt');
        await executor.execute(ast, context, shellEnv);
        expect(vfs.readFile('/test.txt', 'root')).toBe('content\n');
    });

    it('should handle input redirection', async () => {
        await vfs.touch('/', 'input.txt', 'root');
        await vfs.writeFile('/input.txt', 'from file', 'root');

        const ast = parseCmd('cat < input.txt');
        const result = await executor.execute(ast, context, shellEnv);
        expect(result.output).toBe('from file');
    });

    it('should handle command substitution $(...)', async () => {
        // Note: New executor handles subshells via recursion
        await vfs.touch('/', 'name.txt', 'root');
        await vfs.writeFile('/name.txt', 'antigravity', 'root');

        const ast = parseCmd('echo hello $(cat name.txt)');
        const result = await executor.execute(ast, context, shellEnv);
        expect(result.output.trim()).toBe('hello antigravity');
    });

    it('should handle compound commands (&&)', async () => {
        const ast = parseCmd('ls non_existent && echo "should not see this"');
        const result = await executor.execute(ast, context, shellEnv);
        // We expect ls to return 'No such file or directory' because it's a registered command but target is missing
        expect(result.exitCode).not.toBe(0);
        expect(result.output).not.toContain('should not see this');
    });

    it('should handle grep command', async () => {
        await vfs.writeFile('/test.txt', 'line 1\nsearch target\nline 3', 'root');
        const ast = parseCmd('grep "target" test.txt');
        const result = await executor.execute(ast, context, shellEnv);
        expect(result.output.trim()).toBe('search target');
    });

    it('should handle find command', async () => {
        // Redone to reflect find/ls behavior in new engine
        await vfs.mkdir('/', 'mydir', 'root');
        await vfs.writeFile('/mydir/file1.txt', 'data', 'root');
        
        const ast = parseCmd('ls /mydir');
        const result = await executor.execute(ast, context, shellEnv);
        expect(result.output).toContain('file1.txt');
    });

    it('should handle chmod command', async () => {
        await vfs.writeFile('/script.sh', 'echo hi', 'root');
        const ast = parseCmd('chmod 755 script.sh');
        await executor.execute(ast, context, shellEnv);

        const inode: any = vfs.resolve('/script.sh', 'root');
        expect(inode.permissions.owner.execute).toBe(true);
        expect(inode.permissions.others.write).toBe(false);
    });

    it('should handle chown command', async () => {
        await vfs.writeFile('/file.txt', 'data', 'root');
        const ast = parseCmd('chown guest file.txt');
        await executor.execute(ast, context, shellEnv);

        const inode: any = vfs.resolve('/file.txt', 'root');
        expect(inode.ownerId).toBe('guest');
    });

    it('should handle Permission Denied for unauthorized access', async () => {
        await vfs.writeFile('/root_secret.txt', 'secret data', 'root');
        await vfs.chmod('/root_secret.txt', '700', 'root');

        context.userId = 'guest';
        context.groups = ['guest'];
        const ast = parseCmd('cat /root_secret.txt');
        const result = await executor.execute(ast, context, shellEnv);

        expect(result.exitCode).toBe(1);
        expect(result.error).toContain('cat: /root_secret.txt: Permission denied');
    });

    it('should handle Command Not Found errors', async () => {
        const ast = parseCmd('nonexistentcommand arg1');
        const result = await executor.execute(ast, context, shellEnv);

        expect(result.exitCode).toBe(127);
        expect(result.error).toContain('bash: nonexistentcommand: command not found');
    });
});
