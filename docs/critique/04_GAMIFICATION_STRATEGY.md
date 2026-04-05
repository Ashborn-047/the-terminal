# Gamification Evolution & User Engagement Strategy

## 4.1 — Current System Audit

### XP & Level Curve
### [SEVERITY: P2] Jarring XP Curve Discontinuity
**What**: The formula in `gamificationStore.ts` uses a quadratic curve (`100 * ((level - 1) * level) / 2`) for levels 1-10, but hard-switches to a linear curve (`4500 + (level - 10) * 1000`) for levels 11+.
**Why it matters**: This creates a jarring pacing shift. The quadratic curve is too steep initially, punishing beginners, while the linear curve plateaus motivation for advanced users who expect increasing difficulty.
**How to fix**: Implement a smoothed exponential curve (e.g., $XP = Base \times 1.15^{Level}$) across all levels to ensure consistent pacing.
**Verification**: Write a unit test asserting that the XP delta between level N and N+1 is strictly monotonically increasing for N from 1 to 50.

| Level | Current XP Required | Proposed XP Required | Approx Hours |
|---|---|---|---|
| 2 | 100 | 100 | 0.5 |
| 5 | 1,000 | ~750 | 2.5 |
| 10 | 4,500 | ~3,500 | 10 |
| 20 | 14,500 | ~14,000 | 40 |

### Achievement Audit
### [SEVERITY: P3] Shallow Achievement Design
**What**: Current achievements are almost exclusively "Milestone" markers (e.g., "Complete Module 1").
**Why it matters**: They function merely as a secondary progress bar rather than rewarding unique exploration or technical skill expression, missing a core driver of player engagement.
**How to fix**: Implement [Exploration] achievements (e.g., `cat /var/mail/admin`), and [Skill] achievements (e.g., `Pipe Master: chain 4 commands using pipes`).
**Verification**: Create an achievement object with `triggerType: 'exploration'` and verify that reading the specific file triggers the achievement notification.

### Streak System
### [SEVERITY: P3] Invisible Streak Mechanics
**What**: The streak system multiplies XP by 1.0x to 2.0x, but this occurs silently in the backend logic.
**Why it matters**: Users do not emotionally "feel" a 1.2x multiplier when completing a lab, rendering the mechanic ineffective for retention.
**How to fix**: Introduce a visual "Streak Flame" in the terminal prompt (PS1) that grows or changes color based on streak length. Display the multiplier prominently on the lab completion screen.
**Verification**: Ensure `useTerminalStore` reads `streakMultiplier` and updates the prompt rendering logic accordingly.

### Challenge Arena Gap
### [SEVERITY: P1] Incomplete Challenge Arena Stubs
**What**: "Survival Mode" and "Ultimate Mastery Test" are visible in the UI but wired to no actual functionality.
**Why it matters**: Teasing endgame content without delivering it causes massive churn among users who finish the guided curriculum.
**How to fix**: Implement the Survival Mode Engine. Load a broken VFS state, start a 5-minute timer, and verify the fix. Upon success, deduct 1 minute from the timer and load the next broken state immediately.
**Verification**: Ensure the timer correctly interrupts a user mid-command if it hits 0, logging a failure state.

## 4.2 — The "Normal Person" Onboarding Problem

**The Paralysis of the Blinking Cursor**:
A completely blank terminal is terrifying to a non-technical user.

**The New 60-Second Onboarding Flow**:
1. **The Hook**: A simulated "Incoming Connection..." boot sequence.
2. **The Guide**: The terminal types *for* the user automatically: `echo "Hello. I am the system. Who are you?"`
3. **The Scaffold**: A glowing tooltip highlights the prompt, saying "Type `whoami` and press Enter."
4. **The Reward**: Upon pressing Enter, the system responds "Ah, a guest. Let's get you registered," immediately awarding 50 XP and a loud, satisfying level-up sound.

## 4.3 — Narrative Framework

**Setting**: You are a newly awakened AI maintenance drone on a derelict generational colony ship.
**The Stakes**: Life support systems are failing due to a corrupted mainframe.
**Integration**:
- Module 1 (Foundations): Navigating the local memory banks to find your own identity files.
- Module 4 (Permissions): Overriding lockdown protocols left by the old human administrators.
- Module 7 (Processes): Hunting down rogue malware processes consuming system resources.
**In-VFS Lore**:
- `/var/mail/admin`: Contains emails detailing the ship's final days, found by curious users exploring outside the lab path.

## 4.4 — Cosmetic & Social Reward System

**Customization Economy**:
Instead of just XP, labs and streaks award "Credits".

**Terminal Themes (Unlockables)**:
1. *Phosphor Green*: Unlocked at Level 5.
2. *Amber CRT*: Unlocked at Level 10.
3. *Cyberpunk Neon*: Purchased with 500 Credits.
4. *Solarized Dark/Light*: Unlocked by completing Module 5.
5. *Deep Space*: Earned via 30-day streak.

**PS1 Customization**:
Users can unlock prompt segments: `[User@Ship]`, `[Level 10]`, `🔥` (streak indicator).
*Technical*: The `useTerminalStore` needs a `ps1Format` string (e.g., `\\u@\\h:\\w\\$`), parsed by the UI layer before rendering the prompt.

**SpacetimeDB Schema updates**:
```rust
#[table(public, accessor = user_cosmetics)]
pub struct UserCosmetics {
    #[primary_key]
    pub identity: Identity,
    pub active_theme: String,
    pub active_ps1: String,
    pub unlocked_themes: Vec<String>,
}
```

## 4.5 — Multiplayer & Social Features

**Co-op Labs (The "Pair Programming" Mechanic)**:
- **Shared VFS**: Two users connect to the same SpacetimeDB session. Reducers sync VFS changes globally.
- **Role Separation**: One user is given `root` (can change configs), the other is given `app_user` (can restart services). They must communicate to fix a broken stack.
- **Conflict Resolution**: Last-write-wins on files, managed natively by SpacetimeDB's serialized transactions.

**Mentor System**:
- Users above Level 20 unlock "Mentor" status.
- They can enter a "Help Queue". If a beginner is stuck, the mentor can temporarily join their session as a read-only spectator and offer hints via chat.
- **Reward**: Mentors earn unique cosmetic titles for successful helps.

## 4.6 — Retention & Re-engagement

- **"Crisis Alert" Events**: Every Friday at 5 PM UTC, a global "Server Outage" boss lab becomes available for 48 hours. Completing it awards limited-time cosmetics.
- **Return Experience**: If a user returns after 14 days, don't drop them into the exact lab they left. Offer a "Boot Sequence Diagnostics" 2-minute refresher lab covering `cd`, `ls`, and `cat`.

## 4.7 — Monetization-Ready Architecture

**Free vs Premium Boundary**:
- **Free**: Modules 1-10 (Core Linux). Single-player. Standard VFS.
- **Premium (The Terminal PRO)**:
  - Advanced Modules (Kubernetes simulation, Cloud Infra).
  - Co-op Labs and Weekly Tournaments.
  - Unlimited AI Mentor hints.
- **Implementation**: SpacetimeDB `User` table gets an `is_pro: bool` flag. The React UI gates specific routes and API calls check this flag before executing premium reducers.