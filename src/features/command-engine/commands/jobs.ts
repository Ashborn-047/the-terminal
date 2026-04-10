import { CommandContext, CommandResult } from '../types';
import { JobState } from '../shell/jobManager';

export async function jobs(args: string[], context: CommandContext): Promise<CommandResult> {
    const jobs = context.jobManager.listJobs();
    if (jobs.length === 0) {
        return { output: '', exitCode: 0 };
    }

    const output = jobs.map((job, index) => {
        const isLast = index === jobs.length - 1;
        const char = isLast ? '+' : (index === jobs.length - 2 ? '-' : ' ');
        // [1]+  Running                 sleep 100 &
        const state = job.state === 'RUNNING' ? 'Running' : 'Stopped';
        return `[${job.id}]${char}  ${state.padEnd(24)}${job.command} &`;
    }).join('\n');

    return { output: output + '\n', exitCode: 0 };
}

export async function fg(args: string[], context: CommandContext): Promise<CommandResult> {
    const spec = args[0] || '%%';
    const job = context.jobManager.getJobBySpec(spec);

    if (!job) {
        return { output: '', error: `bash: fg: ${spec}: no such job`, exitCode: 1 };
    }

    console.log(`[fg] Bringing job ${job.id} (${job.command}) to foreground`);
    
    // In a real terminal we would write the command name
    const output = `${job.command}\n`;
    
    context.jobManager.resumeJob(job.id, true);
    
    // Wait for the job to complete
    const results = await Promise.all(job.processes.map(p => p.promise));
    const lastResult = results[results.length - 1];

    return { 
        output: output + (lastResult?.output || ''), 
        error: lastResult?.error,
        exitCode: lastResult?.exitCode ?? 0 
    };
}

export async function bg(args: string[], context: CommandContext): Promise<CommandResult> {
    const spec = args[0] || '%%';
    const job = context.jobManager.getJobBySpec(spec);

    if (!job) {
        return { output: '', error: `bash: bg: ${spec}: no such job`, exitCode: 1 };
    }

    if (job.state === 'RUNNING') {
        return { output: `bash: bg: job ${job.id} already in background\n`, exitCode: 0 };
    }

    context.jobManager.resumeJob(job.id, false);
    return { 
        output: `[${job.id}]+ ${job.command} &\n`, 
        exitCode: 0 
    };
}
