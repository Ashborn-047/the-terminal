import { spacetime } from './index';
import { useGamificationStore, levelFromXP } from '../../stores/gamificationStore';
import { useLabStore } from '../../stores/labStore';
import { logger } from '../../utils/logger';

/**
 * SpacetimeDB Sync Layer
 * Synchronizes remote SpacetimeDB state with local Zustand stores.
 */
export const initSpacetimeSync = () => {
    spacetime.onUpdate(() => {
        if (!spacetime.getIsConnected()) return;

        const user = spacetime.getLocalUser();
        if (user) {
            const totalXp = Number(user.xp);
            const level = user.level || levelFromXP(totalXp);

            useGamificationStore.setState((state) => ({
                xp: totalXp,
                level: level,
                totalXpEarned: totalXp,
                streak: {
                    ...state.streak,
                    current: user.streak,
                    longest: user.longestStreak,
                }
            }));

            logger.debug('Synced user state from SpacetimeDB', { level, totalXp });
        }

        const progress = spacetime.getUserProgress();
        if (progress) {
            const localProgress = { ...useLabStore.getState().progress };
            let updated = false;

            progress.completedLabs.forEach((labId: string) => {
                if (localProgress[labId]?.status !== 'completed') {
                    localProgress[labId] = {
                        ...(localProgress[labId] || {}),
                        labId,
                        status: 'completed',
                        verified: true,
                        completedAt: Date.now(), // Approximation
                        currentStepIndex: 999 // Ensure it passes completion check
                    };
                    updated = true;
                }
            });

            if (updated) {
                useLabStore.setState({ progress: localProgress });
                logger.debug('Synced lab progress from SpacetimeDB');
            }

            if (progress.activityLog) {
                const history: Record<string, number> = {};
                progress.activityLog.forEach((entry: any) => {
                    const date = new Date(Number(entry.timestamp / 1000n)).toISOString().split('T')[0];
                    const parts = entry.metadata.split(':');
                    const xp = parts.length > 1 ? parseInt(parts[1]) : 50;
                    history[date] = (history[date] || 0) + xp;
                });
                useGamificationStore.getState().setActivityHistory(history);
                logger.debug('Synced activity history from SpacetimeDB');
            }
        }

        // Update Leaderboard
        const leaderboard = spacetime.getLeaderboard();
        if (leaderboard.length > 0) {
            // We could store this in a dedicated leaderboard store or 
            // just keep it in the spacetime service for components to fetch.
        }
    });
};
