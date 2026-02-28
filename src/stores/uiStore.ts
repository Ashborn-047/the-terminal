import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI State Store — per frontend_architecture.md §4.1
 * Manages ephemeral UI state: sidebar visibility, active view, theme.
 */
interface UIState {
    sidebarOpen: boolean;
    activeView: 'dashboard' | 'curriculum' | 'achievements' | 'settings';
    onboardingStep: number; // 0 = not started, 1 = welcome, 2 = intro, 3 = first lab, 4 = completed
    onboardingComplete: boolean;

    toggleSidebar: () => void;
    setActiveView: (view: UIState['activeView']) => void;
    setOnboardingStep: (step: number) => void;
    completeOnboarding: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            activeView: 'dashboard',
            onboardingStep: 0,
            onboardingComplete: false,

            toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
            setActiveView: (view) => set({ activeView: view }),
            setOnboardingStep: (step) => set({ onboardingStep: step }),
            completeOnboarding: () => set({ onboardingComplete: true, onboardingStep: 4 }),
        }),
        { name: 'the-terminal-ui' }
    )
);
