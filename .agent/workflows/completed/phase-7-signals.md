---
description: Phase 7 Migration — Signals & Process Management
---

This workflow guides the implementation of POSIX signals (SIGINT/Ctrl+C) and advanced process management to achieve a higher-fidelity Linux simulation.

### 1. Preparation & Design Review
Review the **[Phase 7 Implementation Plan](file:///C:/Users/PUSHAN/.gemini/antigravity/brain/c2c3e097-7e53-4974-8ac4-fa12571cfb5a/implementation_plan.md)** to ensure all architectural decisions are aligned.

### 2. Core Signals & Lifecycle
// turbo
1. Update `src/features/command-engine/types.ts` to include `Signal` enums and `onSignal` handlers.
2. Implement `sendSignal` and `foregroundProcess` state in `src/stores/terminalStore.ts`.
3. Modify `src/features/command-engine/executor.ts` to support execution interruption (AbortController).

### 3. Terminal Interruption (UI)
// turbo
1. Add global `Ctrl+C` event listener in `src/components/terminal/Terminal.tsx`.
2. Update the `useTerminal` hook to pass signal context down to the executor.

### 4. Signal-Aware Commands
// turbo
1. Create a new `sleep` command in `src/features/command-engine/commands/core.ts` for testing.
2. Update the existing `kill` command to send actual signals instead of just removing processes.
3. Refactor any long-running commands (e.g. `cat`, `grep`) to check `context.isInterrupted()`.

### 5. Final Verification
// turbo
1. Run `npm run test` for core logic.
2. Manually verify `sleep 10` + `Ctrl+C` responsiveness.
3. Sync documentation with Phase 7 milestones.
