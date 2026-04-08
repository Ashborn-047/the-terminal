---
description: Wave 2 — Linux Simulator Engine Restoration & High-Fidelity Rendering
---

## Phase 2: Engine Restoration

This workflow handles the transformation of the "functional" simulation into a "high-fidelity" experience.

### 1. High-Fidelity Rendering
1.  Analyze `src/components/terminal/Terminal.tsx`.
2.  Implement a stateful ANSI parser supporting:
    -   16-color palettes (ANSI 30-37, 90-97).
    -   SGR sequences (Bold, Dim, Italic, Underline, Blink).
    -   Background colors (ANSI 40-47, 100-107).
3.  Maintain "Brutal/Glassmorphism" UI aesthetic with glow effects for high-contrast colors.

### 2. Shell Engine Hardening
1.  **VFS Append Support**:
    -   Update `vfs.ts` `writeFile` to support an `append` flag.
    -   Verify with `echo "test" >> file.txt`.
2.  **Advanced Redirections**:
    -   Update `executor.ts` to capture `stderr`.
    -   Implement routing for `2>` and `&>`.
    -   Ensure `append` mode for `>>`.

### 3. Real-Time Lab Verification
1.  **VFS Observer Pattern**:
    -   Add event listeners to `VFS` class (`onFileChange`, `onDirChange`).
    -   Trigger events on all modifying operations.
2.  **Verification Real-Time Integration**:
    -   Update `TerminalComponent` or `LabEngine` to listen for VFS events.
    -   Check conditions immediately on VFS change instead of only on command finish.

### 4. Regression & Stability
1.  Run `npm run test` to ensure 132/132 tests remain passing.
2.  Perform manual smoke tests for redirection and rendering fidelity.
