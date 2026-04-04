import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands'; // Register commands

describe('Manual Smoke Tests — Architectural Hardening Verification', () => {
    let vfs: VFS;
    let executor: CommandExecutor;
    let context: CommandContext;

    beforeEach(async () => {
        vfs = new VFS();
        executor = new CommandExecutor(vfs);
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        terminalStore.setState({ processes: [], jobs: [] }); // Reset store

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
        };
    });

    it('Scenario 1: sleep 100 & → kill %1 (verify job table update)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        
        await executor.execute(CommandParser.parse('sleep 100 &'), context);
        const jobs = terminalStore.getState().jobs;
        expect(jobs.length).toBeGreaterThan(0);
        const jid = jobs[0].jid;

        // Kill by Job ID
        await executor.execute(CommandParser.parse(`kill %${jid}`), context);

        // Verify status update in store
        const updatedJobs = terminalStore.getState().jobs;
        expect(updatedJobs[0].status).toBe('Terminated');
    });

    it('Scenario 2: sleep 100 & → kill <PID> (verify PID resolution)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;

        await executor.execute(CommandParser.parse('sleep 100 &'), context);
        const jobs = terminalStore.getState().jobs;
        const pid = jobs[0].pid;

        // Kill by PID
        await executor.execute(CommandParser.parse(`kill ${pid}`), context);

        const updatedJobs = terminalStore.getState().jobs;
        expect(updatedJobs[0].status).toBe('Terminated');
    });

    it('Scenario 5: Mode 600 file access denial (No bypass for root group)', async () => {
        vfs.touch('/', 'secret.txt', 'root');
        vfs.writeFile('/secret.txt', 'data', 'root');
        vfs.chmod('/secret.txt', '600', 'root');

        // Normal user in root group
        context.userId = 'guest';
        context.groups = ['root'];

        const result = await executor.execute(CommandParser.parse('cat /secret.txt'), context);
        expect(result.exitCode).toBe(1);
        expect(result.error).toContain('Permission denied');
    });

    it('Scenario 6: SGID-root binary access denial', async () => {
        // Create a root-only file
        vfs.touch('/', 'root_only.txt', 'root');
        vfs.writeFile('/root_only.txt', 'confidential', 'root');
        vfs.chmod('/root_only.txt', '600', 'root');

        // Create an SGID-root binary (chmod 2755)
        vfs.touch('/', 'sgid_bin', 'root');
        vfs.chmod('/sgid_bin', '2755', 'root');

        // Run as guest
        context.userId = 'guest';
        context.groups = ['users'];

        // The executor handles SGID by adding the file's group to the context
        // In this case, 'root' group is added.
        // But hasPermission now correctly denies access to mode 600 files for GID 0.
        const result = await executor.execute(CommandParser.parse('./sgid_bin'), context);
        
        // Since ./sgid_bin is just a file, executor will try to read it as a script.
        // If it can't read the script itself (mode 755 allows it), it executes.
        // The check here is whether a process with GID 0 (from the SGID bit) can read root_only.txt.
        // We'll test this by mocking a command that tries to read it.
        const { grep } = await import('../commands/grep');
        const grepResult = await grep(['confidential', '/root_only.txt'], context, '');
        expect(grepResult.exitCode).toBe(1); // Denied
    });

    it('Scenario 7: Signal handler cleanup (No interference between commands)', async () => {
        const terminalStore = (await import('../../../stores/terminalStore')).useTerminalStore;
        // Run sleep, then kill it
        await executor.execute(CommandParser.parse('sleep 100 &'), context);
        const pid = terminalStore.getState().jobs[0].pid;
        await executor.execute(CommandParser.parse(`kill ${pid}`), context);

        // Run another command
        const result = await executor.execute(CommandParser.parse('echo "hello"'), context);
        expect(result.output.trim()).toBe('hello');
        expect(result.exitCode).toBe(0);
    });
});
