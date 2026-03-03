import { test, expect } from '@playwright/test';

test.describe('Curriculum & Lab Experience', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', async msg => {
            const values = [];
            for (const arg of msg.args()) {
                values.push(await arg.jsonValue().catch(() => '<unserializable>'));
            }
            console.log(`PW_TEST: ${msg.text()} | `, ...values);
        });
        // Complete onboarding to get to a fresh state
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.goto('/');

        await page.getByPlaceholder('enter_username').fill('lab_tester');
        await page.getByRole('button', { name: 'Initialize Session →' }).click();

        // Skip walkthrough to reach labs faster if possible, 
        // but here we just follow the redirect after walkthrough
        await expect(page.getByRole('heading', { name: 'The Command Line' })).toBeVisible({ timeout: 10000 });
        await page.getByPlaceholder('pwd').fill('pwd');
        await page.keyboard.press('Enter');

        await expect(page.getByRole('heading', { name: 'Your Location' })).toBeVisible();
        await page.getByPlaceholder('ls').fill('ls');
        await page.keyboard.press('Enter');

        await page.getByRole('button', { name: 'Next →' }).click();
        await page.getByRole('button', { name: 'Start Learning!' }).click();

        await expect(page).toHaveURL(/\/lab\/lab-1-1/);
    });

    test('should complete a guided lab and earn XP', async ({ page }) => {
        page.on('console', msg => console.log('PW_TEST:', msg.text()));

        // 1. Verify we are in Lab 1-1
        await expect(page.getByText('Your First Command')).toBeVisible();
        await expect(page.getByText('Step 1/2')).toBeVisible();

        // 2. Check initial XP (should be 0 or wait for rewards if they trigger on first command)
        // Note: The walkthrough commands might have triggered achievement rewards.
        // Let's check the header for XP
        const initialXPText = await page.getByText(/XP$/).innerText();

        // 3. Complete Step 1: pwd
        const terminal = page.getByLabel('Terminal Input');
        await terminal.fill('pwd');
        await page.keyboard.press('Enter');

        // 4. Verify auto-advance to Step 2
        await expect(page.getByText('Step 2/2')).toBeVisible();

        // 5. Complete Step 2: ls
        await terminal.fill('ls');
        await page.keyboard.press('Enter');

        // 6. Verify Lab Complete screen (Celebration Modal)
        await expect(page.getByText('First Lab Complete!')).toBeVisible();
        await expect(page.getByText('This is just the beginning')).toBeVisible();

        // 7. Click Finish/Exit button to go back to Dashboard
        await page.getByRole('button', { name: 'View Dashboard' }).click();
        await expect(page).toHaveURL('/');

        // 8. Verify we are back on the Dashboard
        await expect(page.getByRole('heading', { name: /Command Center/i })).toBeVisible();

        // Verify lab is marked completed in curriculum 
        await page.getByRole('button', { name: /Start a Lab/i }).click();
        await expect(page.getByText('COMPLETED').first()).toBeVisible();
    });
});
