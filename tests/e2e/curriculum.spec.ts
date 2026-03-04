import { test, expect } from '@playwright/test';

test.describe('Curriculum and Lab Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Skip onboarding for these tests by setting the flag in localStorage
        await page.goto('');
        await page.evaluate(() => {
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: {
                    onboardingComplete: true,
                    username: 'test_student',
                    onboardingStep: 4,
                    version: 0
                }
            }));
            localStorage.setItem('the-terminal-gamification', JSON.stringify({
                state: {
                    xp: 1000,
                    level: 5,
                    totalXpEarned: 1000,
                    streak: { current: 1, longest: 1, lastActivityDate: null, freezesRemaining: 1 },
                    counters: {},
                    activityHistory: {},
                    unlockedAchievements: [],
                    labsCompleted: 10,
                    hintsUsed: 0,
                    dailyQuests: [],
                    lastQuestGenerationDate: null,
                    version: 0
                }
            }));
        });
        await page.reload();
    });

    test('should navigate through curriculum and complete a guided lab', async ({ page }) => {
        // 1. Start from Labs Page
        await page.goto('labs');
        await expect(page.getByRole('heading', { name: 'Curriculum' })).toBeVisible({ timeout: 10000 });

        // 2. Click on the first lab card
        const labCard = page.getByRole('button', { name: 'START' }).first();
        await labCard.click();

        // 3. Verify Lab View
        await expect(page).toHaveURL(/\/lab\/lab-1-1/);
        await expect(page.getByText('Your First Command')).toBeVisible();

        // 4. Complete the guided steps
        // Step 1: pwd
        const terminalInput = page.locator('input[type="text"]').last();
        await terminalInput.fill('pwd');
        await page.keyboard.press('Enter');
        await expect(page.getByText('Nice! /home/test_student')).toBeVisible();

        // Step 2: ls
        await terminalInput.fill('ls');
        await page.keyboard.press('Enter');

        // 5. Verify Lab Completion Modal (CelebrationModal)
        await expect(page.getByRole('heading', { name: 'Lab Complete!' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('+50 XP').nth(1)).toBeVisible();

        // 6. Navigate back to Dashboard
        await page.getByRole('button', { name: 'View Dashboard' }).click({ force: true });
        await expect(page).toHaveURL(/\/$/);
    });

    test('should complete a DIY lab with verification conditions', async ({ page }) => {
        // Directly go to a DIY lab (Module 1, Lab 2)
        await page.goto('lab/lab-1-2');
        await expect(page.getByText('Navigation Challenge')).toBeVisible();

        // Perform the required actions in terminal
        const terminalInput = page.locator('input[type="text"]').last();

        // Task: Create /home/guest/workspace (actual condition in initial.ts)
        await terminalInput.fill('mkdir -p /home/test_student/workspace');
        await page.keyboard.press('Enter');

        // Click Verify button
        await page.getByRole('button', { name: 'VERIFY LAB' }).click();

        // Success message and Modal
        await expect(page.getByRole('heading', { name: 'Lab Complete!' })).toBeVisible();
    });
});
