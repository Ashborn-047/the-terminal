# Open PR Report — `Ashborn-047/the-terminal`

> Generated on 2026-03-30

---

## PR #3 — `feat: add diy advanced scenarios, dynamic processes and comprehensive review report`

| Field | Value |
|-------|-------|
| **Branch** | `jules-12515250108404457818-a42d719c` → `main` |
| **Author** | Ashborn-047 (created by Jules AI agent) |
| **Created** | 2026-03-15 |
| **Files Changed** | 8 files |

### What It Does

1. **Review Report** — Adds a detailed architecture & security analysis (`LINUX_SIMULATOR_REVIEW.md`).
2. **Curriculum Expansion** — Introduces **two new Advanced DIY Labs**:
   - *"Hunt the Rogue Process"* — identify and terminate a cryptominer via `ps`/`kill`.
   - *"Restore Corrupted Configuration"* — repair Nginx config files from backups.
3. **Dynamic Processes** — Refactors `ps` and `top` commands to read from live process state instead of static output. Refactors `kill` to actively remove processes from state.
4. **VFS Seeding** — Implements `initialVFS` to bootstrap scenario-specific file structures when advanced labs start; creates `advanced-scenarios` VFS snapshot.

### 🐛 CodeRabbit Flagged Issues (Actionable)

| # | File | Severity | Issue |
|---|------|----------|-------|
| 1 | `src/data/curriculum.ts` (L127-158) | 🔴 **Bug** | **Duplicate lab entries** — `lab-rogue-process` and `lab-corrupted-config` are duplicated in `curriculum.ts` and conflict with the canonical `INITIAL_LABS`. They also lack required fields (`module`, `xpReward`, `prerequisites`). **Fix:** Remove the duplicates and inline `verify` callbacks; rely on `INITIAL_LABS` and `verification.conditions`. |
| 2 | `src/data/labs/initial.ts` (L37) | 🔴 **Bug** | **Wrong VFS for beginner lab** — The beginner lab `lab-1-2` has `initialVFS: 'advanced-scenarios'`, exposing cryptominer files to beginners. **Fix:** Change to `'default'` or a `'beginner'` snapshot. |
| 3 | `src/data/labs/initial.ts` (L1061-1085) | 🟡 **Missing verification** | Lab `lab-11-diy-1` only checks file removal but **never verifies the rogue process was killed**. **Fix:** Add a verification condition like `type: 'process_not_running', name: 'cryptominer'`. |
| 4 | `src/features/command-engine/commands/core.ts` (L970-991) | 🔴 **Bug** | **Cryptominer process never seeded** — `ps`/`top` expect a running `cryptominer` in `context.processes` but it's never initialized when the lab loads. **Fix:** Seed a cryptominer process entry (with `name`, `pid`, `user`, `startTime`, `status`) when the advanced-scenarios lab starts, similar to how `systemd`/`sshd`/`bash` are seeded in `useTerminal.ts`. |
| 5 | `src/features/command-engine/commands/core.ts` (L1023-1028) | 💡 **Nitpick** | **Fragile sort comparator** — The `top` output sorts formatted string rows by checking for the substring `'cryptominer'`. **Fix:** Sort the process objects array *before* formatting into strings, using a stable numeric comparator (e.g., `b.cpu - a.cpu`). |
| 6 | `src/features/vfs/snapshots.ts` (L69-94) | 🟡 **Dead code** | The `'advanced-scenarios'` key in the `snapshots` object is **redundant/dead** because `getVFSSnapshot()` uses `SNAPSHOT_REGISTRY` populated by `createAdvancedScenariosSnapshot()`. **Fix:** Remove the duplicate or refactor into a single source. |
| 7 | `src/lib/vfsSnapshots.ts` (L70-91) | 🟡 **Duplicate** | Same issue as above — two conflicting `'advanced-scenarios'` snapshot definitions exist. **Fix:** Consolidate into one. |
| 8 | `src/pages/LabView.tsx` (L47-54) | 🔴 **Bug** | **Locked labs can auto-start** — The `useEffect` allows labs with `status === 'locked'` to call `startLab`. **Fix:** Only allow `status === 'available'` (or undefined) to trigger start; redirect locked labs back to curriculum page. |

---

## PR #2 — `⚡ Bolt: Optimize terminal typing performance with memoization`

| Field | Value |
|-------|-------|
| **Branch** | `bolt-terminal-memo-optimization-2351462436912522554` → `main` |
| **Author** | Ashborn-047 (created by Jules AI agent) |
| **Created** | 2026-03-14 |
| **Files Changed** | 1 file (`src/components/terminal/Terminal.tsx`) |

### What It Does

Extracts the terminal history rendering into a new `HistoryEntry` component wrapped in `React.memo()` to stop re-rendering all history entries on every keystroke.

- **Before:** Every keystroke triggered `O(n)` re-renders across all historical terminal entries (including ANSI regex parsing).
- **After:** Historical entries render once and are skipped on subsequent typing — `O(1)` per keystroke.

### 🐛 CodeRabbit Flagged Issues (Actionable)

| # | File | Severity | Issue |
|---|------|----------|-------|
| 1 | `Terminal.tsx` (L32-55) | 🟡 **Design** | **`userId` prop breaks memoization** — `userId` is passed as a separate prop to `HistoryEntry`, which can cause unnecessary re-renders. **Fix:** Add a `userId` field directly to the `TerminalEntry` type so each entry captures who ran the command at creation time. Remove the external `userId` prop from `HistoryEntry`. |
| 2 | `Terminal.tsx` (L55) | 💡 **Nitpick** | **Missing `displayName`** — The memoized component is anonymous, showing as "Anonymous" in React DevTools. **Fix:** Add `HistoryEntry.displayName = 'HistoryEntry';` after the `memo()` call. |

---

## Summary

| PR | Status | CodeRabbit Verdict | Actionable Items | Nitpicks |
|----|--------|--------------------|-----------------|----------|
| **#3** — Advanced Scenarios | Open | Changes Requested | **7** (3 bugs, 2 dead code, 1 missing verification, 1 locked lab bypass) | 1 |
| **#2** — Memo Optimization | Open | Changes Requested | **1** (userId memoization) | 1 |
