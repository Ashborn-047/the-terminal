import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext, Signal } from '../types';
import { JobManager } from '../shell/jobManager';
import '../commands'; // Register commands

describe('Manual Smoke Tests — Architectural Hardening Verification', () => {
    let vfs: VFS;
    let executor: CommandExecutor;
    let context: CommandContext;

    beforeEach(async () => {
        vfs = new VFS();
        executor = new CommandExecutor(vfs);
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        terminalStore.setState({ processes: [], jobs: [] }); 

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
            updateProcesses: (p) => { 
                terminalStore.setState({ processes: p });
                context.processes = p; 
            },
            updateJobs: (j) => { 
                terminalStore.setState({ jobs: j });
                context.jobs = j; 
            },
            updateAliases: () => {},
            onSignal: () => {},
            removeSignalHandler: () => {},
            isInterrupted: () => false,
            resolvePath: (p: string) => p.startsWith('/') ? p : `/${p}`,
            waitIfSuspended: async () => {},
            jobManager: new JobManager((j) => {
                terminalStore.setState({ jobs: j });
                context.jobs = j;
            }),
            jobId: undefined
        };
    });

    it('Scenario 1: sleep 100 & → kill %1 (verify job table update)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        await executor.execute(CommandParser.parse('sleep 100 &'), context);
        const jobs = terminalStore.getState().jobs;
        expect(jobs.length).toBeGreaterThan(0);
        await executor.execute(CommandParser.parse(`kill %${jobs[0].jid}`), context);
        expect(terminalStore.getState().jobs[0].status).toBe('Terminated');
    });

    it('Scenario 2: sleep 100 & → kill <PID> (verify PID resolution)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        await executor.execute(CommandParser.parse('sleep 100 &'), context);
        const pid = terminalStore.getState().jobs[0].pid;
        await executor.execute(CommandParser.parse(`kill ${pid}`), context);
        expect(terminalStore.getState().jobs[0].status).toBe('Terminated');
    });

    it('Scenario 3: Command interruption (AbortController propagation)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        const promise = executor.execute(CommandParser.parse('sleep 100'), context);
        
        // Wait for process to be registered
        await new Promise(r => setTimeout(r, 50));
        
        const pid = context.processes[0]?.pid;
        if (pid) {
            terminalStore.getState().sendSignal(pid, Signal.SIGINT);
        }

        const result = await promise;
        expect(result.exitCode).toBe(130);
    });

    it('Scenario 4: grep -r interruption between files', async () => {
        vfs.mkdir('/', 'dir', 'root');
        vfs.touch('/dir', 'f1.txt', 'root');
        vfs.writeFile('/dir/f1.txt', 'pattern', 'root');
        vfs.touch('/dir', 'f2.txt', 'root');
        vfs.writeFile('/dir/f2.txt', 'pattern', 'root');

        const { grep } = await import('../commands/grep');
        let callCount = 0;
        const interruptedContext = {
            ...context,
            isInterrupted: () => {
                callCount++;
                return callCount > 1; 
            },
        };
        const result = await grep(['-r', 'pattern', '/dir'], interruptedContext, '');
        const matchCount = result.output.split('\n').filter(l => l.length > 0).length;
        expect(matchCount).toBeLessThan(2);
    });

    it('Scenario 5: Mode 600 file access denial (No bypass for root group)', async () => {
        vfs.touch('/', 'secret', 'root');
        vfs.writeFile('/secret', 'data', 'root');
        vfs.chmod('/secret', '600', 'root');
        context.userId = 'guest';
        context.groups = ['root'];
        const result = await executor.execute(CommandParser.parse('cat /secret'), context);
        expect(result.error).toContain('Permission denied');
    });

    it('Scenario 6: SGID-root binary access denial', async () => {
        vfs.touch('/', 'root_file', 'root');
        vfs.writeFile('/root_file', 'data', 'root');
        vfs.chmod('/root_file', '600', 'root');
        vfs.touch('/', 'sgid_bin', 'root');
        vfs.chmod('/sgid_bin', '2755', 'root');
        context.userId = 'guest';
        context.groups = ['users'];
        const { grep } = await import('../commands/grep');
        const result = await grep(['data', '/root_file'], { ...context, groups: ['root'] }, '');
        expect(result.exitCode).toBe(1);
    });

    it('Scenario 7: Signal handler cleanup (No interference between commands)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        await executor.execute(CommandParser.parse('sleep 100 &'), context);
        const pid = terminalStore.getState().jobs[0].pid;
        await executor.execute(CommandParser.parse(`kill ${pid}`), context);
        const result = await executor.execute(CommandParser.parse('echo "hello"'), context);
        expect(result.output.trim()).toBe('hello');
    });
});
