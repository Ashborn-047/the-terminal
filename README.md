
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
- **📖 Linux Mastery Track** — A structured, high-fidelity curriculum featuring **15+ deep-dive chapters** with reading modes, interactive drills, and XP-gated assessments.
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

- **Wave 3: Gamification & Economy Completion** — Exponential XP curve (1.5x), Replay Diminishing Returns, and Hardcore Mode implemented ✅
- **📖 Linux Mastery Track** — Initial 15 chapters of the foundational system administration curriculum deployed with "Reading Mode" enforcement ✅
- **High-Fidelity Prompt Engine** — Integrated Streak (🔥) and Mastery (e.g. `[KERNEL]`) badges into the shell prompt ✅
- **Architectural Hardening** — VFS access control strictly follows UID 0 bypass; composite scenario support for Mastery Challenges implemented ✅
- **Backend Status** — 🟢 System Online (Connected to `terminal-backend` on SpacetimeDB Cloud)

---

## 🗺️ Strategic Roadmap (Restoration Phases)

### ✅ Phase 1-3: Foundation & Engine (Completed)
- **VFS Refactor**: POSIX-compliant permission engine.
- **Shell Engine**: Advanced redirections, pipes, and xterm.js integration.
- **Gamification**: Hardcore mode, Multi-day streaks, and Exponential progression.

### ⚓ Phase 4: Mastery Content (Current)
- **Professional Certification Labs**: Deployment of 20+ specialized administrative scenarios mapped to industry-standard mastery levels.
- **Linux Mastery Track**: Expansion of the curriculum to include Advanced Networking, SELinux, and Container orchestration.
- **Boss Arena**: Time-gated "Kernel Panic" repair challenges.
- **Interactive Mentorship**: SpacetimeDB-backed multiplayer shadowing for lab review.

### 🌌 Future: System Visualization
- **Path of Mastery**: Visual skill-tree mapping command proficiency to XP clusters.
- **Hardlink/Dentry Decoupling**: Final VFS architectural refinement to support `ln` fidelity.
- **Block Device Simulation**: `/dev/` population for disk management labs.

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
