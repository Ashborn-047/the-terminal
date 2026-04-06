# Wave 2: The Engine (Behavioral Sophistication)

## 1. Primary Objectives
Wave 2 focuses on **Logic and Presentation Layer**. We move beyond command "fakes" and into a true, high-fidelity terminal engine that feels identical to a local Linux shell.

---

## 2. Technical Blueprints (Details & Sub-Details)

### 2.1. AST-Based Shell Interpreter (P0)
**The Problem:** The current shell uses a Regex-based string matcher. This limits the engine to simple "command + args." It cannot handle `if`, `for`, `while`, or complex `&&`/`||` chaining.

#### **What:**
Replace the Regex logic with a **Tree-Walking Interpreter** using an Abstract Syntax Tree (AST).

#### **Why:**
To support advanced RHCSA tasks (e.g., "Write a script that creates 10 users using a for loop"). Without this, the simulator is just a "facade."

#### **How:**
1.  **Lexer/Parser:** Use a tool like `chevrotain` or a custom LL(k) parser to tokenize shell input.
2.  **Execution Engine:** Traverses the AST and executes commands in order, respecting control flow.
3.  **Variable Scope:** Implement a true `Environment` store for shell variables (`$HOME`, `$PATH`).

#### **Sub-Details:**
*   **Expansion:** Support `${VAR}` and `$(command)` sub-shells.
*   **Redirection:** Implement `>` and `>>` as first-class citizens in the AST walker.
*   **Piping:** Support multi-stage pipes (`ls | grep | awk`).

---

### 2.2. Xterm.js Canvas Renderer (P0)
**The Problem:** Currently, the terminal is a large collection of React `<div>` elements. This is extremely slow for high-throughput commands like `cat large_file.log` or `top`.

#### **What:**
Migrate from DOM-based rendering to **Xterm.js with Canvas/WebGL addon**.

#### **Why:**
To achieve 60fps terminal performance and support TUI applications like `vim`, `nano`, and `htop` which require ANSI escape code support.

#### **How:**
1.  **Terminal Mounting:** Replace the "Neo-Brutalist" terminal container with an Xterm instance.
2.  **ANSI Translation:** Ensure all command outputs are piped through an ANSI-compatible buffer.
3.  **Input Handling:** Move to raw keyboard input (supporting Ctrl+C, Ctrl+Z, arrow keys).

---

### 2.3. Authoritative SpacetimeDB Shifting (P1)
**The Problem:** Currently, VFS mutations happen on the client and are "saved" to the database. This allows for client-side cheating and race conditions in multiplayer.

#### **What:**
Move the "Business Logic" of the VFS (`create`, `delete`, `move`) into **Rust Reducers** on SpacetimeDB.

#### **Why:**
Security and Authoritative State. The server must be the source of truth, not a passive state-saver.

#### **How:**
Migrate the `VFSCore` logic from TypeScript into the SpacetimeDB module. Commands will now invoke a `call_reducer` instead of modifying a local store.

---

## 3. Bottleneck Analysis & Overcoming Challenges

| Setback | Bottleneck | How to Overcome |
|---|---|---|
| **Flat Shell** | Regex cannot nest logic. | **The Parser:** Use an AST-based walker. |
| **Tab Crashes** | DOM re-renders are $O(n)$ proportional to history. | **The Canvas:** Use Xterm.js virtual scrolling. |
| **Desync** | Client and DB can get out of sync during lag. | **The Authoritative Shift:** Move logic to the DB. |

---

## 4. Do's and Don'ts

### ✅ Do's:
*   **Do** support shell scripting (even a subset of Bash).
*   **Do** implement `TAB` completion using the new AST-aware lookup.
*   **Do** ensure that `vim` works without UI stutter.
*   **Do** use the SpacetimeDB `identity` for RBAC (Role-Based Access Control) in Rust.

### ❌ Don't s:
*   **Don't** use strings as the intermediate format for command execution.
*   **Don't** allow client-side modification of file permissions.
*   **Don't** mix DOM and Canvas rendering; commit fully to Xterm.js.

---

## 5. Expected vs. Desired Outcomes

| Type | Outcome Definition |
|---|---|
| **Probable** | Support for `if/for` loops and variables. |
| **Expected** | Smooth high-speed scrolling even with millions of lines. |
| **Desired** | Zero-trust backend where the client only renders what the server allows. |

---

## 6. Watch Out For:
> [!WARNING]
> **Input Latency:** Moving logic to the server (SpacetimeDB) can introduce a 100ms lag. We MUST implement **Optimistic UI** (local prediction) for basic input while waiting for the server's definitive response.
