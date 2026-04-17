import { test, expect } from '@playwright/test';

test.describe('User Onboarding Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            (window as any).PLAYWRIGHT_TESTING = true;
        });
    });

    test('should complete the full onboarding journey', async ({ page }) => {
        // 1. Visit the landing page
        await page.goto('');

        // 2. Verify Welcome Modal is visible
        await expect(page.getByText('Welcome, Learner')).toBeVisible();

        // 3. Enter username and initialize session
        const usernameInput = page.getByTestId('welcome-input');
        await usernameInput.fill('test_user');

        const initButton = page.getByRole('button', { name: 'Initialize Session →' });
        await initButton.click();

        // 4. Wait for verification delay §3.1 (WelcomeModal has 1.5s delay)
        // The modal should disappear and walkthrough should appear
        await expect(page.getByRole('heading', { name: 'The Command Line' })).toBeVisible({ timeout: 10000 });

        // 5. Walkthrough Step 1: pwd
        const step1Input = page.getByTestId('walkthrough-input');
        await step1Input.fill('pwd');
        await page.keyboard.press('Enter');

        // 6. Walkthrough Step 2: ls
        await expect(page.getByRole('heading', { name: 'Your Location' })).toBeVisible();
        const step2Input = page.getByTestId('walkthrough-input');
        await step2Input.fill('ls');
        await page.keyboard.press('Enter');

        // 7. Walkthrough Step 3: Next
        await expect(page.getByRole('heading', { name: 'Directory Contents' })).toBeVisible();
        await page.getByRole('button', { name: 'Next →' }).click();

        // 8. Walkthrough Step 4: Start Learning
        await expect(page.getByRole('heading', { name: 'The Curriculum' })).toBeVisible();
        await page.getByRole('button', { name: 'Start Learning!' }).click();

        // 9. Verify redirect to first lab §3.3
        await expect(page).toHaveURL(/\/lab\/lab-1-1/);

        // 10. Verify first lab instructions are visible
        await expect(page.getByText('Your First Command')).toBeVisible();
    });

    test('should show validation errors for invalid usernames', async ({ page }) => {
        await page.goto('');

        const usernameInput = page.getByTestId('welcome-input');
        const initButton = page.getByRole('button', { name: 'Initialize Session →' });

        // Too short
        await usernameInput.fill('ab');
        await initButton.click();
        await expect(page.getByText('Username must be at least 3 characters')).toBeVisible({ timeout: 10000 });

        // Invalid characters
        await usernameInput.fill('test@user');
        await initButton.click();
        await expect(page.getByText('Only letters, numbers, and underscores allowed')).toBeVisible();
    });
});
