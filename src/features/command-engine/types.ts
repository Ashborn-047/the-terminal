import { VFS } from '../vfs/vfs';

export enum Signal {
    SIGINT = 'SIGINT',
    SIGTERM = 'SIGTERM',
    SIGKILL = 'SIGKILL'
}

export type SignalHandler = (sig: Signal) => void;


export interface CommandContext {
    cwd: string;
    userId: string;
    groups: string[];
    vfs: VFS;
    env: Record<string, string>;
    history: string[];
    processes: { pid: number; name: string; user: string; startTime: number; status?: string }[];
    jobs: any[];
    aliases: Record<string, string>;
    updateEnv: (env: Record<string, string>) => void;
    updateProcesses: (processes: any[]) => void;
    updateJobs: (jobs: any[]) => void;
    updateAliases: (aliases: Record<string, string>) => void;
    prompt?: (message: string) => Promise<string>;
    onSignal: (handler: SignalHandler) => void;
    removeSignalHandler: (handler: SignalHandler) => void;
    isInterrupted: () => boolean;
    resolvePath: (path: string) => string;
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
