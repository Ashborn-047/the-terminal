// src/stores/hardcoreStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useGamificationStore } from './gamificationStore';
import { toastEmitter } from '../components/ToastNotification';
import { HardcoreProfile } from '../features/lab-engine/hardcore';

interface HardcoreState {
    profile: HardcoreProfile | null;
    enableHardcore: () => void;
    registerDeath: (reason: string) => void;
    disableHardcore: () => void;
}

export const useHardcoreStore = create<HardcoreState>()(
    persist(
        (set, get) => ({
            profile: null,

            enableHardcore: () => set({
                profile: {
                    isActive: true,
                    deathCount: 0,
                    currentSessionStarted: Date.now(),
                    protectedPaths: ['/bin', '/boot', '/dev', '/etc', '/lib', '/proc', '/sys', '/usr'],
                }
            }),

            registerDeath: (reason: string) => {
                set((state) => {
                    if (!state.profile) return state;

                    // Trigger XP reset in the main store
                    useGamificationStore.getState().resetXpOnDeath();

                    toastEmitter.emit({
                        type: 'error',
                        title: '💀 [HARDCORE] YOU HAVE DIED',
                        message: `Reason: ${reason}. All progress lost.`,
                        duration: 8000
                    });

                    return {
                        profile: {
                            ...state.profile,
                            deathCount: state.profile.deathCount + 1,
                            currentSessionStarted: Date.now(), // Reset session timer
                        }
                    };
                });
            },

            disableHardcore: () => set({ profile: null }),
        }),
        { name: 'the-terminal-hardcore' }
    )
);
