# Integration & Implementation Plan v2.0 — Hardened

> [!CAUTION]
> This plan supersedes the earlier draft. It was stress-tested against the actual codebase state on `main`, the existing Playwright E2E test suite (7 spec files across 2 directories), the Zustand persist keys, the route table, and the cross-PR file overlap. Every hidden risk identified is documented below.

---

## Critical Risks Identified (Holes in v1.0)

### Risk 1 — PR 7 Is Documentation Only, Not a Codebase Change
**Problem in v1.0**: Step 1 said "Implement the Kernel/Process Manager changes from PR 7". But PR 7 is **purely a `.md` critique document**. It does not ship any code changes. Implementing its suggestions (process manager, signal dispatcher, sudoers model) is an **entire architectural refactor** — weeks of work that would rewrite core systems (`useTerminal.ts`, command execution, VFS) and break every existing Playwright test.

**Fix**: Merge PR 7 as-is (docs only, with tone/type fixes). Defer its architectural recommendations to a separate epic. Do NOT block the other 3 PRs on it.

### Risk 2 — `QuestType` Union Needs Expansion Before PR 10
**Problem**: PR 10 introduces three new quest types: `complete_module`, `find_easter_egg`, `reach_level`. But the current `QuestType` on `main` is:
```typescript
export type QuestType = 'earn_xp' | 'execute_commands' | 'complete_labs';
```
PR 10's `updateQuestProgress('reach_level', ...)` calls will **silently no-op** because the type union doesn't include them, and `dailyQuests.map()` won't match any quest with `q.type === 'reach_level'`. This is not a compile error — it's a **silent runtime bug**.

**Fix**: The `QuestType` expansion MUST happen in the same commit as the quest template additions. This is a PR 10-internal concern, but must be explicitly tracked because it won't cause a build failure.

### Risk 3 — `hintsUsed` Shape Migration (localStorage Corruption)
**Problem**: On `main`, `labStore` persists to `localStorage` key `the-terminal-labs`. The `hintsUsed` field is currently `number[]` (array of step indices). PR 8 wants to change it to `Record<number, number[]>` (object mapping step → hint tiers). **Existing users who have localStorage data will hydrate stale `number[]` arrays into the new `Record` shape**, causing runtime crashes like `Object.keys([0, 1]).map(...)` producing `["0", "1"]` instead of step indices.

**Fix**: PR 8 must include a **Zustand persist migration** in the `persist()` config:
```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: 'the-terminal-labs',
    version: 2,
    migrate: (persisted, version) => {
      if (version < 2) {
        // Convert all hintsUsed arrays to Records
        for (const [id, p] of Object.entries(persisted.progress || {})) {
          if (Array.isArray(p.hintsUsed)) {
            p.hintsUsed = {}; // Reset — old data is incompatible
          }
        }
      }
      return persisted;
    }
  }
)
```
Without this, every returning user's app will crash on lab resume. **The E2E tests won't catch this** because they always start with `localStorage.clear()`.

### Risk 4 — `gamificationStore` Shape Change Breaks Playwright Fixtures
**Problem**: The Playwright tests (`gamification.spec.ts`, `regression.spec.ts`, `curriculum.spec.ts`) inject mock `the-terminal-gamification` JSON into localStorage via `addInitScript`. These fixtures hardcode the current state shape:
```javascript
state: {
  xp: 140, level: 1, totalXpEarned: 140,
  streak: {...}, counters: {}, activityHistory: {},
  unlockedAchievements: [], labsCompleted: 0, hintsUsed: 0,
  dailyQuests: [], version: '3.1'
}
```
If PR 8 adds new required fields (e.g., `difficultyMode`, `spendXp`) or PR 10 expands `questTemplates`, the Zustand `persist` hydration may reject or partially load the fixture, causing **silent state corruption** where some fields are `undefined`.

**Fix**: After each PR merge, **update every `addInitScript` fixture** in all 7 spec files to include the new fields with safe defaults. Create a shared fixture factory in `test-utils.ts` to avoid scattering the shape across tests.

### Risk 5 — PR 10 Registers Route `/labs/${lab.module}/lab/${id}` But Only `/lab/:labId` Exists
**Problem**: The `ChallengeArena.tsx` `onStart` handler navigates to `/labs/${lab.module}/lab/${id}`, but `App.tsx` only has:
```tsx
<Route path="/lab/:labId" element={...} />
```
There is no `/labs/:moduleId/lab/:labId` route. This will render a blank page (no match → no component). The Playwright `curriculum.spec.ts` test expects `/lab/lab-1-1`, so it won't catch this bug — it only tests guided labs, not arena.

**Fix**: The PR 10 fix must change the navigation to `navigate('/lab/' + id)` to match the existing route table. Do NOT add a new route — it creates routing ambiguity.

### Risk 6 — PR 9 Adds `/chapters` Route But No Playwright Coverage
**Problem**: PR 9 introduces a `ChaptersPage` lazy-loaded in `App.tsx`. But the `regression.spec.ts` "page navigation works for all routes" test only checks `/`, `/labs`, `/terminal`, `/profile`. It does not test `/chapters`. If the chapters page has a rendering crash (e.g., from the missing default export noted in the analysis), it will go undetected until a user clicks the nav link.

**Fix**: After merging PR 9, add `/chapters` to the route navigation test and write a minimal smoke test that asserts the page renders without crash.

### Risk 7 — `processLabCompletion` Bypasses `awardXP` (Quest Desync)
**Problem**: On `main`, `processLabCompletion` directly does `set({ xp: state.xp + finalXpGain })` instead of calling `get().awardXP(finalXpGain)`. The `awardXP` method is the one that calls `updateQuestProgress('earn_xp', ...)`. This means **lab XP never credits the `earn_xp` daily quest**. PR 10's analysis noted this but the v1.0 plan didn't mark it as a blocking prerequisite.

**Fix**: This must be fixed in PR 8 (gamification overhaul) since it's a gamification engine bug. Specifically, at the end of `processLabCompletion`, add:
```typescript
get().updateQuestProgress('earn_xp', finalXpGain);
```

### Risk 8 — `diyLabs` Gate Already Lowered on `main`
**Problem**: The v1.0 plan attributed the `diyLabs >= 1` issue to PR 10. But looking at `main` right now, `useFeatureAccess.ts` line 30 already shows `diyLabs: labsCompleted >= 1`. This is **already shipped on main**. PR 10's analysis flagged it, but this means: (a) reverting it would change behavior users already see, and (b) tests written against it on `main` already expect it.

**Fix**: Accept the `>= 1` threshold for basic DIY labs. If advanced DIY gating is needed, introduce a **new** `diyLabsAdvanced: labsCompleted >= 10` field rather than reverting.

### Risk 9 — No `spendXp` Validation on `main`
**Problem**: PR 8 introduces `spendXp` for hard-mode hint reveals. But the current gamificationStore has no `spendXp` action at all. When PR 8 adds it, `LabComponents.tsx` will call `spendXp(cost)` and expect a boolean return. If the implementation accepts negative values or doesn't use functional state updates, the XP can go negative or stale.

**Fix**: The `spendXp` implementation must:
1. Validate `amount > 0 && Number.isFinite(amount)`
2. Use `set(state => ({ xp: state.xp - amount }))` (functional update, not `get().xp`)
3. Return `false` if insufficient XP

### Risk 10 — PR 8 and PR 10 Both Modify `gamificationStore.ts`
**Problem**: PR 8 adds `spendXp`, `difficultyMode`, `setDifficultyMode`. PR 10 expands `QuestType` and adds quest templates. Both files touch the same Zustand store. If we merge PR 8 first and then rebase PR 10, the `gamificationStore.ts` will have massive conflicts in the interface definition, the initial state, and the actions.

**Fix**: When rebasing PR 10 onto post-PR-8 main, resolve conflicts by:
- Keeping PR 8's new fields (`difficultyMode`, `spendXp`)
- Adding PR 10's expanded `QuestType` union on top
- Combining both sets of `questTemplates`
- Running `tsc --noEmit` after resolution to verify no type errors

### Risk 11 — Duplicate `DailyQuest` Interface (questStore vs gamificationStore)
**Problem**: There are **two separate `DailyQuest` interfaces** in the codebase:
1. `questStore.ts` line 5: `DailyQuest { labId, xpMultiplier }` — used for the broken-system daily rotation
2. `gamificationStore.ts` line 111: `DailyQuest { id, title, type, target, progress, xpReward, completed, claimed }` — used for the daily quest UI

These are completely different shapes with the same name. When PR 10 expands quest types, any import confusion between these two will cause silent type mismatches. Components importing `DailyQuest` could get the wrong interface depending on import path.

**Fix**: Rename `questStore.ts`'s interface to `DailyLabRotation` or `DailyQuestAssignment` to eliminate naming collision. Do this in PR 10 since it's the one expanding quest functionality.

### Risk 12 — CI Pipeline Runs `npm run build` Before Playwright
**Problem**: The `playwright.yml` workflow runs `npm run build` (line 39) before `npx playwright test` (line 41). This means **any TypeScript error or Vite build error will fail the CI before tests even run**. The PRs must compile cleanly at every merge point, not just pass tests.

**Fix**: For every PR merge, run both `npm run build` AND `npx playwright test` locally. The plan already says `tsc --noEmit` but that's not sufficient — Vite's build can catch additional issues (unused CSS modules, broken dynamic imports, etc.). Add `npm run build` to the local verification loop.

### Risk 13 — `home.spec.ts` Lives Outside `e2e/` Directory
**Problem**: There is a stray test file at `tests/home.spec.ts` (outside the `tests/e2e/` directory). It also hardcodes `the-terminal-ui` state fixtures. This 7th test file could be missed when updating fixtures because the plan only mentions "5 spec files in `tests/e2e/`".

**Fix**: Include `tests/home.spec.ts` in the fixture update sweep. The plan should reference **7 spec files total** (1 in `tests/` + 6 in `tests/e2e/`).

---

## Revised Merge Order

### Phase 0: Merge PR 7 (Documentation Only) — ⏱️ 15 min
| Item | Detail |
|------|--------|
| **What** | Fix critique doc tone + undefined `Chunk` type |
| **Files touched** | `LINUX_SIMULATOR_CRITIQUE.md` only |
| **Test impact** | None — no code changes |
| **Merge method** | Squash merge |

**Defer**: All architectural recommendations (process manager, signal dispatcher) to a separate `epic/kernel-v2` branch.

### Phase 1: Merge PR 8 (Gamification v2.0) — ⏱️ 2-3 hours
| Item | Detail |
|------|--------|
| **What** | Difficulty modes, tiered hints, `spendXp`, new About page |
| **Files touched** | `labStore.ts`, `gamificationStore.ts`, `LabComponents.tsx`, `LabsPage.tsx`, `SettingsPage.tsx`, `AboutLinuxPage.tsx`, `progression.ts` |
| **Test impact** | **HIGH** — store shape changes |

**Pre-merge checklist**:
- [ ] Fix `resetLab` → `hintsUsed: {}` (not `[]`)
- [ ] Fix `recordHintUsage` signature → `(labId, stepIndex, hintLevel)`
- [ ] Add Zustand persist migration (version 1 → 2) for `the-terminal-labs`
- [ ] Implement `spendXp` with validation (finite, positive, functional update)
- [ ] Wire `difficultyMode` UI into SettingsPage or remove dead imports
- [ ] Fix `ButtonProps` type to include `"lime"` variant
- [ ] Tighten `DIFFICULTY_MULTIPLIERS` type to `Record<DifficultyMode, number>`
- [ ] Fix `DIYLabInstructions` to bind `onRevealSolution` + `solutionRevealed`
- [ ] Add `get().updateQuestProgress('earn_xp', finalXpGain)` to `processLabCompletion`
- [ ] **Update all 7 Playwright spec files** (including `tests/home.spec.ts`): add `difficultyMode`, `hintsUsed: {}` etc. to fixtures
- [ ] **Run full Playwright suite locally**
- [ ] **Run `npm run build`** — zero warnings, zero errors
- [ ] **Run `tsc --noEmit`** — zero errors

### Phase 2: Merge PR 9 (Chapters System) — ⏱️ 2-3 hours
| Item | Detail |
|------|--------|
| **What** | Chapters/assessments UI, question provider, curriculum docs |
| **Files touched** | `App.tsx`, `AshbornLayout.tsx`, `ChaptersPage.tsx`, `chaptersData.ts`, `QuestionProvider.ts` |
| **Test impact** | **MEDIUM** — new route, sidebar nav change |

**Pre-merge checklist**:
- [ ] Rebase onto post-PR-8 `main`
- [ ] Add `export default ChaptersPage` for `React.lazy` compatibility
- [ ] Fix `moduleId` mapping for chapters 5-8
- [ ] Escape regex metacharacters in `correctAnswer` strings or remove `regexMatch: true`
- [ ] Persist `completedChapterIds` in `gamificationStore` (not local state)
- [ ] Add `if (!locked)` guard to chapter card `onClick`
- [ ] Wrap `new RegExp(...)` in try/catch
- [ ] Add `try/catch` around `handleStartChapter` fetch
- [ ] Add `practiceOnly` flag to synthetic drills (no XP)
- [ ] Add "Coming Soon" stubs for 22 empty chapters in `staticQuestionBank`
- [ ] Extract `<TrackSection>` from duplicated JSX
- [ ] Add distinct `Icons.Book` for chapters nav
- [ ] **Add `/chapters` to `regression.spec.ts` route navigation test**
- [ ] **Write `chapters.spec.ts` E2E smoke test**
- [ ] **Run full Playwright suite**

### Phase 3: Merge PR 10 (Arena Challenges) — ⏱️ 3-4 hours
| Item | Detail |
|------|--------|
| **What** | 40 arena labs, quest expansion, broken system scenarios |
| **Files touched** | `arena.ts`, `scenarios.ts`, `initial.ts`, `ChallengeArena.tsx`, `gamificationStore.ts`, `useTerminal.ts`, `useFeatureAccess.ts` |
| **Test impact** | **HIGH** — store shape change, new content, quest type expansion |

**Pre-merge checklist**:
- [ ] Rebase onto post-PR-9 `main`
- [ ] Expand `QuestType` to include `'complete_module' | 'find_easter_egg' | 'reach_level'`
- [ ] Add corresponding `questTemplates` entries for new types
- [ ] Fix `ChallengeArena.tsx` navigation: `/lab/${id}` (not `/labs/.../lab/...`)
- [ ] Populate `difficulty` field for all 35 `INITIAL_LABS` entries
- [ ] Fix all scenario initializer issues:
  - [ ] Create parent dirs before `vfs.mkdir`
  - [ ] Set immutability in `arena_immutable_config`
  - [ ] Fix file owner in `arena_ssh_hardening`
  - [ ] Create symlink in `arena_corrupt_fs`
  - [ ] Fix path collision in `arena_rogue_suid`
  - [ ] Handle `DIRECTORY_ALREADY_EXISTS` in `arena_path_hijack`
  - [ ] Create `/usr/bin/curl` before chmod in `arena_zero_day`
  - [ ] Sequence `/var/run` creation in `arena_ghost_process`
- [ ] Replace `file_contains` with `content: ''` → `file_matches_regex` with `^$`
- [ ] Delegate `arena_sticky_missing` and `arena_path_hijack` to existing scenarios
- [ ] Gate module-completion side-effect in `useTerminal.ts` to fire once
- [ ] Fix `reach_level` to compute `levelsGained` delta
- [ ] Accept `diyLabs >= 1` on main; add `diyLabsAdvanced >= 10` if needed
- [ ] Update unit test name for `useFeatureAccess.test.ts`
- [ ] **Update Playwright fixtures with new `questTemplates` shape**
- [ ] **Write `arena.spec.ts` E2E smoke test**
- [ ] **Run full Playwright suite**
- [ ] **Run `tsc --noEmit`** — zero errors

---

## Shared Test Infrastructure Upgrade

Before starting any PR merge, create a **fixture factory** in `tests/e2e/test-utils.ts` to centralize the mock state shape:

```typescript
export function buildGamificationFixture(overrides: Partial<GamificationState> = {}) {
  return JSON.stringify({
    state: {
      xp: 0, level: 1, totalXpEarned: 0,
      streak: { current: 0, longest: 0, lastActivityDate: null, freezesRemaining: 1 },
      counters: {}, activityHistory: {}, unlockedAchievements: [],
      labsCompleted: 0, hintsUsed: 0, dailyQuests: [],
      lastQuestGenerationDate: null, version: '3.1',
      difficultyMode: 'NORMAL', // PR 8
      questTemplates: [],        // PR 10 will expand
      ...overrides
    },
    version: 0
  });
}
```

This ensures that when future PRs add new fields, you update **one function** instead of hunting through 7 spec files.

---

## Post-Merge Validation Checklist

After all 4 PRs are merged:

- [ ] `npm run build` — zero warnings, zero errors
- [ ] `tsc --noEmit` — zero type errors
- [ ] `npx playwright test` — all specs green
- [ ] Manual smoke test: Onboarding → Lab 1-1 → Completion → Dashboard
- [ ] Manual smoke test: Navigate to `/chapters`, `/challenge-arena`, `/settings`
- [ ] Verify localStorage migration: import old `the-terminal-labs` JSON → no crash
- [ ] Verify `earn_xp` quest increments when completing a lab
- [ ] Verify difficulty mode selector appears in Settings
- [ ] Verify Arena shows challenges grouped by difficulty tier
