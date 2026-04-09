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
        // Trigger a fake activity or command to earn remaining XP
        await typeCommand(page, 'help');
        
        // Wait for Level Up Modal to appear in DOM
        const levelUpHeading = page.getByRole('heading', { name: /LEVEL UP/i });
        await expect(levelUpHeading).toBeVisible({ timeout: 20000 });
        
        // Verify current level in modal
        await expect(page.getByText(/Level 2/i).first()).toBeVisible();
        
        // Close modal
        await page.getByRole('button', { name: /Sweet/i }).click();
        await expect(levelUpHeading).not.toBeVisible();
    });

    test('should show achievement unlock notifications', async ({ page }) => {
        // Trigger "First Command" achievement by typing something
        // Note: The system might already know we used 'help' in the previous test IF state persisted,
        // but beforeEach does localStorage.clear() so it's fresh.
        await typeCommand(page, 'help');

        // Verify Achievement Toast appears
        // Sonner toasts usually have .sonner-toast class or specific role
        // We wait up to 20s because CI environment is slow
        const toast = page.locator('.sonner-toast');
        await expect(toast).toContainText(/First Command Unlocked/i, { timeout: 20000 });
        
        // Optional: Verify achievement is also visible in dashboard/sidebar stats
    });

    test('should earn streak rewards', async ({ page }) => {
        // This test verifies the streak logic is active
        const sidebar = page.locator('aside');
        await expect(sidebar).toContainText(/1 Day Streak/i, { timeout: 20000 });
        
        // Mock a streak update if needed - for now just check initial visibility
    });
});
