# Master Plan: Strategic Linux Simulator Restoration

> "The only way to learn a system is to break it. The safe way to do it is here."

## 1. Executive Vision
The goal of this restoration is to transition "The Terminal" from a surface-level visual simulation into a high-fidelity, POSIX-compliant Linux environment. We are moving away from "happy path" string matching toward an authoritative, architectural simulation capable of handling advanced RHCSA/LFCS troubleshooting scenarios.

---

## 2. The Three-Wave Strategy

This restoration is sequenced to ensure that data integrity and core performance are resolved before layering on behavioral complexity and educational content.

| Phase | Title | Primary Objective | Key Deliverable |
|---|---|---|---|
| **Wave 1** | **The Foundation** | Structural Integrity & Performance | Inode/Dentry VFS & $O(1)$ Path Resolution |
| **Wave 2** | **The Engine** | Behavioral Sophistication | AST Parser & Xterm.js Canvas Rendering |
| **Wave 3** | **The Content** | Educational Mastery | Broken System Labs & Co-op Multiplayer |

---

## 3. High-Level Bottleneck Analysis

| Current Setback | Technical Bottleneck | Strategic Solution |
|---|---|---|
| **VFS is a "Facade"** | Inode/Dentry conflation prevents hardlinks. | **Wave 1:** Separate metadata from tree structure. |
| **Input Lag** | $O(n)$ search in `findParentId()`. | **Wave 1:** Implement $O(1)$ Inode mapping. |
| **No Logic** | Regex parser cannot handle `if/for` loops. | **Wave 2:** Build an AST-based Interpreter. |
| **UI Crashes** | React DOM cannot handle 50k+ log lines. | **Wave 2:** Migrate to Xterm.js (Canvas). |
| **Cheatable Labs** | Client-side verification is vulnerable. | **Wave 3:** Move verification logic to Rust. |

---

## 4. The Waves (Detailed Blueprints)

Explore the granular blueprints, technical specifications, and "Do's & Don'ts" for each restoration phase:

### 🌊 [Wave 1: The Foundation](file:///e:/My%20Projects/Linux/docs/restoration_plan/WAVE_1_FOUNDATION.md)
*Focus: Security, Performance, and VFS Core.*

### 🌊 [Wave 2: The Engine](file:///e:/My%20Projects/Linux/docs/restoration_plan/WAVE_2_ENGINE.md)
*Focus: Shell Logic, Rendering, and Backend Authoritativeness.*

### 🌊 [Wave 3: The Content](file:///e:/My%20Projects/Linux/docs/restoration_plan/WAVE_3_CONTENT.md)
*Focus: Certification Coverage, Gamification, and UX Polishing.*

---

## 5. Success Metrics (Target Fidelity: 95%)

| Metric | Baseline (Current) | Target (Post-Restoration) |
|---|---|---|
| **Filesystem Compliance** | 60% (Broken hardlinks) | 100% (True Inode separation) |
| **Scripting Depth** | 15% (No control flow) | 90% (Bash-compatible AST) |
| **Process Realism** | 20% (Flat list) | 95% (Tree-based PPIDs/States) |
| **Educational Depth** | 25% (Simulated tasks) | 95% (RHCSA/LFCS objectives) |

---

## 6. Execution Protocol

1. **Commit through the end:** No half-measures. Wave 1 must be bulletproof before Wave 2 starts.
2. **Standard of Excellence:** Every command implementation must aim for exact flag parity with GNU/Linux equivalents.
3. **Multiplayer-First:** All VFS and Engine changes must consider real-time synchronization via SpacetimeDB.
