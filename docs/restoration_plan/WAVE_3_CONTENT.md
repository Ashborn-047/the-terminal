# Wave 3: Content & Mastery (Educational Strategy)

## 1. Primary Objectives
Wave 3 transforms the high-fidelity engine into a world-class educational product. We focus on **Curriculum Depth**, **Gamification**, and **Collaborative Learning**.

---

## 2. Technical Blueprints (Details & Sub-Details)

### 2.1. The 10 "Broken System" Labs (P0)
**The Problem:** Current labs are too simple (e.g., "create a file"). Real sysadmins need to fix broken systems under pressure.

#### **What:**
Implement 10 high-fidelity troubleshooting scenarios (RHCSA/LFCS style).

#### **Scenario Examples:**
1.  **The Ghost Process:** A hidden process is consuming 90% CPU but won't show in standard `ps` (requires `lsof` or `/proc` inspection).
2.  **Permissions Nightmare:** A mission-critical binary has the wrong SUID bit, causing silent failures for non-root users.
3.  **The Circular Link:** A symlink loop is crashing a backup script.
4.  **Zombie Apocalypse:** The system table is full of zombie processes; find the parent and kill it.

#### **How:**
Use "Scenario Initializers" that modify the VFS state (Wave 1) before the user logs in.

---

### 2.2. Co-op Labs & Mentor Mode (P1)
**The Problem:** Troubleshooting is often a solo experience, but professional environments are collaborative.

#### **What:**
Enable two or more users to share the same terminal session (using SpacetimeDB synchronization).

#### **Why:**
To allow mentors to watch students in real-time or permit "Pair Debugging" sessions.

#### **How:**
1.  **Shared Inode State:** Both users point to the same VFS instance in SpacetimeDB.
2.  **Terminal Mirroring:** Input/Output streams are broadcasted to all session participants via Xterm.js (Wave 2).

---

### 2.3. Gamification Logic Overhaul (P1)
**The Problem:** The current XP curve is linear and unrewarding. Achievements are purely visual.

#### **What:**
Implement a science-based progression system.

#### **Details:**
*   **XP Math:** Smooth exponential curve ($XP = 100 * 1.5^{(Level-1)}$).
*   **Streak System:** Visual feedback in the PS1 prompt (e.g., a "flame" emoji if the user completes labs 3 days in a row).
*   **Hardcore Mode:** A "Sudden Death" mode where one wrong `rm -rf` deletes the user's progress.

---

## 3. Bottleneck Analysis & Overcoming Challenges

| Setback | Bottleneck | How to Overcome |
|---|---|---|
| **Easy Cheating** | Static text-matching for lab completion. | **The Authoritative Scrutiny:** Use Rust-based telemetry to verify the *state* of the system, not just the command history. |
| **Boring UI** | Too much "Neo-Brutalist" noise. | **The Muting:** Shift to a "Terminal-First" UI where buttons are secondary to the terminal experience. |
| **Isolation** | No feedback loop for students. | **The Mentor System:** Launch real-time collaborative co-op sessions. |

---

## 4. Do's and Don'ts

### ✅ Do's:
*   **Do** base all labs on actual RHCSA/LFCS exam objectives.
*   **Do** ensure that lab verification can handle "creative" solutions (e.g., if a student uses `awk` instead of `grep`).
*   **Do** implement "Reset Lab" buttons that cleanly restore the VFS Inode state.

### ❌ Don'ts:
*   **Don't** use pop-up alerts for feedback; use terminal messages.
*   **Don't** hide the terminal behind modal windows.
*   **Don't** allow XP gains for repetitive, non-educational commands.

---

## 5. Expected vs. Desired Outcomes

| Type | Outcome Definition |
|---|---|
| **Probable** | 10 new high-quality troubleshooting scenarios available. |
| **Expected** | User session duration increases by >30% due to gamification loops. |
| **Desired** | The simulator becomes an industry-standard prep tool for Linux certifications. |

---

## 6. Verification Plan
1.  **Smoke Test:** Can a user complete "The Ghost Process" lab using only the terminal?
2.  **Multplayer Test:** Can two users see each other's typing in real-time?
3.  **Mobile Test:** Is the terminal readable on a 6-inch screen with the new "Muted UI"?
