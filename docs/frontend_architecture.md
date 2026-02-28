# Frontend Architecture Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

This document defines the frontend architecture for the Linux Terminal Academy. It covers folder structure, state management, routing, component hierarchy, and integration with SpacetimeDB. The architecture is designed for scalability, maintainability, and a consistent developer experience.

---

## 2. Technology Stack

| **Layer**          | **Technology**                                    |
|---------------------|---------------------------------------------------|
| Framework           | React 18 with TypeScript                          |
| Build Tool          | Vite                                              |
| Styling             | Tailwind CSS 4.0 + custom Neo‑Brutalist theme     |
| State Management    | Zustand (client state) + SpacetimeDB subscriptions (server sync) |
| Routing             | React Router v6                                   |
| Icons               | Lucide React                                      |
| UI Components       | Custom components (with Radix UI primitives where needed) |
| Real‑time Sync      | SpacetimeDB TypeScript SDK                        |

---

## 3. Folder Structure

```
src/
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
│   ├── ui/               # Generic building blocks (Button, Card, Input)
│   ├── terminal/         # Terminal-specific components (Terminal, Prompt, Output)
│   ├── lab/              # Lab-related components (LabCard, LabInstructions, Hint)
│   ├── chat/             # Chat components (ChatWindow, MessageBubble, TypingIndicator)
│   └── layout/           # Layout components (Header, Sidebar, MainLayout)
├── features/             # Feature-based modules
│   ├── auth/             # Authentication (SpacetimeDB identity)
│   ├── gamification/     # XP, level, streak, achievements
│   ├── lab-engine/       # Lab execution and verification
│   ├── command-engine/   # Command parsing and execution
│   ├── vfs/              # Virtual File System logic
│   └── chat/             # Chat state and logic
├── hooks/                # Custom React hooks
│   ├── useSpacetimeDB.ts # SpacetimeDB connection and subscriptions
│   ├── useTerminal.ts    # Terminal input/output management
│   ├── useLab.ts         # Lab progress and verification
│   └── useAuth.ts        # User identity and registration
├── lib/                  # Core utilities and services
│   ├── spacetime/        # SpacetimeDB client setup, generated bindings
│   ├── vfs/              # VFS classes and operations
│   ├── commands/         # Command registry and parsers
│   └── gamification/     # Gamification calculations and helpers
├── stores/               # Zustand stores (client-side state)
│   ├── userStore.ts      # User profile, progress (cached)
│   ├── uiStore.ts        # UI state (sidebar open, theme)
│   └── chatStore.ts      # Local chat UI state (typing, drafts)
├── types/                # TypeScript type definitions
│   ├── api.ts            # SpacetimeDB generated types (or manual)
│   ├── lab.ts            # Lab definitions and verification
│   └── vfs.ts            # Virtual file system types
├── utils/                # Helper functions
│   ├── date.ts           # Date formatting for streaks
│   └── commandHelpers.ts # Command parsing utilities
├── App.tsx               # Root component
├── main.tsx              # Entry point
├── routes.tsx            # React Router configuration
└── index.css             # Global styles (Tailwind imports + custom)
```

---

## 4. State Management Strategy

We use a **hybrid approach**: client-side state with Zustand, and server‑synced state with SpacetimeDB subscriptions.

### 4.1 Zustand Stores (Client‑Only State)

Zustand manages ephemeral UI state and cached user data that doesn’t need real‑time sync.

**Example: `uiStore.ts`**
```typescript
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light'; // though we only use dark
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

**Example: `userStore.ts`** (caches user profile from SpacetimeDB)
```typescript
import { create } from 'zustand';
import { User } from '../types/api';

interface UserState {
  profile: User | null;
  setProfile: (profile: User) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
```

### 4.2 SpacetimeDB Subscriptions (Server State)

SpacetimeDB provides real‑time data via subscriptions. We wrap subscriptions in custom hooks that update Zustand stores automatically.

**Hook: `useSpacetimeDB.ts`**
```typescript
import { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { client } from '../lib/spacetime/client';

export function useSpacetimeDB() {
  useEffect(() => {
    // Connect to SpacetimeDB
    client.connect();

    // Subscribe to user data for the current identity
    const unsubscribeUser = client.db.user.subscribe(
      (user) => {
        if (user.identity === client.identity) {
          useUserStore.getState().setProfile(user);
        }
      }
    );

    // Clean up on unmount
    return () => {
      unsubscribeUser();
      client.disconnect();
    };
  }, []);
}
```

**Usage in `App.tsx`:**
```typescript
function App() {
  useSpacetimeDB(); // initializes connection and subscriptions
  return <RouterProvider router={router} />;
}
```

### 4.3 SpacetimeDB Generated Bindings

After deploying the module, run:
```bash
spacetime generate --lang typescript --out-dir src/lib/spacetime/bindings
```

This creates types and reducer wrappers. Import them directly.

---

## 5. Routing (React Router)

We use React Router v6 with a nested layout.

**`routes.tsx`**
```typescript
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LabsPage from './pages/LabsPage';
import LabDetailPage from './pages/LabDetailPage';
import CommandsPage from './pages/CommandsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'labs', element: <LabsPage /> },
      { path: 'labs/:labId', element: <LabDetailPage /> },
      { path: 'commands', element: <CommandsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
]);
```

**`MainLayout.tsx`** includes the sidebar, header, and outlet.

---

## 6. Component Hierarchy

We follow a **composition over configuration** approach.

### 6.1 Layout Components
- `MainLayout` – wraps the whole app, includes `Header` and `Sidebar`.
- `Header` – top bar with level/XP, streak, chat icon, user menu.
- `Sidebar` – navigation links, module progress, quick access.

### 6.2 Terminal Components
- `Terminal` – main container, manages input line and output history.
- `Prompt` – shows `$` or `>` with current working directory.
- `OutputLine` – renders a single line of output (text, error, etc.).
- `InputLine` – handles user typing, history navigation, tab completion.

### 6.3 Lab Components
- `LabCard` – displays lab title, XP reward, status (completed/in-progress/locked).
- `LabInstructions` – shows lab objective, step-by-step guide, hints.
- `LabVerification` – indicates success/failure of current step/goal.

### 6.4 Chat Components
- `ChatWindow` – list of messages, input area, typing indicators.
- `MessageBubble` – single message with sender, timestamp, edit/delete actions.
- `ChannelList` – list of available channels (global, lab-specific, DMs).

### 6.5 Gamification Components
- `LevelBadge` – shows current level and XP progress bar.
- `StreakFlame` – displays streak count with flame icon.
- `AchievementCard` – displays achievement name, description, progress.

---

## 7. Theming with Tailwind

We extend Tailwind with our Neo‑Brutalist design tokens.

**`tailwind.config.js`**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brutal: {
          black: '#0A0A0A',
          dark: '#1E1E1E',
          white: '#F0F0F0',
          gray: '#A0A0A0',
          green: '#00FF9D',
          red: '#FF4D4D',
          yellow: '#FFE600',
          blue: '#00CCFF',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        heading: ['Archivo Black', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
```

**Global CSS (`index.css`):**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Archivo+Black&family=JetBrains+Mono:wght@400;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-brutal-black text-brutal-white font-sans antialiased;
  }
}
```

---

## 8. Code Organization Patterns

### 8.1 Custom Hooks
Encapsulate complex logic. Example: `useTerminal` manages input, history, command execution.

```typescript
export function useTerminal() {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const executeCommand = useCallback(async (cmd: string) => {
    // ...
  }, []);
  return { history, input, setInput, executeCommand };
}
```

### 8.2 Feature Modules
Each feature (lab-engine, command-engine, vfs) is a self‑contained directory with its own logic, types, and tests. They export a public API used by components.

### 8.3 SpacetimeDB Client Singleton
We create a singleton client instance to avoid multiple connections.

**`lib/spacetime/client.ts`**
```typescript
import { SpacetimeDBClient } from '@clockworklabs/spacetimedb-sdk';

export const client = new SpacetimeDBClient(
  import.meta.env.VITE_SPACETIME_HOST || 'ws://localhost:3000',
  'linux_terminal_academy'
);
```

---

## 9. Error Boundaries

Wrap major sections (e.g., terminal, chat) with error boundaries to prevent whole app crashes.

```typescript
class TerminalErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div>Terminal crashed. Reload?</div>;
    }
    return this.props.children;
  }
}
```

---

## 10. Performance Considerations

- **Virtual scrolling** for long terminal output.
- **Debounced typing** for chat input to reduce reducer calls.
- **Memoized selectors** for Zustand stores.
- **Lazy loading** for routes (React Router `lazy`).

---

## 11. Integration Checklist

- [ ] Set up Vite + React + TypeScript.
- [ ] Install and configure Tailwind.
- [ ] Create folder structure.
- [ ] Set up Zustand stores.
- [ ] Integrate SpacetimeDB client and generate bindings.
- [ ] Implement basic layout.
- [ ] Add routing.
- [ ] Build core components (Terminal, LabCard, etc.).
- [ ] Connect SpacetimeDB subscriptions to Zustand.
- [ ] Implement error boundaries.

---

**This document provides a complete blueprint for the frontend architecture. All team members (including Antigravity) must adhere to these patterns when building UI components and integrating with the backend.**
