import { Page, expect } from '@playwright/test';

export const PROMPT_REGEX = /linux-lab/;

/**
 * Types a command into the xterm.js terminal and waits for execution.
 * Ensures the terminal is focused and READY before typing.
 */
export async function typeCommand(page: Page, command: string) {
    const terminal = page.getByTestId('terminal-container');
    
    // 1. Wait for terminal container to exist in DOM
    await page.waitForSelector('[data-testid="terminal-container"]', { timeout: 30000 });
    
    // 2. Wait for terminal to be visible
    await terminal.waitFor({ state: 'visible', timeout: 30000 });
    
    // 3. Wait for xterm to initialize - try multiple selectors as fallback
    try {
        await page.waitForSelector('.xterm-rows', { timeout: 20000 });
    } catch {
        // Fallback: wait for xterm screen container if rows are delayed
        await page.waitForSelector('.xterm-screen', { timeout: 20000 });
    }
    
    // 4. Ensure xterm is mounted and has rows
    await page.waitForFunction(
        () => {
            const rows = document.querySelector('.xterm-rows') || document.querySelector('.xterm-screen');
            return rows && rows.children.length > 0;
        },
        { timeout: 30000 }
    );
    
    // 5. Ensure the terminal is focused with a significant delay for CI stability
    await terminal.click({ force: true });
    await page.waitForTimeout(1000); 

    // 6. Wait for the prompt character ($ or # or >) to ensure the terminal is fully interactive
    // Using a more lenient regex to accommodate various prompt states
    await expect(terminal).toContainText(/[$#>]/, { timeout: 30000 });

    // 7. Type the command with a larger delay between keys for high-latency CI environments
    await page.keyboard.type(command, { delay: 100 });
    await page.keyboard.press('Enter');
    
    // 8. Wait for the command execution and the prompt to reappear
    // Expect the prompt to contain 'linux-lab' and one of the prompt chars
    await expect(terminal).toContainText(/linux-lab.*[$#>]/, { timeout: 30000 });
}

/**
 * Verifies that a specific text appears in the terminal output.
 */
export async function expectTerminalOutput(page: Page, textOrRegex: string | RegExp) {
    const terminal = page.getByTestId('terminal-container');
    // Using an extended timeout for heavy processing tasks
    await expect(terminal).toContainText(textOrRegex, { timeout: 30000 });
}
