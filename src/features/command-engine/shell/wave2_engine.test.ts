import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VFS } from '../../vfs/vfs';
import { ShellExecutor } from './executor';
import { ShellEnvironment } from './environment';
import { JobManager, JobState } from './jobManager';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { CommandContext, Signal } from '../types';
import '../commands';

describe('Wave 2 Engine Restoration', () => {
    let vfs: VFS;
    let executor: ShellExecutor;
    let env: ShellEnvironment;
    let jobManager: JobManager;
    let context: CommandContext;

    beforeEach(() => {
        vfs = new VFS();
        executor = new ShellExecutor(vfs);
        env = new ShellEnvironment({ USER: 'testuser', HOME: '/home/testuser', PWD: '/' });
        jobManager = new JobManager(() => {});
        context = {
            cwd: '/',
            updateCwd: (p) => { context.cwd = p; },
            userId: 'testuser',
            groups: ['testuser', 'users'],
            vfs,
            env: {},
            history: [],
            processes: [],
            jobManager,
            resolvePath: (p) => p.startsWith('/') ? p : `/${p}`,
            isInterrupted: () => false,
            onSignal: () => {}
        };
    });

    const run = async (input: string) => {
        const lexer = new Lexer(input);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const result = await executor.execute(ast, context, env);
        
        // Drain stream if present for test assertions
        if (result.stream) {
            let streamOutput = '';
            for await (const chunk of result.stream) {
                streamOutput += chunk;
            }
            result.output = streamOutput;
        }
        
        return result;
    };

    describe('Job Control', () => {
        it('should launch a background job with &', async () => {
            const result = await run('sleep 100 &');
            expect(result.output).toMatch(/\[1\] \d+/);
            const jobs = jobManager.listJobs();
            expect(jobs.length).toBe(1);
            expect(jobs[0].command).toBe('sleep 100');
            expect(jobs[0].state).toBe(JobState.RUNNING);
        });

        it('should list jobs with the jobs command', async () => {
            await run('sleep 100 &');
            const result = await run('jobs');
            expect(result.output).toContain('[1]+  Running                 sleep 100 &');
        });

        it('should support killing a job by JID', async () => {
            await run('sleep 100 &');
            await run('kill %1');
            const jobs = jobManager.listJobs();
            expect(jobs.length).toBe(1);
            expect(jobs[0].state).toBe(JobState.TERMINATED);
        });
    });

    describe('Heredoc Support', () => {
        it('should capture and expand basic heredoc', async () => {
            env.set('VAR', 'world');
            const input = `cat << EOF\nhello $VAR\nEOF`;
            const result = await run(input);
            expect(result.output).toBe('hello world\n');
        });

        it('should not expand when delimiter is quoted', async () => {
            env.set('VAR', 'world');
            const input = `cat << "EOF"\nhello $VAR\nEOF`;
            const result = await run(input);
            expect(result.output).toBe('hello $VAR\n');
        });

        it('should strip tabs with <<- operator', async () => {
            const input = `cat <<- EOF\n\t\tindented\nEOF`;
            const result = await run(input);
            expect(result.output).toBe('indented\n');
        });
    });

    describe('Streaming Pipelines', () => {
        it('should pipe output between commands using streams', async () => {
            vfs.writeFile('/test.txt', 'line1\nline2\nmatch\nline4', 'testuser', ['users']);
            const result = await run('cat /test.txt | grep match');
            expect(result.output).toBe('match\n');
        });

        it('should handle head properly in a pipeline', async () => {
            vfs.writeFile('/test.txt', '1\n2\n3\n4\n5', 'testuser', ['users']);
            const result = await run('cat /test.txt | head -n 2');
            expect(result.output).toBe('1\n2\n');
        });

        it('should handle tail properly in a pipeline', async () => {
            vfs.writeFile('/test.txt', '1\n2\n3\n4\n5', 'testuser', ['users']);
            const result = await run('cat /test.txt | tail -n 2');
            expect(result.output).toBe('4\n5\n');
        });
    });
});
