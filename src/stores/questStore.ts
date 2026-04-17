import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import seedrandom from 'seedrandom';
import { brokenSystemLabs } from '../data/labs/broken_systems';

export interface DailyQuest {
    labId: string;
    xpMultiplier: number;
}

interface QuestState {
    dailyQuests: DailyQuest[];
    lastRotationDate: string;
    
    // Actions
    rotateQuestsIfNecessary: () => void;
    getQuestMultiplier: (labId: string) => number;
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
                const rng = seedrandom(dateString);
                
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
