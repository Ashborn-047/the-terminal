import { test, expect } from '@playwright/test';

test('homepage has correct title and renders terminal', async ({ page }) => {
    await page.goto('');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/);

    // Expect the terminal prompt to be visible
    const terminal = page.getByTestId('terminal-container');
    await expect(terminal).toBeVisible({ timeout: 15000 });
    await expect(terminal).toContainText(/linux-lab/, { timeout: 15000 });
});
