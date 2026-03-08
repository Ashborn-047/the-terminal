import { VFSSnapshot } from '../vfs/types';

export type LabType = 'guided' | 'diy' | 'boss';

export interface VerificationCondition {
    type: 'directory_exists' | 'file_exists' | 'file_contains' | 'file_matches_regex' | 'file_not_exists' | 'permission_equals' | 'owner_equals' | 'symlink_target_equals';
    path: string;
    content?: string;
    mode?: string;
    owner?: string;
    message: string;
}

export interface LabStep {
    id: string;
    instruction: string;
    expectedCommand?: string;
    alternativeCommands?: string[]; // Any of these also pass the step
    requiredSequence?: string[];    // All must be entered in order to pass
    hint?: string;
    solution?: string; // Revealed command(s) for the step
    regexMatch?: boolean; // If true, expectedCommand is treated as a regex
}

export interface Lab {
    id: string;
    module: number;
    title: string;
    description: string;
    type: LabType;
    xpReward: number;
    prerequisites: string[];
    initialVFS?: string; // name of snapshot or 'default'
    steps?: LabStep[]; // for guided
    verification?: {
        conditions: VerificationCondition[];
    }; // for diy
    hints?: string[];
    solution?: string; // For DIY labs, the overall solution
    completionMessage: string;
    parTime?: number; // in seconds
    parXpBonus?: number;
    tags?: string[];
    author?: string;
}

export interface LabProgress {
    labId: string;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
    currentStepIndex: number;
    sequenceIndex?: number; // Tracks progress within a requiredSequence step
    completedAt?: number;
    verified: boolean;
    hintsUsed?: number[]; // indices of steps where hints were used (Guided) or hint indices (DIY)
    solutionRevealed?: boolean; // True if the user revealed the solution
    startTime?: number;   // UNIX timestamp when lab started/resumed
    totalTimeSpent?: number; // Cumulative seconds spent
}
