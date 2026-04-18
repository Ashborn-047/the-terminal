import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { CommandExecutor } from '../executor';
import { CommandParser } from '../parser';
import { CommandContext } from '../types';
import '../commands';

describe('SUID Debug Test', () => {
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
            resolvePath: (p: string) => p,
            jobManager: {
                listJobs: () => [],
                addJob: () => ({ id: 1, pgid: 1234, state: 'RUNNING' } as any),
                getJobBySpec: () => undefined,
                terminateJob: () => {}
            } as any
        };
        
        // Ensure /bin exists (it should from VFS constructor, but let's be sure)
        await vfs.mkdir('/', 'bin', 'root', '755');
    });

    it('DEBUG: id -u should return 0 for root', async () => {
        const pipeline = CommandParser.parse('id -u');
        const rootContext = { ...context, userId: 'root', groups: ['root'] };
        const result = await executor.execute(pipeline, rootContext);
        console.log('DEBUG: id -u (root) result:', JSON.stringify(result));
        expect(result.output.trim()).toBe('0');
    });

    it('DEBUG: suid execution', async () => {
        await vfs.writeFile('/bin/suid_tool', 'echo START; id -u; echo END', 'root');
        await vfs.chmod('/bin/suid_tool', '4755', 'root');
        
        console.log('DEBUG: suid_tool metadata:', JSON.stringify(vfs.getMetadata('/bin/suid_tool', 'root')));

        const pipeline = CommandParser.parse('/bin/suid_tool');
        const result = await executor.execute(pipeline, context);
        console.log('DEBUG: suid_tool output:', JSON.stringify(result));
        expect(result.output).toContain('0');
    });
    
    it('DEBUG: direct echo with subshell', async () => {
        const pipeline = CommandParser.parse('echo UID: $(id -u)');
        const rootContext = { ...context, userId: 'root', groups: ['root'] };
        const result = await executor.execute(pipeline, rootContext);
        console.log('DEBUG: echo subshell result:', JSON.stringify(result));
        expect(result.output).toContain('UID: 0');
    });
});
