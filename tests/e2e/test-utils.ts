import { Page, expect } from '@playwright/test';

export const PROMPT_REGEX = /linux-lab/;

/**
 * Types a command into the xterm.js terminal and waits for execution.
 * Ensures the terminal is focused before typing.
 */
export async function typeCommand(page: Page, command: string) {
    const terminal = page.getByTestId('terminal-container');
    
    // Focus the terminal by clicking it specifically on an active layer
    await terminal.waitFor({ state: 'visible' });
    await terminal.click({ force: true });
    
    // Additional focus attempt to ensure xterm catches keyboard events
    await page.evaluate(() => {
        const terminalElem = document.querySelector('[data-testid="terminal-container"]');
        if (terminalElem) {
            const textarea = terminalElem.querySelector('textarea');
            if (textarea) (textarea as HTMLElement).focus();
        }
    });
    
    // Type the command followed by Enter
    await page.keyboard.type(command);
    await page.keyboard.press('Enter');
    
    // Wait for the prompt to reappear to ensure the command finished
    // We expect the prompt to contain '$' (for user) or '#' (for root)
    // and specifically the hostname 'linux-lab'
    await expect(terminal).toContainText(/linux-lab.*[\\$|#]/, { timeout: 10000 });
}

/**
 * Verifies that a specific text appears in the terminal output.
 */
export async function expectTerminalOutput(page: Page, textOrRegex: string | RegExp) {
    const terminal = page.getByTestId('terminal-container');
    await expect(terminal).toContainText(textOrRegex, { timeout: 10000 });
}
