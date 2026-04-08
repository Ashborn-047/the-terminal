export interface HardcoreProfile {
    isActive: boolean;
    deathCount: number;
    currentSessionStarted: number; // timestamp
    protectedPaths: string[]; // e.g. ['/bin', '/boot', '/etc']
}

export type MasteryBadge = 'novice' | 'hacker' | 'sysad' | 'kernel_master';

export interface MasteryState {
    badge: MasteryBadge;
    points: number;
    unlockedLabs: string[];
}
