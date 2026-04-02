import { VFS } from '../vfs/vfs';

export enum Signal {
    SIGINT = 'SIGINT',
    SIGTERM = 'SIGTERM',
    SIGKILL = 'SIGKILL',
    SIGSTOP = 'SIGSTOP',
    SIGCONT = 'SIGCONT',
    SIGTSTP = 'SIGTSTP' // Ctrl+Z
}

export type SignalHandler = (sig: Signal) => void;

export type JobStatus = 'Running' | 'Stopped' | 'Terminated' | 'Done';

export interface Job {
    jid: number;
    pid: number;
    command: string;
    status: JobStatus;
    isBackground: boolean;
}

export interface Process {
    pid: number;
    ppid: number | null;
    name: string;
    uid: string;
    gid: string;
    status: JobStatus;
    startTime: number;
}

export interface CommandContext {
    cwd: string;
    userId: string;
    groups: string[];
    vfs: VFS;
    env: Record<string, string>;
    history: string[];
    processes: Process[];
    jobs: Job[];
    updateEnv: (env: Record<string, string>) => void;
    updateProcesses: (processes: Process[]) => void;
    updateJobs: (jobs: Job[]) => void;
    prompt?: (message: string) => Promise<string>;
    onSignal: (handler: SignalHandler) => void;
    removeSignalHandler: (handler: SignalHandler) => void;
    isInterrupted: () => boolean;
}

export interface CommandResult {
    output: string;
    error?: string;
    exitCode: number;
    stream?: AsyncGenerator<string>; // For high-fidelity streaming pipes
}

export type RedirectionType = 'overwrite' | 'append' | 'input' | 'stderr' | 'both' | 'heredoc' | 'none';

export interface CommandAction {
    name: string;
    args: string[];
    redirectionType: RedirectionType;
    redirectionPath?: string;
    heredocData?: string;
    background?: boolean;
}

export interface CommandPipeline {
    actions: CommandAction[];
}
