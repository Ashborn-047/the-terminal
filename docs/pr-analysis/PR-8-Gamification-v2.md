# PR 8: Feature: Gamification v2.0 Overhaul - Difficulty Modes & Tiered Hints

## Overview
This PR introduces a comprehensive gamification overhaul, featuring a three-tier difficulty system (BEGINNER, NORMAL, HARD), replacing single-hint strings with multi-level tiered hints tracked per-step, implementing XP costs for hard-mode solution reveals, and adding a new "About Linux" educational page.

## CodeRabbit Bot Findings & Required Fixes

### State Management & Stores
- **`src/stores/labStore.ts`**:
  - **CRITICAL**: `recordHintUsage` API and implementation are incorrect for the new tiered model. It drops `hintLevel` and corrupts data by treating `hintsUsed` as an array instead of a `Record<number, number[]>`. Must update signature to `(labId, stepIndex, hintLevel)` and fix internal state updates to use object shape.
  - `resetLab` initializes `hintsUsed` as an array `[]`. Must initialize as an empty object `{}` to align with the new type.
- **`src/stores/gamificationStore.ts`**:
  - The `spendXp` action accepts negative or non-finite amounts and mutates stale state. Must validate input to be finite/positive and use functional state updates (e.g., `set(prev => ...)`) to ensure atomic mutation.

### UI & Components
- **`src/components/lab/LabComponents.tsx`**:
  - `DIYLabInstructions` references undefined props and state (`usedHints`, `labHints`, etc.). Must destructure `onRevealSolution` and `solutionRevealed`, bind to `useGamificationStore`, and derive hint parameters identically to `GuidedLabInstructions`. Reveal flows must be gated upon `spendXp` successfully returning `true`.
- **`src/pages/LabsPage.tsx`**:
  - `difficultyMode`, `setDifficultyMode`, and `Settings` icon are imported but never used. Must wire a global difficulty selector into the page header, or remove the unused imports.
- **`src/pages/SettingsPage.tsx`**:
  - `difficultyMode` and `setDifficultyMode` are destructured but never rendered in UI. Must add a UI block (e.g., "System Difficulty" section) using design-system components, or remove the dead code.
- **`src/pages/AboutLinuxPage.tsx`**:
  - The `ButtonProps` variant union is missing the `"lime"` variant, causing a type mismatch. Must update the `ButtonProps` type union to include `"lime"`.

### Configuration & Types
- **`src/config/progression.ts`**:
  - `DIFFICULTY_MULTIPLIERS` is typed too loosely as `Record<string, number>`. Must import `DifficultyMode` and tighten the type to `Record<DifficultyMode, number>` to ensure compile-time guarantees.
