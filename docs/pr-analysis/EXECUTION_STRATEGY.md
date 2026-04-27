# Execution Strategy — Shared-Foundation Approach

## The Idea
Instead of merging PRs one-by-one and fighting cascading rebases, we extract the **common systems** that appear across multiple PRs, fix them all **once** on a single branch, then layer the unique PR-specific content on top.

---

## Cross-PR Overlap Matrix

| File / System | PR 7 | PR 8 | PR 9 | PR 10 | Hit Count |
|---|:---:|:---:|:---:|:---:|:---:|
| `gamificationStore.ts` | | `spendXp`, `difficultyMode` | `completedChapterIds` | `QuestType` expansion, `earn_xp` fix, `reach_level` fix | **3 PRs** |
| `labStore.ts` | | `hintsUsed` shape, `recordHintUsage`, `resetLab` | | | **1 PR** |
| `progression.ts` | | `DIFFICULTY_MULTIPLIERS` typing | | | **1 PR** |
| `useTerminal.ts` | | | | module-completion gate | **1 PR** |
| `useFeatureAccess.ts` | | | | `diyLabsAdvanced` | **1 PR** |
| `App.tsx` (routes) | | | `/chapters` route | arena route fix | **2 PRs** |
| `AshbornLayout.tsx` (nav) | | | chapters icon | | **1 PR** |
| Playwright Fixtures (all 7 specs) | | shape change | shape change | shape change | **3 PRs** |
| `QuestType` + `DailyQuest` types | | | | expansion + rename | **1 PR** |

### The Big Shared Targets
The files hit by **2+ PRs** are:
1. **`gamificationStore.ts`** — 3 PRs all modify it
2. **`App.tsx`** — 2 PRs add/fix routes
3. **Playwright test fixtures** — 3 PRs all require fixture updates

---

## Execution Layers

### Layer 0: Documentation (PR 7) — Standalone
**What**: Fix the critique doc tone and undefined `Chunk` type.
**Why isolated**: Zero code overlap with anything else. Can be done independently at any time.
**Files**: `LINUX_SIMULATOR_CRITIQUE.md`

### Layer 1: Shared Foundation — Do Once, Covers All PRs
Fix all the shared systems in a single pass. This eliminates the biggest source of merge conflicts.

| # | File | What to fix | Covers |
|---|------|-------------|--------|
| 1 | `gamificationStore.ts` | Expand `QuestType` to 6 values, add `spendXp` with validation, add `difficultyMode`/`setDifficultyMode`, add `completedChapterIds` state field, fix `processLabCompletion` to credit `earn_xp` quest, fix `reach_level` to compute `levelsGained` delta | PR 8 + PR 9 + PR 10 |
| 2 | `labStore.ts` | Change `hintsUsed` from `number[]` → `Record<number, number[]>`, fix `resetLab` init to `{}`, fix `recordHintUsage` signature to `(labId, stepIndex, hintLevel)`, add Zustand persist migration (v1→v2) | PR 8 |
| 3 | `progression.ts` | Tighten `DIFFICULTY_MULTIPLIERS` to `Record<DifficultyMode, number>` | PR 8 |
| 4 | `useTerminal.ts` | Gate module-completion side-effect to fire once (not on every command) | PR 10 |
| 5 | `questStore.ts` | Rename `DailyQuest` → `DailyLabRotation` to avoid name collision | PR 10 |
| 6 | `App.tsx` | Add `/chapters` route (PR 9), verify `/challenge-arena` exists, verify `/lab/:labId` is the only lab route | PR 9 + PR 10 |
| 7 | `tests/e2e/test-utils.ts` | Create `buildGamificationFixture()` and `buildUIFixture()` factories | ALL |
| 8 | All 7 spec files | Replace hardcoded fixture JSONs with factory calls | ALL |

**After Layer 1**: Run `npm run build` + `tsc --noEmit` + `npx playwright test`. Everything must pass. The shared foundation is locked.

### Layer 2: PR-Specific Features — Parallel-Safe
These are the unique components/data that belong to individual PRs. They don't conflict with each other because the shared foundation is already resolved.

#### Layer 2A: Gamification UI (from PR 8)
- `LabComponents.tsx` — bind `DIYLabInstructions` to `onRevealSolution`, `solutionRevealed`, gate reveal on `spendXp`
- `LabsPage.tsx` — wire difficulty selector or remove dead imports
- `SettingsPage.tsx` — add "System Difficulty" UI section
- `AboutLinuxPage.tsx` — fix `ButtonProps` to include `"lime"` variant

#### Layer 2B: Chapters System (from PR 9)
- `ChaptersPage.tsx` — extract `<TrackSection>`, add `!locked` guard, wrap RegExp in try/catch, persist completion globally, add error handling to fetch
- `chaptersData.ts` — fix `moduleId` mappings, fix `/etc` description, escape regex in assessments, add rotation pools for chapters 6-8
- `QuestionProvider.ts` — add `practiceOnly` flag, stub 22 empty chapters as "Coming Soon"
- `AshbornLayout.tsx` — add `Icons.Book` for chapters nav
- Write `chapters.spec.ts` E2E smoke test

#### Layer 2C: Arena Content (from PR 10)
- `arena.ts` — fix empty verification conditions (`file_matches_regex` with `^$`)
- `scenarios.ts` — fix all 8 scenario initializer bugs (parent dirs, immutability, file owners, symlinks, path collisions)
- `initial.ts` — populate `difficulty` field for all 35 labs
- `ChallengeArena.tsx` — fix navigation to `/lab/${id}`
- `useFeatureAccess.ts` — add `diyLabsAdvanced: labsCompleted >= 10` if needed
- Write `arena.spec.ts` E2E smoke test

**After Layer 2 (all sub-layers)**: Final full Playwright run + build verification.

---

## Why This Is Better

| Aspect | PR-by-PR | Shared Foundation |
|--------|----------|-------------------|
| `gamificationStore.ts` conflicts | Resolve 3 times across 3 rebases | Resolve **once** |
| Playwright fixture updates | Update 7 files × 3 rounds = 21 edits | Update 7 files × **1 round** = 7 edits |
| Risk of breaking between merges | Each merge is a cliff edge | Single integration, single test gate |
| Total time | ~8-10 hours (with rebase overhead) | **~5-6 hours** |

---

## Branch Strategy

```
main
 └── integrate/all-pr-features
      ├── Layer 0: PR 7 doc fix (commit 1)
      ├── Layer 1: Shared foundation (commits 2-8)
      ├── Layer 2A: Gamification UI (commit 9)
      ├── Layer 2B: Chapters system (commits 10-12)
      └── Layer 2C: Arena content (commits 13-15)
```

One branch. Well-organized commits. One merge to `main`. Close all 4 PRs with a reference to the integration branch.
