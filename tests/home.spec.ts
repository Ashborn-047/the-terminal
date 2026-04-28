import { test, expect } from '@playwright/test';
import { waitForEngineReady, injectStandardFixtures } from './e2e/test-utils';

test('homepage has correct title and renders terminal', async ({ page }) => {
    // 1. Inject state BEFORE navigation to ensure hydration picks it up
    await injectStandardFixtures(page, {
        ui: {
            onboardingComplete: true,
            username: 'guest',
            onboardingStep: 4,
        }
    });
    
    // 2. Navigate to root and use networkidle for full hydration
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Robust link selection using the newly added aria-label and correct role
    const terminalLink = page.getByRole('button', { name: /Terminal/i });
    await terminalLink.click({ force: true });
    
    // Explicit wait for navigation completion
    await page.waitForURL(/.*terminal/, { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Terminal/i, { timeout: 30000 });
    
    // Standardized Readiness Gate
    await waitForEngineReady(page);
});
