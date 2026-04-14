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
    
    // 2. Navigate to root and use networkidle for full hydration
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Robust link selection
    const terminalLink = page.getByRole('link', { name: /Terminal/i });
    await terminalLink.waitFor({ state: 'visible', timeout: 30000 });
    await terminalLink.click();
    
    // Explicit wait for navigation completion
    await page.waitForURL(/.*terminal/, { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/i, { timeout: 30000 });
    
    // 3. Wait for terminal container and its visual population
    await page.waitForSelector('[data-testid="terminal-container"]', { timeout: 30000 });
    
    const terminal = page.getByTestId('terminal-container');
    await expect(terminal).toBeVisible({ timeout: 30000 });
    
    // Use the custom readiness signal we implemented
    await expect(terminal).toHaveAttribute('data-engine-status', 'ready', { timeout: 30000 });
    await expect(terminal).toContainText(/linux-lab/i, { timeout: 30000 });
});
