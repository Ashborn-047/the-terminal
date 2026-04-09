import { test, expect } from '@playwright/test';

test('homepage has correct title and renders terminal', async ({ page }) => {
    // 1. Inject state BEFORE navigation to ensure hydration picks it up
    await page.addInitScript(() => {
        localStorage.clear();
        localStorage.setItem('the-terminal-ui', JSON.stringify({
            state: {
                onboardingComplete: true,
                username: 'guest',
                onboardingStep: 4,
            },
            version: 0
        }));
    });
    
    // 2. Navigate and wait
    await page.goto('');
    await page.waitForLoadState('networkidle');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/i, { timeout: 15000 });

    // Expect the terminal prompt to be visible
    const terminal = page.getByTestId('terminal-container');
    await expect(terminal).toBeVisible({ timeout: 20000 });
    await expect(terminal).toContainText(/linux-lab/i, { timeout: 20000 });
});
