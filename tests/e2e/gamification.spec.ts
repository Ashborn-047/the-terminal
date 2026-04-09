import { test, expect } from '@playwright/test';
import { typeCommand } from './test-utils';

test.describe('Gamification and Social Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Inject state BEFORE navigation to ensure stores hydrate with the mock data
        await page.addInitScript(() => {
            localStorage.clear();
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: {
                    onboardingComplete: true,
                    username: 'guest',
                    onboardingStep: 4
                },
                version: 0
            }));
            // Mock gamification state if needed to trigger level up faster
            localStorage.setItem('the-terminal-gamification', JSON.stringify({
                state: {
                    xp: 90,
                    level: 1,
                    totalXpEarned: 90,
                    streak: { current: 1, longest: 1, lastActivityDate: null, freezesRemaining: 1 },
                    counters: {},
                    activityHistory: {},
                    unlockedAchievements: [],
                    labsCompleted: 0,
                    hintsUsed: 0,
                    dailyQuests: [],
                    lastQuestGenerationDate: null
                },
                version: 0
            }));
        });

        await page.goto('terminal');
        await page.waitForLoadState('networkidle');
    });

    test('should trigger level-up modal on XP threshold', async ({ page }) => {
        // We already have 90 XP from beforeEach injection
        await typeCommand(page, 'help');
        
        // Wait for Level Up Modal using robust test-id
        const levelUpModal = page.getByTestId('level-up-modal');
        await expect(levelUpModal).toBeVisible({ timeout: 20000 });
        
        // Verify Content
        await expect(levelUpModal.getByText(/Level Up!/i)).toBeVisible();
        await expect(levelUpModal.getByText(/2/)).toBeVisible(); // The new level
        
        // Close modal
        await page.getByRole('button', { name: /Continue Journey/i }).click();
        await expect(levelUpModal).not.toBeVisible();
    });

    test('should show achievement unlock notifications', async ({ page }) => {
        await typeCommand(page, 'help');

        // Verify Achievement Toast using robust test-id
        const toast = page.getByTestId('toast');
        await expect(toast).toBeVisible({ timeout: 20000 });
        await expect(toast).toContainText(/First Command Unlocked/i);
    });

    test('should earn streak rewards', async ({ page }) => {
        const sidebar = page.locator('aside');
        await expect(sidebar).toContainText(/1 Day Streak/i, { timeout: 20000 });
    });
});
