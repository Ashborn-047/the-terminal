import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lab, LabProgress } from '../features/lab-engine/types';

/**
 * Lab Store — per lab_engine_documentation.md
 * Manages lab definitions, progress tracking, and current active lab.
 * Now includes resetLab and exitLab functionality.
 */
interface LabState {
    labs: Record<string, Lab>;
    progress: Record<string, LabProgress>;
    currentLabId: string | null;

    setLabs: (labs: Record<string, Lab>) => void;
    startLab: (labId: string) => void;
    updateProgress: (labId: string, updates: Partial<LabProgress>) => void;
    completeLab: (labId: string) => void;
    resetLab: (labId: string) => void;
    exitLab: () => void;
    getCurrentLab: () => Lab | null;
}

export const useLabStore = create<LabState>()(
    persist(
        (set, get) => ({
            labs: {},
            progress: {},
            currentLabId: null,

            setLabs: (labs) => set({ labs }),

            startLab: (labId) => {
                const lab = get().labs[labId];
                if (!lab) return;

                set((state) => ({
                    currentLabId: labId,
                    progress: {
                        ...state.progress,
                        [labId]: state.progress[labId] || {
                            labId,
                            status: 'in-progress',
                            currentStepIndex: 0,
                            verified: false,
                        },
                    },
                }));
            },

            updateProgress: (labId, updates) => set((state) => ({
                progress: {
                    ...state.progress,
                    [labId]: { ...state.progress[labId], ...updates },
                },
            })),

            completeLab: (labId) => {
                const lab = get().labs[labId];
                if (!lab) return;

                set((state) => ({
                    currentLabId: null, // exit lab on completion
                    progress: {
                        ...state.progress,
                        [labId]: {
                            ...state.progress[labId],
                            status: 'completed',
                            completedAt: Date.now(),
                            verified: true,
                        },
                    },
                }));
            },

            resetLab: (labId) => {
                set((state) => ({
                    progress: {
                        ...state.progress,
                        [labId]: {
                            labId,
                            status: 'in-progress',
                            currentStepIndex: 0,
                            verified: false,
                        },
                    },
                }));
            },

            exitLab: () => set({ currentLabId: null }),

            getCurrentLab: () => {
                const { labs, currentLabId } = get();
                return currentLabId ? labs[currentLabId] : null;
            },
        }),
        {
            name: 'the-terminal-labs',
        }
    )
);
