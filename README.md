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

- **🖥️ Advanced Shell Engine** — Support for **60+ commands**, pipes `|`, redirections (`>`, `>>`, `<<`, `2>`, `&>`), command substitution `$(...)`, background jobs (`&`), and **recursive globbing** (`**`).
- **📂 High-Fidelity VFS** — Sophisticated in-memory filesystem with Inode management, octal permissions (UID/GID), SUID safety, symlinks, and **real-time syscall tracing**.
- **🚦 Process & Job Control** — Robust job table management with `jobs`, `fg`, `bg`, and POSIX signal handling (`SIGINT`, `SIGTSTP`, `SIGCONT`, `SIGTERM`).
- **🔬 Observability Toolkit** — Advanced SRE tools including `strace` (syscall tracing), `lsof` (open file listing), `ps`, `top`, and `du`.
- **🧪 Curriculum System** — **18 Modules & 38 Labs** covering everything from basic navigation to advanced sysadmin troubleshooting.
- **🎮 Real-Time Progression** — Live Leaderboards and Achievement unlocks powered by **SpacetimeDB**.
- **🎨 Neo-Brutalist UI** — A premium, high-contrast visual experience with an ARIA-compliant 100% accessible interface.

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

- **Lab Progress**: 8 / 35 Labs Completed ✅
- **User Stats**: Level 6 (User Manager), ~415 XP
- **Backend Status**: 🟢 System Online (Connected to `terminal-backend` on SpacetimeDB Cloud)
- **CI/CD**: Fully automated deployment to GitHub Pages via GitHub Actions.

---

## 🗺️ Roadmap & Upcoming Features

### ⚖️ Gamification Refinement
- **Hint Penalties**: 50% XP reduction for using hints during a lab.
- **Solution Reveal**: 75% XP reduction for revealing the full solution.

### 🎨 UI/UX Overhaul
- **Page-Level Navigation**: Transitioning from tab-based views to distinct route-based pages.
- **Improved Scrolling**: Fixing overflow-hidden issues for a better experience.

---

## ⚖️ Known Differences from Real Linux

While designed for high realism, the simulator has specific intentional differences:

### 1. **Signal Propagation**
Signals are handled at the `terminalStore` level. While they simulate `SIGSTOP`/`SIGCONT` behavior, background jobs are not actual separate threads; they are asynchronous generator cycles within the main loop.

### 2. **SUID on Scripts**
For security and realism, SUID bits on `#!` shebang scripts are ignored (matching the behavior of modern Linux kernels like Debian/Ubuntu).

### 3. **Globbing - `nullglob`**
The simulator defaults to a `nullglob` behavior where non-matching patterns are returned as literals, consistent with bash's standard configuration.

### 4. **Mocked SRE Tools**
Tools like `strace` and `lsof` operate on a simulated event bus (`notifySyscall`). They provide 100% realistic output for VFS operations but do not trace raw kernel-level memory allocations or network syscalls.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  <strong>"The only way to learn a system is to break it. The safe way to do it is here."</strong>
</p>
