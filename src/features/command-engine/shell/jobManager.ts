import { Signal } from '../types';

export enum JobState {
    RUNNING = 'RUNNING',
    STOPPED = 'STOPPED',
    TERMINATED = 'TERMINATED',
}

export interface Process {
    pid: number;
    name: string;
    promise: Promise<any>;
}

export interface Job {
    id: number;
    pgid: number;
    command: string;
    state: JobState;
    processes: Process[];
    foreground: boolean;
    startTime: number;
}

export class JobManager {
    private jobs: Map<number, Job> = new Map();
    private nextJobId: number = 1;
    private currentForegroundJob: Job | null = null;
    private onJobsChanged?: (jobs: Job[]) => void;

    constructor(onJobsChanged?: (jobs: Job[]) => void) {
        this.onJobsChanged = onJobsChanged;
    }

    public addJob(command: string, processes: Process[], foreground: boolean): Job {
        const job: Job = {
            id: this.nextJobId++,
            pgid: processes[0]?.pid || 0,
            command,
            state: JobState.RUNNING,
            processes,
            foreground,
            startTime: Date.now(),
        };

        this.jobs.set(job.id, job);
        if (foreground) {
            this.currentForegroundJob = job;
        }

        // Connect process promises to job state
        Promise.all(processes.map(p => p.promise)).then(() => {
            if (job.state !== JobState.STOPPED) {
                this.terminateJob(job.id);
            }
        });

        this.notify();
        return job;
    }

    public suspendJob(jobId: number): void {
        const job = this.jobs.get(jobId);
        if (job) {
            job.state = JobState.STOPPED;
            job.foreground = false;
            if (this.currentForegroundJob?.id === jobId) {
                this.currentForegroundJob = null;
            }
            this.notify();
        }
    }

    public resumeJob(jobId: number, foreground: boolean): void {
        const job = this.jobs.get(jobId);
        if (job) {
            job.state = JobState.RUNNING;
            job.foreground = foreground;
            if (foreground) {
                this.currentForegroundJob = job;
            }
            this.notify();
        }
    }

    public terminateJob(jobId: number, signal?: Signal): void {
        const job = this.jobs.get(jobId);
        if (job) {
            job.state = JobState.TERMINATED;
            this.jobs.delete(jobId);
            if (this.currentForegroundJob?.id === jobId) {
                this.currentForegroundJob = null;
            }
            this.notify();
        }
    }

    public getJob(jobId: number): Job | undefined {
        return this.jobs.get(jobId);
    }

    public getJobBySpec(spec: string): Job | undefined {
        if (spec.startsWith('%')) {
            const val = spec.substring(1);
            if (val === '%' || val === '+') {
                // Get most recent job
                return Array.from(this.jobs.values()).pop();
            }
            if (val === '-') {
                // Get second most recent
                const jobs = Array.from(this.jobs.values());
                return jobs[jobs.length - 2];
            }
            const id = parseInt(val);
            if (!isNaN(id)) {
                return this.jobs.get(id);
            }
            // Prefix match
            return Array.from(this.jobs.values()).find(j => j.command.startsWith(val));
        }
        return undefined;
    }

    public listJobs(): Job[] {
        return Array.from(this.jobs.values());
    }

    public getForegroundJob(): Job | null {
        return this.currentForegroundJob;
    }

    private notify() {
        if (this.onJobsChanged) {
            this.onJobsChanged(this.listJobs());
        }
    }
}
