import { Page, expect } from '@playwright/test';

/**
 * Ensures the application and terminal engine are fully hydrated and ready for input.
 * This is the "Healing" alternative to arbitrary waitForTimeout calls.
 */
export async function waitForEngineReady(page: Page) {
    // 1. Wait for the global App Readiness Gate (VFS + Spacetime + Store hydration)
    await page.waitForFunction(() => (window as any).__APP_READY__ === true, { timeout: 60000 });

    // 2. Wait for the Terminal Engine to signal 'ready' status
    const terminal = page.getByTestId('terminal-container');
    try {
        await page.waitForSelector('[data-engine-status="ready"]', { timeout: 30000 });
    } catch (e) {
        const text = await terminal.textContent();
        console.error(`[Test Diagnostic] Engine readiness timeout. Current DOM text: "${text}"`);
        throw e;
    }
    
    return terminal;
}

/**
 * Types a command into the xterm.js terminal and waits for execution.
 * Leverages deterministic status signaling for 100% reliability.
 */
export async function typeCommand(page: Page, command: string) {
    // Ensure we are ready
    const terminal = await waitForEngineReady(page);
    
    // Focus terminal
    await terminal.click({ force: true });

    // Type the command
    await page.keyboard.type(command, { delay: 50 }); // Faster typing now that engine is verified ready
    await page.keyboard.press('Enter');
    
    // 1. Wait for the engine to acknowledge the command (Busy state)
    // We use a small timeout here because simple commands might finish before we can catch the 'busy' state
    try {
        await page.waitForSelector('[data-engine-status="busy"]', { timeout: 2000 });
    } catch (e) {
        // Command might have been instant (e.g. 'pwd'), continuing...
    }

    // 2. Wait for the engine to return to 'ready' state
    await page.waitForSelector('[data-engine-status="ready"]', { timeout: 30000 });
}

/**
 * Verifies that a specific text appears in the terminal output.
 */
export async function verifyOutput(page: Page, expectedText: string | RegExp) {
    const terminal = page.getByTestId('terminal-container');
    await expect(terminal).toContainText(expectedText, { timeout: 15000 });
}
