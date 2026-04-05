# System Design & Architecture Critical Review

## 5.1 — State Management Architecture

### [SEVERITY: P2] "Fat Store" Anti-Pattern
**What**: `gamificationStore.ts` spans over 600 lines, conflating state storage with complex business logic like XP calculations, daily quest generation, and SpacetimeDB sync.
**Why it matters**: It violates single-responsibility principles, making testing impossible without mocking the entire DB and Zustand lifecycle.
**How to fix**: Extract `AchievementService` and `QuestGenerator` as pure, stateless plain TypeScript classes. The store should only hold the state object and expose thin wrapper actions.
**Verification**: Verify that the daily quest generation logic can be tested in Vitest without initializing Zustand.

### [SEVERITY: P1] Offline Persistence Conflicts
**What**: Offline VFS changes currently overwrite online state indiscriminately when reconnecting to SpacetimeDB.
**Why it matters**: If a user plays on mobile, goes offline, then plays on desktop, their VFS states will collide and destroy progress.
**How to fix**: Implement a Last-Write-Wins merge strategy based on `modifiedAt` timestamps for individual inodes during sync.
**Verification**: Make an offline change on Client A, an online change on Client B, bring Client A online, and assert both changes merged successfully.

## 5.2 — VFS Engine Architecture

### [SEVERITY: P2] `VFSCore` Monolithic Bloat
**What**: The `vfs.ts` class handles tree traversal, DAC permissions, syscall simulation, and snapshot generation.
**Why it matters**: The file is difficult to navigate, and adding MAC/ACLs will make it unmaintainable.
**How to fix**: Split into `VFSManager` (tree ops), `VFSPermissions` (access checks), and `VirtualFS` (proc/dev simulation).
**Verification**: Ensure all existing VFS tests pass after the modularization.

### [SEVERITY: P1] UI Re-render Thrashing
**What**: React components subscribe to the entire `vfsStore` snapshot object.
**Why it matters**: Modifying a single file deep in the tree causes the entire terminal UI to re-render, creating input latency.
**How to fix**: Implement an `EventEmitter` pattern on the `VFS` instance. `vfs.on('change', (path) => ...)` allows UI components to subscribe only to the directories they are rendering (e.g., the current `cwd`).
**Verification**: Profile the React tree. Typing `touch file` should only re-render the prompt component, not the entire page.

## 5.3 — Command Engine Architecture

### [SEVERITY: P1] `executor.ts` Cyclomatic Overload
**What**: The executor handles pipelines, globbing, signals, background jobs, and script parsing all in a single loop.
**Why it matters**: It is brittle and heavily prone to regressions when adding new shell syntax.
**How to fix**: Decompose into `JobManager`, `RedirectionManager`, and `PipelineStreamer` classes.
**Verification**: Run the pipeline suite (`ls -la | grep sys | wc -l`) and ensure it outputs the correct number without using the legacy executor loop.

### [SEVERITY: P2] Command Registry Type Bloat
**What**: `CommandRegistry` maps string names directly to `async (args, ctx, input)` functions.
**Why it matters**: It requires every command to reinvent flag parsing (`-l`, `-a`) and help text generation.
**How to fix**: Define a `CommandDescriptor` interface: `{ name, run, flags: string[], helpText, minArgs }`. Implement a universal flag parser using `getopt` logic before invoking the command.
**Verification**: Typing `ls --invalid-flag` should immediately print a standard error without ever invoking `ls.ts`.

## 5.4 — SpacetimeDB / Backend Critique

### [SEVERITY: P0] DRY Violation & Desync Risk
**What**: `xp_for_level()` is defined in `gamificationStore.ts` and `spacetime-module/src/lib.rs` with *different mathematical formulas*.
**Why it matters**: A user's client thinks they are level 12, but the server calculates they are level 10. The UI will desync, causing progression blockers.
**How to fix**: Rust is the canonical source of truth. The TypeScript client must read the level from the SpacetimeDB identity sync, entirely removing the local XP calculation.
**Verification**: Write a test ensuring `level` in TS exactly matches `level` returned from SpacetimeDB after an XP grant.

### [SEVERITY: P0] Message ID Collision under Load
**What**: `lib.rs` line 443: `id: (ctx.timestamp.to_micros_since_unix_epoch() / 1000) as u64`.
**Why it matters**: Truncating to milliseconds guarantees collisions if two users send a message in the same millisecond, breaking message rendering in the UI.
**How to fix**: Use a SpacetimeDB atomic sequence or append the `ctx.sender().to_string()` hash to the ID to guarantee uniqueness.
**Verification**: Send 10 messages concurrently in a test harness; all 10 must persist with unique IDs.

### [SEVERITY: P1] Rate Limit Bypass
**What**: Rate limiting is bound to `Identity`.
**Why it matters**: If a user clears their browser storage and reconnects anonymously, they get a new identity, bypassing the chat rate limit and allowing spam.
**How to fix**: Bind rate limits to IP address via SpacetimeDB context, or require authenticated sessions for global chat.
**Verification**: An unauthenticated user clearing local storage should still be blocked if sending >5 messages in 10s from the same IP.

### [SEVERITY: P1] Client-Side Trust (Missing Backend Verification)
**What**: Currently, the client SDK tells the server "I finished the lab" via the `complete_lab` reducer.
**Why it matters**: A malicious user can write a script to call `complete_lab` directly via the SDK, instantly maxing out their level and ruining the leaderboard integrity.
**How to fix**: The server must perform lab verification. The client should send the final VFS snapshot or command history to a new `verify_and_complete_lab` reducer, which executes the validation logic in Rust.
**Verification**: Attempt to call the reducer with a blank VFS snapshot; the server must reject it and not award XP.

## 5.5 — Performance & Scalability

### [SEVERITY: P2] VFS Serialization Blocking the Main Thread
**What**: The `vfsStore.ts` uses JSON serialization for Zustand persist. At 100K inodes, this `JSON.stringify` operation will take hundreds of milliseconds.
**Why it matters**: This causes massive UI thread blocking during VFS mutations, freezing the browser.
**How to fix**: Move VFS persistence from `localStorage` to IndexedDB using a WebWorker for asynchronous serialization.
**Verification**: Generate 100K inodes and trigger a save. The UI frame rate must remain above 30fps.

### [SEVERITY: P3] Unbounded Command History
**What**: The `history` array in `CommandContext` has no maximum length.
**Why it matters**: At 10,000 entries, the array search for up-arrow navigation and autocomplete will lag.
**How to fix**: Cap the history at 1,000 entries by shifting the array upon insertion.
**Verification**: Push 1005 commands to history and verify `history.length === 1000`.

## 5.6 — Testing Architecture

### [SEVERITY: P1] Critical Path Test Coverage Gaps
**What**: Both `executor.ts` and `vfs.ts` are missing tests for extreme edge cases (e.g., deeply nested pipelines `cmd | cmd | cmd`, or symlink loops resolving beyond depth 20).
**Why it matters**: These are the exact edge cases students will accidentally stumble into, causing unhandled application crashes instead of graceful simulated errors.
**How to fix**: Implement a comprehensive "No existing lab can break" regression suite covering these paths.
**Verification**: A symlink loop of 21 files must return `ELOOP` rather than throwing a `RangeError: Maximum call stack size exceeded`.

## 5.7 — Security & Production Readiness

### [SEVERITY: P0] Potential XSS Vector in Terminal Output
**What**: Terminal output strings are rendered into the React DOM. It is not explicitly clear if React's default escaping is bypassed anywhere using `dangerouslySetInnerHTML`.
**Why it matters**: If `cat` outputs a file containing `<script>` and it executes, an attacker could steal SpacetimeDB auth tokens from another user's session in a multiplayer environment.
**How to fix**: Audit `terminalStore.ts` and the UI renderer. Ensure a strict Content Security Policy (CSP) blocking `unsafe-eval` and `unsafe-inline` is added to `vite.config.ts`.
**Verification**: Run `echo "<script>alert(1)</script>"` and ensure the literal string is rendered, not executed.

## 5.8 — Developer Experience

### [SEVERITY: P3] High Friction Command Creation
**What**: Adding a new command requires touching 3 separate files and manually wiring up TypeScript types.
**Why it matters**: It discourages open-source contributions and slows down feature delivery.
**How to fix**: Create a `npm run generate:command` script using Plop.js that scaffolds the command file, test file, and auto-registers it in `registry.ts`.
**Verification**: Running the script with argument `foo` should immediately allow typing `foo` in the dev server terminal.