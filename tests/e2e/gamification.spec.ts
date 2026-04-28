import { test, expect } from '@playwright/test';
import { typeCommand, waitForEngineReady, injectStandardFixtures } from './test-utils';

test.describe('Gamification and Social Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Inject state BEFORE navigation to ensure stores hydrate with the mock data
        await injectStandardFixtures(page, {
            ui: {
                onboardingComplete: true,
                username: 'guest',
                onboardingStep: 4
            },
            gamification: {
                xp: 140,
                level: 1,
                totalXpEarned: 140,
                streak: { current: 1, longest: 1, lastActivityDate: null, freezesRemaining: 1 }
            }
        });

        await page.goto('terminal');
        await page.waitForLoadState('networkidle');

        // Wait for store hydration and engine readiness
        await page.waitForFunction(() => {
            const ui = localStorage.getItem('the-terminal-ui');
            return ui && JSON.parse(ui).state.onboardingComplete;
        });
        await waitForEngineReady(page);
    });

    test('should trigger level-up modal on XP threshold', async ({ page }) => {
        // We already have 90 XP from beforeEach injection
        await typeCommand(page, 'help');
        
        // Wait for Level Up Modal using robust test-id
        const levelUpModal = page.getByTestId('level-up-modal');
        await expect(levelUpModal).toBeVisible({ timeout: 30000 });
        
        // Verify Content
        await expect(levelUpModal.getByText(/Level Up!/i)).toBeVisible();
        await expect(levelUpModal.getByText(/2/)).toBeVisible(); // The new level
        
        // Close modal
        await page.getByRole('button', { name: /Continue Journey/i }).click();
        await expect(levelUpModal).not.toBeVisible();
    });

    test('should show achievement unlock notifications', async ({ page }) => {
        await typeCommand(page, 'help');

        // Verify Achievement Toast using robust test-id and correct text filtering
        const toast = page.getByTestId('toast').filter({ hasText: /First Command Unlocked/i });
        await expect(toast).toBeVisible({ timeout: 30000 });
    });

    test('should earn streak rewards', async ({ page }) => {
        const sidebar = page.locator('aside');
        await expect(sidebar).toContainText(/1 Day Streak/i, { timeout: 20000 });
    });
});
