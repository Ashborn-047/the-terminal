---
description: Restoration Handoff — Phase 1: Foundation
---

# 🚀 Linux Simulator Restoration Handoff

### Context: The "True VFS" Restoration
We are currently on a mission to transition "The Terminal" from a visual facade into a high-fidelity, POSIX-compliant Linux simulator. Our focus is **Wave 1: The Foundation**, where we resolve the underlying architectural debt—specifically the Inode/Dentry conflation—that currently limits our VFS.

---

### Phase 1 Context:
- **Major Goal:** Decouple metadata (Inodes) from names (Dentries).
- **Current Blockers:** Broken hardlinks, $O(n)$ search lag, and memory leaks in signal handlers.
- **Reference Docs:** 
    - [Master Plan](file:///e:/My%20Projects/Linux/docs/restoration_plan/STRATEGIC_RESTORATION_MASTER_PLAN.md)
    - [Wave 1 Blueprint](file:///e:/My%20Projects/Linux/docs/restoration_plan/WAVE_1_FOUNDATION.md)

---

### 🛠️ Interactive Prompt: How should we begin?

To resume our work, simply tell me which of these "Wave 1" tasks you'd like to tackle first:

1.  **"Start the Dependency Audit"**
    *Let's clear the security board by fixing CVEs in `lodash`, `tar`, and `undici` to secure our build foundation.*

2.  **"Blueprint the Inode Table"**
    *Let's dive into the core VFS architecture and define the new `Inode` and `Dentry` interfaces for true 1:1 parity.*

3.  **"Fix the O(n) Path Lag"**
    *Let's implement the Dentry Index Map to resolve file paths in $O(1)$ time, eliminating terminal stutter.*

4.  **"Audit Signal Cleanup"**
    *Let's harden our process management by standardizing how we unsubscribe from SIGINT/SIGTERM listeners on exit.*

---

### Execution Protocol:
- **Maintain Fidelity:** Aim for exact flag parity with GNU/Linux equivalents.
- **No Half-Measures:** Follow the "Do's & Don'ts" in the Wave 1 documentation strictly.
