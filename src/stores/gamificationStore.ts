import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toastEmitter } from '../components/ToastNotification';
import { Lab, LabProgress } from '../features/lab-engine/types';
import { trackEvent } from '../utils/analytics';
import { useUIStore } from './uiStore';
import { spacetime } from '../lib/spacetime';
import { logger } from '../utils/logger';
import { HardcoreProfile, MasteryBadge } from '../features/lab-engine/hardcore';
import { XP_BASE, XP_MULTIPLIER, STREAK_BONUS_TIERS, HARDCORE_XP_MULTIPLIER, BASE_LAB_XP, DIFFICULTY_MULTIPLIERS } from '../config/progression';
import { DifficultyMode } from '../features/lab-engine/types';
import { useQuestStore } from './questStore';
import { useHardcoreStore } from './hardcoreStore';
import { VFS } from '../features/vfs/vfs';
import { VerificationEngine } from '../features/lab-engine/verification';

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

/** Returns level title; levels 11-20 → Linux Associate, 21-30 → Linux Professional, 31+ → Terminal Master */
export function getLevelTitle(level: number): string {
    if (LEVEL_TITLES[level]) return LEVEL_TITLES[level];
    if (level <= 20) return 'Linux Associate';
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
    return Math.floor(XP_MULTIPLIER * Math.pow(XP_BASE, level - 1));
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

export type QuestType = 'earn_xp' | 'execute_commands' | 'complete_labs' | 'complete_module' | 'find_easter_egg' | 'reach_level';

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
    difficultyMode: DifficultyMode;
    streak: {
        current: number;
        longest: number;
        lastActivityDate: string | null;
        freezesRemaining: number;
    };
    counters: Record<string, number>;
    activityHistory: Record<string, number>;
    unlockedAchievements: string[];
    completedChapterIds: string[];
    labsCompleted: number;
    hintsUsed: number;
    dailyQuests: DailyQuest[];
    lastQuestGenerationDate: string | null;
    version: string;
    needsMigrationNotice: boolean;
    
    questTemplates: {
        type: QuestType;
        title: string;
        baseTarget: number;
        xpReward: number;
    }[];

    // Phase 3.3: Mastery
    masteryBadge: MasteryBadge;
    labCompletionHistory: Record<string, { completions: number; lastCompleted: number }>;

    addXp: (amount: number) => void;
    triggerDeath: (reason: string) => void;
    resetXpOnDeath: () => void;
    setMigrationNotice: (val: boolean) => void;
    awardXP: (amount: number, silent?: boolean) => void;
    hintPenalty: () => void;
    processLabCompletion: (labId: string, lab: Lab, vfs: VFS) => void;
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
    migrateUserLevels: () => void;
    dismissMigrationNotice: () => void;
    markChapterCompleted: (chapterId: string) => void;
    calculateReplayXp: (labId: string, baseXp: number) => number;
    calculateTotalXpGain: (totalBase: number) => number;
    setDifficultyMode: (mode: DifficultyMode) => void;
    spendXp: (amount: number) => boolean;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            totalXpEarned: 0,
            difficultyMode: 'NORMAL',
            streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
            counters: {},
            activityHistory: {},
            unlockedAchievements: [],
            completedChapterIds: [],
            labsCompleted: 0,
            hintsUsed: 0,
            dailyQuests: [],
            lastQuestGenerationDate: null,
            version: '3.1',
            needsMigrationNotice: false,
            masteryBadge: 'novice',
            labCompletionHistory: {},

            questTemplates: [
                { type: 'earn_xp', title: 'Gain {{target}} XP', baseTarget: 250, xpReward: 50 },
                { type: 'complete_labs', title: 'Complete {{target}} Labs', baseTarget: 1, xpReward: 100 },
                { type: 'execute_commands', title: 'Execute {{target}} Commands', baseTarget: 20, xpReward: 40 },
                { type: 'execute_commands', title: 'Terminal Mastery: {{target}} Commands', baseTarget: 50, xpReward: 100 },
                { type: 'complete_labs', title: 'Lab Marathon: {{target}} Labs', baseTarget: 3, xpReward: 250 },
                { type: 'earn_xp', title: 'XP Hunter: {{target}} XP', baseTarget: 1000, xpReward: 200 },
                { type: 'complete_module', title: 'Complete a Module ({{target}})', baseTarget: 1, xpReward: 300 },
                { type: 'find_easter_egg', title: 'Discover {{target}} hidden Easter Eggs', baseTarget: 1, xpReward: 150 },
                { type: 'reach_level', title: 'Level Up {{target}} time(s)', baseTarget: 1, xpReward: 200 },
            ],

            setDifficultyMode: (mode) => set({ difficultyMode: mode }),

            spendXp: (amount) => {
                const state = get();
                if (state.xp >= amount) {
                    set({ xp: state.xp - amount });
                    return true;
                }
                return false;
            },

            addXp: (amount) => {
                get().updateQuestProgress('earn_xp', amount);

                set((state) => {
                    const newXp = state.xp + amount;
                    let newLevel = state.level;
                    let leveledUp = false;
                    
                    while (newXp >= xpForLevel(newLevel + 1)) {
                        newLevel++;
                        leveledUp = true;
                    }

                    if (leveledUp) {
                        get().updateQuestProgress('reach_level', 1);
                    }

                    // Calculate badge
                    let badge: MasteryBadge = 'novice';
                    if (newLevel >= 40) badge = 'kernel_master';
                    else if (newLevel >= 30) badge = 'sysad';
                    else if (newLevel >= 20) badge = 'hacker';

                    return { 
                        xp: newXp, 
                        level: newLevel,
                        masteryBadge: badge
                    };
                });
            },

            triggerDeath: (reason) => {
                useHardcoreStore.getState().registerDeath(reason);
            },

            resetXpOnDeath: () => set({ 
                xp: 0, 
                totalXpEarned: 0, 
                level: 1, 
                masteryBadge: 'novice' 
            }),

            setMigrationNotice: (val) => set({ needsMigrationNotice: val }),

            awardXP: async (amount, silent) => {
                const oldTotalXp = get().totalXpEarned;
                const oldLevel = get().level;
                const multiplier = get().getStreakMultiplier();
                const boostedAmount = Math.round(amount * multiplier);

                if (boostedAmount === 0) return { oldXp: oldTotalXp, newXp: oldTotalXp, gain: 0 };

                if (boostedAmount > 0) {
                    get().updateQuestProgress('earn_xp', boostedAmount);
                }

                const progressBefore = get().getXPProgress();

                set((state) => {
                    const nextXp = state.totalXpEarned + boostedAmount;
                    const today = new Date().toISOString().split('T')[0];
                    const nextLevel = levelFromXP(nextXp);
                    return {
                        xp: state.xp + boostedAmount,
                        totalXpEarned: nextXp,
                        level: nextLevel,
                        activityHistory: {
                            ...state.activityHistory,
                            [today]: (state.activityHistory?.[today] || 0) + boostedAmount
                        }
                    };
                });

                const progressAfter = get().getXPProgress();
                const newLevel = get().level;
                const newTotalXp = get().totalXpEarned;

                if (!silent && multiplier > 1) {
                    toastEmitter.emit({
                        type: 'streak',
                        title: 'Streak Multiplier!',
                        message: `${multiplier}x streak bonus applied!`,
                        icon: '🔥',
                    });
                }

                if (newLevel > oldLevel && !silent) {
                    useUIStore.getState().showLevelUp(newLevel);
                    // Level-up toast removed as requested. SuccessAnimation or LevelUp modal should handle visuals.
                }

                return {
                    oldXp: oldTotalXp,
                    newXp: newTotalXp,
                    gain: boostedAmount
                };
            },

            hintPenalty: () => {
                get().awardXP(-10, false);
                set((state) => ({ hintsUsed: state.hintsUsed + 1 }));
            },

            processLabCompletion: async (labId: string, lab: Lab, vfs: VFS) => {
                const { labCompletionHistory } = get();
                const historyRecord = labCompletionHistory[labId];

                // 1. Calculate Base XP from difficulty
                const difficultyBonus = { NOVICE: 100, ADEPT: 250, EXPERT: 600, MASTER: 1500 };
                const baseXP = difficultyBonus[lab.difficulty || 'NOVICE'];

                // 2. Bonus Objectives Verification
                let bonusXP = 0;
                const objectivesCompleted: string[] = [];
                if (lab.bonusObjectives) {
                    const engine = new VerificationEngine(vfs);
                    for (const obj of lab.bonusObjectives) {
                        const { success } = engine.verify(obj.verification);
                        if (success) {
                            bonusXP += obj.xpReward;
                            objectivesCompleted.push(obj.id);
                        }
                    }
                }

                // 3. Handle Replay Cooling
                const xpAfterDiminishing = get().calculateReplayXp(labId, baseXP);
                const totalBase = xpAfterDiminishing + bonusXP;

                // 4. Apply Multipliers (Hardcore + Streak + Daily Quest)
                const questMultiplier = useQuestStore.getState().getQuestMultiplier(labId);
                const totalBaseWithQuest = totalBase * questMultiplier;

                // 5. Award XP and capture data (SILENTLY to avoid toast duplication)
                const xpResult = await get().awardXP(totalBaseWithQuest, true);

                // 6. Update Lab History (awardXP only handles XP/Level)
                set((state) => ({
                    labsCompleted: state.labsCompleted + 1,
                    labCompletionHistory: {
                        ...state.labCompletionHistory,
                        [labId]: {
                            completions: (historyRecord?.completions || 0) + 1,
                            lastCompleted: Date.now()
                        }
                    }
                }));
                
                // SpacetimeDB Sync
                import('../lib/spacetime/index').then(({ spacetime }) => {
                    spacetime.completeLab(labId, BigInt(xpResult.gain));
                }).catch(err => console.error('[SPACETIME] Sync failed:', err));

                // Achievement & Quests
                get().updateQuestProgress('complete_labs', 1);
                get().updateStreak();
                get().checkAchievements();

                if (objectivesCompleted.length > 0) {
                    console.log(`[XP] Bonus Objectives Completed: ${objectivesCompleted.join(', ')}`);
                }

                return xpResult;
            },

            getStreakMultiplier: () => {
                const { current } = get().streak;
                const tier = STREAK_BONUS_TIERS.find(t => current >= t.minDays && current <= t.maxDays);
                return tier ? tier.multiplier : 1.0;
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
                    }
                }

                set((s) => ({
                    streak: {
                        current: newCurrent,
                        longest: Math.max(newCurrent, streak.longest),
                        lastActivityDate: today,
                        freezesRemaining: freezeConsumed ? s.streak.freezesRemaining - 1 : s.streak.freezesRemaining,
                    },
                }));

                if (freezeConsumed) {
                    toastEmitter.emit({
                        type: 'info',
                        title: '❄️ Streak Freeze Used!',
                        message: 'Your streak was saved.',
                        icon: '❄️',
                        duration: 5000,
                    });
                }
            },

            purchaseStreakFreeze: () => {
                const state = get();
                const FREEZE_COST = 200;
                if (state.xp < FREEZE_COST) return false;
                if (state.streak.freezesRemaining >= 1) return false;
                set((s) => ({
                    xp: s.xp - FREEZE_COST,
                    streak: { ...s.streak, freezesRemaining: 1 },
                }));
                return true;
            },

            incrementCounter: (target, amount = 1) => {
                if (target === 'commands-executed') {
                    get().updateQuestProgress('execute_commands', amount);
                }
                set((state) => ({
                    counters: {
                        ...state.counters,
                        [target]: (state.counters[target] || 0) + amount,
                    },
                }));
                get().checkAchievements();
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
                        
                        toastEmitter.emit({
                            type: 'achievement',
                            title: `${ach.name} Unlocked!`,
                            message: ach.description,
                            icon: ach.icon,
                            duration: 6000
                        });
                    }
                }

                if (newlyUnlocked.length > 0) {
                    set((state) => ({
                        unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
                    }));
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
                if (state.lastQuestGenerationDate === today && state.dailyQuests.length > 0) return;

                const { questTemplates, level } = state;
                const dailyCount = 3;
                
                // Shuffle and pick templates
                const shuffled = [...questTemplates].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, dailyCount);

                const newQuests: DailyQuest[] = selected.map((template, index) => {
                    // Scale target by level (roughly 10% increase per 5 levels)
                    const levelScale = 1 + Math.floor(level / 5) * 0.1;
                    const finalTarget = Math.round(template.baseTarget * levelScale);
                    const finalReward = Math.round(template.xpReward * levelScale);

                    return {
                        id: `q${index}-${today}`,
                        title: template.title.replace('{{target}}', finalTarget.toString()),
                        type: template.type,
                        target: finalTarget,
                        progress: 0,
                        xpReward: finalReward,
                        completed: false,
                        claimed: false
                    };
                });

                set({ dailyQuests: newQuests, lastQuestGenerationDate: today });
            },

            updateQuestProgress: (type: QuestType, amount: number) => {
                set((state) => {
                    let updated = false;
                    const nextQuests = state.dailyQuests.map((q) => {
                        if (q.type === type && !q.completed) {
                            const newProgress = Math.min(q.target, q.progress + amount);
                            if (newProgress !== q.progress) updated = true;
                            return { ...q, progress: newProgress, completed: newProgress >= q.target };
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

            migrateUserLevels: () => {
                const state = get();
                if (state.version === '3.1') return;
                
                const newLevel = levelFromXP(state.totalXpEarned);
                set({
                    level: newLevel,
                    needsMigrationNotice: true,
                    version: '3.1'
                });
            },

            dismissMigrationNotice: () => set({ needsMigrationNotice: false }),

            markChapterCompleted: (chapterId: string) => {
                if (get().completedChapterIds.includes(chapterId)) return;
                set(s => ({
                    completedChapterIds: [...s.completedChapterIds, chapterId]
                }));
            },

            calculateReplayXp: (labId: string, baseXp: number) => {
                const history = get().labCompletionHistory[labId];
                if (!history) return baseXp;

                const daysSince = (Date.now() - history.lastCompleted) / (1000 * 60 * 60 * 24);
                if (daysSince < 3) {
                    const multipliers = [1.0, 0.5, 0.25, 0.1];
                    const index = Math.min(history.completions, multipliers.length - 1);
                    return Math.floor(baseXp * multipliers[index]);
                }
                return baseXp;
            },

            calculateTotalXpGain: (totalBase: number) => {
                let multiplier = 1.0;
                
                // Difficulty Multiplier
                const diffMode = get().difficultyMode;
                if (diffMode && DIFFICULTY_MULTIPLIERS[diffMode]) {
                    multiplier *= DIFFICULTY_MULTIPLIERS[diffMode];
                }

                // Hardcore boost
                const hcProfile = useHardcoreStore.getState().profile;
                if (hcProfile?.isActive) multiplier *= HARDCORE_XP_MULTIPLIER;

                // Streak boost
                const streak = get().streak.current;
                const tier = STREAK_BONUS_TIERS.find(t => streak >= t.minDays && streak <= t.maxDays);
                if (tier) multiplier *= tier.multiplier;

                return Math.floor(totalBase * multiplier);
            }
        }),
        { name: 'the-terminal-gamification' }
    )
);
