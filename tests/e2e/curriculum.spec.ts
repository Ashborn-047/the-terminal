import { test, expect } from '@playwright/test';

test.describe('Curriculum and Lab Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Skip onboarding for these tests by setting the flag in localStorage
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('ui-storage', JSON.stringify({
                state: {
                    onboardingCompleted: true,
                    username: 'test_student',
                    onboardingStep: 4
                }
            }));
        });
        await page.reload();
    });

    test('should navigate through curriculum and complete a guided lab', async ({ page }) => {
        // 1. Start from Labs Page
        await page.goto('/labs');
        await expect(page.getByRole('heading', { name: 'The Curriculum' })).toBeVisible();

        // 2. Click on the first lab card
        const labCard = page.getByText('Filesystem Basics: Your First Command');
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
        await expect(page.getByText('Lab Complete!')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('+50 XP')).toBeVisible();

        // 6. Navigate back to Dashboard
        await page.getByRole('button', { name: 'View Dashboard' }).click();
        await expect(page).toHaveURL('/');
    });

    test('should complete a DIY lab with verification conditions', async ({ page }) => {
        // Directly go to a DIY lab (Module 1, Lab 2)
        await page.goto('/lab/lab-1-2');
        await expect(page.getByText('Navigation Challenge')).toBeVisible();

        // Perform the required actions in terminal
        const terminalInput = page.locator('input[type="text"]').last();

        // Task: Create /tmp/navigator.txt (assuming this is the condition)
        await terminalInput.fill('mkdir -p /tmp');
        await page.keyboard.press('Enter');
        await terminalInput.fill('touch /tmp/navigator.txt');
        await page.keyboard.press('Enter');

        // Click Verify button
        await page.getByRole('button', { name: 'Verify Solution' }).click();

        // Success message and Modal
        await expect(page.getByText('Lab Complete!')).toBeVisible();
    });
});
