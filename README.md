# ⌨️ The Terminal

> Master Linux from the inside. A gamified, browser-based terminal simulator built with React, TypeScript, and a fully sandboxed Virtual File System.

![Neo-Brutalist](https://img.shields.io/badge/Design-Neo--Brutalist-black?style=flat-square&labelColor=00FF00)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)

---

## What is The Terminal?

The Terminal is an interactive Linux learning platform where you practice real commands in a safe, sandboxed environment. No VM required — everything runs in your browser.

### ✨ Features

- **🖥️ Full Terminal Simulation** — A realistic command-line interface with 30+ Linux commands
- **📂 Virtual File System** — Complete in-memory filesystem with permissions, symlinks, and path resolution
- **🧪 Guided & DIY Labs** — Step-by-step tutorials and open-ended challenges across 4 modules
- **🎮 Gamification** — XP, levels, streaks, achievements, and a progressive unlock system
- **🎨 Neo-Brutalist UI** — Bold, high-contrast design with micro-animations
- **🔔 Toast Notifications** — Real-time feedback for XP gains, level-ups, and achievement unlocks
- **🚀 Onboarding Flow** — Welcome modal, guided walkthrough, and progressive feature unlocking

### 📚 Curriculum (8 Labs)

| Module | Topic | Labs |
|--------|-------|------|
| 1 | Command Line Basics | `pwd`, `ls`, directory navigation |
| 2 | File Management | `touch`, `cat`, `cp`, `mv`, project structures |
| 3 | Searching & Filtering | `grep`, pipes, `head`/`tail` |
| 4 | Permissions | `ls -la`, `chmod`, ownership |

### 🏆 Achievement System

13 achievements across 5 categories: Milestones, Skill Mastery, Exploration, Endurance, and Hidden. Track your progress in the Achievement Gallery.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (Neo-Brutalist theme) |
| State | Zustand (persisted) |
| Routing | React Router v6 |
| Icons | Lucide React |

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

## Project Structure

```
src/
├── components/        # UI components
│   ├── terminal/      # Terminal emulator
│   ├── lab/           # Lab instructions & cards
│   ├── layout/        # MainLayout with sidebar
│   ├── onboarding/    # Welcome, Walkthrough, Celebration
│   └── ui/            # Radix UI primitives
├── features/          # Core logic
│   ├── vfs/           # Virtual File System
│   ├── command-engine/# Parser, Registry, Executor
│   └── lab-engine/    # Verification & types
├── stores/            # Zustand state (lab, gamification, ui)
├── hooks/             # useTerminal, useFeatureAccess
├── pages/             # HomePage, LabsPage, ProfilePage
├── data/              # Lab definitions, command docs
├── lib/               # VFS snapshots
└── utils/             # Logger
```

---

## License

MIT

---

<p align="center">
  <strong>Built with ⚡ by learners, for learners.</strong>
</p>
