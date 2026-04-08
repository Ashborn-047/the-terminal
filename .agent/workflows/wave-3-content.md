---
description: Wave 3 — Content, Curriculum & Mastery
---

# Wave 3 Restoration — Content & Mastery

This workflow handles the transition from **Engine Stabilization (Wave 2)** to **Content & Curriculum Restoration (Wave 3)**. The goal is to transform the high-fidelity simulator into a world-class educational tool.

## 1. Context & Achievements (Wave 2)
Wave 2 focused on behavioral sophistication. We have achieved:
- **High-Fidelity Rendering**: Migration to **Xterm.js** with Canvas/WebGL support.
- **Streaming Engine**: Support for `AsyncGenerator` streams in `Terminal.tsx` and `executor.ts`, enabling real-time progress bars (verified with `curl` mock).
- **Advanced Redirections**: Robust support for `>>` (append), `2>` (stderr), and `&>` (both) in all executors.
- **Authoritative VFS**: POSIX security (SUID/SGID) hardened and verified with 85/85 regression tests.
- **Version Control**: All stabilization changes pushed to `feature/wave-2-engine-restoration`.

## 2. Objectives for Wave 3
Wave 3 focuses on the **Educational Strategy** and **Gamification**.

### 2.1. "Broken System" Troubleshooting Labs (P0)
1.  Implement **Scenario Initializers** that pre-corrupt the VFS state (e.g., broken permissions, circular symlinks, zombie processes).
2.  Develop 10 high-fidelity scenarios matching RHCSA/LFCS objectives.
3.  Implement **State-Based Verification**: Use Rust/TS telemetry to check the system state (e.g., "Is the process dead?") rather than just command strings.

### 2.2. Progression & Gamification (P1)
1.  **XP Overhaul**: Implement an exponential XP curve ($XP = 100 * 1.5^{(Level-1)}$).
2.  **Streak System**: Add visual badges (e.g., 🔥) to the PS1 prompt based on daily activity.
3.  **Sudden Death Mode**: Implement "Hardcore" mode where catastrophic failures (like `rm -rf /`) result in progress resets.

### 2.3. Co-op & Multiplayer (P1)
1.  **Shared Terminals**: Enable real-time terminal mirroring between users via SpacetimeDB broadcasts.
2.  **Mentor Mode**: allow a privileged user to observe and assist a student's session.

## 3. Handoff Instructions for Next Agent
1.  **Research**: Review `docs/restoration_plan/WAVE_3_CONTENT.md` for scenario details.
2.  **Plan**: Create a fresh `implementation_plan.md` for Wave 3, focusing on a **Scenario Initializer** pattern.
3.  **Core Check**: Ensure any new lab logic uses the high-fidelity `CommandExecutor` as the absolute source of truth.
4.  **UI**: Follow the "Muted UI" philosophy—prioritize terminal real-estate over Neo-Brutalist decor.

**Execute `/daily-handoff` to synchronize state before starting implementation.**
