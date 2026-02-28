import { CommandResult } from '../features/command-engine/types';

export interface TerminalEntry {
    id: string;
    command: string;
    output: string;
    error?: string;
    cwd: string;
    timestamp: number;
}

export interface TerminalState {
    history: TerminalEntry[];
    cwd: string;
    userId: string;
}
