import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toastEmitter } from '../components/ToastNotification';
import { useUIStore } from './uiStore';

// ======================================================================
//  Level Titles — per gamification_framework.md §2.2
// ======================================================================
export const LEVEL_TITLES: Record<number, string> = {
    1: 'Terminal Novice',
    2: 'Command Rookie',
    3: 'File Explorer',
    4: 'Permission Apprentice',
    5: 'Process Watcher',
    6: 'User Manager',
    7: 'Network Learner',
    8: 'Service Controller',
    9: 'Software Installer',
    10: 'Storage Handler',
};

/** Returns level title; levels 11-20 → RHCSA Candidate, 21-30 → Linux Professional, 31+ → Terminal Master */
export function getLevelTitle(level: number): string {
    if (LEVEL_TITLES[level]) return LEVEL_TITLES[level];
    if (level <= 20) return 'RHCSA Candidate';
    if (level <= 30) return 'Linux Professional';
    return 'Terminal Master';
}

// ======================================================================
//  Level Formula — per gamification_framework.md §2.2
//  XP for Level N = 100 × N (for N ≤ 10)
//  Cumulative: L1=0, L2=100, L3=300, L4=600, L5=1000 ...
// ======================================================================
export function xpForLevel(level: number): number {
    if (level <= 1) return 0;
    if (level <= 10) {
        // Cumulative: sum of 100*(1) + 100*(2) + ... + 100*(level-1)
        // = 100 * sum(1..level-1) = 100 * (level-1)*level/2
        return 100 * ((level - 1) * level) / 2;
    }
    // Level 11+: base 4500 + 1000 per level above 10
    const base10 = 4500; // cumulative XP at level 10
    return base10 + (level - 10) * 1000;
}

export function levelFromXP(totalXp: number): number {
    // Iterate to find the highest level where xpForLevel(level) <= totalXp
    let level = 1;
    while (xpForLevel(level + 1) <= totalXp) level++;
    return level;
}

// ======================================================================
//  Achievement Definitions — per gamification_framework.md §2.4
// ======================================================================
export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: 'milestone' | 'skill-mastery' | 'exploration' | 'streak' | 'easter-egg';
    icon: string;
    hidden: boolean;
    xpReward: number;
    criteria: {
        type: 'counter' | 'event';
        target: string;
        threshold: number;
    };
}

export const ACHIEVEMENTS: Achievement[] = [
    // Milestone
    { id: 'first-command', name: 'First Command', description: 'Execute your first command', category: 'milestone', icon: '⌨️', hidden: false, xpReward: 10, criteria: { type: 'counter', target: 'commands-executed', threshold: 1 } },
    { id: 'first-lab', name: 'First Steps', description: 'Complete your first lab', category: 'milestone', icon: '🎯', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'labs-completed', threshold: 1 } },
    { id: 'explorer', name: 'Explorer', description: 'Complete 3 labs', category: 'milestone', icon: '🗺️', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'labs-completed', threshold: 3 } },
    { id: 'dedicated-learner', name: 'Dedicated Learner', description: 'Complete 5 labs', category: 'milestone', icon: '📚', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'labs-completed', threshold: 5 } },
    { id: 'ten-labs', name: 'Lab Rat', description: 'Complete 10 labs', category: 'milestone', icon: '🧪', hidden: false, xpReward: 150, criteria: { type: 'counter', target: 'labs-completed', threshold: 10 } },
    { id: 'level-5', name: 'Rising Star', description: 'Reach Level 5', category: 'milestone', icon: '⭐', hidden: false, xpReward: 100, criteria: { type: 'counter', target: 'level', threshold: 5 } },
    { id: 'level-10', name: 'Linux Veteran', description: 'Reach Level 10', category: 'milestone', icon: '🏆', hidden: false, xpReward: 250, criteria: { type: 'counter', target: 'level', threshold: 10 } },
    { id: 'root-access', name: 'Root Access', description: 'Reach Level 20', category: 'milestone', icon: '👑', hidden: false, xpReward: 500, criteria: { type: 'counter', target: 'level', threshold: 20 } },

    // Skill Mastery
    { id: 'navigator', name: 'Navigator', description: 'Use cd 10 times', category: 'skill-mastery', icon: '🧭', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'cd-count', threshold: 10 } },
    { id: 'file-creator', name: 'File Creator', description: 'Create 5 files', category: 'skill-mastery', icon: '📄', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'files-created', threshold: 5 } },
    { id: 'permission-master', name: 'Permission Master', description: 'Use chmod on 10 different files', category: 'skill-mastery', icon: '🔐', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'chmod-count', threshold: 10 } },
    { id: 'grep-guru', name: 'Grep Guru', description: 'Use grep 25 times', category: 'skill-mastery', icon: '🔍', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'grep-count', threshold: 25 } },
    { id: 'pipe-wizard', name: 'Pipe Wizard', description: 'Use 5 pipe chains', category: 'skill-mastery', icon: '🔗', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'pipe-count', threshold: 5 } },
    { id: 'command-master', name: 'Command Master', description: 'Use 25 unique commands', category: 'skill-mastery', icon: '🎓', hidden: false, xpReward: 100, criteria: { type: 'counter', target: 'unique-commands', threshold: 25 } },
    { id: 'process-terminator', name: 'Process Terminator', description: 'Use kill 5 times', category: 'skill-mastery', icon: '💀', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'kill-count', threshold: 5 } },

    // Exploration
    { id: 'man-reader', name: 'Man Page Reader', description: 'Read 5 different man pages', category: 'exploration', icon: '📖', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'man-pages-read', threshold: 5 } },
    { id: 'history-buff', name: 'Command Historian', description: 'Execute 100 commands', category: 'exploration', icon: '📜', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'commands-executed', threshold: 100 } },
    { id: 'night-owl', name: 'Night Owl', description: 'Complete a lab between midnight and 5am', category: 'exploration', icon: '🦉', hidden: false, xpReward: 50, criteria: { type: 'event', target: 'night-owl', threshold: 1 } },
    { id: 'early-bird', name: 'Early Bird', description: 'Complete a lab between 5am and 8am', category: 'exploration', icon: '🐦', hidden: false, xpReward: 50, criteria: { type: 'event', target: 'early-bird', threshold: 1 } },
    { id: 'speed-runner', name: 'Speed Runner', description: 'Complete a lab under par time', category: 'exploration', icon: '⚡', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'speed-bonus-count', threshold: 1 } },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Complete a lab without using any hints', category: 'exploration', icon: '🎯', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'perfect-lab-count', threshold: 1 } },

    // Streak
    { id: 'streak-3', name: 'Streak Starter', description: 'Maintain a 3-day streak', category: 'streak', icon: '✨', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'streak', threshold: 3 } },
    { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'streak', icon: '🔥', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'streak', threshold: 7 } },
    { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', category: 'streak', icon: '🌟', hidden: false, xpReward: 200, criteria: { type: 'counter', target: 'streak', threshold: 30 } },
    { id: 'streak-90', name: 'Marathon Runner', description: 'Maintain a 90-day streak', category: 'streak', icon: '🏅', hidden: false, xpReward: 500, criteria: { type: 'counter', target: 'streak', threshold: 90 } },

    // Easter Eggs
    { id: 'sandwich', name: 'Sudo Make Me a Sandwich', description: 'Try to make a sandwich', category: 'easter-egg', icon: '🥪', hidden: true, xpReward: 10, criteria: { type: 'event', target: 'sandwich-attempt', threshold: 1 } },
    { id: 'rm-rf-root', name: 'You Monster', description: 'Try to rm -rf /', category: 'easter-egg', icon: '💣', hidden: true, xpReward: 10, criteria: { type: 'event', target: 'rm-rf-root', threshold: 1 } },
];

// ======================================================================
//  Gamification Store — per gamification_framework.md
// ======================================================================
interface GamificationState {
    xp: number;
    level: number;
    totalXpEarned: number;
    streak: {
        current: number;
        longest: number;
        lastActivityDate: string | null;
        freezesRemaining: number;
    };
    counters: Record<string, number>;
    unlockedAchievements: string[];
    labsCompleted: number;
    hintsUsed: number;

    awardXP: (amount: number, silent?: boolean) => void;
    hintPenalty: () => void;
    processLabCompletion: (lab: any, progress: any) => void;
    getStreakMultiplier: () => number;
    updateStreak: () => void;
    incrementCounter: (target: string, amount?: number) => void;
    checkAchievements: () => string[]; // returns newly unlocked IDs
    getTitle: () => string;
    getXPProgress: () => { current: number; needed: number; percent: number };
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            totalXpEarned: 0,
            streak: {
                current: 0,
                longest: 0,
                lastActivityDate: null,
                freezesRemaining: 1,
            },
            counters: {},
            unlockedAchievements: [],
            labsCompleted: 0,
            hintsUsed: 0,

            awardXP: (amount, silent) => {
                const oldLevel = get().level;
                // Apply streak multiplier
                const multiplier = get().getStreakMultiplier();
                const boostedAmount = Math.round(amount * multiplier);

                if (boostedAmount === 0) return;

                set((state) => {
                    const newTotalXp = state.totalXpEarned + boostedAmount;
                    const newLevel = levelFromXP(newTotalXp);
                    return {
                        xp: state.xp + boostedAmount,
                        totalXpEarned: newTotalXp,
                        level: newLevel,
                    };
                });

                // Fire XP toast (show multiplier if active)
                if (!silent) {
                    const bonusText = multiplier > 1 ? ` (${multiplier}x streak bonus!)` : '';
                    toastEmitter.emit({ type: 'xp', title: `${boostedAmount > 0 ? '+' : ''}${boostedAmount} XP${bonusText}`, icon: boostedAmount > 0 ? '⚡' : '💡' });
                }

                // Fire level-up toast and modal if leveled up
                const newLevel = get().level;
                if (newLevel > oldLevel) {
                    // Show full celebration modal if not silent
                    if (!silent) {
                        useUIStore.getState().showLevelUp(newLevel);
                    }

                    toastEmitter.emit({
                        type: 'level-up',
                        title: `Level ${newLevel}!`,
                        message: getLevelTitle(newLevel),
                        icon: '🎖️',
                        duration: 5000,
                    });
                }
            },

            hintPenalty: () => {
                get().awardXP(-10, false);
                set((state) => ({ hintsUsed: state.hintsUsed + 1 }));
            },

            processLabCompletion: (lab, progress) => {
                if (!lab || !progress) return;

                // 1. Calculate base reward
                let finalXp = lab.xpReward;

                // 2. Apply Hint Penalties (10 XP per unique hint index used)
                const hintsCount = progress.hintsUsed?.length || 0;
                const hintPenalty = hintsCount * 10;

                // 3. Apply Speed Bonus
                let speedBonus = 0;
                const timeSpent = progress.totalTimeSpent || 0;
                if (lab.parTime && timeSpent <= lab.parTime) {
                    speedBonus = lab.parXpBonus || 50;
                    get().incrementCounter('speed-bonus-count');
                    toastEmitter.emit({ type: 'xp', title: `+${speedBonus} XP (Speed Bonus!)`, icon: '⚡' });
                }

                if (hintsCount > 0) {
                    toastEmitter.emit({ type: 'xp', title: `-${hintPenalty} XP (${hintsCount} hints used)`, icon: '💡' });
                }

                // Award total XP (Base - Penalty + Bonus)
                // Note: finalXp can go below base reward but we stay above 0
                const finalAmount = Math.max(0, finalXp - hintPenalty + speedBonus);
                get().awardXP(finalAmount);

                if (hintsCount === 0) {
                    get().incrementCounter('perfect-lab-count');
                }

                set((state) => ({ labsCompleted: state.labsCompleted + 1 }));
                get().updateStreak();
                get().checkAchievements();
            },

            getStreakMultiplier: () => {
                const { current } = get().streak;
                if (current >= 30) return 2.0;
                if (current >= 14) return 1.5;
                if (current >= 7) return 1.25;
                if (current >= 3) return 1.1;
                return 1.0;
            },

            updateStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const { streak } = get();

                if (streak.lastActivityDate === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                let newCurrent = 1;
                if (streak.lastActivityDate === yesterdayStr) {
                    newCurrent = streak.current + 1;
                } else if (streak.lastActivityDate && streak.lastActivityDate !== yesterdayStr) {
                    // Missed more than 1 day — check freeze
                    const lastDate = new Date(streak.lastActivityDate);
                    const dayDiff = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (dayDiff === 2 && streak.freezesRemaining > 0) {
                        // Use streak freeze
                        newCurrent = streak.current + 1;
                        set((s) => ({
                            streak: { ...s.streak, freezesRemaining: s.streak.freezesRemaining - 1 },
                        }));
                    }
                }

                set({
                    streak: {
                        current: newCurrent,
                        longest: Math.max(newCurrent, streak.longest),
                        lastActivityDate: today,
                        freezesRemaining: streak.freezesRemaining,
                    },
                });

                // Check streak milestones for bonus XP
                const streakBonuses: Record<number, number> = { 7: 100, 30: 500, 90: 1000 };
                if (streakBonuses[newCurrent]) {
                    get().awardXP(streakBonuses[newCurrent]);
                }
            },

            incrementCounter: (target, amount = 1) => {
                set((state) => ({
                    counters: {
                        ...state.counters,
                        [target]: (state.counters[target] || 0) + amount,
                    },
                }));
            },

            checkAchievements: () => {
                const state = get();
                const newlyUnlocked: string[] = [];

                for (const ach of ACHIEVEMENTS) {
                    if (state.unlockedAchievements.includes(ach.id)) continue;

                    let value = 0;
                    switch (ach.criteria.target) {
                        case 'labs-completed': value = state.labsCompleted; break;
                        case 'level': value = state.level; break;
                        case 'streak': value = state.streak.current; break;
                        default: value = state.counters[ach.criteria.target] || 0;
                    }

                    if (value >= ach.criteria.threshold) {
                        newlyUnlocked.push(ach.id);
                        // Award XP for the achievement
                        get().awardXP(ach.xpReward);
                    }
                }

                if (newlyUnlocked.length > 0) {
                    set((state) => ({
                        unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
                    }));
                    // Fire achievement toasts
                    for (const achId of newlyUnlocked) {
                        const ach = ACHIEVEMENTS.find(a => a.id === achId);
                        if (ach) {
                            toastEmitter.emit({
                                type: 'achievement',
                                title: `${ach.name} Unlocked!`,
                                message: `${ach.description} (+${ach.xpReward} XP)`,
                                icon: ach.icon,
                                duration: 5000,
                            });
                        }
                    }
                }

                return newlyUnlocked;
            },

            getTitle: () => getLevelTitle(get().level),

            getXPProgress: () => {
                const state = get();
                const currentLevelXP = xpForLevel(state.level);
                const nextLevelXP = xpForLevel(state.level + 1);
                const current = state.totalXpEarned - currentLevelXP;
                const needed = nextLevelXP - currentLevelXP;
                return { current, needed, percent: Math.round((current / needed) * 100) };
            },
        }),
        {
            name: 'the-terminal-gamification',
        }
    )
);
