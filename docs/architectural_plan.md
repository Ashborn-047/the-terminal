Enhanced PR #5: Architectural Audit & Restoration Fixes
Analysis of Pull Request #5 and CodeRabbit’s review. The PR introduces hardening and architectural improvements, but CodeRabbit correctly identified several critical regressions and security flaws. This enhanced plan closes those gaps and adds robustness checks.

🔴 Critical Issues (from CodeRabbit)
Issue	Severity	Fix
Privilege Escalation via root group	High	Only UID 0 (root user) bypasses permission checks. The root group grants only group‑level permissions, not full bypass.
Signal delivery mismatch (background jobs)	High	Ensure the same PID is used in job table and signal registry. Add signal handler cleanup.
SUID root also grants global bypass	High	Same fix: only UID 0 bypasses. SUID root binary executed by normal user → only file owner’s permissions apply.
kill %1 (job ID) not working	Medium	Ensure job ID resolution works after PID sync fix.
Stale signal handlers after command exit	Medium	Implement removeSignalHandler to unbind listeners.
✅ Proposed Changes (Enhanced)
1. VFS Security Hardening
[MODIFY] vfs.ts – hasPermission

typescript
// BEFORE (vulnerable):
if (userId === 'root' || groups.includes('root')) return true;

// AFTER (secure):
if (userId === 'root') return true;  // Only UID 0 bypasses
// Groups, including 'root', only grant group-level permissions defined in Inode.groupMask
Add test: sgid_root_bypass.test.ts – Create file owned by root:root with mode 600. Create SGID‑root binary owned by root:root with mode 4750. Run as normal user → access denied.

Add test: suid_root_bypass.test.ts – Same as above but with SUID binary. Verify no global bypass.

2. Execution Engine & Job Control
[MODIFY] executor.ts – Signal Handling & PID Sync

Required Change	Details
PID synchronization	When creating a background job, generate a single PID and use it for both the job table entry and the signal handler registration.
removeSignalHandler	Unbind the signal listener from terminalStore when the command finishes (success, error, or kill).
AbortController integration	After each async operation (file read, glob expansion, write), check signal.aborted and exit early.
Job ID support for kill	Ensure kill %1 resolves to the correct PID. Add a helper resolveTarget(jobIdOrPid) in the job manager.
[MODIFY] executor.ts – Main execution loop (pseudocode)

typescript
async function execute(cmd, args, options) {
  const abortController = new AbortController();
  const pid = generatePID();
  
  // Register signal handler with the SAME pid
  registerSignalHandler(pid, (signal) => {
    abortController.abort();
  });
  
  try {
    for await (const step of asyncSteps) {
      if (abortController.signal.aborted) {
        throw new Error('Interrupted');
      }
      await step();
    }
  } finally {
    removeSignalHandler(pid);   // Clean up!
  }
}
3. Command‑Level Interruptibility
[MODIFY] sleep.ts

typescript
async function sleep(seconds, context) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, seconds * 1000);
    context.onSignal(() => {
      clearTimeout(timer);
      reject(new Error('Interrupted'));
    });
  });
}
[MODIFY] grep.ts

Add context.isInterrupted() check between each file when -r (recursive) is used.

For very large single files, add a check every N lines (e.g., every 1000 lines) to remain responsive.

[FUTURE] Long‑running commands – Document that commands like cat hugefile may not be interruptible mid‑line; this is a known limitation.

4. Signal Enum Decision (Closed)
Decision: Support only POSIX basics – SIGTERM, SIGKILL, SIGINT, SIGHUP.
Custom signals (e.g., SIGUSR1) are not simulated. Document this in README.md.

Update signal.ts (or equivalent) to export an enum:

typescript
export enum Signal {
  TERM = 'SIGTERM',
  KILL = 'SIGKILL',
  INT = 'SIGINT',
  HUP = 'SIGHUP'
}
🧪 Enhanced Verification Plan
Automated Tests (New & Expanded)
Test File	Coverage
sgid_root_bypass.test.ts	SGID‑root binary cannot read root‑owned 600 file.
suid_root_bypass.test.ts	SUID‑root binary cannot bypass permissions.
job_control_kill.test.ts	kill <PID> and kill %1 on background sleep.
signal_cleanup.test.ts	After kill, no stale signal handler remains for next command.
interruptible_grep.test.ts	grep -r stops when interrupted between files.
Run existing suite
bash
npm install
npx vitest run               # must pass 100%
npx vitest run src/features/vfs/__tests__   # permission tests
npx vitest run src/features/command-engine/__tests__   # command engine
Manual Smoke Tests
Test	Expected Result
sleep 100 & → jobs → kill %1 → jobs	Job disappears, no zombie.
sleep 100 & → kill <PID> → jobs	Same as above.
strace sleep 5 → interrupt with Ctrl+C	strace shows --- SIGINT --- and command exits.
grep -r foo / → interrupt with Ctrl+C	Stops within a few seconds, no hang.
Create root:root file with 600 permissions. As normal user: cat file → Permission denied.	No bypass.
Create SGID‑root binary owned by root:root (chmod 2750). Run as normal user → reads file → still denied.	Only group root permissions apply, not full bypass.
Run sleep 5, then kill it. Immediately run ls.	No lingering signal handlers affect ls.
🛡️ Security & Regression Checklist
Only UID 0 bypasses permission checks (no GID 0 bypass).

SUID/SGID root do not grant global bypass.

Background job PID is consistent between job table and signal registry.

removeSignalHandler is called for every finished command.

kill %1 works (job ID resolution).

Long‑running commands check isInterrupted() periodically.

Signal enum is limited to TERM, KILL, INT, HUP and documented.

📝 Open Questions (Resolved)
Original Question	Resolution
Should we implement a more robust Signal enum?	No. Stick to POSIX basics.
Simulate sudo group separately from root group?	No. Not needed for current scope. Future enhancement possible.
🔄 Rollback Plan
If the merge introduces regressions:

bash
git merge --abort                     # if still in merge state
# or
git reset --hard main-backup-<date>   # restore from pre-merge backup
