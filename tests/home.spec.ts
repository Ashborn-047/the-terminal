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
    
    // 2. Navigate specifically to terminal view
    await page.goto('terminal');
    await page.waitForLoadState('domcontentloaded');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/i, { timeout: 15000 });
    
    // 3. Wait for terminal container to exist in DOM first
    await page.waitForSelector('[data-testid="terminal-container"]', { timeout: 30000 });
    
    // 4. Wait for xterm content to render (with fallback)
    try {
        await page.waitForSelector('.xterm-rows', { timeout: 20000 });
    } catch {
        await page.waitForSelector('.xterm-screen', { timeout: 20000 });
    }

    // 5. Expect the terminal prompt to be visible
    const terminal = page.getByTestId('terminal-container');
    await expect(terminal).toBeVisible({ timeout: 30000 });
    await expect(terminal).toContainText(/linux-lab/i, { timeout: 30000 });
});
