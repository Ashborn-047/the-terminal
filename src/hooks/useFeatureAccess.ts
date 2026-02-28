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
    achievements: boolean;  // Unlocks after completing 2 labs
    chat: boolean;          // Unlocks after completing 3 labs (future)
    settings: boolean;      // Unlocks at level 3
    labReset: boolean;      // Unlocks after completing 1 lab
    hints: boolean;         // Always available
}

export function useFeatureAccess(): FeatureAccess {
    const { labsCompleted, level } = useGamificationStore();

    return {
        terminal: true,
        curriculum: true,
        achievements: labsCompleted >= 2,
        chat: labsCompleted >= 3,
        settings: level >= 3,
        labReset: labsCompleted >= 1,
        hints: true,
    };
}
