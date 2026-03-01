import { VFSSnapshot } from '../vfs/types';

export type LabType = 'guided' | 'diy';

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
    hint?: string;
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
    completedAt?: number;
    verified: boolean;
    hintsUsed?: number[]; // indices of steps where hints were used
    startTime?: number;   // UNIX timestamp when lab started/resumed
    totalTimeSpent?: number; // Cumulative seconds spent
}
