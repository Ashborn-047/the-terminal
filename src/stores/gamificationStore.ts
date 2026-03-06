import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toastEmitter } from '../components/ToastNotification';
import { Lab, LabProgress } from '../features/lab-engine/types';
import { trackEvent } from '../utils/analytics';
import { useUIStore } from './uiStore';
import { spacetime } from '../lib/spacetime';
import { logger } from '../utils/logger';

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

const FIRST_LAB_BONUS = 500;

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
        return 100 * ((level - 1) * level) / 2;
    }
    const base10 = 4500; // cumulative XP at level 10
    return base10 + (level - 10) * 1000;
}

export function levelFromXP(totalXp: number): number {
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
    category: 'milestone' | 'skill-mastery' | 'exploration' | 'social' | 'streak' | 'easter-egg';
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
    { id: 'first-command', name: 'First Command', description: 'Execute your first command', category: 'milestone', icon: '⌨️', hidden: false, xpReward: 10, criteria: { type: 'counter', target: 'commands-executed', threshold: 1 } },
    { id: 'first-lab', name: 'First Steps', description: 'Complete your first lab', category: 'milestone', icon: '🎯', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'labs-completed', threshold: 1 } },
    { id: 'explorer', name: 'Explorer', description: 'Complete 3 labs', category: 'milestone', icon: '🗺️', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'labs-completed', threshold: 3 } },
    { id: 'dedicated-learner', name: 'Dedicated Learner', description: 'Complete 5 labs', category: 'milestone', icon: '📚', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'labs-completed', threshold: 5 } },
    { id: 'ten-labs', name: 'Lab Rat', description: 'Complete 10 labs', category: 'milestone', icon: '🧪', hidden: false, xpReward: 150, criteria: { type: 'counter', target: 'labs-completed', threshold: 10 } },
    { id: 'level-5', name: 'Rising Star', description: 'Reach Level 5', category: 'milestone', icon: '⭐', hidden: false, xpReward: 100, criteria: { type: 'counter', target: 'level', threshold: 5 } },
    { id: 'level-10', name: 'Linux Veteran', description: 'Reach Level 10', category: 'milestone', icon: '🏆', hidden: false, xpReward: 250, criteria: { type: 'counter', target: 'level', threshold: 10 } },
    { id: 'root-access', name: 'Root Access', description: 'Reach Level 20', category: 'milestone', icon: '👑', hidden: false, xpReward: 500, criteria: { type: 'counter', target: 'level', threshold: 20 } },
    { id: 'navigator', name: 'Navigator', description: 'Use cd 10 times', category: 'skill-mastery', icon: '🧭', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'cd-count', threshold: 10 } },
    { id: 'file-creator', name: 'File Creator', description: 'Create 5 files', category: 'skill-mastery', icon: '📄', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'files-created', threshold: 5 } },
    { id: 'permission-master', name: 'Permission Master', description: 'Use chmod on 10 different files', category: 'skill-mastery', icon: '🔐', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'chmod-count', threshold: 10 } },
    { id: 'grep-guru', name: 'Grep Guru', description: 'Use grep 25 times', category: 'skill-mastery', icon: '🔍', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'grep-count', threshold: 25 } },
    { id: 'pipe-wizard', name: 'Pipe Wizard', description: 'Use 5 pipe chains', category: 'skill-mastery', icon: '🔗', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'pipe-count', threshold: 5 } },
    { id: 'command-master', name: 'Command Master', description: 'Use 25 unique commands', category: 'skill-mastery', icon: '🎓', hidden: false, xpReward: 100, criteria: { type: 'counter', target: 'unique-commands', threshold: 25 } },
    { id: 'process-terminator', name: 'Process Terminator', description: 'Use kill 5 times', category: 'skill-mastery', icon: '💀', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'kill-count', threshold: 5 } },
    { id: 'man-reader', name: 'Man Page Reader', description: 'Read 5 different man pages', category: 'exploration', icon: '📖', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'man-pages-read', threshold: 5 } },
    { id: 'history-buff', name: 'Command Historian', description: 'Execute 100 commands', category: 'exploration', icon: '📜', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'commands-executed', threshold: 100 } },
    { id: 'night-owl', name: 'Night Owl', description: 'Complete a lab between midnight and 5am', category: 'exploration', icon: '🦉', hidden: false, xpReward: 50, criteria: { type: 'event', target: 'night-owl', threshold: 1 } },
    { id: 'early-bird', name: 'Early Bird', description: 'Complete a lab between 5am and 8am', category: 'exploration', icon: '🐦', hidden: false, xpReward: 50, criteria: { type: 'event', target: 'early-bird', threshold: 1 } },
    { id: 'speed-runner', name: 'Speed Runner', description: 'Complete a lab under par time', category: 'exploration', icon: '⚡', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'speed-bonus-count', threshold: 1 } },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Complete a lab without using any hints', category: 'exploration', icon: '🎯', hidden: false, xpReward: 50, criteria: { type: 'counter', target: 'perfect-lab-count', threshold: 1 } },
    { id: 'streak-3', name: 'Streak Starter', description: 'Maintain a 3-day streak', category: 'streak', icon: '✨', hidden: false, xpReward: 25, criteria: { type: 'counter', target: 'streak', threshold: 3 } },
    { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'streak', icon: '🔥', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'streak', threshold: 7 } },
    { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', category: 'streak', icon: '🌟', hidden: false, xpReward: 200, criteria: { type: 'counter', target: 'streak', threshold: 30 } },
    { id: 'streak-90', name: 'Marathon Runner', description: 'Maintain a 90-day streak', category: 'streak', icon: '🏅', hidden: false, xpReward: 500, criteria: { type: 'counter', target: 'streak', threshold: 90 } },
    { id: 'sandwich', name: 'Sudo Make Me a Sandwich', description: 'Try to make a sandwich', category: 'easter-egg', icon: '🥪', hidden: true, xpReward: 10, criteria: { type: 'event', target: 'sandwich-attempt', threshold: 1 } },
    { id: 'rm-rf-root', name: 'You Monster', description: 'Try to rm -rf /', category: 'easter-egg', icon: '💣', hidden: true, xpReward: 10, criteria: { type: 'event', target: 'rm-rf-root', threshold: 1 } },
    { id: 'social-butterfly', name: 'Social Butterfly', description: 'Send 50 chat messages', category: 'social', icon: '🦋', hidden: false, xpReward: 75, criteria: { type: 'counter', target: 'messages-sent', threshold: 50 } },
    { id: 'mentor', name: 'Mentor', description: 'Have your messages upvoted 10 times', category: 'social', icon: '🧑‍🏫', hidden: false, xpReward: 100, criteria: { type: 'counter', target: 'upvotes-received', threshold: 10 } },
    { id: 'completionist', name: 'Completionist', description: 'Complete all labs in a module', category: 'milestone', icon: '🏁', hidden: false, xpReward: 250, criteria: { type: 'counter', target: 'modules-completed', threshold: 1 } },
];

export type QuestType = 'earn_xp' | 'execute_commands' | 'complete_labs';

export interface DailyQuest {
    id: string;
    title: string;
    type: QuestType;
    target: number;
    progress: number;
    xpReward: number;
    completed: boolean;
    claimed: boolean;
}

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
    activityHistory: Record<string, number>;
    unlockedAchievements: string[];
    labsCompleted: number;
    hintsUsed: number;
    dailyQuests: DailyQuest[];
    lastQuestGenerationDate: string | null;

    awardXP: (amount: number, silent?: boolean) => void;
    hintPenalty: () => void;
    processLabCompletion: (lab: Lab, progress: LabProgress) => void;
    getStreakMultiplier: () => number;
    updateStreak: () => void;
    purchaseStreakFreeze: () => boolean;
    incrementCounter: (target: string, amount?: number) => void;
    checkAchievements: () => string[];
    getTitle: () => string;
    getXPProgress: () => { current: number; needed: number; percent: number };
    generateDailyQuests: () => void;
    updateQuestProgress: (type: QuestType, amount: number) => void;
    claimQuestReward: (questId: string) => void;
    setActivityHistory: (history: Record<string, number>) => void;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            totalXpEarned: 0,
            streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
            counters: {},
            activityHistory: {},
            unlockedAchievements: [],
            labsCompleted: 0,
            hintsUsed: 0,
            dailyQuests: [],
            lastQuestGenerationDate: null,

            awardXP: async (amount, silent) => {
                const oldLevel = get().level;
                const multiplier = get().getStreakMultiplier();
                const boostedAmount = Math.round(amount * multiplier);

                if (boostedAmount === 0) return;

                if (boostedAmount > 0) {
                    get().updateQuestProgress('earn_xp', boostedAmount);
                }

                // For simple XP awards that aren't labs, we might want a generic reducer.
                // For now, let's just update local state and consider adding an 'award_xp' reducer to the module if needed.
                // In a real app, this might be triggered by specific actions.
                set((state) => {
                    const nextXp = state.totalXpEarned + boostedAmount;
                    const today = new Date().toISOString().split('T')[0];
                    return {
                        xp: state.xp + boostedAmount,
                        totalXpEarned: nextXp,
                        level: levelFromXP(nextXp),
                        activityHistory: {
                            ...state.activityHistory,
                            [today]: (state.activityHistory?.[today] || 0) + boostedAmount
                        }
                    };
                });

                if (!silent) {
                    const bonusText = multiplier > 1 ? ` (${multiplier}x streak bonus!)` : '';
                    toastEmitter.emit({
                        type: 'xp',
                        title: `${boostedAmount > 0 ? '+' : ''}${boostedAmount} XP${bonusText}`,
                        icon: boostedAmount > 0 ? '⚡' : '💡'
                    });
                }

                const newLevel = get().level;
                if (newLevel > oldLevel) {
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

            processLabCompletion: async (lab, progress) => {
                if (!lab || !progress) return;

                let finalXp = lab.xpReward;
                const hintsCount = progress.hintsUsed?.length || 0;
                const hintPenalty = hintsCount * 10;
                const isFirstLab = get().labsCompleted === 0;

                if (isFirstLab) finalXp += FIRST_LAB_BONUS;

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

                const finalAmount = Math.max(0, finalXp - hintPenalty + speedBonus);

                // Perform optimistic local update first so UI reflects progress immediately
                set((state) => {
                    const nextXp = state.totalXpEarned + finalAmount;
                    return {
                        xp: state.xp + finalAmount,
                        totalXpEarned: nextXp,
                        level: levelFromXP(nextXp),
                        labsCompleted: state.labsCompleted + 1
                    };
                });
                console.log('LAB_DEBUG: processLabCompletion done', {
                    labsCompleted: get().labsCompleted,
                    xp: get().xp,
                    level: get().level
                });

                // CALL SPACETIME REDUCER (async sync)
                try {
                    await spacetime.completeLab(lab.id, BigInt(finalAmount));
                } catch (e) {
                    logger.error('Failed to sync lab completion to SpacetimeDB', { error: e });
                    // We don't revert local state for now to avoid jumpy UI, 
                    // persistence middleware will keep it locally.
                }

                if (hintsCount === 0) {
                    get().incrementCounter('perfect-lab-count');
                }

                trackEvent('lab_completed', {
                    labId: lab.id,
                    xpAwarded: finalAmount,
                    isFirstLab
                });

                get().updateStreak();
                get().checkAchievements();
                get().updateQuestProgress('complete_labs', 1);
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
                let freezeConsumed = false;
                if (streak.lastActivityDate === yesterdayStr) {
                    newCurrent = streak.current + 1;
                } else if (streak.lastActivityDate && streak.lastActivityDate !== yesterdayStr) {
                    const lastDate = new Date(streak.lastActivityDate);
                    const dayDiff = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (dayDiff === 2 && streak.freezesRemaining > 0) {
                        newCurrent = streak.current + 1;
                        freezeConsumed = true;
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
                        freezesRemaining: freezeConsumed ? streak.freezesRemaining - 1 : streak.freezesRemaining,
                    },
                });

                // Freeze consumed notification
                if (freezeConsumed) {
                    toastEmitter.emit({
                        type: 'info',
                        title: '❄️ Streak Freeze Used!',
                        message: 'Your streak was saved. Purchase another freeze from your profile.',
                        icon: '❄️',
                        duration: 5000,
                    });
                }

                // Streak milestone bonuses + notifications
                const streakBonuses: Record<number, number> = { 7: 100, 30: 500, 90: 1000 };
                if (streakBonuses[newCurrent]) {
                    get().awardXP(streakBonuses[newCurrent]);
                    toastEmitter.emit({
                        type: 'streak',
                        title: `🔥 ${newCurrent}-Day Streak!`,
                        message: `+${streakBonuses[newCurrent]} XP milestone bonus!`,
                        icon: '🔥',
                        duration: 5000,
                    });
                }
            },

            purchaseStreakFreeze: () => {
                const state = get();
                const FREEZE_COST = 200;
                if (state.xp < FREEZE_COST) {
                    toastEmitter.emit({ type: 'error', title: 'Not enough XP', message: `You need ${FREEZE_COST} XP to buy a streak freeze.`, icon: '❌', duration: 4000 });
                    return false;
                }
                if (state.streak.freezesRemaining >= 1) {
                    toastEmitter.emit({ type: 'info', title: 'Already Active', message: 'You already have a streak freeze active.', icon: '❄️', duration: 4000 });
                    return false;
                }
                set((s) => ({
                    xp: s.xp - FREEZE_COST,
                    totalXpEarned: s.totalXpEarned, // Don't subtract from totalXpEarned (it's a purchase)
                    streak: { ...s.streak, freezesRemaining: 1 },
                }));
                toastEmitter.emit({ type: 'xp', title: `-${FREEZE_COST} XP`, message: 'Streak Freeze activated! ❄️', icon: '❄️', duration: 4000 });
                return true;
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
                        get().awardXP(ach.xpReward);
                    }
                }

                if (newlyUnlocked.length > 0) {
                    set((state) => ({
                        unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
                    }));
                    for (const achId of newlyUnlocked) {
                        const ach = ACHIEVEMENTS.find(a => a.id === achId);
                        if (ach) {
                            trackEvent('achievement_unlocked', { achievementId: achId });
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

            generateDailyQuests: () => {
                const today = new Date().toISOString().split('T')[0];
                const state = get();
                if (state.lastQuestGenerationDate === today) return;

                const newQuests: DailyQuest[] = [
                    { id: `q1-${today}`, title: 'Gain 250 XP', type: 'earn_xp', target: 250, progress: 0, xpReward: 50, completed: false, claimed: false },
                    { id: `q2-${today}`, title: 'Complete 2 Labs', type: 'complete_labs', target: 2, progress: 0, xpReward: 100, completed: false, claimed: false },
                    { id: `q3-${today}`, title: 'Execute 50 Commands', type: 'execute_commands', target: 50, progress: 0, xpReward: 75, completed: false, claimed: false },
                ];

                set({ dailyQuests: newQuests, lastQuestGenerationDate: today });
            },

            updateQuestProgress: (type: QuestType, amount: number) => {
                set((state) => {
                    let updated = false;
                    const nextQuests = state.dailyQuests.map((q) => {
                        if (q.type === type && !q.completed) {
                            const newProgress = Math.min(q.target, q.progress + amount);
                            let justCompleted = false;

                            if (newProgress >= q.target && !q.completed) {
                                justCompleted = true;
                                updated = true;
                                toastEmitter.emit({
                                    type: 'achievement',
                                    title: 'Daily Quest Complete!',
                                    message: q.title,
                                    icon: '✨',
                                    duration: 6000
                                });
                            } else if (newProgress !== q.progress) {
                                updated = true;
                            }

                            return { ...q, progress: newProgress, completed: q.completed || justCompleted };
                        }
                        return q;
                    });

                    return updated ? { dailyQuests: nextQuests } : {};
                });
            },

            claimQuestReward: (questId: string) => {
                const q = get().dailyQuests.find(q => q.id === questId);
                if (q && q.completed && !q.claimed) {
                    set((state) => ({
                        dailyQuests: state.dailyQuests.map(quest => quest.id === questId ? { ...quest, claimed: true } : quest)
                    }));
                    get().awardXP(q.xpReward);
                }
            },

            setActivityHistory: (history: Record<string, number>) => {
                set({ activityHistory: history });
            },
        }),
        { name: 'the-terminal-gamification' }
    )
);
