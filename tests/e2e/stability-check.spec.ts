import { test, expect } from '@playwright/test';
import { typeCommand, verifyOutput } from './test-utils';

test.describe('Engine Stability and Determinism Check', () => {
    test.beforeEach(async ({ page }) => {
        // Direct navigation to terminal with onboarding bypass
        await page.addInitScript(() => {
            localStorage.clear();
            localStorage.setItem('the-terminal-ui', JSON.stringify({
                state: { onboardingComplete: true, username: 'guest', onboardingStep: 4 },
                version: 0
            }));
        });
        await page.goto('terminal');
        await page.waitForLoadState('networkidle');
        
        // Wait for our custom readiness signal (visual healing)
        const terminal = page.getByTestId('terminal-container');
        await expect(terminal).toHaveAttribute('data-engine-status', 'ready', { timeout: 30000 });
    });

    test('should execute grep without isInterrupted crash', async ({ page }) => {
        // This command previously triggered the "isInterrupted is not a function" error
        // during sub-command substitution or pipe processing.
        await typeCommand(page, 'echo "hello world" | grep hello');
        
        // Wait for DOM sync
        await page.waitForTimeout(500); 
        
        // Verify output and absence of crash logs
        await verifyOutput(page, 'hello world');
        
        const terminal = page.getByTestId('terminal-container');
        await expect(terminal).not.toContainText(/isInterrupted is not a function/i);
        await expect(terminal).not.toContainText(/bash: b\./i); // Minified error pattern
    });

    test('should execute command substitution with grep', async ({ page }) => {
        // Complex case: Substitution usually uses a nested context
        await typeCommand(page, 'echo $(echo "found" | grep found)');
        
        await page.waitForTimeout(500);
        await verifyOutput(page, 'found');
    });

    test('should assign deterministic PIDs to background jobs', async ({ page }) => {
        // Monotonic PIDs are seeded at 1, 142, 501. 
        // Background jobs should start at 502, 503...
        
        await typeCommand(page, 'sleep 10 &');
        // Check for job control output: [jobid] pid
        const terminal = page.getByTestId('terminal-container');
        
        // First BG job should likely be 502 (after systemd, sshd, and the seeded bash)
        await expect(terminal).toContainText(/\[1\] 502/i, { timeout: 10000 });
        
        await typeCommand(page, 'sleep 10 &');
        await expect(terminal).toContainText(/\[2\] 503/i, { timeout: 10000 });
    });
});
