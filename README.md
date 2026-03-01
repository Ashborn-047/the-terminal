# ⌨️ The Terminal

> Master Linux from the inside. A gamified, browser-based terminal simulator built with React, TypeScript, and a fully sandboxed Virtual File System.

![Neo-Brutalist](https://img.shields.io/badge/Design-Neo--Brutalist-black?style=flat-square&labelColor=00FF00)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)

---

## What is The Terminal?

The Terminal is an interactive Linux learning platform where you practice real commands in a safe, sandboxed environment. No VM required — everything runs directly in your browser using a custom in-memory Virtual File System (VFS) and command execution engine.

### ✨ Features

- **🖥️ Full Terminal Simulation** — A realistic command-line interface with **50+ Linux commands** implemented (including `grep`, `awk`, `sed`, `find`, `systemctl`, and pipeline support).
- **📂 Virtual File System** — Complete in-memory filesystem with strict Unix permissions (octal/symbolic), ownership, symlinks, and path resolution.
- **🧪 Guided & DIY Labs** — **38 comprehensive labs** across 18 modules. Features step-by-step tutorials with Regex-based validation and open-ended DIY challenges verified by scanning VFS state.
- **🎮 Gamification** — Earn XP, level up your profile, maintain daily streaks, and unlock **20 unique achievements**.
- **💬 Simulated Multiplayer & Chat** — Real-time chat simulation with global and lab-specific channels, typing indicators, and presence tracking, built on a Reducer-based mock SpacetimeDB engine.
- **🎨 Neo-Brutalist UI** — Bold, high-contrast design with micro-animations, asymmetrical grids, and exposed UI elements.
- **🔒 Security & Auditing** — Real-time security dashboard tracking permission changes, `sudo` access, and simulated system health.
- **🚀 Onboarding Flow** — Welcome modal, interactive terminal walkthrough, and progressive feature unlocking.

### 📚 Curriculum (18 Modules, 38 Labs)

Covering everything from basic navigation to advanced shell scripting and troubleshooting.

| Module Focus | Key Concepts |
|--------|-------|
| **Basics** | Navigation, `pwd`, `ls`, file manipulation (`cp`, `mv`, `rm`) |
| **Intermediate** | Text Processing (`grep`, `head`, `tail`), Pipes, Permissions (`chmod`, `chown`) |
| **Advanced System Admin** | Process Management (`ps`, `top`, `kill`), Networking (`ping`, `curl`), Services (`systemctl`), Packages (`yum`, `dnf`) |
| **Shell Scripting** | Advanced pipelines, `awk`, `sed`, `xargs`, `tee`, `sort`, `uniq` |

### 🏆 Achievement System

**20 achievements** across Milestones, Skill Mastery, Exploration, Endurance, and Hidden categories. Complete labs, chain long pipelines, maintain 90-day streaks, or find hidden commands to unlock them all!

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 4 (Custom Neo-Brutalist theme components) |
| **State** | Zustand (Persisted & Reducer Pattern) |
| **Routing** | React Router v6 |
| **Icons** | Lucide React |

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/Ashborn-047/the-terminal.git
cd the-terminal
npm install

# Run locally
npm run dev
```

Open `http://localhost:5173` and start learning!

---

## Contributing to The Terminal

We love open source! Whether it's adding a new Linux command to the engine, creating a new set of labs, or fixing a UI glitch — we'd love your help.

Read our [Contributing Guidelines](CONTRIBUTING.md) to get started, and please review our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Project Structure

```
src/
├── components/        # UI components (terminal, lab, layout, chat, debug)
├── features/          # Core logic
│   ├── vfs/           # Virtual File System Engine
│   ├── command-engine/# Command Parser, Pipeline, and Registry
│   └── lab-engine/    # Step Verification & DIY validation
├── module_bindings/   # Simulated SpacetimeDB Server bindings
├── stores/            # Zustand state (ui, lab, gamification)
├── hooks/             # useTerminal, useFeatureAccess
├── pages/             # HomePage, LabsPage, ChatPage, ProfilePage
├── data/              # 38 Lab definitions, structured Man Pages
├── lib/               # VFS Base Snapshots
└── utils/             # JSON Logger, Spacetime Client Mock, Error Codes
```

---

## License

MIT

---

<p align="center">
  <strong>Built with ⚡ by learners, for learners.</strong>
</p>
