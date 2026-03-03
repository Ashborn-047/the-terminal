import { test, expect } from '@playwright/test';

test.describe('Gamification and Social Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('ui-storage', JSON.stringify({
                state: {
                    onboardingCompleted: true,
                    username: 'test_gamer',
                    onboardingStep: 4
                }
            }));
            // Mock gamification state if needed to trigger level up faster
            localStorage.setItem('gamification-storage', JSON.stringify({
                state: {
                    xp: 90,
                    level: 1,
                    streak: 1,
                    achievements: []
                }
            }));
        });
        await page.reload();
    });

    test('should trigger level-up modal on XP threshold', async ({ page }) => {
        // Navigate to a lab to earn the last 10 XP needed for Level 2
        await page.goto('/lab/lab-2-1');

        const terminalInput = page.locator('input[type="text"]').last();
        await terminalInput.fill('pwd'); // Just to triggers steps
        await page.keyboard.press('Enter');

        // Complete the lab (assuming 1 step for test simplicity or mock completion)
        // For real test, we follow the lab steps
        await terminalInput.fill('touch hello.txt');
        await page.keyboard.press('Enter');

        // Verify Level Up Modal §6.2.4
        await expect(page.getByText('Level Up!')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('Level 2')).toBeVisible();
        await page.getByRole('button', { name: 'Awesome!' }).click();
    });

    test('should show achievement unlock notifications', async ({ page }) => {
        await page.goto('/terminal');

        const terminalInput = page.locator('input[type="text"]').last();

        // Trigger "First Command" achievement
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');

        // Verify Toast §10
        await expect(page.getByText('Achievement Unlocked!')).toBeVisible();
        await expect(page.getByText('First Command')).toBeVisible();
    });

    test('should allow chat message sending and receiving', async ({ page }) => {
        // Unlock chat if needed (Progressive unlock §4)
        await page.evaluate(() => {
            const labStore = JSON.parse(localStorage.getItem('lab-storage') || '{"state":{"completedLabs":[]}}');
            labStore.state.completedLabs = ['lab-1-1', 'lab-1-2', 'lab-2-1'];
            localStorage.setItem('lab-storage', JSON.stringify(labStore));
        });
        await page.reload();

        await page.goto('/chat');
        await expect(page.getByPlaceholder('Type a message...')).toBeVisible();

        const chatInput = page.getByPlaceholder('Type a message...');
        await chatInput.fill('Hello world from E2E!');
        await page.keyboard.press('Enter');

        // Verify message appeared §2.4
        await expect(page.getByText('Hello world from E2E!')).toBeVisible();
    });
});
