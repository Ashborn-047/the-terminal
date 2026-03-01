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
    recordHintUsage: (labId: string, stepIndex: number) => void;
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

                const now = Date.now();
                set((state) => ({
                    currentLabId: labId,
                    progress: {
                        ...state.progress,
                        [labId]: state.progress[labId] || {
                            labId,
                            status: 'in-progress',
                            currentStepIndex: 0,
                            verified: false,
                            hintsUsed: [],
                            startTime: now,
                            totalTimeSpent: 0
                        },
                    },
                }));

                // If resuming, update startTime to now
                const currentProgress = get().progress[labId];
                if (currentProgress && currentProgress.status === 'in-progress') {
                    set((state) => ({
                        progress: {
                            ...state.progress,
                            [labId]: { ...currentProgress, startTime: now }
                        }
                    }));
                }
            },

            updateProgress: (labId, updates) => set((state) => ({
                progress: {
                    ...state.progress,
                    [labId]: { ...state.progress[labId], ...updates },
                },
            })),

            completeLab: (labId) => {
                const lab = get().labs[labId];
                const p = get().progress[labId];
                if (!lab || !p) return;

                const now = Date.now();
                const sessionTime = p.startTime ? Math.floor((now - p.startTime) / 1000) : 0;
                const totalTime = (p.totalTimeSpent || 0) + sessionTime;

                set((state) => ({
                    currentLabId: null, // exit lab on completion
                    progress: {
                        ...state.progress,
                        [labId]: {
                            ...p,
                            status: 'completed',
                            completedAt: now,
                            verified: true,
                            totalTimeSpent: totalTime,
                            startTime: undefined // Clear session start
                        },
                    },
                }));
            },

            recordHintUsage: (labId, stepIndex) => {
                const p = get().progress[labId];
                if (!p || p.hintsUsed?.includes(stepIndex)) return;

                set((state) => ({
                    progress: {
                        ...state.progress,
                        [labId]: {
                            ...p,
                            hintsUsed: [...(p.hintsUsed || []), stepIndex]
                        }
                    }
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
                            hintsUsed: [],
                            startTime: Date.now(),
                            totalTimeSpent: 0
                        },
                    },
                }));
            },

            exitLab: () => {
                const labId = get().currentLabId;
                if (labId) {
                    const p = get().progress[labId];
                    if (p && p.status === 'in-progress') {
                        const now = Date.now();
                        const sessionTime = p.startTime ? Math.floor((now - p.startTime) / 1000) : 0;
                        const totalTime = (p.totalTimeSpent || 0) + sessionTime;

                        set((state) => ({
                            progress: {
                                ...state.progress,
                                [labId]: {
                                    ...p,
                                    totalTimeSpent: totalTime,
                                    startTime: undefined
                                }
                            }
                        }));
                    }
                }
                set({ currentLabId: null });
            },

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
