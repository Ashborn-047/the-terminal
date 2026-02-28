import { VFS } from '../vfs/vfs';

export interface CommandContext {
    cwd: string;
    userId: string;
    vfs: VFS;
    env: Record<string, string>;
    history: string[];
}

export interface CommandResult {
    output: string;
    error?: string;
    exitCode: number;
}

export type RedirectionType = 'overwrite' | 'append' | 'none';

export interface CommandAction {
    name: string;
    args: string[];
    redirectionType: RedirectionType;
    redirectionPath?: string;
}

export interface CommandPipeline {
    actions: CommandAction[];
}
