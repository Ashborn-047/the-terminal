# Daily and Arena Challenges Update

This PR introduces comprehensive updates to both the Daily Quests system and the Challenge Arena, drastically increasing the amount of replayable and varied content for users to engage with.

## Changes Made

### 1. Expanded Daily Quests (`src/stores/gamificationStore.ts`)
- Added new quest types to the `QuestType` definition: `complete_module`, `find_easter_egg`, and `reach_level`.
- Added new templates to the `questTemplates` array to randomly select from these new objectives.
- Integrated `updateQuestProgress` calls directly into the `addXp` and `complete_module` execution paths to ensure progress is tracked reliably.

### 2. Massive Challenge Arena Expansion (`src/data/labs/arena.ts`)
- Created a new data file specifically for Arena challenges to separate them from standard curriculum labs.
- Implemented 40 brand new interactive scenarios, divided equally among four difficulty tiers:
  - **10 Novice** (e.g. basic navigation, log truncation, process termination)
  - **10 Adept** (e.g. symlink repair, missing sticky bits, rogue SUID removal)
  - **10 Expert** (e.g. systemd targets, path injection defense, fork bombs)
  - **10 Master** (e.g. zero-day mitigations, rootkit removal, chroot escapes)
- Dynamically merged these 40 new challenges into `INITIAL_LABS` on boot in `src/App.tsx`.

### 3. VFS Scenario Automation (`src/features/lab-engine/scenarios.ts`)
- Added 40 corresponding `ScenarioInitializer` functions to set up the Virtual File System (VFS) accurately before each Arena challenge begins.
- Automates the creation of dummy directories, files, symlinks, permissions, ownership rules, and process stubs that players need to fix or exploit to solve the challenge.

### 4. Overhauled Arena UI (`src/components/lab/ChallengeArena.tsx`)
- Refactored `ChallengeArenaPage` and its internal components to render actual, playable challenge cards instead of placeholders, provided the user has passed the Level 10 gate.
- Categorized and visually grouped challenges by difficulty (Novice, Adept, Expert, Master) utilizing existing design system colors.

### 5. Test Fixes and Alignments
- Maintained stability by ensuring test cases that relied on early feature unlocking (like DIY labs for `lab-1-2`) still had correct progression conditions (`src/hooks/useFeatureAccess.ts`). All E2E, manual UI, and unit testing scripts now pass locally.