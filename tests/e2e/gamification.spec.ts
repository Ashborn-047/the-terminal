import { test, expect } from '@playwright/test';

test.describe('Gamification and Social Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await page.evaluate(() => {
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: {
                    onboardingComplete: true,
                    username: 'test_gamer',
                    onboardingStep: 4,
                    version: 0
                }
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
                    lastQuestGenerationDate: null,
                    version: 0
                }
            }));
        });
        await page.reload();
    });

    test('should trigger level-up modal on XP threshold', async ({ page }) => {
        // Navigate to a lab to earn the last 10 XP needed for Level 2
        await page.goto('lab/lab-2-1');

        const terminalInput = page.locator('input[type="text"]').last();
        await terminalInput.fill('pwd'); // Just to triggers steps
        await page.keyboard.press('Enter');

        // Complete the lab (assuming 1 step for test simplicity or mock completion)
        // For real test, we follow the lab steps
        await terminalInput.fill('touch hello.txt');
        await page.keyboard.press('Enter');

        // Verify Celebration Modal (since it's the first lab)
        await expect(page.getByText('First Lab Complete!')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('Leveled Up to 2!')).toBeVisible();
        await page.getByRole('button', { name: 'Continue Learning →' }).click();
    });

    test('should show achievement unlock notifications', async ({ page }) => {
        await page.goto('terminal');

        const terminalInput = page.locator('input[type="text"]').last();

        // Trigger "First Command" achievement
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');

        // Verify Toast §10 - Title is "{Name} Unlocked!"
        await expect(page.getByText('First Command Unlocked!')).toBeVisible();
    });

    test('should allow chat message sending and receiving', async ({ page }) => {
        // Unlock chat if needed (Progressive unlock §4)
        await page.evaluate(() => {
            localStorage.setItem('the-terminal-labs', JSON.stringify({
                state: {
                    labs: {},
                    progress: {
                        'lab-1-1': { status: 'completed' },
                        'lab-1-2': { status: 'completed' },
                        'lab-2-1': { status: 'completed' }
                    },
                    currentLabId: null,
                    version: 0
                }
            }));
            localStorage.setItem('the-terminal-gamification', JSON.stringify({
                state: {
                    xp: 500,
                    level: 5,
                    totalXpEarned: 500,
                    streak: { current: 3, longest: 3, lastActivityDate: null, freezesRemaining: 1 },
                    counters: {},
                    activityHistory: {},
                    unlockedAchievements: [],
                    labsCompleted: 3,
                    hintsUsed: 0,
                    dailyQuests: [],
                    lastQuestGenerationDate: null,
                    version: 0
                }
            }));
        });
        await page.reload();

        await page.goto('chat');
        await expect(page.getByPlaceholder('Type a message...')).toBeVisible();

        const chatInput = page.getByPlaceholder('Type a message...');
        await chatInput.fill('Hello world from E2E!');
        await page.keyboard.press('Enter');

        // Verify message appeared §2.4
        await expect(page.getByText('Hello world from E2E!')).toBeVisible();
    });
});
