import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { brokenSystemLabs } from '../data/labs/broken_systems';

export interface DailyLabRotation {
    labId: string;
    xpMultiplier: number;
}

interface QuestState {
    dailyQuests: DailyLabRotation[];
    lastRotationDate: string;
    
    // Actions
    rotateQuestsIfNecessary: () => void;
    getQuestMultiplier: (labId: string) => number;
}

/**
 * Simple deterministic seeded PRNG (mulberry32).
 * No external dependency needed — produces consistent results for the same seed.
 */
function seededRandom(seed: number): () => number {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Convert a date string to a numeric seed */
function dateToSeed(dateString: string): number {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return hash;
}

export const useQuestStore = create<QuestState>()(
    persist(
        (set, get) => ({
            dailyQuests: [],
            lastRotationDate: '',

            rotateQuestsIfNecessary: () => {
                // Determine current UTC Date (YYYY-MM-DD)
                const today = new Date();
                const dateString = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;

                const state = get();
                if (state.lastRotationDate === dateString && state.dailyQuests.length > 0) {
                    return; // Already rotated for today
                }

                // Deterministic rotation based on the date string
                // Everyone gets the same daily quests!
                const rng = seededRandom(dateToSeed(dateString));
                
                // Shuffle copy of the labs
                const shuffledLabs = [...brokenSystemLabs].sort(() => 0.5 - rng());
                
                // Pick top 2
                const selected = shuffledLabs.slice(0, 2).map((lab) => ({
                    labId: lab.id,
                    xpMultiplier: 2.0 // Double XP!
                }));

                set({
                    dailyQuests: selected,
                    lastRotationDate: dateString
                });
            },

            getQuestMultiplier: (labId: string) => {
                const state = get();
                const quest = state.dailyQuests.find(q => q.labId === labId);
                return quest ? quest.xpMultiplier : 1.0;
            }
        }),
        { name: 'the-terminal-quests' }
    )
);
