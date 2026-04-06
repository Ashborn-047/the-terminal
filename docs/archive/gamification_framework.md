# Gamification Framework Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Active Development  

---

## 1. Gamification Philosophy

The **The Terminal** uses gamification not as a superficial layer of badges and points, but as a **motivational engine** that drives learners through a rigorous, professional curriculum. Every gamification element serves a clear purpose:

| **Element** | **Purpose** |
|:---|:---|
| **XP (Experience Points)** | Quantify progress and effort; provide immediate feedback |
| **Levels** | Give long-term progression goals and status |
| **Streaks** | Encourage daily practice and habit formation |
| **Achievements** | Recognize mastery of specific skills and milestones |
| **Skill Trees** | Visualize learning path and what comes next |
| **Boss Challenges** | Test integration of multiple skills in realistic scenarios |
| **Leaderboards** | Foster friendly competition (optional, can be disabled) |

The system is designed to make learners **want to come back daily** and **feel proud of their progress** while systematically building RHCSA-level competence.

---

## 2. Core Gamification Components

### 2.1 Experience Points (XP)

**Purpose:** XP is the primary reward currency. It provides immediate positive feedback for every learning action.

#### XP Sources & Values

| **Action** | **Base XP** | **Notes** |
|:---|:---|:---|
| Complete a Guided Lab step | 10 XP | Per step within a lab |
| Complete a Guided Lab | 50 XP | Bonus for finishing all steps |
| Complete a DIY Lab | 100–200 XP | Scales with complexity |
| First lab of the day | +25 XP | Streak starter bonus |
| Streak milestone (7 days) | +100 XP | One-time bonus |
| Streak milestone (30 days) | +500 XP | One-time bonus |
| Complete all labs in a module | +250 XP | Module completion bonus |
| Earn an achievement | 0 XP | Achievements are non-XP rewards |

#### XP Calculation Formula
```
Total XP = Σ(Base XP) + Σ(Streak Bonuses) + Σ(Milestone Bonuses)
```

#### XP Display
- Shown in the top navigation bar as a numeric value and progress bar to next level
- Floating "+50 XP" animations when XP is earned
- Detailed breakdown available in the Progress dashboard

### 2.2 Leveling System

**Purpose:** Levels provide long-term progression and a sense of growing mastery.

#### Level Progression

| **Level** | **XP Required** | **Cumulative XP** | **Title Unlocked** |
|:---|:---|:---|:---|
| 1 | 0 | 0 | Terminal Novice |
| 2 | 100 | 100 | Command Rookie |
| 3 | 200 | 300 | File Explorer |
| 4 | 300 | 600 | Permission Apprentice |
| 5 | 400 | 1000 | Process Watcher |
| 6 | 500 | 1500 | User Manager |
| 7 | 600 | 2100 | Network Learner |
| 8 | 700 | 2800 | Service Controller |
| 9 | 800 | 3600 | Software Installer |
| 10 | 900 | 4500 | Storage Handler |
| 11–20 | 1000 per level | - | RHCSA Candidate |
| 21–30 | 1500 per level | - | Linux Professional |
| 31–50 | 2000 per level | - | Terminal Master |

**Level-Up Benefits:**
- New title displayed in profile
- Unlock access to higher-level modules
- Special profile badge on leaderboards (if enabled)

#### Level Formula
```
XP for Level N = 100 × N (for N ≤ 10)
XP for Level N = 1000 + (N-10) × 500 (for N > 10)
```

### 2.3 Streak System

**Purpose:** Streaks are the primary habit-building mechanism. They reward consistency and bring learners back daily.

#### Streak Mechanics

| **Rule** | **Behavior** |
|:---|:---|
| **Streak increment** | Complete at least one lab in a calendar day |
| **Streak freeze** | One missed day per week doesn't break streak (max 1 freeze active) |
| **Streak reset** | Miss two consecutive days without a freeze |
| **Max streak** | No maximum; tracked indefinitely |

#### Streak Bonuses

| **Streak Length** | **Daily Bonus** | **Milestone Bonus** |
|:---|:---|:---|
| 3 days | +10 XP on next lab | - |
| 7 days | +15 XP on next lab | +100 XP one-time |
| 14 days | +20 XP on next lab | - |
| 30 days | +25 XP on next lab | +500 XP one-time |
| 60 days | +30 XP on next lab | - |
| 90 days | +35 XP on next lab | +1000 XP one-time |
| 365 days | +50 XP on next lab | +5000 XP one-time + Legend badge |

#### Streak Display
- Flame icon with current streak number
- Calendar view showing last 30 days of activity
- Streak freeze indicator (ice cube icon when freeze is active)

### 2.4 Achievement System

**Purpose:** Achievements recognize specific accomplishments and encourage exploration of all platform features.

#### Achievement Categories

| **Category** | **Description** | **Example Achievements** |
|:---|:---|:---|
| **Milestone** | Reaching important progression points | "Level 10", "First Module Complete", "RHCSA Ready" |
| **Skill Mastery** | Demonstrating proficiency in specific areas | "Permission Master", "Grep Guru", "Process Terminator" |
| **Exploration** | Discovering hidden features or trying different approaches | "Man Page Reader", "Command Historian", "Tab Completion Wizard" |
| **Social** | Engaging with community features | "First Share", "Helped a Friend" (if social features added) |
| **Streak** | Maintaining long-term consistency | "7-Day Streak", "Monthly Warrior", "Yearly Legend" |
| **Easter Eggs** | Fun, hidden achievements | "Sudo Make Me a Sandwich", "Why Did You `rm -rf` That?" |

#### Achievement Data Structure

```json
{
  "id": "permissions-master",
  "name": "Permission Master",
  "description": "Correctly set permissions on 10 different files",
  "category": "skill-mastery",
  "icon": "🔐",
  "hidden": false,
  "criteria": {
    "type": "counter",
    "target": "permission-changes",
    "threshold": 10
  },
  "reward": {
    "xp": 0,
    "badge": true,
    "title": "Permission Master" // Optional title unlock
  }
}
```

#### Achievement Progress Tracking
- Each achievement has a progress bar
- Notifications when an achievement is earned
- Showcased in user profile

### 2.5 Skill Trees

**Purpose:** Visual representation of the curriculum that shows what's completed, what's next, and how topics relate.

#### Skill Tree Structure

```
RHCSA Skill Tree
├── Core Foundations [COMPLETED]
│   ├── Command Line Basics [COMPLETED]
│   ├── File Management [COMPLETED]
│   └── Getting Help [COMPLETED]
├── User Environment [IN PROGRESS]
│   ├── Users & Groups [75% COMPLETE]
│   ├── Permissions [50% COMPLETE]
│   └── Processes [LOCKED]
├── System Operations [LOCKED]
│   ├── Services
│   ├── Storage
│   └── Software
└── Advanced Topics [LOCKED]
    ├── Networking
    ├── Security
    └── Containers
```

#### Visual Design
- Branching tree or constellation of nodes
- Color-coded: completed (green), in-progress (blue), locked (gray)
- Clickable nodes show module details and link to labs
- Progress percentage per branch

### 2.6 Boss Challenges

**Purpose:** Comprehensive, multi-step scenarios that test integration of multiple skills. These are the "final exams" for modules or groups of modules.

#### Challenge Structure

| **Element** | **Description** |
|:---|:---|
| **Prerequisites** | Must complete specific modules or reach certain level |
| **Scenario** | Realistic problem description (e.g., "The web server is down; diagnose and fix it") |
| **Steps** | 5–10 required actions (not revealed upfront; user must figure out what to do) |
| **Time Limit** | Optional; 15–30 minutes for boss challenges |
| **Verification** | System checks final state AND intermediate steps (optional) |
| **Rewards** | 500–1000 XP, exclusive badge, unlocks next tier |

#### Example Boss Challenge: "The Broken Web Server"

**Scenario:** Users are reporting they cannot access the company website. You need to investigate and fix the issue.

**Required Actions (not shown to user):**
1. Check if httpd service is running (`systemctl status httpd`)
2. Check firewall rules (`firewall-cmd --list-all`)
3. Verify port 80 is open (`ss -tuln | grep 80`)
4. Check logs for errors (`journalctl -u httpd`)
5. Start/restart the service (`systemctl start httpd`)
6. Add firewall rule if needed (`firewall-cmd --add-service=http --permanent`)
7. Verify website is accessible (`curl localhost`)

### 2.7 Leaderboards (Optional)

**Purpose:** Foster friendly competition and community engagement.

#### Leaderboard Types

| **Type** | **Reset** | **Description** |
|:---|:---|:---|
| Daily | Daily | Most XP earned today |
| Weekly | Weekly | Most XP earned this week |
| Monthly | Monthly | Most XP earned this month |
| All-Time | Never | Total XP since joining |
| Streak | Never | Longest active streak |
| Module Race | Per module | First to complete a new module |

#### Privacy Options
- Users can opt out of leaderboards
- Anonymous mode (display as "Learner #1234")
- Friends-only leaderboards

---

## 3. Gamification Integration with Curriculum

### 3.1 Module-Locked Progression

| **Module** | **Required Level** | **Required Previous Modules** |
|:---|:---|:---|
| Module 1 | Level 1 | None |
| Module 2 | Level 1 | Module 1 |
| Module 3 | Level 2 | Module 2 |
| Module 4 | Level 2 | Module 3 |
| Module 5 | Level 3 | Module 4 |
| Module 6 | Level 3 | Module 5 |
| Module 7 | Level 4 | Module 6 |
| Module 8 | Level 4 | Module 7 |
| Module 9 | Level 5 | Module 8 |
| Module 10 | Level 5 | Module 9 |
| Module 11 | Level 6 | Module 10 |
| Module 12 | Level 6 | Module 11 |
| Module 13 | Level 7 | Module 12 |
| Module 14 | Level 7 | Module 13 |
| Module 15 | Level 8 | Module 14 |
| Module 16 | Level 8 | Module 15 |
| Module 17 | Level 9 | Module 16 |
| Module 18 | Level 10 | Module 17 |

### 3.2 Achievement Mapping to Curriculum

| **Achievement** | **Unlock Condition** | **Module** |
|:---|:---|:---|
| First Steps | Complete first lab | Module 1 |
| Help Seeker | Use `man` command 5 times | Module 3 |
| Pathfinder | Navigate to 10 different directories | Module 4 |
| Creator | Create 20 files/directories | Module 5 |
| Vim Novice | Complete vim tutorial | Module 6 |
| Pipeline Master | Use pipes in 5 different commands | Module 7 |
| User Creator | Create 3 different users | Module 8 |
| Permission Master | Change permissions 10 times | Module 9 |
| Process Killer | Terminate 5 processes | Module 10 |
| Service Manager | Start/stop/restart 10 services | Module 11 |
| SSH Pro | Successfully use SSH 5 times | Module 12 |
| Log Detective | Find errors in logs 3 times | Module 13 |
| Network Explorer | Use 5 different network commands | Module 14 |
| Archiver | Create 5 different archives | Module 15 |
| Package Manager | Install/remove 10 packages | Module 16 |
| Storage Handler | Mount/unmount 5 filesystems | Module 17 |
| RHCSA Ready | Complete all modules | Module 18 |

---

## 4. User Experience & Interface

### 4.1 Gamification Dashboard

Located in the main sidebar under "Progress"

**Dashboard Sections:**
1. **Level & XP Card**
   - Current level with title
   - XP progress bar (current / next level)
   - Total XP earned
   - "Level up in X more XP" indicator

2. **Streak Card**
   - Flame icon with current streak number
   - Today's status (completed/not completed)
   - Streak freeze indicator (if active)
   - "X day streak remaining this week" (shows freeze usage)

3. **Recent Activity Feed**
   - "Completed Lab: Filesystem Basics (+50 XP)"
   - "Earned Achievement: Pathfinder"
   - "Level Up! You are now Level 3"
   - "7-Day Streak Bonus: +100 XP"

4. **Achievement Showcase**
   - Latest 3 achievements earned
   - "View All" button to full achievement gallery
   - Progress on next achievable achievement

5. **Module Progress**
   - Visual grid of all 18 modules
   - Color-coded: completed, in-progress, locked
   - Overall completion percentage

### 4.2 Achievement Gallery

**Layout:**
- Grid of achievement cards
- Categories as filters
- Search functionality

**Achievement Card Design:**
```
┌─────────────────────┐
│ 🔐                  │ <- Icon
│ Permission Master   │ <- Name
│ Change permissions  │ <- Description
│ on 10 different     │
│ files               │
│                     │
│ [████████░░] 8/10   │ <- Progress bar
│                     │
│ +0 XP • Badge       │ <- Reward info
└─────────────────────┘
```

### 4.3 Notifications

**Types of Notifications:**
- **XP Earned:** Floating toast "+50 XP"
- **Level Up:** Modal with fanfare and new level info
- **Achievement Unlocked:** Toast with achievement name and icon
- **Streak Milestone:** Toast with flame and bonus amount
- **Module Unlocked:** Toast with module name

**Notification Design:**
- Non-intrusive (toast style)
- Auto-dismiss after 3-5 seconds
- Clickable to view details
- Stackable (up to 3 visible)

### 4.4 Profile Page

**User Profile Contains:**
- Username
- Current level with title
- Total XP
- Longest streak
- Achievement count
- Completed modules count
- Showcase (3 favorite achievements)
- Join date
- Activity heatmap (last 365 days)

---

## 5. Technical Implementation

### 5.1 Data Models

#### User Progress Schema (TypeScript)

```typescript
interface UserProgress {
  // Core progression
  xp: number;
  level: number;
  totalXpEarned: number;
  
  // Streak tracking
  streak: {
    current: number;
    longest: number;
    lastActivityDate: string; // ISO date
    freezeAvailable: boolean;
    freezeUsed: boolean;
    streakHistory: StreakDay[];
  };
  
  // Completed content
  completedLabs: string[]; // Lab IDs
  completedModules: number[]; // Module numbers
  unlockedModules: number[];
  
  // Achievements
  achievements: {
    id: string;
    unlockedAt: string;
    progress?: number; // For progressive achievements
  }[];
  
  // Activity log (for heatmap and feed)
  activityLog: ActivityEntry[];
  
  // Settings
  settings: {
    leaderboardOptOut: boolean;
    anonymousMode: boolean;
    notificationsEnabled: boolean;
  };
}

interface StreakDay {
  date: string;
  completed: boolean;
  freezeUsed: boolean;
}

interface ActivityEntry {
  timestamp: string;
  type: 'lab_complete' | 'achievement' | 'level_up' | 'streak_bonus';
  description: string;
  xpEarned: number;
}
```

#### Achievement Definition Schema

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'milestone' | 'skill-mastery' | 'exploration' | 'social' | 'streak' | 'easter-egg';
  icon: string; // Lucide icon name or emoji
  hidden: boolean;
  
  criteria: {
    type: 'counter' | 'boolean' | 'threshold';
    target: string; // What to track (e.g., 'permission-changes')
    threshold?: number; // For counter type
    condition?: string; // For boolean type
  };
  
  reward: {
    xp: number;
    badge: boolean;
    title?: string;
  };
  
  progression?: {
    total: number; // For multi-stage achievements
    stages?: {
      threshold: number;
      reward: string;
    }[];
  };
}
```

### 5.2 State Management

**Gamification Context (React):**

```typescript
interface GamificationContextType {
  // State
  userProgress: UserProgress;
  
  // Actions
  awardXP: (amount: number, source: string) => void;
  completeLab: (labId: string, xpAmount: number) => void;
  checkAchievements: () => void;
  updateStreak: () => void;
  resetStreak: () => void;
  useStreakFreeze: () => void;
  
  // Getters
  getNextLevelXP: () => number;
  getLevelProgress: () => number;
  getModuleProgress: (moduleNumber: number) => number;
  getAchievementProgress: (achievementId: string) => number;
}
```

### 5.3 Persistence

**Storage Strategy:**
- Primary: `localStorage` with key `"ltg-progress"`
- Backup: `sessionStorage` for crash recovery
- Export/Import: JSON file download/upload

**Save Triggers:**
- After any XP change
- After lab completion
- After achievement unlock
- After level up
- On page unload (if changed)

**Save Format:**
```json
{
  "version": "1.0",
  "timestamp": "2025-04-08T12:00:00Z",
  "data": { ... } // UserProgress object
}
```

### 5.4 Event System

**Events to Track for Gamification:**

```typescript
enum GamificationEvent {
  LAB_STARTED = 'lab_started',
  LAB_COMPLETED = 'lab_completed',
  LAB_STEP_COMPLETED = 'lab_step_completed',
  COMMAND_EXECUTED = 'command_executed',
  COMMAND_SUCCESS = 'command_success',
  FILE_CREATED = 'file_created',
  FILE_DELETED = 'file_deleted',
  PERMISSION_CHANGED = 'permission_changed',
  USER_CREATED = 'user_created',
  PROCESS_KILLED = 'process_killed',
  SERVICE_STARTED = 'service_started',
  SSH_CONNECTED = 'ssh_connected',
  MAN_OPENED = 'man_opened',
  TAB_COMPLETION_USED = 'tab_completion_used',
  // etc.
}
```

**Event Listener Pattern:**
```typescript
class GamificationEngine {
  private listeners: Map<GamificationEvent, Function[]>;
  
  on(event: GamificationEvent, callback: Function): void;
  emit(event: GamificationEvent, data: any): void;
  
  // Achievement checking
  private checkCounterAchievements(event: GamificationEvent, data: any): void;
  private checkMilestoneAchievements(): void;
}
```

---

## 6. Gamification Rules & Edge Cases

### 6.1 XP Rules

| **Rule** | **Description** |
|:---|:---|
| No XP for repeats | Completing a lab again does not award XP |
| Lab step XP | Only awarded first time each step is completed |
| Lab completion XP | Only awarded first time lab is completed |
| Daily first lab | Only counts once per day, regardless of how many labs |
| Streak bonus | Applied to next lab after reaching milestone |

### 6.2 Streak Rules

| **Scenario** | **Result** |
|:---|:---|
| Complete lab on Day 1 | Streak = 1 |
| Complete lab on Day 2 | Streak = 2 |
| Miss Day 3, freeze available | Streak = 2 (freeze used) |
| Miss Day 4 | Streak = 0 (reset) |
| Complete lab after reset | Streak = 1 |
| Complete 2 labs on same day | Streak still increments by 1 |

**Timezone Handling:**
- Streak day based on user's local timezone
- Detect via browser's `Intl` API
- Fallback to UTC if detection fails

### 6.3 Level-Up Rules

| **Rule** | **Description** |
|:---|:---|
| Automatic | Level up happens immediately when XP threshold reached |
| Overflow | Excess XP carries over to next level |
| Notifications | Show level-up modal only once per level |
| Unlock check | Re-check unlocked modules after level up |

### 6.4 Achievement Rules

| **Rule** | **Description** |
|:---|:---|
| Retroactive | Achievements can be earned retroactively when added |
| One-time | Achievements cannot be earned twice |
| Hidden | Hidden achievements show as "???" until unlocked |
| Progressive | Multi-stage achievements show progress after first stage |
| Notification | Show notification when achievement unlocked |

---

## 7. Initial Gamification Setup

### 7.1 New User Defaults

```javascript
const newUserProgress = {
  xp: 0,
  level: 1,
  totalXpEarned: 0,
  streak: {
    current: 0,
    longest: 0,
    lastActivityDate: null,
    freezeAvailable: true,
    freezeUsed: false,
    streakHistory: []
  },
  completedLabs: [],
  completedModules: [],
  unlockedModules: [1], // Only module 1 unlocked
  achievements: [],
  activityLog: [],
  settings: {
    leaderboardOptOut: false,
    anonymousMode: false,
    notificationsEnabled: true
  }
};
```

### 7.2 Welcome Bonus

When a new user completes their first lab:
- Award 50 XP (instead of normal 10)
- Unlock "First Steps" achievement
- Start streak at 1

---

## 8. Testing Gamification

### 8.1 Test Scenarios

| **Test Case** | **Expected Behavior** |
|:---|:---|
| Complete first lab | XP awarded, streak starts, achievement unlocks |
| Complete lab again | No additional XP |
| Complete lab next day | Streak increments by 1 |
| Miss one day | Streak freeze used (if available) |
| Miss two days | Streak resets to 0 |
| Reach level 2 | Level up modal shows, module 3 unlocks |
| Complete 10 permission changes | Permission Master achievement progress updates |
| Complete all module labs | Module completion bonus awarded |

### 8.2 Debug Mode

For testing, include a debug panel that:
- Shows current gamification state
- Allows manual XP adjustment
- Resets streak
- Unlocks achievements
- Simulates date changes

---

## 9. Future Gamification Enhancements

### Phase 2+ Features

| **Feature** | **Description** | **Timeline** |
|:---|:---|:---|
| **Daily Quests** | 3 random challenges each day for bonus XP | Phase 2 |
| **Seasonal Events** | Limited-time achievements and rewards | Phase 3 |
| **Mentor System** | Earn XP by helping other users | Phase 3 |
| **Guilds/Teams** | Group leaderboards and challenges | Future |
| **Cosmetic Rewards** | Terminal themes, profile backgrounds | Future |
| **XP Multipliers** | Boost XP during certain periods | Future |

---

## 10. Implementation Checklist

### Phase 0 (MVP)
- [ ] XP tracking system
- [ ] Level calculation
- [ ] Lab completion XP awards
- [ ] Basic streak tracking (no freeze)
- [ ] Progress persistence in localStorage

### Phase 1
- [ ] Full streak system with freeze
- [ ] Achievement framework
- [ ] First 20 achievements
- [ ] Level-up notifications
- [ ] Activity feed
- [ ] Progress dashboard UI

### Phase 2
- [ ] Skill tree visualization
- [ ] Boss challenges
- [ ] Leaderboards
- [ ] Achievement gallery
- [ ] Profile pages
- [ ] Daily quests

### Phase 3
- [ ] Seasonal events
- [ ] Social features
- [ ] Advanced analytics
- [ ] Export/import progress
