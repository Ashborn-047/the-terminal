import { test, expect } from '@playwright/test';
import { waitForEngineReady } from './e2e/test-utils';

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
        (window as any).PLAYWRIGHT_TESTING = true;
    });
    
    // 2. Navigate to root and use networkidle for full hydration
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Robust link selection with forced click to bypass potential headless visibility issues
    const terminalLink = page.getByRole('link', { name: /Terminal/i });
    await terminalLink.click({ force: true });
    
    // Explicit wait for navigation completion
    await page.waitForURL(/.*terminal/, { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/i, { timeout: 30000 });
    
    // Standardized Readiness Gate
    await waitForEngineReady(page);
});
