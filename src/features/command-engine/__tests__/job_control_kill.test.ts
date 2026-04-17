import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands'; // Register commands

describe('Job Control — Kill by PID and Job ID', () => {
    let vfs: VFS;
    let executor: CommandExecutor;
    let context: CommandContext;
    let jobsList: any[];
    let processList: any[];

    beforeEach(() => {
        vfs = new VFS();
        executor = new CommandExecutor(vfs);
        jobsList = [];
        processList = [];

        context = {
            vfs,
            cwd: '/',
            userId: 'root',
            groups: ['root'],
            env: { HOME: '/root' },
            history: [],
            processes: processList,
            jobs: jobsList,
            aliases: {},
            updateEnv: () => {},
            updateProcesses: (p) => { processList = p; context.processes = p; },
            updateJobs: (j) => { jobsList = j; context.jobs = j; },
            updateAliases: () => {},
            onSignal: () => {},
            removeSignalHandler: () => {},
            isInterrupted: () => false,
            isInterrupted: () => false,
            resolvePath: (p: string) => p.startsWith('/') ? p : `/${p}`,
            jobManager: {
                listJobs: () => jobsList,
                addJob: (cmd: string, procs: any[]) => {
                    const job = { id: 1, pgid: procs[0]?.pid || 1234, state: 'RUNNING', pid: procs[0]?.pid || 1234 } as any;
                    jobsList.push(job);
                    return job;
                },
                getJobBySpec: () => undefined,
                terminateJob: () => {}
            } as any
        };
    });

    it('should create a background job with a valid PID', async () => {
        const pipeline = CommandParser.parse('sleep 100 &');
        const result = await executor.execute(pipeline, context);

        // Output should contain the job ID and PID
        expect(result.output).toMatch(/\[\d+\] \d+/);
        expect(result.exitCode).toBe(0);

        // The job should be registered in the jobs list
        expect(jobsList.length).toBe(1);
        expect(jobsList[0].state).toBe('RUNNING');
    });

    it('should output the correct job ID in background job output', async () => {
        const pipeline = CommandParser.parse('sleep 100 &');
        const result = await executor.execute(pipeline, context);

        // First background job should be [1]
        expect(result.output).toMatch(/^\[1\] \d+\n$/);
    });

    it('should register a process with matching PID in job and process tables', async () => {
        const pipeline = CommandParser.parse('sleep 100 &');
        await executor.execute(pipeline, context);

        expect(jobsList.length).toBe(1);
        expect(processList.length).toBe(1);

        // Critical: PID in job table must match PID in process table
        expect(jobsList[0].pid).toBe(processList[0].pid);
    });
});
