# PR 10: feat: expand daily quests and add 40 interactive arena challenges

## Overview
This PR adds arena-based lab challenges and expands the quest system. It merges pre-defined arena and broken system labs during app initialization, updates the `ChallengeArena` component to render unlocked challenges grouped by difficulty tier, introduces three new quest types (`complete_module`, `find_easter_egg`, `reach_level`), and integrates quest progress tracking into module completion and XP gain flows.

## CodeRabbit Bot Findings & Required Fixes

### UI & Navigation
- **`src/components/lab/ChallengeArena.tsx`**: 
  - `onStart` handler navigates to an unregistered route `/labs/${lab.module}/lab/${id}`. Must be updated to use the registered route `/lab/${id}`.

### Lab Engine & Scenarios
- **`src/data/labs/arena.ts`**:
  - Scenario initializers (`arena_empty`, `arena_empty_systemd`, `arena_empty_hosts`) do not create the files or symlinks required by verification. Need to add expected artifacts (e.g., `/root/.ssh/id_rsa`, `/etc/network/interfaces`, `/etc/systemd/system/default.target` symlink, `/etc/hosts` entries).
  - Empty file verification conditions use `file_contains` with `content: ''` which always passes. Must be replaced with `file_matches_regex` using `^$`.
- **`src/features/lab-engine/scenarios.ts`**:
  - `arena_immutable_config`: Does not set immutability flag. Must call VFS API to set immutability (`vfs.chattr` or similar).
  - Missing parent directories: Several arena scenarios call `vfs.mkdir` assuming parent directories exist. Must create parent directories explicitly or use recursive flag.
  - `arena_ssh_hardening`: File owner should be `root` instead of `user`.
  - `arena_corrupt_fs`: Must create the symlink for `libc.so` pointing to `libc.so.6`.
  - Path collisions and errors: Fix path collision in `arena_rogue_suid`, handle `DIRECTORY_ALREADY_EXISTS` in `path_hijack`, create `/usr/bin/curl` before chmod in `arena_zero_day`, and correctly sequence parent directory creation for `/var/run` in `arena_ghost_process`.
  - Duplication: Delegate `arena_sticky_missing` and `arena_path_hijack` to existing scenarios via `applyScenario` to avoid drift.

### Data Validation
- **`src/data/labs/initial.ts`**:
  - 35 labs are missing the required `Lab.difficulty` field, causing filtering issues in `ChallengeArena`. Must populate the `difficulty` field for all `INITIAL_LABS` entries.

### Gamification & State
- **`src/hooks/useFeatureAccess.ts`**:
  - The `diyLabs` gate was lowered to `labsCompleted >= 1`, exposing advanced DIY labs too early. Must revert to unlocking only foundational DIY labs, possibly introducing a `diyLabsAdvanced` flag.
- **`src/hooks/useTerminal.ts`**:
  - Module-completion side-effects run on every command while a lab remains active. Must be gated to run exactly once per module completion.
- **`src/stores/gamificationStore.ts`**:
  - `processLabCompletion` directly increments XP and does not credit the `earn_xp` daily quest. Must explicitly update quest progress for XP earned.
  - `reach_level` is credited only once even when multiple levels are gained at once. Must be changed to compute `levelsGained` and pass that to `updateQuestProgress`.

### Testing
- **`src/hooks/__tests__/useFeatureAccess.test.ts`**:
  - Stale test name regarding `diyLabs` gate. Must update test to explicitly pin the `>= 1` boundary and rename accordingly.
