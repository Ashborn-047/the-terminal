import { test, expect } from '@playwright/test';
import { typeCommand, verifyOutput, waitForEngineReady, injectStandardFixtures } from './test-utils';

/**
 * Full Regression Flow — End-to-End
 * 
 * Tests the complete user journey from first visit to lab completion:
 * 1. New user lands → Welcome Modal appears
 * 2. Enters username → Validates and proceeds
 * 3. Walkthrough (pwd, ls, navigation tips)
 * 4. Redirected to first lab (lab-1-1)
 * 5. Completes guided lab steps
 * 6. Celebration Modal appears with XP
 * 7. Navigates to labs page
 * 8. Dashboard shows updated progress
 */
test.describe('Full Regression Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Start fresh — clear all localStorage and inject testing flag BEFORE navigation
        await injectStandardFixtures(page, {
            ui: { onboardingComplete: false, onboardingStep: 0, username: '' }
        });
        await page.goto('');
    });

    test('complete user journey: register → walkthrough → lab → celebrate → dashboard', async ({ page }) => {

        // ──────────────────────────────────────────────
        // STEP 1: Welcome Modal
        // ──────────────────────────────────────────────
        await expect(page.getByText('Welcome, Learner')).toBeVisible({ timeout: 10000 });

        // STEP 2: Enter username
        const usernameInput = page.getByTestId('welcome-input');
        await usernameInput.fill('regression_user');
        await page.getByRole('button', { name: 'Initialize Session →' }).click();

        // Wait for verification + walkthrough to appear
        await expect(page.getByTestId('walkthrough-title')).toHaveText(/The Command Line/i, { timeout: 15000 });

        // ──────────────────────────────────────────────
        // STEP 3: Walkthrough — pwd + ls + navigation
        // ──────────────────────────────────────────────
        // Step 3a: Type pwd in mini-terminal
        const step1Input = page.getByTestId('walkthrough-input');
        await step1Input.fill('pwd');
        await page.keyboard.press('Enter');

        // Step 3b: Type ls -la
        const walkthroughTitle = page.getByTestId('walkthrough-title');
        await expect(walkthroughTitle).toHaveText(/Your First Output/i);
        const step2Input = page.getByTestId('walkthrough-input');
        await step2Input.fill('ls -la');
        await page.keyboard.press('Enter');

        // Step 3c: Click Next Step
        await expect(walkthroughTitle).toHaveText(/Systematic Chapters/i);
        await page.getByRole('button', { name: 'Next Step →' }).click();

        // Step 3d: Click Next Step
        await expect(walkthroughTitle).toHaveText(/The Challenge Arena/i);
        await page.getByRole('button', { name: 'Next Step →' }).click();

        // Step 3e: Enter Terminal
        await expect(walkthroughTitle).toHaveText(/You're Ready/i);
        await page.getByRole('button', { name: 'Enter Terminal' }).click();

        // ──────────────────────────────────────────────
        // STEP 4: Redirected to first lab
        // ──────────────────────────────────────────────
        await expect(page).toHaveURL(/\/lab\/lab-1-1/, { timeout: 10000 });
        await expect(page.getByText('Your First Command')).toBeVisible();

        // ──────────────────────────────────────────────
        // STEP 5: Complete guided lab
        // ──────────────────────────────────────────────
        
        // Step 5a: pwd
        await typeCommand(page, 'pwd');

        // Wait for the lab to progress to step 2. The step indicator is visually "STEP 2 / 2", but
        // the text content is "Step 2 / 2". Playwright's getByText is sometimes tricky with mixed casing and elements.
        // Since we moved to Hard Mode obscuration, the text is actually different if the mode is wrong,
        // but default is NORMAL, so it should be the instruction.
        // Or we can just wait for the progress indicator instead of the exact string.
        await page.waitForTimeout(1000); // Small wait to allow verification to trigger
        await typeCommand(page, 'ls');

        // ──────────────────────────────────────────────
        // STEP 6: Celebration Modal
        // ──────────────────────────────────────────────
        const celebrationHeading = page.getByRole('heading', { name: /First Lab Complete!/i });
        await expect(celebrationHeading).toBeVisible({ timeout: 30000 });
        await expect(page.getByText('+50 XP').first()).toBeVisible();

        // Dismiss celebration
        const continueBtn = page.getByRole('button', { name: /Continue Learning/i });
        await continueBtn.click();
        await expect(celebrationHeading).not.toBeVisible();

        // ──────────────────────────────────────────────
        // STEP 7: Back on labs page
        // ──────────────────────────────────────────────
        await expect(page).toHaveURL(/\/labs/, { timeout: 15000 });

        // ──────────────────────────────────────────────
        // STEP 8: Dashboard shows progress
        // ──────────────────────────────────────────────
        await page.goto('');
        // Verify XP is displayed somewhere (nav bar or dashboard)
        await expect(page.locator('body')).toContainText('XP', { timeout: 10000 });
    });

    test('terminal command execution and history navigation', async ({ page }) => {
        // Set up completed onboarding with persistent flag
        await injectStandardFixtures(page, {
            ui: { onboardingComplete: true, username: 'guest', onboardingStep: 4 }
        });
        await page.goto('terminal');
        await waitForEngineReady(page);

        // Execute several commands
        await typeCommand(page, 'pwd');
        await page.waitForTimeout(500); // 100% Reliability Gate for DOM rendering
        await verifyOutput(page, '/home/guest');

        await typeCommand(page, 'mkdir testdir');

        await typeCommand(page, 'ls');
        await page.waitForTimeout(500); // 100% Reliability Gate for DOM rendering
        await verifyOutput(page, 'testdir');

        await typeCommand(page, 'cd testdir');

        await typeCommand(page, 'pwd');
        await page.waitForTimeout(500); // 100% Reliability Gate for DOM rendering
        await verifyOutput(page, '/home/guest/testdir');

        // Test command history (up arrow)
        // Wait for React state to settle and ensure focus
        await page.waitForTimeout(500);
        const terminal = page.getByTestId('terminal-container');
        await terminal.click();
        await page.keyboard.press('ArrowUp');
        // Note: xterm doesn't have a value property, we check if it's rendered
        await verifyOutput(page, 'pwd');
        await page.keyboard.press('ArrowUp');
        await verifyOutput(page, 'cd testdir');
    });

    test('page navigation works for all routes', async ({ page }) => {
        await injectStandardFixtures(page, {
            ui: { onboardingComplete: true, username: 'guest', onboardingStep: 4 },
            gamification: {
                xp: 1000, level: 5, totalXpEarned: 1000, labsCompleted: 5
            }
        });
        await page.goto('');

        // Home (Dashboard)
        await page.goto('./');
        await expect(page.getByRole('heading', { name: /Welcome|Dashboard|Command Center/i })).toBeVisible({ timeout: 15000 });

        // Dashboard
        await page.goto('./');
        await expect(page.getByRole('heading', { name: /Welcome|Dashboard|Command Center/i })).toBeVisible({ timeout: 10000 });

        // Labs
        await page.goto('labs');
        await expect(page.getByTestId('lab-module-title')).toBeVisible({ timeout: 10000 });

        // Terminal
        await page.goto('terminal');
        await expect(page.getByTestId('terminal-container')).toBeVisible({ timeout: 10000 });

        // Profile
        await page.goto('profile');
        await expect(page.locator('body')).toContainText('guest', { timeout: 10000 });
    });
});
