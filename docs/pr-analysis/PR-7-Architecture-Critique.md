# PR 7: Add Linux Simulator Architecture Critique

## Overview
This PR adds a comprehensive documentation file (`LINUX_SIMULATOR_CRITIQUE.md`) containing a critical review of the Terminal Simulator project. It details limitations across filesystem operations, process management, command execution, kernel boundaries, and feedback mechanisms.

## CodeRabbit Bot Findings & Required Fixes

### Documentation Refinements
- **`LINUX_SIMULATOR_CRITIQUE.md`**:
  - **Tone Adjustment**: The "Executive Summary" is deemed too harsh. Must revise to adopt a more balanced, constructive tone. Acknowledge project strengths (accessibility, VFS, pipeline engine) before listing limitations as "areas for enhancement" instead of failures.
  - **Type Definition in Examples**: The conceptual snippet for `FileDescriptor` introduces an undefined `Chunk` type, which may confuse readers. Must declare `Chunk` (e.g., `type Chunk = string | Uint8Array`) to clarify that it is a conceptual example.

### Recommended Architectural Fixes
*(These are action items prompted by the critique that should be implemented in the codebase)*
- **Kernel Abstractions & Signals (`src/features/kernel/process.ts`)**:
  - The simulator currently bypasses real signal semantics by directly mutating the Zustand process list. Must implement a central signal dispatcher that respects process groups and signal masks, enqueues signals on `Process` objects, and delivers them asynchronously.
- **Process & User Management**:
  - The flat Zustand `processes` array is inaccurate. Must replace it with a minimal process manager tracking per-process structs (PID, PPID, state, CPU/mem counters, env, TTY) driven by a scheduler tick.
  - Update `top`/`ps` to read simulated real states instead of cosmetic strings.
  - Harden `sudo` implementation by replacing the bypass in `sudo.ts` with a check against a simulated `/etc/sudoers` model and a ticket cache.
  - Introduce per-process environments so commands operate in isolated contexts.
