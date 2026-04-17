import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands';

describe('High-Fidelity Realism Tests', () => {
    let vfs: VFS;
    let executor: CommandExecutor;
    let context: CommandContext;

    beforeEach(async () => {
        vfs = new VFS();
        executor = new CommandExecutor(vfs);
        const state = {
            cwd: '/home/guest',
            userId: 'guest',
            groups: ['guest'],
            env: { HOME: '/home/guest', USER: 'guest' } as Record<string, string>,
            history: [] as string[],
            processes: [] as any[],
            jobs: [] as any[],
            aliases: {} as Record<string, string>,
        };

        context = {
            vfs,
            get cwd() { return state.cwd; },
            set cwd(v) { state.cwd = v; },
            get userId() { return state.userId; },
            set userId(v) { state.userId = v; },
            get groups() { return state.groups; },
            set groups(v) { state.groups = v; },
            get env() { return state.env; },
            set env(v) { state.env = v; },
            get history() { return state.history; },
            set history(v) { state.history = v; },
            get processes() { return state.processes; },
            set processes(v) { state.processes = v; },
            get jobs() { return state.jobs; },
            set jobs(v) { state.jobs = v; },
            get aliases() { return state.aliases; },
            set aliases(v) { state.aliases = v; },
            updateEnv: (e) => { state.env = e; },
            updateProcesses: (p) => { state.processes = p; },
            updateJobs: (j) => { state.jobs = j; },
            updateAliases: (a) => { state.aliases = a; },
            prompt: async () => '',
            onSignal: () => { },
            removeSignalHandler: () => { },
            isInterrupted: () => false,
            resolvePath: (p: string) => p.startsWith('/') ? p : (state.cwd === '/' ? `/${p}` : `${state.cwd}/${p}`),
            jobManager: {
                listJobs: () => state.jobs,
                addJob: () => {
                    const job = { id: 1, pgid: 1234, state: 'RUNNING' } as any;
                    state.jobs.push(job);
                    return job;
                },
                getJobBySpec: () => undefined,
                terminateJob: () => {}
            } as any
        };
        // Setup standard dirs correctly
        await vfs.mkdir('/', 'bin', 'root', '755');
        await vfs.mkdir('/', 'root', 'root', '700');
        await vfs.mkdir('/', 'home', 'root', '755');
        await vfs.mkdir('/home', 'guest', 'guest', '755');
    });

    describe('Phase 5: Job Control', () => {
        it('should execute a command in the background with &', async () => {
            const pipeline = CommandParser.parse('sleep 10 &');
            const result = await executor.execute(pipeline, context);

            expect(result.output).toMatch(/\[1\]/);
            expect(context.jobs.length).toBeGreaterThan(0);
        });

        it('should list jobs with the jobs command', async () => {
            context.updateJobs([{ id: 1, pid: 1234, command: 'sleep 10', state: 'RUNNING', processes: [] }] as any);
            const pipeline = CommandParser.parse('jobs');
            const result = await executor.execute(pipeline, context);
            expect(result.output).toMatch(/\[1\].*Running/);
        });
    });

    describe('Phase 6: POSIX Identity & SUID', () => {
        it('should respect SUID bit on executable files', async () => {
            await vfs.writeFile('/bin/suid_tool', 'echo UID: $(id -u)', 'root');
            await vfs.chmod('/bin/suid_tool', '4755', 'root');

            const pipeline = CommandParser.parse('/bin/suid_tool');
            const result = await executor.execute(pipeline, context);
            expect(result.output).toContain('UID: 0');
        });

        it('should allow sudo command for privileged actions', async () => {
            await vfs.writeFile('/root/secret', 'shhh', 'root');
            await vfs.chmod('/root/secret', '700', 'root');

            const catFail = await executor.execute(CommandParser.parse('cat /root/secret'), context);
            expect(catFail.error || catFail.output).toMatch(/Permission denied|No such file/);

            const catSudo = await executor.execute(CommandParser.parse('sudo cat /root/secret'), context);
            
            let finalOutput = catSudo.output;
            if (catSudo.stream) {
                for await (const chunk of catSudo.stream) {
                    finalOutput += chunk;
                }
            }
            expect(finalOutput.trim()).toBe('shhh');
        });
    });

    describe('Phase 7: Observability', () => {
        it('should trace syscalls with strace', async () => {
            await vfs.writeFile('/home/guest/test.txt', 'hello', 'guest');
            const pipeline = CommandParser.parse('strace cat test.txt');
            const result = await executor.execute(pipeline, context);

            expect(result.output).toContain('openat');
            expect(result.output).toContain('read');
            expect(result.output).toContain('hello');
        });

        it('should list open file descriptors with lsof', async () => {
            const pipeline = CommandParser.parse('lsof');
            const result = await executor.execute(pipeline, context);
            expect(result.output).toContain('COMMAND');
            expect(result.output).toContain('/dev/null');
        });
    });

    describe('Phase 8: Advanced Shell Utilities', () => {
        it('should define aliases', async () => {
            await executor.execute(CommandParser.parse('alias ll="ls -la"'), context);
            expect(context.aliases['ll']).toBe('ls -la');
        });

        it('should track command history', async () => {
            context.history = ['echo "cmd1"'];
            const pipeline = CommandParser.parse('history');
            const result = await executor.execute(pipeline, context);
            expect(result.output).toContain('echo "cmd1"');
        });
    });
    describe('Phase 9: Engine Hardening (Advanced Redirections & Streaming)', () => {
        it('should append output with >>', async () => {
            await executor.execute(CommandParser.parse('echo line1 > test.txt'), context);
            await executor.execute(CommandParser.parse('echo line2 >> test.txt'), context);
            const result = await executor.execute(CommandParser.parse('cat test.txt'), context);
            
            let finalOutput = result.output;
            if (result.stream) {
                for await (const chunk of result.stream) {
                    finalOutput += chunk;
                }
            }
            expect(finalOutput.trim()).toBe('line1\nline2');
        });

        it('should redirect stderr with 2>', async () => {
            await executor.execute(CommandParser.parse('cat non_existent 2> error.log'), context);
            const result = await executor.execute(CommandParser.parse('cat error.log'), context);
            
            let finalOutput = result.output;
            if (result.stream) {
                for await (const chunk of result.stream) {
                    finalOutput += chunk;
                }
            }
            expect(finalOutput).toMatch(/No such file or directory/i);
        });

        it('should redirect both stdout and stderr with &>', async () => {
            await executor.execute(CommandParser.parse('echo hello &> out.log'), context);
            const out1 = await executor.execute(CommandParser.parse('cat out.log'), context);
            
            let finalOutput1 = out1.output;
            if (out1.stream) {
                for await (const chunk of out1.stream) {
                    finalOutput1 += chunk;
                }
            }
            expect(finalOutput1.trim()).toBe('hello');

            await executor.execute(CommandParser.parse('ls non_existent &> out.log'), context);
            const out2 = await executor.execute(CommandParser.parse('cat out.log'), context);
            
            let finalOutput2 = out2.output;
            if (out2.stream) {
                for await (const chunk of out2.stream) {
                    finalOutput2 += chunk;
                }
            }
            expect(finalOutput2).toMatch(/No such file or directory/i);
        });

        it('should return a stream for curl command', async () => {
            const pipeline = CommandParser.parse('curl http://test.com');
            const result = await executor.execute(pipeline, context);
            expect(result.output).toBeDefined();
            expect(result.output.length).toBeGreaterThan(0);
        });
    });
});
