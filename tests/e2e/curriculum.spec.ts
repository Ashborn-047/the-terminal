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
                    onboardingStep: 4, // Restored onboardingStep
                    labsCompleted: 0,
                },
                version: 0
            }));
            localStorage.setItem('the-terminal-gamification', JSON.stringify({
                state: {
                    xp: 0,
                    level: 1,
                    labsCompleted: 0, // labsCompleted is correctly located here
                    totalXpEarned: 0,
                    streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
                    counters: {},
                    activityHistory: {},
                    unlockedAchievements: [],
                    hintsUsed: 0,
                    dailyQuests: [],
                    lastQuestGenerationDate: null
                },
                version: 0
            }));
        });
        await page.reload();
    });

    test('should navigate through curriculum and complete a guided lab', async ({ page }) => {
        // 1. Start from Labs Page
        await page.goto('labs');
        await expect(page.getByRole('heading', { name: /FOUNDATIONS|Curriculum/i })).toBeVisible({ timeout: 10000 });

        // 2. Click on the first lab card
        const labCard = page.getByRole('button', { name: 'Start Lab' }).first();
        await labCard.click();

        // 3. Verify Lab View
        await expect(page).toHaveURL(/\/lab\/lab-1-1/);
        await expect(page.getByText('Your First Command')).toBeVisible();

        // 4. Complete the guided steps
        // Step 1: pwd
        const terminalInput = page.locator('input[type="text"]').last();
        await terminalInput.fill('pwd');
        await page.keyboard.press('Enter');
        await expect(page.getByText('/home/test_student')).toBeVisible({ timeout: 5000 });

        // Step 2: ls
        await terminalInput.fill('ls');
        await page.keyboard.press('Enter');

        // 5. Verify Lab Completion Modal (CelebrationModal — shown for first lab only)
        const modal = page.getByRole('heading', { name: 'First Lab Complete!' });
        await expect(modal).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('+50 XP').first()).toBeVisible();

        // 6. Navigate back to curriculum
        const continueBtn = page.getByRole('button', { name: /Continue Learning/i });
        await continueBtn.dispatchEvent('click');
        await expect(modal).not.toBeVisible();
        await expect(page).toHaveURL(/\/labs/, { timeout: 15000 });
    });

    test('should complete a DIY lab with verification conditions', async ({ page }) => {
        // Mock that we have already completed one lab to bypass CelebrationModal and test auto-navigation
        await page.addInitScript(() => {
            const uiState = JSON.parse(localStorage.getItem('the-terminal-ui') || '{}');
            const gamState = JSON.parse(localStorage.getItem('the-terminal-gamification') || '{}');
            uiState.state.labsCompleted = 1;
            gamState.state.labsCompleted = 1;
            localStorage.setItem('the-terminal-ui', JSON.stringify(uiState));
            localStorage.setItem('the-terminal-gamification', JSON.stringify(gamState));
        });
        await page.reload();

        // Directly go to a DIY lab (Module 1, Lab 2)
        await page.goto('lab/lab-1-2');
        await expect(page.getByText('Navigation Challenge')).toBeVisible();

        // Perform the required actions in terminal
        const terminalInput = page.locator('input[type="text"]').last();

        // Task: Create /home/test_student/workspace
        await terminalInput.fill('mkdir -p /home/test_student/workspace');
        await page.keyboard.press('Enter');

        // Give a moment for the VFS snapshot to sync to the store
        // We can verify the command actually did something by checking the terminal history
        await expect(page.locator('body')).toContainText('/home/test_student/workspace', { timeout: 10000 });

        // Click Verify button
        await page.getByRole('button', { name: 'VERIFY LAB' }).click();

        // Success message — the app auto-navigates to /labs after 3s (when not the first lab)
        await expect(page.locator('body')).toContainText(/Success!|Complete!/i);
        await expect(page).toHaveURL(/\/labs/, { timeout: 15000 });
    });
});
