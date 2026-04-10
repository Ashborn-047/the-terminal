import { VFS } from '../vfs/vfs';
import { JobManager } from './shell/jobManager';

export enum Signal {
    SIGINT = 'SIGINT',
    SIGTERM = 'SIGTERM',
    SIGKILL = 'SIGKILL',
    SIGHUP = 'SIGHUP',
    // Process control signals (used by bg/fg)
    SIGSTOP = 'SIGSTOP',
    SIGCONT = 'SIGCONT'
}

export type SignalHandler = (sig: Signal) => void;


export interface CommandContext {
    cwd: string;
    updateCwd: (path: string) => void;
    userId: string;
    groups: string[];
    vfs: VFS;
    env: Record<string, string>;
    history: string[];
    processes: { pid: number; name: string; user: string; startTime: number; status?: string }[];
    jobManager: JobManager;
    resolvePath: (path: string) => string;
    abortSignal?: AbortSignal;
    onSignal: (handler: SignalHandler) => void;
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
