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

- **🖥️ Advanced Shell Engine** — Support for **50+ commands**, pipes `|`, redirections (`>`, `>>`, `<<`, `2>`, `&>`), and command substitution `$(...)`.
- **📂 Linux VFS** — Sophisticated in-memory filesystem with Inode management, octal permissions, symlinks, and persistable state.
- **🧪 Curriculum System** — **18 Modules & 38 Labs** covering everything from basic navigation to advanced sysadmin troubleshooting.
- **🏟️ Challenge Arena** — Dedicated **Arena** with "Survival Mode" challenges and "Ultimate Mastery" tests to push your skills to the limit.
- **🎮 Real-Time Progression** — Live Leaderboards, Daily Quests, Streak Heatmap and Achievement unlocks powered by **SpacetimeDB**.
- **💬 AI-Powered Mentorship** — Interactive Chat interface for real-time guidance during complex labs, featuring **Lab-Gated Channels**.
- **🎨 Neo-Brutalist UI** — A premium, high-contrast visual experience designed for the modern developer with an ARIA-compliant 100% accessible interface.
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

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  <strong>"The only way to learn a system is to break it. The safe way to do it is here."</strong>
</p>
