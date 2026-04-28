import { test, expect } from '@playwright/test';
import { typeCommand, waitForEngineReady, injectStandardFixtures } from './test-utils';

test.describe('Curriculum and Lab Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Inject state upstream of navigation to ensure stores hydrate with the completed onboarding flag
        await injectStandardFixtures(page, {
            ui: {
                onboardingComplete: true,
                username: 'guest',
                onboardingStep: 4,
                labsCompleted: 0,
            }
        });

        await page.goto('');
        await page.waitForLoadState('networkidle');
    });

    test('should navigate through curriculum and complete lab flow', async ({ page }) => {
        // Step 1: Start at Home to ensure store hydration
        await page.goto('/');
        
        // Wait for activity bar to be visible and select the specific navigation button
        const curriculumLink = page.getByTestId('nav-item-curriculum');
        await expect(curriculumLink).toBeVisible({ timeout: 15000 });
        await curriculumLink.click();

        // Step 2: Verify Foundations module is active
        await expect(page).toHaveURL(/\/labs/);
        await expect(page.getByTestId('lab-module-title')).toContainText(/Foundations/i);

        // Step 3: Start "Your First Command" (lab-1-1)
        const startBtn = page.locator('[data-testid="lab-card-lab-1-1"]').getByRole('button', { name: /Start/i });
        await expect(startBtn).toBeVisible({ timeout: 15000 });
        await startBtn.click();

        // Step 4: Verify Lab View mounts terminal
        await expect(page).toHaveURL(/\/lab\/lab-1-1/);
        await expect(page.getByText(/Your First Command/i).first()).toBeVisible();
        
        // Wait for terminal prompt using the standardized readiness gate
        await waitForEngineReady(page);

        // Step 4: Execute required step (pwd)
        await typeCommand(page, 'pwd');
        
        // Wait for step to advance in instructions sidebar
        await expect(page.getByText(/Step.*2.*\/.*2/).first()).toBeVisible({ timeout: 15000 });

        // Step 5: Execute final step (ls)
        await typeCommand(page, 'ls');

        // Step 6: Verify Celebration Modal (triggers on first lab completion)
        await expect(page.getByRole('heading', { name: /First Lab Complete!/i })).toBeVisible({ timeout: 20000 });

        // Step 7: Continue Learning (Continue button in modal goes back to labs)
        await page.getByRole('button', { name: /Continue Learning/i }).click();
        await expect(page).toHaveURL(/\/labs/);

        // Step 8: Verify Navigation Challenge (lab-1-2) is now unlocked
        const challengeCard = page.locator('[data-testid="lab-card-lab-1-2"]');
        await expect(challengeCard).toBeVisible({ timeout: 15000 });
        await expect(challengeCard).toContainText(/challenge/i);
        
        const challengeStartBtn = challengeCard.getByRole('button', { name: /Start/i });
        await expect(challengeStartBtn).toBeVisible();
        await challengeStartBtn.click();
        
        await expect(page).toHaveURL(/\/lab\/lab-1-2/);
        
        // Step 9: Verify VFS state isolation in challenge lab
        await typeCommand(page, 'cd / && ls');
        await expect(page.getByTestId('terminal-container')).toContainText(/etc/i);
    });
});
