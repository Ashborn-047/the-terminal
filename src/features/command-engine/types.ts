import { VFS } from '../vfs/vfs';

export interface CommandContext {
    cwd: string;
    userId: string;
    vfs: VFS;
    env: Record<string, string>;
    history: string[];
    processes: { pid: number; name: string; user: string; startTime: number }[];
    updateEnv: (env: Record<string, string>) => void;
    updateProcesses: (processes: any[]) => void;
    prompt?: (message: string) => Promise<string>;
}

export interface CommandResult {
    output: string;
    error?: string;
    exitCode: number;
}

export type RedirectionType = 'overwrite' | 'append' | 'input' | 'stderr' | 'both' | 'none';

export interface CommandAction {
    name: string;
    args: string[];
    redirectionType: RedirectionType;
    redirectionPath?: string;
}

export interface CommandPipeline {
    actions: CommandAction[];
}
