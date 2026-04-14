import { test, expect } from '@playwright/test';
import { typeCommand, verifyOutput } from './test-utils';

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
        // Start fresh — clear all localStorage before each test
        await page.goto('');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
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
        await expect(page.getByRole('heading', { name: 'The Command Line' })).toBeVisible({ timeout: 10000 });

        // ──────────────────────────────────────────────
        // STEP 3: Walkthrough — pwd + ls + navigation
        // ──────────────────────────────────────────────
        // Step 3a: Type pwd in mini-terminal
        const step1Input = page.getByTestId('walkthrough-input');
        await step1Input.fill('pwd');
        await page.keyboard.press('Enter');

        // Step 3b: Type ls
        await expect(page.getByRole('heading', { name: 'Your Location' })).toBeVisible();
        const step2Input = page.getByTestId('walkthrough-input');
        await step2Input.fill('ls');
        await page.keyboard.press('Enter');

        // Step 3c: Click Next
        await expect(page.getByRole('heading', { name: 'Directory Contents' })).toBeVisible();
        await page.getByRole('button', { name: 'Next →' }).click();

        // Step 3d: Start Learning
        await expect(page.getByRole('heading', { name: /The Curriculum|FOUNDATIONS/i })).toBeVisible();
        await page.getByRole('button', { name: 'Start Learning!' }).click();

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
        await expect(page.getByText(/Step.*2.*\/.*2/).first()).toBeVisible({ timeout: 5000 });

        // Step 5b: ls
        await typeCommand(page, 'ls');

        // ──────────────────────────────────────────────
        // STEP 6: Celebration Modal
        // ──────────────────────────────────────────────
        const celebrationHeading = page.getByRole('heading', { name: 'First Lab Complete!' });
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
        // Set up completed onboarding
        await page.goto('');
        await page.evaluate(() => {
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: { onboardingComplete: true, username: 'guest', onboardingStep: 4 },
                version: 0
            }));
        });
        await page.reload();

        await page.goto('terminal');

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
        await page.goto('');
        await page.evaluate(() => {
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: { onboardingComplete: true, username: 'guest', onboardingStep: 4 },
                version: 0
            }));
            localStorage.setItem('the-terminal-gamification', JSON.stringify({
                state: {
                    xp: 1000, level: 5, totalXpEarned: 1000,
                    streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
                    counters: {}, activityHistory: {}, unlockedAchievements: [],
                    labsCompleted: 5, hintsUsed: 0, dailyQuests: [], lastQuestGenerationDate: null
                },
                version: 0
            }));
        });
        await page.reload();

        // Home
        await page.goto('');
        await expect(page.locator('body')).toContainText('Terminal', { timeout: 10000 });

        // Labs
        await page.goto('labs');
        await expect(page.getByRole('heading', { name: /FOUNDATIONS|Curriculum/i })).toBeVisible({ timeout: 10000 });

        // Terminal
        await page.goto('terminal');
        await expect(page.getByTestId('terminal-container')).toBeVisible({ timeout: 10000 });

        // Profile
        await page.goto('profile');
        await expect(page.locator('body')).toContainText('guest', { timeout: 10000 });
    });
});
