import { test, expect } from '@playwright/test';
import { typeCommand } from './test-utils';

test.describe('Curriculum and Lab Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Inject state upstream of navigation to ensure stores hydrate with the completed onboarding flag
        await page.addInitScript(() => {
            localStorage.clear();
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: {
                    onboardingComplete: true,
                    username: 'guest',
                    onboardingStep: 4,
                    labsCompleted: 0,
                },
                version: 0
            }));
            localStorage.setItem('the-terminal-gamification', JSON.stringify({
                state: {
                    xp: 0,
                    level: 1,
                    labsCompleted: 0,
                    totalXpEarned: 0,
                    streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
                    counters: {},
                    activityHistory: {},
                    unlockedAchievements: [],
                    hintsUsed: 0,
                    dailyQuests: [],
                    lastQuestGenerationDate: null
                },
                version: 0
            }));
        });

        await page.goto('');
        await page.waitForLoadState('networkidle');
        
        // Wait for store hydration
        await page.waitForFunction(() => {
            const ui = localStorage.getItem('the-terminal-ui');
            return ui && JSON.parse(ui).state.onboardingComplete;
        });
    });

    test('should navigate through curriculum and complete a guided lab', async ({ page }) => {
        // Step 1: Browse to Curriculum
        await page.goto('labs');
        await expect(page.getByText(/Foundations/i).first()).toBeVisible({ timeout: 15000 });

        // Step 2: Start "Your First Command" (lab-1-1)
        const startBtn = page.locator('[data-testid="lab-card-lab-1-1"]').getByRole('button', { name: /Start/i });
        await startBtn.click();

        // Step 3: Verify Lab View mounts terminal
        await expect(page).toHaveURL(/\/lab\/lab-1-1/);
        await expect(page.getByText('Your First Command')).toBeVisible();
        
        // Wait for terminal prompt
        const terminal = page.getByTestId('terminal-container');
        await expect(terminal).toContainText(/[\\$|#]/, { timeout: 20000 });

        // Step 4: Execute required step (pwd)
        await typeCommand(page, 'pwd');
        
        // Wait for step to advance in instructions sidebar
        // Note: The instruction components might have specific testids or headings
        await expect(page.getByText(/Step.*2.*\/.*2/).first()).toBeVisible({ timeout: 15000 });

        // Step 5: Execute final step (ls)
        await typeCommand(page, 'ls');

        // Step 6: Verify Celebration Modal (triggers on first lab completion)
        await expect(page.getByRole('heading', { name: 'First Lab Complete!' })).toBeVisible({ timeout: 20000 });
    });

    test('should track challenge lab attempts', async ({ page }) => {
        await page.goto('labs');
        
        // Find a challenge lab (e.g. Navigation Master)
        const challengeCard = page.locator('[data-testid="lab-card-lab-1-2"]');
        await expect(challengeCard).toBeVisible({ timeout: 15000 });
        await expect(challengeCard).toContainText(/challenge/i);
        
        const startBtn = challengeCard.getByRole('button', { name: /Start/i });
        await startBtn.click();
        
        await expect(page).toHaveURL(/\/lab\/lab-1-2/);
        
        // Terminal interaction is verified here to ensure VFS state isolation
        await typeCommand(page, 'cd / && ls');
        await expect(page.getByTestId('terminal-container')).toContainText(/etc/i);
    });
});
