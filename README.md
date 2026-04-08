# ⌨️ The Terminal

> Master Linux from the inside. A gamified, browser-based terminal simulator with real-time multiplayer features.

![Neo-Brutalist](https://img.shields.io/badge/Design-Neo--Brutalist-black?style=flat-square&labelColor=00FF00)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Rust](https://img.shields.io/badge/Rust-2024-white?style=flat-square&logo=rust)
![SpacetimeDB](https://img.shields.io/badge/Backend-SpacetimeDB-orange?style=flat-square)
![Compliance](https://img.shields.io/badge/Audit_Compliance-100%25-success?style=flat-square)

---

## 🚀 Live Demo & Mastery

The Terminal is more than just a simulator—it's a path to **Terminal Professionalism**. Built with a custom VFS and command engine, it provides a safe, sandboxed environment to master complex Linux operations directly in your browser.

### ✨ Core Features

- **🖥️ High-Fidelity Shell Engine** — Support for **50+ commands**, pipes `|`, redirections (`>`, `>>`, `<<`, `2>`, `&>`), and command substitution `$(...)`.
- **📂 True Linux VFS** — Sophisticated in-memory filesystem with Inode management, octal permissions, symlinks, and a roadmap for a true Inode/Dentry split.
- **🛠️ Strategic Troubleshooting** — **10 "Broken System" Lab Scenarios** designed to test mastery through real-world diagnostics.
- **🏟️ Challenge Arena** — Dedicated **Arena** with "Survival Mode" challenges and "Ultimate Mastery" tests to push your skills to the limit.
- **🎮 Authoritative Multiplayer** — Live Leaderboards, Daily Quests, and **Co-op Labs** (Pair Programming) powered by an authoritative **SpacetimeDB** backend.
- **💬 AI-Powered Mentorship** — Interactive Chat interface for real-time guidance during complex labs, featuring **Lab-Gated Channels**.
- **🎨 Terminal-First UI** — A premium Neo-Brutalist visual experience designed for high-performance **Xterm.js** canvas rendering.
- **🛡️ Production Ready** — Integrated with `@sentry/react` for robust telemetry and error monitoring.

---

## 🛠️ The Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | **React 18** | Functional components with Hooks |
| **Language** | **TypeScript 5** | Strict type safety across the engine |
| **Module Logic**| **Rust** | High-performance backend module for SpacetimeDB |
| **Backend** | **SpacetimeDB** | Real-time database & Wasm-based server logic |
| **Automation** | **Makefile** | Orchestration for builds and deployments |
| **Scripts** | **PowerShell** | Installation and setup automation |
| **State** | **Zustand** | Multi-store architecture (UI, Lab, Gamification) |
| **Styling** | **Tailwind 4** | custom-token system for Neo-Brutalist aesthetics |
| **Testing** | **Playwright** | E2E verification of critical user flows |

### 🔗 SpacetimeDB & Rust
The Terminal uses **SpacetimeDB** for its multiplayer layer, with core logic authored in **Rust**. 
- **Rust Modules**: Server-side logic for lab completion, XP awards, and chat.
- **Reducers**: Real-time event handlers for state mutations.
- **Subscriptions**: Live synchronization of leaderboards and user presence.
- **Local Fallback**: An intelligent cache-first approach ensures the app remains functional even in offline mode.

---

## 🏗️ Architecture Overview

```
src/
├── features/          
│   ├── vfs/           # Linux-compliant Filesystem Engine
│   ├── command-engine/# Parser, Pipeline Executor, and Command Registry
│   └── lab-engine/    # Verification logic for DIY and Guided labs
├── components/        
│   ├── terminal/      # Custom XTerm-style terminal emulator
│   ├── gamification/  # SkillTrees, Leaderboards, Heatmaps
│   └── layout/        # Progressive feature unlocking sidebar
├── stores/            # Persistence-aware state management
└── lib/               # SpacetimeDB bindings and VFS snapshots
```

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/Ashborn-047/the-terminal.git

# Install dependencies
npm install

# Start the dev server
npm run dev

# Run E2E tests
npm run test:e2e
```

---

## ⚙️ Configuration

The application uses environment variables for SpacetimeDB connectivity. Create a `.env` file in the root directory:

```env
# Toggle SpacetimeDB Mock Mode (default: true)
VITE_MOCK_SPACETIME=false

# SpacetimeDB Connection Details
VITE_SPACETIME_URI=https://maincloud.spacetimedb.com
VITE_SPACETIME_DB_NAME=terminal-backend
```

### 🎭 Mock Mode
To ensure the app is usable even without a live backend connection, a **Mock Mode** is built-in. When `VITE_MOCK_SPACETIME=true`:
- The app uses hardcoded user data and progress snapshots.
- Reducer calls are logged to the console instead of being sent to the server.
- This is the recommended mode for local UI development and E2E testing.

---

## 📈 Current Status

- **Strategic Audit & Restoration In Progress** — 95% Linux Fidelity Roadmap established ✅
- **Documentation Cleanup** — Legacy documentation archived (24 files) ✅
- **Backend Status** — 🟢 System Online (Connected to `terminal-backend` on SpacetimeDB Cloud)
- **Restoration Focus** — Preparing for Phase A (Internal Inode/Dentry VFS Refactor) 🚀
- **Architectural Hardening** — VFS access control strictly follows UID 0 bypass; root group membership no longer grants global permission bypass.

---

## 🗺️ Strategic Roadmap (Restoration Phases)

### ⚖️ Phase A: True Inode System (P0)
- Resolve hardlink bugs by decoupling Dentries from Inodes.
- Fix `O(n)` performance bottlenecks in VFS resolution.

### 🐚 Phase B: AST-Based Shell Parser (P0)
- Support full shell script control flow (`if`, `for`, `while`).
- Replace regex-based parsing with a tree-walking interpreter.

### 🌳 Phase C: POSIX Process Tree (P1)
- Implement proper process lifecycles (fork/exec/wait) and process states (Zombie, etc.).
- Fix signal handler memory leaks and delivery flaws.

### 📦 Phase D: File Descriptor Table (P1)
- Isolate I/O redirection using per-process FD tables.

### 🛠️ Phase E-H: Expansion & Hardening
- **Phase E**: RHCSA/LFCS Command Suite expansion (systemctl, ip, find -exec).
- **Phase F-G**: Mount Namespace simulation and Block/Character Device model.
- **Phase H**: SELinux / MAC security simulation layer.

---

## 🎨 UI/UX Evolution
- **Xterm.js Migration**: Transitioning from DOM to Canvas rendering for `vim`/`top` support.
- **Terminal-First Paradigm**: Reducing cognitive load by muting secondary UI aesthetics.
- **Multiplayer Co-op**: Shared terminal namespaces and real-time mentor shadowing.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  <strong>"The only way to learn a system is to break it. The safe way to do it is here."</strong>
</p>
