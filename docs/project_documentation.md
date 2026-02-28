# Project Documentation: The Terminal

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Active Development  

---

## 1. Project Overview

The **The Terminal** is an interactive, gamified educational platform designed to teach Linux command-line skills from absolute beginner to professional system administrator level. The platform simulates a functional Linux environment within the browser, with a curriculum aligned to the official **Red Hat System Administration I (RH124)** course and the **RHCSA exam objectives**.

The application combines a virtual filesystem, a custom command engine, a structured curriculum, and gamification elements (XP, levels, streaks) to create an engaging, self‑paced learning experience. It is built with modern web technologies and requires no backend—all state is persisted in the browser’s `localStorage`.

---

## 2. Goals & Objectives

### Primary Goals
- **Provide a safe, sandboxed terminal** where users can practice Linux commands without risk.
- **Deliver a structured, professional‑grade curriculum** based on RH124 and RHCSA objectives.
- **Gamify the learning process** to increase motivation and retention (XP, levels, achievements).
- **Offer both guided and DIY labs** to accommodate different learning styles.
- **Include a comprehensive command reference** that serves as a searchable, interactive “man pages” equivalent.
- **Prepare learners for real‑world Linux administration** and the RHCSA certification.

### Secondary Goals
- Maintain high code quality and modularity for easy extension.
- Ensure accessibility and responsiveness (desktop‑first, but usable on tablets).
- Provide a smooth onboarding experience for complete beginners.
- Track user progress locally, enabling offline‑like usage.

---

## 3. Target Audience

- **Absolute beginners** who have never used the command line.
- **Developers, DevOps engineers, and students** who need to strengthen their Linux skills.
- **IT professionals** preparing for the RHCSA certification.
- **HPC users** who need to navigate Linux clusters (IIT Delhi HPC Lab context).

---

## 4. Core Features & Functionality

### 4.1 Terminal Simulation
- **Virtual File System (VFS):** JSON‑based representation of a Linux filesystem (/, /home, /etc, /var, /proc, etc.).
- **Command Engine:** Supports 30+ Linux‑like commands implemented in TypeScript, including:
  - File operations: `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, `find`, `ln`
  - System info: `uname`, `free`, `top`, `ps`, `df`, `whoami`, `uptime`
  - Networking: `ping`, `dig`, `wget`, `curl`, `ssh` (simulated), `scp` (simulated)
  - Utilities: `sudo` (simulated), `tar`, `gzip`, `history`, `clear`, `man` (integrated with docs)
  - Permission management: `chmod`, `chown`, `useradd`, `passwd` (simulated)
- **Tab Completion:** For commands and file paths.
- **Command History:** Navigate with arrow keys.

### 4.2 Curriculum & Labs
- **Phased Learning Modules:** 18 modules following RH124 (see Section 6).
- **Lab Types:**
  - *Guided Labs:* Step‑by‑step instructions that verify exact command entry.
  - *DIY Labs:* Scenario‑based challenges that verify the final state of the VFS (e.g., files created, permissions set).
- **Unlock System:** Modules and labs unlock sequentially based on completion.
- **Progress Persistence:** All completed steps, XP, and streak data saved in `localStorage`.

### 4.3 Gamification
- **XP & Levels:** Each lab awards 10–200 XP; leveling up requires cumulative XP (e.g., 100 XP per level).
- **Streaks:** Consecutive days of lab completions grant bonus XP.
- **Achievement Badges:** Unlocked for completing modules or mastering specific skills (e.g., “Permission Master”).
- **Progress Dashboard:** Visual overview of completed modules, current level, and RHCSA readiness score.

### 4.4 Documentation & Reference
- **Interactive Command Reference:** Searchable by name/category; each entry includes syntax, options, examples, and links to relevant labs.
- **“RHCSA Prep Zone”:**
  - Concept explainers (SELinux, LVM, systemd).
  - Complex practice scenarios.
  - Exam objectives checklist.
- **Troubleshooting Guides:** Common errors and diagnostic steps.

### 4.5 User Interface
- **Main Terminal Area:** Prominent, with a retro‑style look.
- **Sidebar Navigation:** Quick access to Home, Labs, Commands, Progress.
- **Lab Instructions Panel:** Shows current objective, hints, and success feedback.
- **Responsive Design:** Optimized for desktop, usable on tablets.

---

## 5. Technical Architecture

### 5.1 Technology Stack
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.0 + Lucide React for icons
- **UI Components:** Radix UI primitives (accessible, unstyled)
- **State Management:** React Context + useReducer (or Zustand for scalability)
- **Persistence:** `localStorage` for user progress; VFS state can be reset per lab

### 5.2 Core Modules

#### Virtual File System (VFS)
- **Data Structure:** A tree of nodes, each with `type` (file/dir), `name`, `content` (for files), `permissions`, `owner`, `group`, and `timestamp`.
- **Operations:** Exposed through a VFS API that commands use to read/write/delete nodes.
- **Initialization:** Pre‑populated with standard Linux directories and some sample files (e.g., `/etc/passwd`, `/var/log/syslog`).

#### Command Engine
- **Parser:** Tokenizes user input, handles quotes, pipes, redirections.
- **Command Registry:** Each command is a separate module with a defined interface (`execute(args, vfs, state)`).
- **Pipes & Redirections:** Implemented by capturing stdout and passing as input to next command or writing to file.

#### Lab Engine
- **Lab Definition Format:** JSON for each lab, containing:
  - `id`, `title`, `description`, `type` (guided/diy), `xpReward`
  - `initialVFS` (optional override of default VFS)
  - `verification`: For guided labs: array of expected commands. For DIY: a set of conditions (e.g., file exists, content matches, permissions correct).
  - `hints`: Array of progressive hints.
- **Lab Runner:** Manages lab state, validates completion, awards XP.

#### Gamification Service
- Tracks XP, level, streak, achievements.
- Updates dashboard and unlocks modules.

### 5.3 Data Flow
1. User types command → Parser → Command execution → VFS update / output generation.
2. Lab engine monitors commands (guided) or VFS state (DIY).
3. On lab completion: XP awarded, progress saved, next labs unlocked.

### 5.4 Persistence Schema (localStorage)
```json
{
  "user": {
    "xp": 1250,
    "level": 5,
    "streak": 3,
    "lastActivity": "2025-04-08",
    "completedLabs": ["lab-1-1", "lab-1-2", ...],
    "unlockedModules": [1,2,3],
    "achievements": ["first_login", "permissions_master"]
  }
}
```

---

## 6. Development Phases & Roadmap

### Phase 0: Foundation (MVP)
- Set up React + TypeScript + Tailwind project.
- Implement basic terminal UI (input, output area).
- Create simple VFS with in‑memory tree.
- Implement 5–10 core commands: `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cat`, `echo`, `clear`.
- Build lab system with JSON definitions.
- Create first 3 modules (Modules 1–3) with guided labs.
- Implement progress persistence.

**Timeline:** 2–3 weeks

### Phase 1: Core Curriculum Expansion
- Expand command set to cover Modules 4–10 (file ops, users, permissions, processes).
- Add DIY lab verification.
- Implement gamification (XP, levels, streak).
- Build command reference UI with search.
- Add side navigation and dashboard.

**Timeline:** 4–5 weeks

### Phase 2: Advanced Features
- Implement Modules 11–18 (networking, software, storage, review).
- Add SSH simulation, `systemctl`, `dnf` mock.
- Create “RHCSA Prep Zone” with concept articles and practice scenarios.
- Add achievements and badges.
- Polish UI/UX, animations.

**Timeline:** 4–5 weeks

### Phase 3: Polish & Scale
- Performance optimizations.
- Accessibility audit.
- Mobile responsiveness improvements.
- User testing and feedback integration.
- Optional: add export/import of progress.

**Timeline:** 2–3 weeks

---

## 7. Current Status & Progress

**As of 2025-04-08:**

- Project concept finalized.
- Curriculum mapped to RH124 (18 modules).
- Technology stack selected.
- Documentation created.
- Development environment ready (React + Vite + Tailwind).
- **Next immediate steps:**
  - Build terminal UI shell (input line, output scroll).
  - Implement VFS core with JSON tree.
  - Create parser and command registry.
  - Implement first 5 commands (`ls`, `cd`, `pwd`, `mkdir`, `touch`).
  - Create Module 1 labs (Introduction) as JSON.

---

## 8. Implementation Guidelines (for Antigravity)

### Coding Standards
- **TypeScript:** Strict mode, no `any`.
- **Components:** Functional components with hooks; use Radix UI for interactive elements.
- **Styling:** Tailwind classes; prefer composition with `cn()` utility.
- **State:** React Context for global state (auth, user progress); useReducer for complex local state.
- **Commands:** Each command in its own file under `src/commands/`, exporting an object with `name`, `description`, `execute`.
- **VFS:** Singleton class (or context) with methods for file/dir operations.

### Testing
- Unit tests for commands and VFS operations (Jest + React Testing Library).
- Integration tests for lab verification logic.

### Documentation
- Keep this living document updated.
- Document every command’s behavior, options, and edge cases.
- Use JSDoc comments for functions.

### Version Control
- Git with conventional commits (feat, fix, docs, etc.).
- Main branch protected; feature branches used.

### Agent Workflow
1. **Understand:** Review this document and any new requirements.
2. **Plan:** Break down tasks, propose approach.
3. **Execute:** Write code, update docs, commit.
4. **Verify:** Test locally, ensure no regressions.
5. **Report:** Summarize progress and next steps.

---

## 9. Key Decisions & Constraints

- **No Backend:** All logic runs client‑side; persistence via `localStorage`. This simplifies deployment and allows offline use.
- **Simulated Commands:** Some commands (e.g., `sudo`, `ssh`) will be simulated to maintain safety and simplicity. For example, `sudo` may just check if the user is in the `wheel` group and execute the command as root (if the VFS supports root user).
- **VFS Accuracy:** The filesystem mimics a real Linux system but is simplified (e.g., no device files, limited inodes). Enough for learning purposes.
- **Browser‑First:** Targeting modern browsers (Chrome, Firefox, Edge). No Internet Explorer support.
- **Mobile:** Not a priority initially, but design should be somewhat responsive.

---

## 10. Glossary

- **VFS:** Virtual File System – the simulated filesystem state.
- **RH124:** Red Hat System Administration I – foundational course.
- **RHCSA:** Red Hat Certified System Administrator – entry‑level certification.
- **DIY Lab:** Do‑It‑Yourself lab where users achieve a goal without step‑by‑step instructions.
- **XP:** Experience points, the currency of gamification.
