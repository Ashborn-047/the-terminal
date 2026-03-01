import { useGamificationStore } from '../stores/gamificationStore';
import { useLabStore } from '../stores/labStore';

/**
 * Progressive Feature Unlocking — per user_onboarding.md §4
 * Features unlock based on labs completed and level reached.
 * This hook returns which features are currently available.
 */
export interface FeatureAccess {
    terminal: boolean;      // Always available
    curriculum: boolean;    // Available after onboarding
    achievements: boolean;  // 2 labs
    chat: boolean;          // 3 labs
    commandReference: boolean; // 5 labs
    diyLabs: boolean;       // 10 labs
    settings: boolean;      // Level 3
    labReset: boolean;      // 1 lab
    hints: boolean;
}

export function useFeatureAccess(): FeatureAccess {
    const { labsCompleted, level } = useGamificationStore();

    return {
        terminal: true,
        curriculum: true,
        achievements: labsCompleted >= 2,
        chat: labsCompleted >= 3,
        commandReference: labsCompleted >= 5,
        diyLabs: labsCompleted >= 10,
        settings: level >= 3,
        labReset: labsCompleted >= 1,
        hints: true,
    };
}
