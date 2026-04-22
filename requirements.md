# Linux Simulator Lab & Gamification Overhaul v2.0 - Requirements

## Overview
This document outlines the changes made to introduce global Difficulty Modes, a three-tiered hint system, and XP-gated solutions for "The Terminal" simulator.

## 1. Difficulty Modes & XP Multipliers
A global `DifficultyMode` setting has been introduced to allow users to customize their challenge level.

**Location:** Stored in `gamificationStore.ts` as `difficultyMode` (`'BEGINNER' | 'NORMAL' | 'HARD'`).
**Multipliers:**
- **BEGINNER (Easy):** 1.0x XP multiplier. Focuses on syntax and basic concepts.
- **NORMAL (Intermediate):** 1.5x XP multiplier. Focuses on command chaining and system configuration.
- **SYSTEM OPERATIONAL (Hard):** 3.0x XP multiplier. Focuses on real-world scenarios, troubleshooting, and efficiency.

The multiplier is applied when calculating the final XP gain upon lab completion (`calculateTotalXpGain`).

## 2. Three-Tiered Hint System
The single string hint has been upgraded to an array of up to 3 tiered hints (`hints: string[]`).

**Hint Tiers:**
- **Level 1 (Concept):** General guidance (-10 XP reward penalty)
- **Level 2 (Command):** Syntax structure (-25 XP reward penalty)
- **Level 3 (Example):** Partial usage example (-50 XP reward penalty)

**Implementation Details:**
- **`types.ts`:** `LabStep.hint` is now `LabStep.hints?: string[]`. DIY labs also support global `hints?: string[]`. `LabProgress.hintsUsed` is now a `Record<number, number[]>` mapping step index (or 0 for DIY) to an array of hint levels used.
- **`labStore.ts`:** `recordHintUsage` now accepts `hintLevel` and updates the `hintsUsed` record properly, ensuring hints are only recorded once per level per step.
- **UI (`LabComponents.tsx`):** The hint button now sequentially reveals hints based on how many have already been used, showing the XP penalty for the next hint.

## 3. XP-Gated Solutions (Hard Mode)
The "Reveal Solution" feature now behaves differently based on the difficulty mode.

- **Beginner / Normal:** Revealing the solution issues a heavy penalty to the lab's XP reward, but does not cost global XP.
- **System Operational (Hard):** Revealing the solution acts as a "Protocol Bypass" and costs **200 XP** directly from the user's global balance (`gamificationStore.ts -> spendXp`). If the user has insufficient XP, the action is disabled.

## 4. Hard Mode UI Obscuration
In Hard Mode, the detailed step instructions (`step.instruction`) are obscured.
- The UI instead displays `step.actionText` (e.g., "List the files in the directory") to provide only the primary objective without any "how-to" guidance.
- If `actionText` is missing, a generic "OPERATIONAL OBJECTIVE: Complete the current task." fallback is used.

## 5. Design Updates
- The UI for hints, solutions, and the new settings sections has been updated to use the **Neo-brutalism** design system (`tokens.font.display`, bold shadows, strong borders, lime/amber colors).
- A new "System Difficulty" selector was added to `SettingsPage.tsx`.
- A quick-switch dropdown was added to the header of `LabsPage.tsx`.
- A new `/about` educational page (`AboutLinuxPage.tsx`) was created to cover the Kernel, FHS, Shell, and CLI philosophy.
