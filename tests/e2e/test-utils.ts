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
    
    // First, ensure the terminal container is AT LEAST present in the DOM
    await expect(terminal).toBeAttached({ timeout: 15000 });
    
    try {
        // Now wait for the localized status to signify readiness
        await page.waitForSelector('[data-engine-status="ready"]', { timeout: 30000 });
    } catch (e) {
        // If we timeout, try to scrape terminal text for diagnostics
        const text = await terminal.innerText();
        console.error(`[Test Diagnostic] Engine readiness timeout. Current DOM text length: ${text.length}`);
        throw e;
    }

    // 3. SECONDARY GATE: Ensure the prompt is visually rendered in the DOM
    // This prevents race conditions where 'ready' status fires before xterm flushes rows.
    await expect(terminal).toContainText(/linux-lab|[$#>]/, { timeout: 15000 });
    
    // 4. Final 200ms grace period for Webkit font rendering stability
    await page.waitForTimeout(200);
    
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

// ─── Centralized Fixture Factories ─────────────────────────────────────────
// These ensure ALL test files use the same state shape.
// When a PR adds a new field to any store, update ONLY these factories.

/**
 * Builds a complete gamification store fixture for localStorage injection.
 * Matches the full GamificationState shape including PR 8/9/10 additions.
 */
export function buildGamificationFixture(overrides: Record<string, any> = {}) {
    return JSON.stringify({
        state: {
            xp: 0,
            level: 1,
            totalXpEarned: 0,
            streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
            counters: {},
            activityHistory: {},
            unlockedAchievements: [],
            labsCompleted: 0,
            hintsUsed: 0,
            dailyQuests: [],
            lastQuestGenerationDate: null,
            version: '3.1',
            needsMigrationNotice: false,
            masteryBadge: 'novice',
            labCompletionHistory: {},
            difficultyMode: 'NORMAL',       // PR 8
            completedChapterIds: [],         // PR 9
            questTemplates: [
                { type: 'earn_xp', title: 'Gain {{target}} XP', baseTarget: 250, xpReward: 50 },
                { type: 'complete_labs', title: 'Complete {{target}} Labs', baseTarget: 1, xpReward: 100 },
                { type: 'execute_commands', title: 'Execute {{target}} Commands', baseTarget: 20, xpReward: 40 },
                { type: 'execute_commands', title: 'Terminal Mastery: {{target}} Commands', baseTarget: 50, xpReward: 100 },
                { type: 'complete_labs', title: 'Lab Marathon: {{target}} Labs', baseTarget: 3, xpReward: 250 },
                { type: 'earn_xp', title: 'XP Hunter: {{target}} XP', baseTarget: 1000, xpReward: 200 },
                { type: 'complete_module', title: 'Complete a Module', baseTarget: 1, xpReward: 300 },
                { type: 'reach_level', title: 'Reach Level {{target}}', baseTarget: 5, xpReward: 150 },
                { type: 'find_easter_egg', title: 'Discover {{target}} Easter Egg(s)', baseTarget: 1, xpReward: 75 },
            ],
            ...overrides
        },
        version: 0
    });
}

/**
 * Builds a complete UI store fixture for localStorage injection.
 */
export function buildUIFixture(overrides: Record<string, any> = {}) {
    return JSON.stringify({
        state: {
            onboardingComplete: true,
            username: 'guest',
            onboardingStep: 4,
            ...overrides
        },
        version: 0
    });
}

/**
 * Builds a complete labs store fixture for localStorage injection.
 * Uses version 2 (post-migration) with Record-based hintsUsed.
 */
export function buildLabsFixture(overrides: Record<string, any> = {}) {
    return JSON.stringify({
        state: {
            labs: {},
            progress: {},
            currentLabId: null,
            ...overrides
        },
        version: 2
    });
}

/**
 * Injects all standard fixtures into a page's localStorage before navigation.
 * This is the recommended way to set up test state.
 */
export async function injectStandardFixtures(page: Page, overrides: {
    gamification?: Record<string, any>;
    ui?: Record<string, any>;
    labs?: Record<string, any>;
} = {}) {
    await page.addInitScript((fixtures) => {
        localStorage.clear();
        localStorage.setItem('the-terminal-gamification', fixtures.gamification);
        localStorage.setItem('the-terminal-ui', fixtures.ui);
        localStorage.setItem('the-terminal-labs', fixtures.labs);
        (window as any).PLAYWRIGHT_TESTING = true;
    }, {
        gamification: buildGamificationFixture(overrides.gamification),
        ui: buildUIFixture(overrides.ui),
        labs: buildLabsFixture(overrides.labs),
    });
}
