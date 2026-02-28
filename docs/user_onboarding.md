# User Onboarding Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

User onboarding is the critical first experience for new learners. It sets the tone, reduces friction, and ensures users quickly understand the value of **The Terminal**. A well‑designed onboarding flow increases retention, reduces support requests, and encourages users to start their first lab.

This document outlines the onboarding flow, including first‑time user registration, initial tutorial, progress setup, and progressive feature introduction.

---

## 2. Onboarding Goals

| **Goal** | **Description** |
|----------|-----------------|
| **Immediate value** | Users should complete a meaningful task within 2–3 minutes of signing up. |
| **Contextual learning** | Teach by doing – the first lab introduces core concepts naturally. |
| **No overwhelm** | Avoid feature‑dumping; introduce chat, achievements, and labs gradually. |
| **Progress anchoring** | Show users their starting point and what they'll achieve. |
| **Motivation boost** | Use gamification (XP, achievements) right away to trigger dopamine. |

---

## 3. Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Entry Points                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Landing   │  │   Direct    │  │   Existing  │             │
│  │    Page     │  │   Lab Link  │  │   User      │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Identity Check                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  SpacetimeDB anonymous identity or JWT login?             │  │
│  │  - If new identity → onboard                               │  │
│  │  - If existing identity → load progress, redirect to labs │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  New User – Onboarding Steps                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Step 1: Welcome & Username                                 │  │
│  │ Step 2: Terminal Introduction (interactive)                │  │
│  │ Step 3: First Lab – "Your First Command"                   │  │
│  │ Step 4: Celebrate & Unlock Dashboard                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.1 Step 1: Welcome & Username

When a user with a new SpacetimeDB identity arrives, they see a welcome modal or dedicated onboarding page.

**UI Elements:**
- Friendly headline: "Welcome to The Terminal!"
- Subtext: "You're about to start your journey to Linux mastery."
- Input field: "Choose a username (this will be visible to others)"
- Optional: avatar selection (later)
- "Continue" button

**Backend Action:**
Call the `registerUser` reducer with the chosen username. This creates a `User` record with level 1, 0 XP, and streak 0.

**Edge Cases:**
- Username already taken → show error, suggest alternatives.
- Username too short/long → validate client‑side (3–20 chars, alphanumeric + underscore).

### 3.2 Step 2: Terminal Introduction

After registration, the user is taken to a special "onboarding lab" – a guided, interactive walkthrough of the terminal interface.

**Content:**
- "This is the terminal. You type commands here."
- A mini terminal appears with a prompt. The user is instructed to type `pwd` and press Enter.
- After they do, the output is shown and the next instruction appears.
- They then type `ls` and see the contents of their home directory (pre‑populated with a few sample files/folders).

This step is essentially a guided lab with 2–3 steps, designed to demonstrate basic interaction.

### 3.3 Step 3: First Real Lab – "Your First Command"

After the introduction, the user is automatically enrolled in their first lab: **Module 1, Lab 1: "Your First Command"** (which may overlap with the intro but now with clear objectives and XP reward).

**Lab Content:**
- Learn `pwd`, `ls`, `cd`.
- Navigate to `/home/guest/Documents` and list files.
- XP reward: 50 XP + bonus for first lab.

**UI:**
- Sidebar shows lab instructions.
- Terminal remains active.
- Progress is tracked per step.
- Upon completion, a celebration animation plays.

### 3.4 Step 4: Celebrate & Unlock Dashboard

After completing the first lab, the user sees a success modal:

- "🎉 Congratulations! You've earned your first 50 XP."
- "You're now Level 2!" (if enough XP)
- "Your journey continues – explore more labs in the curriculum."
- Buttons: "Continue Learning" (goes to labs page) and "View Dashboard" (opens progress overview).

The full dashboard with modules, achievements, and chat becomes accessible.

---

## 4. Progressive Feature Introduction

To avoid overwhelming new users, we introduce features gradually based on milestones.

| **Milestone** | **Features Unlocked** |
|---------------|------------------------|
| After first lab | Dashboard, next labs, basic profile |
| After 3 labs | Chat (read‑only global channel) |
| After 5 labs | Achievements tab, ability to send chat messages |
| After 10 labs | Command reference, DIY labs |
| After completing Module 3 | Streak display, daily goals |
| After completing Module 5 | Profile customization (avatar, bio) |

This can be implemented by checking the user's `completedLabs` length and conditionally rendering UI elements or showing tooltips.

---

## 5. UI Components for Onboarding

### 5.1 Welcome Modal

```tsx
// components/onboarding/WelcomeModal.tsx

import { useState } from 'react';
import { useSpacetimeReducer } from '../../hooks/useSpacetimeDB';

export function WelcomeModal({ onComplete }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const registerUser = useSpacetimeReducer('registerUser');

  const handleSubmit = async () => {
    try {
      await registerUser(username);
      onComplete();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-brutal-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-brutal-dark border-3 border-brutal-white p-8 max-w-md w-full">
        <h1 className="font-heading text-3xl uppercase mb-4">Welcome to The Terminal</h1>
        <p className="mb-6 text-brutal-gray">Choose a username to begin your journey.</p>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full bg-brutal-black border-2 border-brutal-white p-3 mb-2 text-brutal-white"
          autoFocus
        />
        {error && <p className="text-brutal-red mb-4">{error}</p>}
        
        <button
          onClick={handleSubmit}
          disabled={!username.trim()}
          className="w-full border-2 border-brutal-green text-brutal-green py-3 hover:bg-brutal-green hover:text-brutal-black disabled:opacity-50"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}
```

### 5.2 Onboarding Tooltip

We use a simple tooltip system to point out UI elements.

```tsx
// components/onboarding/Tooltip.tsx

export function Tooltip({ children, targetId, message, onNext }) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    // Position tooltip near target
    // ...
  }, []);

  return (
    <div className="absolute z-50 bg-brutal-yellow text-brutal-black p-3 border-2 border-brutal-black">
      <p>{message}</p>
      <button onClick={onNext} className="mt-2 underline">Got it</button>
    </div>
  );
}
```

We can chain tooltips for the first login: point to sidebar, terminal, lab instructions, etc.

---

## 6. State Management for Onboarding

We track onboarding progress in the `userStore` (Zustand) and sync with SpacetimeDB (maybe via a `onboardingCompleted` flag in `User` table).

```typescript
// stores/userStore.ts

interface UserState {
  profile: User | null;
  onboardingStep: number; // 0 = not started, 1 = username, 2 = intro, 3 = first lab, 4 = completed
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
}

// In the component, after registration, set step to 2.
```

Alternatively, we can infer onboarding completion from `completedLabs` (if first lab done, onboarding complete).

---

## 7. Edge Cases

- **Returning user after clearing cache:** Their identity is still in SpacetimeDB, so they should be recognized and skip onboarding. The frontend must check `localStorage` for an existing identity token; if not, but the identity is known to the server (by connecting), we still need to fetch the user profile. If the server returns a user, they are not new.
- **Multiple tabs:** If a user opens two tabs during onboarding, ensure state syncs via SpacetimeDB subscriptions.
- **Abandoned onboarding:** If a user closes the browser during step 2, we should resume from where they left off (stored in `userStore` and persisted).

---

## 8. Onboarding Analytics

Track key events:

- `onboarding_started`
- `onboarding_step_1_complete` (username chosen)
- `onboarding_step_2_complete` (terminal intro done)
- `onboarding_step_3_complete` (first lab done)
- `onboarding_completed`

This data helps optimize the flow.

---

## 9. Testing Onboarding

**Unit tests:**
- Registration reducer handles duplicate usernames.
- Onboarding step progression works correctly.

**Integration tests:**
- Full onboarding flow using Playwright (simulate a new user, complete steps).

**Example Playwright test:**
```typescript
test('new user completes onboarding', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Welcome to The Terminal')).toBeVisible();
  await page.fill('input[placeholder="Username"]', 'testuser');
  await page.click('text=Start Learning');
  
  // Terminal intro
  await expect(page.locator('.terminal-input')).toBeVisible();
  await page.fill('.terminal-input', 'pwd');
  await page.keyboard.press('Enter');
  await expect(page.locator('.terminal-output')).toContainText('/home/guest');
  
  // First lab completion should trigger celebration
  // ...
});
```

---

## 10. Implementation Checklist

- [ ] Add `username` field to `User` table (if not already).
- [ ] Create `registerUser` reducer.
- [ ] Build `WelcomeModal` component.
- [ ] Build `Tooltip` component for guided tours.
- [ ] Create onboarding lab definition (can be part of Module 1).
- [ ] Implement progressive feature unlocking based on completed labs.
- [ ] Add analytics tracking.
- [ ] Write tests.

---

**This document defines the complete user onboarding experience. All team members should ensure the onboarding flow is seamless, engaging, and sets users up for success.**
