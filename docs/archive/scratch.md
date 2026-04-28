Wave 3: Enhanced Implementation Blueprint
Status: Ready for Development
Core Theme: From Engine Stabilization to Educational Depth

Part 1: Strategic Architecture & Core Principles
Before writing code, we must adhere to the non-negotiable constraints identified in the analysis.

Principle	Technical Implementation Mandate
Terminal-First UI	All feedback (success, error, hint) must be printed to the Xterm.js buffer. Zero browser alert() or confirm() popups.
Authoritative Scrutiny (Anti-Cheat)	Lab completion must verify VFS Inode State or Process Snapshot. Never rely on history log matching.
Idempotent Resets	"Reset Lab" must restore the VFS to a clean snapshot before re-applying the scenario corruption.
Outcome Verification	Allow for awk vs grep. Check the result of the command (file content/perms), not the syntax of the command.
Part 2: Phase-Based Execution Plan
We will split Wave 3 into three phases to manage complexity and avoid blocking the release of core content.

Phase 3.1: Core Curriculum & Verification Engine (Solo Mode)
*Goal: Ship the 10 "Broken System" labs with a robust, cheat-proof verification system.*

Tasks:

Scenario Initializer Registry (scenarios.ts)

Outcome-Based Verification Engine (verification.ts)

10 VFS-Corruption Lab Definitions (broken_systems.ts)

Gamification Overhaul (XP Curve + Streak Badge)

Hardcore Mode Foundation (Data model only)

Phase 3.2: Collaborative Learning (Mentor Mode)
Goal: Enable real-time terminal viewing for instructors.

Tasks:

SpacetimeDB Shared Session Subscription (spacetime.ts)

Read-Only Terminal Mirroring (Stream I/O to observer)

Session Join Link Generation

Phase 3.3: Polish & The "Hardcore" Loop
Goal: Launch Hardcore Mode and ProcFS simulation for advanced labs.

Tasks:

Hardcore Mode Logic (Sudden Death state management)

ProcFS Simulation Layer (Required for "Ghost Process" lab)

Mobile Terminal Optimization (6-inch screen legibility)

Part 3: Detailed Technical Specifications (Phase 3.1)
3.1.1. Scenario Initializer Pattern (Detailed)
File: src/features/lab-engine/scenarios.ts

typescript
// IMPORTANT: Do NOT export the VFS instance globally. Pass it as an argument.
export type ScenarioInitializer = (vfs: VirtualFileSystem, logger: LabLogger) => Promise<void>;

export const ScenarioRegistry: Record<string, ScenarioInitializer> = {
  // Example: Permissions Nightmare
  'permissions_nightmare': async (vfs, logger) => {
    // Step 1: Ensure base binary exists
    const binaryPath = '/usr/bin/passwd';
    if (!vfs.exists(binaryPath)) {
       logger.warn('Binary missing, creating mock binary.');
       vfs.writeFile(binaryPath, '#!/bin/bash\necho "Mock Passwd"');
    }
    
    // Step 2: Intentionally corrupt: Remove SUID bit (should be 4755 or 755)
    // We set it to 0755 (standard executable, no SUID)
    await vfs.chmod(binaryPath, 0o755);
    
    // Step 3: Also corrupt /etc/shadow permissions (common professional certification issue)
    await vfs.chmod('/etc/shadow', 0o600); // Actually this is correct, we want it WRONG for the lab.
    // Let's make it world-readable to simulate a security breach.
    await vfs.chmod('/etc/shadow', 0o644);
    
    logger.info('Scenario "Permissions Nightmare" applied.');
  },

  // Example: Circular Link (Corrupted Backup Script)
  'circular_link': async (vfs, logger) => {
    const dirA = '/home/user/backup';
    const dirB = '/home/user/backup/archive';
    
    await vfs.mkdir(dirA, { recursive: true });
    await vfs.mkdir(dirB, { recursive: true });
    
    // Create symlink loop: archive/latest -> ../
    await vfs.symlink('../', `${dirB}/latest`);
    
    logger.info('Circular link created. Running `ls -lR` will hang or error.');
  }
};
Integration with labStore.ts:

typescript
// src/stores/labStore.ts
async function startLab(labId: string) {
  const lab = getLabById(labId);
  setActiveLab(lab);
  
  // CRITICAL: Always start from a clean VFS snapshot
  const cleanSnapshot = createVfsSnapshot(lab.baseImage); // e.g., 'ubuntu-22.04-minimal'
  setCurrentVfs(cleanSnapshot);
  
  // Apply Scenario if defined
  if (lab.scenarioId) {
    const initializer = ScenarioRegistry[lab.scenarioId];
    if (initializer) {
      setIsLoading(true);
      await initializer(cleanSnapshot, console);
      setIsLoading(false);
    }
  }
  
  // Write to terminal: "System ready. Troubleshoot the issue with /usr/bin/passwd."
  terminalWrite('Lab started. Find the issue preventing non-root users from changing passwords.\n');
}
3.1.2. Verification Engine (Outcome-Based)
File: src/features/lab-engine/verification.ts

typescript
export interface OutcomeCheck {
  type: 'fileExists' | 'filePermissions' | 'fileContains' | 'symlinkTarget';
  path: string;
  expected: any;
}

export async function verifyLabOutcome(vfs: VirtualFileSystem, lab: Lab): Promise<VerificationResult> {
  const checks: OutcomeCheck[] = lab.verificationCriteria; // NOT command history
  
  for (const check of checks) {
    switch (check.type) {
      case 'filePermissions':
        const stats = await vfs.stat(check.path);
        // Mask to get just permission bits (e.g., 0o777)
        const perms = stats.mode & 0o777;
        // Allow flexibility: SUID bit (0o4000) must be present, regardless of exact octal
        if (check.expected.mustHaveSuid && !(stats.mode & 0o4000)) {
          return { passed: false, reason: `${check.path} missing SUID bit.` };
        }
        if (perms !== check.expected.perms) {
          return { passed: false, reason: `${check.path} permissions are ${perms.toString(8)}, expected ${check.expected.perms.toString(8)}.` };
        }
        break;
        
      case 'fileContains':
        const content = await vfs.readFile(check.path, 'utf8');
        if (!content.includes(check.expected.substring)) {
          return { passed: false, reason: `${check.path} does not contain required configuration.` };
        }
        break;
    }
  }
  
  return { passed: true };
}
3.1.3. The 10 "Broken System" Labs (Data Definitions)
File: src/data/broken_systems.ts

Focus on VFS-only labs for Phase 3.1. Defer Process Table labs to Phase 3.3.

ID	Name	Scenario ID	Verification Criteria (Outcome-Based)
lab_001	The Permissions Nightmare	permissions_nightmare	1. /usr/bin/passwd has SUID bit (mode includes 0o4000). 2. /etc/shadow permissions are 0o000 or 0o400 (restricted).
lab_002	The Circular Link	circular_link	1. Symlink /home/user/backup/archive/latest no longer points to ../. 2. (Bonus) Script /usr/local/bin/backup.sh runs without error.
lab_003	The Missing Library	missing_ld	1. ldconfig cache updated. 2. Binary /usr/local/bin/myapp runs without "library not found" error.
lab_004	The Broken Sudoers	corrupt_sudoers	1. User can run sudo -l without syntax error. 2. File /etc/sudoers has correct permissions (0440).
lab_005	The Filling Disk	disk_full_sim	1. Large file /var/log/huge.log removed or truncated. 2. df -h shows usage below 90%.
lab_006	The Wrong Time	time_skew	1. System time is within 5 seconds of NIST time (mocked via date). 2. File /etc/localtime symlink points to correct zone.
lab_007	The Orphaned Package	broken_dpkg	1. dpkg --configure -a runs successfully. 2. Package status is ii (installed) not rc or iF.
lab_008	The Lock File	stale_lock	1. File /var/run/myapp.pid removed. 2. Service myapp can start.
lab_009	The Wrong Shell	nologin_user	1. User operator shell is changed from /bin/false to /bin/bash.
lab_010	The Host Resolution	hosts_misconfig	1. /etc/hosts contains entry 127.0.0.1 localhost. 2. ping localhost works.
3.1.4. Gamification Overhaul (XP & Streak)
XP Formula Update:

typescript
// src/stores/gamificationStore.ts
export const xpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  // Use floor to avoid floating XP
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// MIGRATION STRATEGY (Execute ONCE on app load)
export function migrateUserLevels() {
  const user = getCurrentUser();
  const totalXp = user.totalXpEarned;
  let newLevel = 1;
  while (totalXp >= xpForLevel(newLevel + 1)) {
    newLevel++;
  }
  
  if (newLevel !== user.level) {
    user.level = newLevel;
    user.needsMigrationNotice = true; // Show UI toast: "Progression system updated!"
  }
}
Streak Badge Implementation:

tsx
// src/components/Terminal.tsx
const getPromptPrefix = () => {
  const streak = useGamificationStore(state => state.streak);
  let prefix = 'user@linux-lab:~$ ';
  if (streak >= 3) {
    prefix = `🔥 ${streak}d ${prefix}`;
  }
  return prefix;
};
3.1.5. Hardcore Mode Foundation (Data Model Only)
We will not implement the "Sudden Death" logic yet, but we will prepare the schema.

typescript
// src/types/hardcore.ts
export interface HardcoreProfile {
  isActive: boolean;
  deathCount: number;
  currentSessionStarted: number; // timestamp
  protectedPaths: string[]; // ['/bin', '/boot', '/lib', '/etc'] - Read-only enforced by VFS layer
}
Part 4: Phase 3.2 - SpacetimeDB Mentor Mode (Detailed)
Objective: Enable a "Read-Only Observer" pattern first. Editing collaboratively comes later.

Implementation Steps:

Define SpacetimeDB Reducer: subscribe_to_session

Client calls subscribe(session_id).

Server subscribes client to the terminal_output table for that session.

Broadcast Function (spacetime.ts)

typescript
export function broadcastTerminalOutput(sessionId: string, data: string) {
  conn.reducers.sendTerminalOutput({
    session_id: sessionId,
    data: data,
    timestamp: Date.now()
  });
}
Observer UI Component:

Add a "Share Session" button in the header.

Generates a URL: /watch?session=abc123.

The observer sees a read-only Xterm.js instance that streams the host's output. The observer's input is disabled.

Part 5: Verification Plan (Enhanced)
Test ID	Scenario	Expected Result	Tool
V-3.1.1	Start "Permissions Nightmare" 3 times without page refresh.	VFS is reset to clean state then corrupted identically each time.	Vitest (Unit)
V-3.1.2	Fix /usr/bin/passwd with chmod u+s vs chmod 4755.	Both solutions pass verification because check looks for SUID bit mask.	Manual
V-3.1.3	User with 150 XP logs in after migration.	Level displayed is correct according to new exponential curve.	E2E (Playwright)
V-3.2.1	Two browsers open same watch session. Host runs ls.	Observer sees output instantly. Observer cannot type.	Manual
V-UI.1	Complete a lab.	Prompt shows 🔥 3d badge. No browser alert popup.	Manual
Part 6: Timeline & Milestones
Week	Focus	Deliverable
Week 1	Phase 3.1 Core Engine	Scenario Registry + VFS Snapshot Resets + Outcome Verification Engine.
Week 2	Phase 3.1 Content	Implement 10 Lab Definitions + Manual Testing of each lab's reset loop.
Week 3	Phase 3.1 Gamification	XP Migration Script + Streak Badge UI + "Terminal-First" feedback hooks.
Week 4	Phase 3.2 Mentorship	SpacetimeDB Read-Only Stream + Session Sharing URL.
Week 5	Polish & Hardcore Prep	Mobile UI pass (6-inch screen) + Hardcore data schema review.
Week 6	Buffer / ProcFS	Address any bugs. If ahead of schedule, begin ProcFS simulation for "Ghost Process."
Part 7: Final Pre-Development Checklist
Before you run git checkout -b wave-3:

VFS Snapshot System: Confirm Wave 1/2 provides a reliable createVfsSnapshot() and restoreVfsSnapshot() function. If not, this is a blocker for Wave 3.

SpacetimeDB Module: Ensure spacetime client is installed and connection logic is stable.

UI Component Audit: Remove all existing alert() calls from the codebase. Replace with terminal.writeln().
