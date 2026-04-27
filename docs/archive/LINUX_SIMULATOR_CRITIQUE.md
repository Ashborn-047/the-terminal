# 🛡️ Architectural Audit: The Linux Simulator (v0.8)

## Overview & Role Context

"The Terminal" simulator is a highly accessible and impressive educational tool, featuring a robust VFS and pipeline engine. To help elevate this project into an industry-standard educational platform (akin to Red Hat Academy), I have conducted a deep, high-fidelity critique. The purpose of this audit is to identify areas for architectural enhancement, detailing where simulation shortcuts currently exist and providing a roadmap for increased fidelity and pedagogical impact.

This review focuses on **System Architecture and Simulation Fidelity**, aiming to build upon the project's strong foundation.

---

## 1. Vector Analysis: High Fidelity vs. Simulation Shortcuts

### A. The VFS Permission Model & Supplementary Groups
**Finding: Critical Fault in POSIX Compliance**
The current `hasPermission` function in `src/features/vfs/vfs.ts` (`line 235`) relies on a naive check of ownership, primary group ID, or `others`.
*   **The Debt:** It iterates through an explicitly passed `groups` array but fundamentally lacks a system-level resolution of supplementary groups dynamically bound to the current execution context.
*   **SUID/SGID Execution Defect:** While `setuid` metadata exists, the VFS does not inherently alter the effective UID (`euid`) during file execution. The execution layer (`executor.ts`) handles this via a superficial check before passing execution to the underlying command, violating the principle that the kernel (VFS) should enforce executable security.

### B. Pipeline Architecture (`executor.ts`)
**Finding: Streaming Facade (Buffering Anti-Pattern)**
True Unix pipelines (`|`) connect `stdout` of process A directly to `stdin` of process B as an asynchronous stream.
*   **The Debt:** In `executor.ts`, the `execute` loop awaits the *full resolution* of `lastResult.output` before passing it to the next command. This is string buffering, not streaming.
*   **The Impact:** Commands like `tail -f /var/log/syslog | grep "error"` will infinitely hang in the browser because the first pipe segment will never resolve its promise. A true 0.9:1 simulator requires an `AsyncGenerator<string>` architecture for all commands.

### C. Signal & Process State Management (`terminalStore.ts` & `sleep.ts`)
**Finding: Cosmetic Job Control**
The process table (`context.processes` and `useTerminalStore`) acts largely as a React state UI array rather than a process scheduler.
*   **The Debt:** When `kill` is invoked (`src/features/command-engine/commands/process.ts`), it triggers `terminalStore.sendSignal(pid, Signal.SIGTERM)`. However, most commands do not implement a listener for `SIGTERM` or `SIGKILL`. For example, `sleep.ts` only listens for `SIGINT` (Ctrl+C). A `kill -9` will visually remove the process from `ps`, but the underlying JS timeout (or async task) continues running in the background until memory leaks occur.
*   **The Impact:** Attempting to teach RHCSA-level process management is impossible if `kill` merely hides UI elements without aborting the actual thread execution.

---

## 2. Priority Action Roadmap: Moving to 0.9:1

### Phase 1: Critical Restoration Items (The Core Kernel)
1.  **[Pending] Implement True Signal Propagation via `AbortController`:**
    Modify the `executor.ts` and `TerminalStore` to inject an `AbortSignal` into every `CommandContext`. Commands like `sleep` must reject/abort their promises when `SIGKILL` or `SIGTERM` is emitted.
2.  **[Pending] Hardened VFS Permissions (Supplementary Groups):**
    Refactor `vfs.hasPermission` to check against a comprehensive list of supplementary groups tied to the effective user session, not just a mocked array pass-through.
### Phase 2: Architectural Enhancements
1.  **[Pending] Streaming Pipelines (`AsyncGenerator` Migration):**
    Refactor `executor.ts` to connect the output stream of `pipe segment A` directly to the `stdin` iterator of `pipe segment B`. Note: This requires changing the base signature of all 72 commands from `input?: string` to `input?: AsyncGenerator<string>` and is too large for a Phase 1 PoC.
1.  **[Pending] Real Process IDs (PIDs) vs. Mock IDs:** Ensure every pipeline and sub-shell gets a real simulated PID that links child processes to parent processes (`PPID`), allowing `htop` or `ps -ef` to draw accurate process trees.
2.  **[Pending] The Network Manager (Subsystem):** Implement a virtual `tap` interface architecture where `ping` and `curl` interact with a simulated DNS resolution table (`/etc/resolv.conf`) and a mock network stack.

---
