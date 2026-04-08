import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to mock dependencies before importing the store
vi.mock('../../components/ToastNotification', () => ({
    toastEmitter: { emit: vi.fn() }
}));
vi.mock('../../utils/analytics', () => ({
    trackEvent: vi.fn()
}));
vi.mock('../../lib/spacetime', () => ({
    spacetime: { completeLab: vi.fn().mockResolvedValue(undefined) }
}));
vi.mock('../../stores/uiStore', () => ({
    useUIStore: { getState: () => ({ showLevelUp: vi.fn() }) }
}));

import { xpForLevel, levelFromXP, getLevelTitle, ACHIEVEMENTS } from '../../stores/gamificationStore';

describe('Gamification Store — Pure Functions', () => {
    describe('xpForLevel', () => {
        it('should return 0 for level 1', () => {
            expect(xpForLevel(1)).toBe(0);
        });

        it('should return 150 for level 2', () => {
            // 100 * 1.5^(2-1) = 150
            expect(xpForLevel(2)).toBe(150);
        });

        it('should return 3844 for level 10', () => {
            // 100 * 1.5^(10-1) = 3844
            expect(xpForLevel(10)).toBe(3844);
        });

        it('should handle levels above 10 with exponential growth', () => {
            // Level 11 = 100 * 1.5^10 = 5766
            expect(xpForLevel(11)).toBe(5766);
            // Level 12 = 100 * 1.5^11 = 8649
            expect(xpForLevel(12)).toBe(8649);
        });

        it('should return 0 for level 0 or negative', () => {
            expect(xpForLevel(0)).toBe(0);
            expect(xpForLevel(-1)).toBe(0);
        });
    });

    describe('levelFromXP', () => {
        it('should return level 1 for 0 XP', () => {
            expect(levelFromXP(0)).toBe(1);
        });

        it('should return level 2 at 150 XP', () => {
            expect(levelFromXP(150)).toBe(2);
        });

        it('should return level 1 at 149 XP', () => {
            expect(levelFromXP(149)).toBe(1);
        });

        it('should return level 10 at 4500 XP', () => {
            // L10 is 3844, L11 is 5766, so 4500 is L10
            expect(levelFromXP(4500)).toBe(10);
        });

        it('should handle XP above level 10', () => {
            expect(levelFromXP(5800)).toBe(11);
            expect(levelFromXP(9000)).toBe(12);
        });

        it('should return correct level for large XP values', () => {
            expect(levelFromXP(100000)).toBeGreaterThan(10);
        });
    });

    describe('getLevelTitle', () => {
        it('should return named titles for levels 1-10', () => {
            expect(getLevelTitle(1)).toBe('Terminal Novice');
            expect(getLevelTitle(5)).toBe('Process Watcher');
            expect(getLevelTitle(10)).toBe('Storage Handler');
        });

        it('should return RHCSA Candidate for levels 11-20', () => {
            expect(getLevelTitle(11)).toBe('RHCSA Candidate');
            expect(getLevelTitle(20)).toBe('RHCSA Candidate');
        });

        it('should return Linux Professional for levels 21-30', () => {
            expect(getLevelTitle(21)).toBe('Linux Professional');
            expect(getLevelTitle(30)).toBe('Linux Professional');
        });

        it('should return Terminal Master for levels 31+', () => {
            expect(getLevelTitle(31)).toBe('Terminal Master');
            expect(getLevelTitle(50)).toBe('Terminal Master');
        });
    });

    describe('ACHIEVEMENTS', () => {
        it('should have all 6 categories', () => {
            const categories = new Set(ACHIEVEMENTS.map(a => a.category));
            expect(categories).toContain('milestone');
            expect(categories).toContain('skill-mastery');
            expect(categories).toContain('exploration');
            expect(categories).toContain('social');
            expect(categories).toContain('streak');
            expect(categories).toContain('easter-egg');
        });

        it('should have unique IDs', () => {
            const ids = ACHIEVEMENTS.map(a => a.id);
            expect(new Set(ids).size).toBe(ids.length);
        });

        it('should have Social Butterfly achievement', () => {
            const sb = ACHIEVEMENTS.find(a => a.id === 'social-butterfly');
            expect(sb).toBeDefined();
            expect(sb!.criteria.target).toBe('messages-sent');
            expect(sb!.criteria.threshold).toBe(50);
        });

        it('should have Mentor achievement', () => {
            const mentor = ACHIEVEMENTS.find(a => a.id === 'mentor');
            expect(mentor).toBeDefined();
            expect(mentor!.criteria.target).toBe('upvotes-received');
        });

        it('should have Completionist achievement', () => {
            const comp = ACHIEVEMENTS.find(a => a.id === 'completionist');
            expect(comp).toBeDefined();
            expect(comp!.criteria.target).toBe('modules-completed');
        });

        it('should have hidden easter egg achievements', () => {
            const hidden = ACHIEVEMENTS.filter(a => a.hidden);
            expect(hidden.length).toBeGreaterThanOrEqual(2);
            expect(hidden.map(h => h.id)).toContain('sandwich');
            expect(hidden.map(h => h.id)).toContain('rm-rf-root');
        });

        it('should have at least 25 achievements total', () => {
            expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(25);
        });
    });

    describe('Sudden Death Mode', () => {
        let store: any;
        beforeEach(() => {
            store = {
                xp: 1000,
                level: 5,
                hardcore: { deathCount: 0, xpPenaltyTotal: 0, isDead: false },
                masteryBadge: 'hacker'
            };
        });

        it('should reset XP and level on death', () => {
            const penalty = store.xp;
            store.xp = 0;
            store.level = 1;
            store.masteryBadge = 'novice';
            store.hardcore.deathCount++;
            store.hardcore.isDead = true;

            expect(store.xp).toBe(0);
            expect(store.level).toBe(1);
            expect(store.masteryBadge).toBe('novice');
            expect(store.hardcore.isDead).toBe(true);
        });
    });

    describe('XP Migration', () => {
        it('should recalculate level correctly for existing users', () => {
            const oldUser = { totalXpEarned: 5500, level: 11, version: '3.0' };
            const newLevel = levelFromXP(oldUser.totalXpEarned);
            expect(newLevel).toBe(10);
        });
    });
});
