---
description: Phase 10 — Linux Simulator Architectural Harmonization & Restoration
---

## Objective
Harmonize the remote `linux-simulator-critique-and-fixes` branch with the local high-fidelity architecture, preserving modularity and observability while adopting RBAC hardening and POSIX improvements.

## Steps Completed

### 1. Pre-Merge Verification
- Fetched `origin/linux-simulator-critique-and-fixes`.
- Inspected deletions (e.g., `lsof.ts`) and consolidated files (`core.ts`, `extended.ts`).
- Created a stabilization plan to "Harvest & Distribute" instead of accepting consolidation.

### 2. Core Architectural Hardening
- **VFS RBAC**: Updated `src/features/vfs/vfs.ts` to accept `groups: string[]` in all resolution and mutation methods.
- **Executor Context**: Updated `CommandContext` in `src/features/command-engine/types.ts` to propagate session `groups`, `jobs`, and `aliases`.
- **Store Sync**: Refactored `terminalStore.ts` to support process management and native state persistence.

### 3. Modularity Restoration
- Unstaged mass deletions and consolidated remote files.
- Restored modular `*.ts` command files from git history.
- Deleted `src/features/command-engine/commands/core.ts` and `extended.ts` to prevent registration conflicts.

### 4. Command API Synchronization (In Progress)
- **Verified & Updated**:
    - `ls.ts`: Hardened RBAC, added `-lARh` flags and color.
    - `cat.ts`: Hardened RBAC, added `-n` and interrupt check.
    - `cd.ts`: Hardened RBAC, fixed resolution logic.
    - `mkdir.ts`: Hardened RBAC, fixed hierarchical creation.
    - `touch.ts`: Hardened RBAC.

## Next Steps (Remaining Tasks)

### 1. Final Command Synchronization
- [ ] Update `rm.ts`, `cp.ts`, `mv.ts` to use `vfs.resolve` and `groups`.
- [ ] Update `chmod.ts`, `chown.ts`, `ln.ts` to use new VFS signatures.
- [ ] Update `sleep.ts` to utilize `context.onSignal` for `SIGINT` support.
- [ ] Audit `grep.ts` and `find.ts` for globbing consistency.

### 2. Verification & Finalization
- [ ] Run full regression suite: `npx vitest`.
- [ ] Perform manual smoke tests: `id`, `ls -lAR`, `strace cat /etc/passwd`.
- [ ] Execute `git commit` to finalize the merge.
- [ ] Push to `main`.

## Safety Procedures
- **Rollback**: If architectural regression occurs, run `git merge --abort` or reset to `main-backup`.
- **Linting**: Always verify parameter counts for `vfs.resolve` (6 args) and `formatError` (1 arg).
