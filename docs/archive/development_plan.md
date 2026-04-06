# Development Plan: The Terminal

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Active  

---

## 1. Overview

This document provides a step‑by‑step plan for building the Linux Terminal Academy. It consolidates all previous documentation into a structured sequence of tasks, milestones, and dependencies. The goal is to guide Antigravity from zero to a fully functional, deployable application.

All necessary design decisions and specifications are already documented in the files listed below. This plan references them for implementation details.

### 1.1 Reference Documents

| **File** | **Description** |
|----------|-----------------|
| `project_documentation.md` | Project vision, features, roadmap |
| `gamification_framework.md` | XP, levels, streaks, achievements |
| `backend_documentation.md` | SpacetimeDB tables, reducers, client integration |
| `chat_documentation.md` | Real‑time messaging, channels, moderation |
| `ui_ux_documentation.md` | Neo‑Brutalist design principles, components |
| `frontend_architecture.md` | Folder structure, state management, routing |
| `lab_engine_documentation.md` | Lab definitions, verification, hint system |
| `command_engine_vfs.md` | Parser, command registry, VFS implementation |
| `testing_strategy.md` | Unit, integration, E2E tests |
| `deployment_devops.md` | Hosting, CI/CD, monitoring |
| `user_onboarding.md` | First‑time flow, progressive feature introduction |
| `error_handling_logging.md` | Error boundaries, logging, monitoring |
| `security_documentation.md` | Authentication, authorization, data privacy |

---

## 2. Development Phases

We break the project into **5 phases**, each with clear deliverables. Phases may overlap but are designed to be sequential.

| **Phase** | **Title** | **Duration Estimate** | **Key Deliverables** |
|-----------|-----------|----------------------|----------------------|
| 1 | Foundation & Core Terminal | 2 weeks | Project setup, VFS, command engine, basic terminal UI |
| 2 | Lab Engine & Gamification | 2 weeks | Lab definitions, verification, XP/level system, achievements |
| 3 | Multiplayer & Chat | 1.5 weeks | SpacetimeDB integration, chat, online presence |
| 4 | UI Polish & Onboarding | 1 week | Neo‑Brutalist styling, onboarding flow, dashboard |
| 5 | Testing, Deployment & Security | 1.5 weeks | Tests, CI/CD, production deployment, security hardening |

Total: ~8 weeks (adjustable based on complexity and resources).

---

## 3. Phase 1: Foundation & Core Terminal

### 3.1 Goals
- Set up development environment.
- Implement Virtual File System (VFS).
- Build command parser and registry.
- Create basic terminal UI with input/output.
- Support essential commands (`ls`, `cd`, `pwd`, `mkdir`, `touch`, `cat`, `echo`).

### 3.2 Tasks

#### 3.2.1 Project Setup
- [ ] Initialize Vite + React + TypeScript project.
- [ ] Install Tailwind CSS and configure with Neo‑Brutalist theme (see `ui_ux_documentation.md`).
- [ ] Set up folder structure as per `frontend_architecture.md`.
- [ ] Install core dependencies: `zustand`, `react-router-dom`, `lucide-react`, `uuid`.
- [ ] Configure ESLint and Prettier.
- [ ] Set up Git repository with initial commit.

#### 3.2.2 Virtual File System
- [ ] Implement `VFS` class with inode map and path resolution (see `command_engine_vfs.md`).
- [ ] Add core methods: `resolve`, `listDirectory`, `createFile`, `mkdir`, `readFile`, `writeFile`, `chmod`, `chown`.
- [ ] Implement permission checking.
- [ ] Create snapshot loader (`loadSnapshot`) for predefined filesystems (default, hpc-base).
- [ ] Write unit tests for VFS methods.

#### 3.2.3 Command Engine
- [ ] Build command parser (handles quotes, pipes, redirections).
- [ ] Create `CommandRegistry` and `CommandFunction` type.
- [ ] Implement executor with pipe and redirection support.
- [ ] Write first commands: `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cat`, `echo`, `clear`.
- [ ] Test commands manually and with unit tests.

#### 3.2.4 Terminal UI
- [ ] Create `Terminal` component with input line and output history.
- [ ] Implement `useTerminal` hook to manage state and command execution.
- [ ] Add `Prompt` component showing current directory.
- [ ] Implement command history navigation (arrow up/down).
- [ ] Add basic tab completion (commands only initially).
- [ ] Style terminal with Neo‑Brutalist colors (black background, green prompt, white text).
- [ ] Ensure terminal scrolls to bottom on new output.

#### 3.2.5 Basic Routing & Layout
- [ ] Set up React Router with routes: `/` (home), `/labs`, `/commands`, `/profile`.
- [ ] Create `MainLayout` with header and sidebar (collapsible).
- [ ] Add placeholder pages for each route.

### 3.3 Dependencies
- React, TypeScript, Vite
- Tailwind CSS
- Zustand
- React Router
- Lucide React
- UUID

### 3.4 Milestone
- A user can open the terminal, type commands like `ls`, `pwd`, `mkdir test`, and see the VFS update.
- The UI matches the Neo‑Brutalist design (basic version).
- Tests for VFS and core commands pass.

---

## 4. Phase 2: Lab Engine & Gamification

### 4.1 Goals
- Define lab JSON schema and loader.
- Implement guided lab verification (step‑by‑step).
- Implement DIY lab verification (state‑based).
- Add XP, level, and streak tracking.
- Create achievement system.
- Build lab UI components.

### 4.2 Tasks

#### 4.2.1 Lab Definitions
- [ ] Create folder `src/data/labs/` with sample lab JSON files (see `lab_engine_documentation.md`).
- [ ] Implement lab loader (glob import) that reads all JSON files.
- [ ] Define TypeScript types for lab, step, condition.
- [ ] Write validation function for lab JSON.

#### 4.2.2 Lab Engine Core
- [ ] Create `labStore` (Zustand) to track current lab, step progress, and completion.
- [ ] Implement guided step verification: compare entered command with expected.
- [ ] Implement DIY verification: check conditions against VFS.
- [ ] Add hint system (progressive hints).
- [ ] Integrate lab verification with command execution (hook into `useTerminal`).

#### 4.2.3 Gamification System
- [ ] Add XP, level, streak fields to `User` table (SpacetimeDB) – but for now, store in `localStorage` (we'll sync later).
- [ ] Create `gamificationStore` (Zustand) to manage XP, level, streak.
- [ ] Implement XP calculation and level‑up logic.
- [ ] Implement streak tracking (daily activity).
- [ ] Create achievement definitions and unlock logic.
- [ ] Store progress in `localStorage` (persist).

#### 4.2.4 Lab UI Components
- [ ] Build `LabCard` component showing title, XP, status (locked/available/completed).
- [ ] Build `LabInstructions` for guided labs (step display, hint button).
- [ ] Build `LabInstructions` for DIY labs (condition list, verify button).
- [ ] Create labs listing page (`/labs`) with modules and labs grouped.
- [ ] Add lab detail page (`/labs/:labId`) with terminal and instructions side‑by‑side.

#### 4.2.5 Gamification UI
- [ ] Show XP and level in header.
- [ ] Add streak flame icon with count.
- [ ] Create achievements gallery page.
- [ ] Add progress dashboard with module completion.

### 4.3 Dependencies
- Zustand (already)
- Date libraries for streak calculation
- (SpacetimeDB will be integrated later)

### 4.4 Milestone
- A user can start a guided lab, follow steps, and earn XP on completion.
- DIY labs verify correctly.
- XP and level persist across refreshes.
- Achievements unlock.

---

## 5. Phase 3: Multiplayer & Chat

### 5.1 Goals
- Integrate SpacetimeDB backend.
- Implement user registration and progress sync.
- Build real‑time chat with channels.
- Add online presence.

### 5.2 Tasks

#### 5.2.1 SpacetimeDB Module
- [ ] Set up Rust module (or C#) for SpacetimeDB.
- [ ] Define tables: `User`, `UserProgress`, `LabState`, `Message`, `OnlinePresence`, `Achievement`, `AuditLog`.
- [ ] Implement reducers: `registerUser`, `completeLab`, `updateProfile`, `sendMessage`, `editMessage`, `deleteMessage`, `heartbeat`.
- [ ] Add authorization checks in each reducer.
- [ ] Write unit tests for reducers (using SpacetimeDB test harness).
- [ ] Publish module to local instance.

#### 5.2.2 Client Integration
- [ ] Install `@clockworklabs/spacetimedb-sdk`.
- [ ] Generate TypeScript bindings from module.
- [ ] Create `SpacetimeDBClient` singleton and connection management.
- [ ] Implement `useSpacetimeDB` hook to manage connection status.
- [ ] Sync user progress: subscribe to own `User` and `UserProgress`, update Zustand stores.
- [ ] Replace `localStorage` persistence with SpacetimeDB for progress (keep localStorage as fallback/cache).

#### 5.2.3 Chat System
- [ ] Create `ChatProvider` context with chat state.
- [ ] Implement `ChatWindow` component with message list and input.
- [ ] Add support for channels: global, lab‑specific, direct messages.
- [ ] Implement typing indicators.
- [ ] Add edit/delete functionality (with permission checks).
- [ ] Style chat with Neo‑Brutalist design.

#### 5.2.4 Online Presence
- [ ] Show online users in sidebar or chat.
- [ ] Implement heartbeat reducer called periodically.
- [ ] Display typing indicators.

### 5.3 Dependencies
- SpacetimeDB SDK
- Rust (for backend module) or C#

### 5.4 Milestone
- Users can register with a username.
- Progress syncs across devices.
- Real‑time chat works in global and lab channels.
- Online presence shows who's active.

---

## 6. Phase 4: UI Polish & Onboarding

### 6.1 Goals
- Finalize Neo‑Brutalist design.
- Implement user onboarding flow.
- Add dashboard with progress visualization.
- Polish micro‑interactions.

### 6.2 Tasks

#### 6.2.1 Design Polishing
- [ ] Apply consistent Neo‑Brutalist styling to all components (buttons, cards, inputs).
- [ ] Add hover effects (instant color swaps).
- [ ] Ensure proper spacing and typography.
- [ ] Test on different screen sizes (responsive adjustments).

#### 6.2.2 Onboarding Flow
- [ ] Create `WelcomeModal` for new users (username selection).
- [ ] Build interactive terminal introduction (guided steps).
- [ ] Implement progressive feature unlocking (chat unlocks after 3 labs, etc.).
- [ ] Add tooltips for first‑time users pointing to key UI elements.

#### 6.2.3 Dashboard & Progress Visualization
- [ ] Create dashboard page showing:
  - Level and XP progress bar
  - Streak calendar
  - Recent achievements
  - Module completion grid
- [ ] Add skill tree visualization (optional, can be later).

#### 6.2.4 Micro‑interactions
- [ ] Add success animations on lab completion.
- [ ] XP gain notifications (toast).
- [ ] Level‑up modal.
- [ ] Achievement unlocked toast.

### 6.3 Milestone
- New users go through a smooth onboarding and complete first lab.
- All UI elements are polished and consistent.
- Dashboard provides clear progress overview.

---

## 7. Phase 5: Testing, Deployment & Security

### 7.1 Goals
- Comprehensive testing (unit, integration, E2E).
- Set up CI/CD pipeline.
- Deploy to production.
- Security hardening.

### 7.2 Tasks

#### 7.2.1 Testing
- [ ] Write unit tests for all commands (Jest).
- [ ] Write unit tests for VFS methods.
- [ ] Write integration tests for lab engine + VFS.
- [ ] Write SpacetimeDB reducer tests.
- [ ] Set up Playwright for E2E tests covering critical paths.
- [ ] Achieve target coverage (see `testing_strategy.md`).

#### 7.2.2 CI/CD
- [ ] Create GitHub Actions workflow for running tests on push.
- [ ] Add steps for building frontend and publishing SpacetimeDB module.
- [ ] Configure automatic deployment to staging on push to `main`.
- [ ] Set up manual promotion to production.

#### 7.2.3 Deployment
- [ ] Provision SpacetimeDB Cloud instance or self‑hosted server.
- [ ] Configure TLS/WSS.
- [ ] Deploy frontend to Vercel/Netlify.
- [ ] Set up environment variables for production.
- [ ] Configure custom domain (if applicable).

#### 7.2.4 Security Hardening
- [ ] Review all reducers for proper authorization.
- [ ] Add rate limiting (in‑app or reverse proxy).
- [ ] Set up Sentry for client‑side error tracking.
- [ ] Enable audit logging.
- [ ] Run dependency audits.
- [ ] Write `SECURITY.md`.

#### 7.2.5 Monitoring
- [ ] Set up Prometheus metrics endpoint (if self‑hosting).
- [ ] Configure alerts for critical metrics.
- [ ] Create Grafana dashboard.

### 7.3 Milestone
- All tests pass in CI.
- Production deployment is live and accessible.
- Security measures are in place.
- Monitoring provides visibility into system health.

---

## 8. Development Principles

- **Test‑driven where possible:** Write tests alongside code, especially for core logic (VFS, commands, reducers).
- **Commit often:** Use conventional commits (feat, fix, docs, test, etc.).
- **Document as you go:** Update the relevant docs if implementation deviates from plan.
- **Prioritize user experience:** Always run the app and test flows manually.
- **Keep security in mind:** Never trust client input; validate in reducers.

---

## 9. Directory Structure (Final)

```
linux-terminal-academy/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── terminal/
│   │   ├── lab/
│   │   ├── chat/
│   │   └── layout/
│   ├── features/
│   │   ├── auth/
│   │   ├── gamification/
│   │   ├── lab-engine/
│   │   ├── command-engine/
│   │   ├── vfs/
│   │   └── chat/
│   ├── hooks/
│   ├── lib/
│   │   ├── spacetime/
│   │   │   ├── client.ts
│   │   │   └── bindings/ (generated)
│   │   ├── vfs/
│   │   ├── commands/
│   │   └── gamification/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── data/
│   │   └── labs/
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes.tsx
│   └── index.css
├── spacetime-module/
│   ├── src/
│   │   ├── lib.rs
│   │   └── ... (Rust source)
│   ├── Cargo.toml
│   └── publish.sh
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```

---

## 10. Conclusion

This plan gives Antigravity a clear path forward. Each phase builds on the previous one, and all specifications are available in the referenced documents. The agent should follow the order, but may adjust based on emerging priorities. Regular checkpoints (at the end of each phase) ensure progress is on track.

**Now, let's start building!**
