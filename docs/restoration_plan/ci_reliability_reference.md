# CI Reliability & Error Analysis: The "Healing" Reference Guide

This document serves as the definitive reference for diagnosing and resolving CI/E2E instabilities in the Linux Simulator. It codifies the "Architectural Healing" philosophy established during the Wave 2 restoration.

---

## 1. The Core Philosophy: "Heal, Don't Bend"

When CI fails, avoid the temptation to just "bend" the infrastructure or "break" features to accommodate the failure.

| Approach | Action (Avoid) | Result |
| :--- | :--- | :--- |
| **Bending Bones** | Increasing timeouts (30s → 120s). | Masks latent race conditions and slows down the dev cycle. |
| **Breaking Bones** | Disabling features (Canvas, Heartbeat) for tests. | Substantially reduces test fidelity; you aren't testing the real app. |
| **Healing Bones** | **Introducing signals, determinism, and observability.** | **Permanent reliability. Tests act like a bridge, not a guess.** |

---

## 2. Case Study: The Wave 2 Engine Bottlenecks

The transition from Wave 1 (Stability) to Wave 2 (Complexity) introduced four major stressors. Below is the technical audit of why the engine "broke" in CI:

### Bottleneck Inventory

| Bottleneck | Why it fails in CI | The "Fracture" Point |
| :--- | :--- | :--- |
| **Hydration Latency** | SPA renders routes before background services (Spacetime/VFS) are fully alive. | Playwright navigates to `/terminal` and types into a "dead" input buffer. |
| **Visual Fragility** | Tests scan for character strings like `[u@linux-lab]`. | CPU lag splits strings across animation frames; text locators time out. |
| **Non-Determinism** | PIDs and Job IDs are generated via `Math.random()`. | Signal mapping (`SIGINT/SIGKILL`) fails if PID values change between retries. |
| **Hardware Stalls** | `CanvasAddon` fails in "Headless" environments without GPU. | The terminal process hangs permanently during the `xterm.js` mount. |
| **CPU Starvation** | Running 2 workers on 2-core runners. | Vite Server and Browser compete for cycles, causing "frozen" micro-stalls. |

---

## 3. Case Study: The "Hydration Race" Timeline

In a typical local development environment, the following happens in <100ms. In a resource-constrained CI runner, this stretches to >5s:

1.  **0ms**: Browser loads `index.html`.
2.  **50ms**: React mounts `App.tsx`.
3.  **100ms**: `initSpacetimeSync()` starts (Async).
4.  **200ms**: `useVFSStore` hydrates from `localStorage` (Async).
5.  **300ms**: Playwright sees the "Terminal" link in the sidebar and **clicks immediately**.
6.  **400ms**: `TerminalPage` mounts.
7.  **500ms**: `ShellExecutor` constructor runs, but the VFS snapshot is still `null`.
8.  **Result**: The terminal is now "Alive" but "Brainless." Commands typed now are lost or throw `VFS_NOT_INITIALIZED`.

---

## 4. The Healing Framework (The "Bridge of Certainty")

To negate these errors, the following "First-Class Signals" must be maintained:

### 1. Deterministic Identity
*   **Implementation**: Use monotonic incrementing counters for PIDs and JIDs stored in `terminalStore`.
*   **Fix**: PID 1000 is always the first foreground process of a new session.

### 2. Status Signaling (data-engine-status)
*   **Implementation**: `<div id="terminal-container" data-engine-status="booting | ready | busy">`.
*   **Fix**: Tests **NEVER** wait for text characters. They wait for the **Engine State Signal**. 

### 3. Readiness Gating (window.__APP_READY__)
*   **Implementation**: `App.tsx` exposes a global flag only after all async hooks (Spacetime, VFS, Features) are confirmed synchronized.
*   **Fix**: `test-utils.ts` uses `page.waitForFunction(() => window.__APP_READY__)` as the first step of every test.

### 4. Adaptive Rendering (Auto-Heal)
*   **Implementation**: Try/Catch wrappers around xterm.js addons.
*   **Fix**: If Canvas fails, the component **auto-heals** by switching to the DOM renderer instantly.

---

## 4. Future Diagnostic Checklist

If a test fails in the future, follow these steps before changing a single file:

1.  **Check the Status Attribute**: In the Playwright Trace, inspect the Terminal container. What is the `data-engine-status`? 
    *   If `booting`: A background service is hung (Check Spacetime/VFS).
    *   If `busy`: The command is taking too long (Analyze `executor.ts`).
2.  **Verify the Gate**: Open the browser console in the Trace. Is `window.__APP_READY__ === true`?
3.  **Core Check**: Are the number of workers in `playwright.config.ts` equal to the number of CPU cores? (CI runners are usually 2-core; keep `workers: 1`).
4.  **PID Audit**: Are the PIDs incrementing starting from 1000? If they are random, the "monotony heal" has been reverted.

---

*Last Updated: 2026-04-12*
*Reference: Architectural Restoration Phase 10 / Wave 2 Stabilization*
