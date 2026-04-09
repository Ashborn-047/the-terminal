import { Page, expect } from '@playwright/test';

export const PROMPT_REGEX = /linux-lab/;

/**
 * Types a command into the xterm.js terminal and waits for execution.
 * Ensures the terminal is focused and READY before typing.
 */
export async function typeCommand(page: Page, command: string) {
    const terminal = page.getByTestId('terminal-container');
    
    // 1. Wait for terminal to be visible and have some content (prompt)
    await terminal.waitFor({ state: 'visible', timeout: 20000 });
    
    // Wait for the xterm rows to be populated (indicates it opened correctly)
    await page.waitForSelector('.xterm-rows', { timeout: 20000 });
    
    // 2. Ensure the terminal is focused
    await terminal.click({ force: true });

    // 3. Wait for the prompt character ($ or #) to ensure the terminal is fully interactive
    // This is the most robust way to handle the boot sequence delay in CI
    await expect(terminal).toContainText(/[\\$|#]/, { timeout: 20000 });

    // 4. Type the command with a small delay between keys for CI stability
    await page.keyboard.type(command, { delay: 50 });
    await page.keyboard.press('Enter');
    
    // 4. Wait for the prompt to reappear to ensure the command finished
    // We expect the prompt to contain '$' (for user) or '#' (for root)
    // and specifically the hostname 'linux-lab'
    await expect(terminal).toContainText(/linux-lab.*[\\$|#]/, { timeout: 20000 });
}

/**
 * Verifies that a specific text appears in the terminal output.
 */
export async function expectTerminalOutput(page: Page, textOrRegex: string | RegExp) {
    const terminal = page.getByTestId('terminal-container');
    // Using a generous timeout for CI
    await expect(terminal).toContainText(textOrRegex, { timeout: 20000 });
}
