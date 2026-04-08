export interface HardcoreProfile {
    deathCount: number;
    lastDeathReason: string | null;
    isDead: boolean;
    respawnAt: number | null; // ISO timestamp
    xpPenaltyTotal: number;
}

export type MasteryBadge = 'novice' | 'hacker' | 'sysad' | 'kernel_master';

export interface MasteryState {
    badge: MasteryBadge;
    points: number;
    unlockedLabs: string[];
}
