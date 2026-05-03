
# ⌨️ The Terminal

> Master Linux from the inside. A high-fidelity, gamified terminal simulator for professional system administration mastery.

![Neo-Brutalist](https://img.shields.io/badge/Design-Neo--Brutalist-black?style=flat-square&labelColor=00FF00)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Rust](https://img.shields.io/badge/Rust-2024-white?style=flat-square&logo=rust)
![SpacetimeDB](https://img.shields.io/badge/Backend-SpacetimeDB-orange?style=flat-square)
![Compliance](https://img.shields.io/badge/Audit_Compliance-100%25-success?style=flat-square)

---

## 🚀 Professional Linux Mastery

**The Terminal** is a professional-grade educational platform designed to transform users into command-line experts. It features a custom-built POSIX-compliant engine, a sophisticated VFS, and a comprehensive multi-track curriculum that mirrors real-world system administration challenges.

### ✨ Key Features

- **🏆 Dual-Track Mastery Curriculum**:
    - **Foundational Track (Chapters 1-15)**: From kernel basics and shell fundamentals to managing enterprise networking and file systems.
    - **Advanced Track (Track 2)**: Specialized deep-dives into task scheduling, productivity optimization, and server analysis.
- **🖥️ High-Fidelity Shell Engine**: Support for **70+ commands**, full pipeline redirection (`|`, `>`, `>>`, `<<`, `2>`, `&>`), command substitution `$(...)`, and job control (`fg`, `bg`, `jobs`).
- **📂 Hardened POSIX VFS**: Sophisticated in-memory filesystem with Inode management, octal permissions (SUID/SGID/Sticky bits), and true path resolution.
- **🏟️ Challenge Arena**: A dedicated zone featuring **40+ "Broken System" scenarios** designed for real-world diagnostic training.
- **🎮 Authoritative Multiplayer**: Live leaderboards, daily quests, and **Co-op Mentor Mode** (real-time terminal shadowing) powered by **SpacetimeDB**.
- **📖 Interactive Reading Mode**: High-fidelity curriculum content with syntax-drills, MCQ assessments, and "Finale Terminal" verification steps.
- **🎨 Harmonized Neo-Brutalist UI**: A premium, responsive design system optimized for accessibility and professional utility.

---

## 🛠️ Technical Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | **React 18** | Functional architecture with modular feature-based design |
| **Styling** | **Vanilla CSS / Tailwind 4** | custom-token system for high-contrast Neo-Brutalist aesthetics |
| **Logic Engine**| **TypeScript 5** | Strict type safety for VFS, Kernel, and Command Registry |
| **Backend** | **SpacetimeDB / Rust** | Real-time multiplayer logic, XP awards, and co-op shadowing |
| **State** | **Zustand** | Persistence-aware multi-store architecture (UI, Lab, Gamification) |
| **Terminal** | **Xterm.js** | Canvas-accelerated rendering for high-performance interaction |
| **Testing** | **Playwright** | E2E verification with 100% reliability protocol |

---

## 🏗️ Architecture

```
src/
├── features/          
│   ├── kernel/        # Core execution logic and syscall abstraction
│   ├── vfs/           # POSIX-compliant Filesystem Engine (Inode/Dentry)
│   ├── command-engine/# Modular Command Registry and Parser
│   ├── lab-engine/    # Verification logic for multi-stage lab scenarios
│   └── multiplayer/   # SpacetimeDB bindings for co-op and leaderboards
├── data/              
│   ├── chapters/      # Modularized curriculum content (Foundational & Advanced)
│   ├── labs/          # Scenario definitions for Arena and Daily Challenges
│   └── assessments/   # Specialized question pools for track certifications
└── components/        # Harmonized Neo-Brutalist component library
```

---

## 📈 Recent Updates (Wave 4)

- **✅ Advanced Mastery Track**: Deployment of specialized modules including "Scheduling Future Tasks" and "Improving Productivity".
- **✅ Foundational Completion**: All 15 foundational chapters are now fully modularized and integrated into the registry.
- **✅ UI/UX Harmonization**: Completed a global 24px padding sweep and standardized typography across all dashboard pages.
- **✅ Architectural Hardening**: Resolved PID determinism races and synchronized VFS shadow stack for 100% CI reliability.
- **✅ Challenge Arena Expansion**: Populated with high-fidelity "Broken System" scenarios for expert-level troubleshooting.

---

## 🗺️ Restoration Roadmap

### ✅ Completed Milestones
- **Wave 1-2**: Core VFS restoration, Shell engine maturity (Pipes/Redirections), and Base command set.
- **Wave 3**: Gamification economy (Exponential XP), Hardcore mode, and Daily Quests.
- **Wave 4**: Full curriculum expansion (Foundational + Advanced) and UI harmonization.

### ⚓ Current Focus
- **Professional Certification Labs**: Mapping curriculum tracks to industry-standard certifications (e.g., RHCSA).
- **Interactive Mentorship**: Expanding SpacetimeDB-backed shadowing to include multi-user collaborative labs.

### 🌌 Future Horizons
- **Visual Path of Mastery**: An interactive skill-tree visualizing command proficiency and XP clusters.
- **Block Device Simulation**: Populating `/dev/` for disk management and LVM labs.

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/Ashborn-047/the-terminal.git

# Install dependencies
npm install

# Start the development server
npm run dev

# Run the full test suite
npm run test:e2e
```

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for details.

<p align="center">
  <strong>"The only way to learn a system is to break it. The safe way to do it is here."</strong>
</p>
