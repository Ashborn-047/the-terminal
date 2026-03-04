import { test, expect } from '@playwright/test';

test('homepage has correct title and renders terminal', async ({ page }) => {
    await page.goto('');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/);

    // Expect the terminal prompt to be visible
    const prompt = page.locator('text=the-terminal');
    await expect(prompt.first()).toBeVisible();
});
