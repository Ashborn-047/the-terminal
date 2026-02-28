# Backend Documentation: SpacetimeDB Integration

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Design Phase  

---

## 1. Overview

The **The Terminal** backend is powered by **SpacetimeDB**, a high-performance, relational database system that combines the database and server logic into a single unit. It enables real-time synchronization of data across all connected clients without requiring a separate API layer.

### Why SpacetimeDB?
- **Real-time by default** – All connected clients see data changes instantly.
- **ACID transactions** – Reducers ensure data consistency.
- **Type‑safe client bindings** – Automatically generated from the module.
- **No separate backend server** – The database is the server.
- **Built‑in identity** – Each connection is authenticated via an identity token.

---

## 2. Architecture

```
┌─────────────────┐     ┌───────────────────────────────────┐
│   React Frontend │ ←─→ │      SpacetimeDB Module           │
│   (TypeScript)   │     │  (Rust module + database tables)  │
└─────────────────┘     └───────────────────────────────────┘
         ↑                            ↑
         │                            │
    localStorage              WebSocket connection
    (offline cache)           (real-time sync)
```

### 2.1 Key Concepts
- **Module** – A Rust (or C#) program that defines tables and reducers. Deployed to SpacetimeDB.
- **Tables** – Define the schema of persistent data.
- **Reducers** – Functions that modify the database in response to client calls.
- **Subscriptions** – Queries that clients subscribe to; the server automatically pushes updates when relevant data changes.
- **Identity** – Every connection has a unique `Identity`; can be linked to a user account.

---

## 3. Data Models (Rust)

All backend logic lives in a single Rust crate. Tables are defined with `#[spacetimedb(table)]` and reducers with `#[spacetimedb(reducer)]`.

### 3.1 Core Tables

#### `User`
```rust
use spacetimedb::{spacetimedb, Identity, Timestamp};

#[spacetimedb(table)]
pub struct User {
    #[primarykey]
    identity: Identity,
    username: String,
    display_name: Option<String>,
    level: u32,
    xp: u64,
    streak: u32,
    longest_streak: u32,
    last_activity: Timestamp,
    avatar_url: Option<String>,
    is_online: bool,
    created_at: Timestamp,
}
```

#### `UserProgress`
```rust
#[spacetimedb(table)]
pub struct UserProgress {
    #[primarykey]
    identity: Identity,
    completed_labs: Vec<String>,      // list of lab IDs
    completed_modules: Vec<u32>,       // module numbers
    unlocked_modules: Vec<u32>,
    achievements: Vec<String>,         // achievement IDs
    activity_log: Vec<ActivityEntry>,  // JSON-encoded for simplicity
}
```

#### `LabState`
Stores the current state of a lab for each user (or group in future multiplayer labs).
```rust
#[spacetimedb(table)]
pub struct LabState {
    #[primarykey]
    id: u64,                           // auto-increment
    user_identity: Identity,
    lab_id: String,
    vfs_snapshot: String,               // JSON representation of the virtual filesystem
    started_at: Timestamp,
    completed_at: Option<Timestamp>,
    current_step: u32,                  // for guided labs
    verified: bool,
}
```

#### `LeaderboardEntry`
```rust
#[spacetimedb(table)]
pub struct LeaderboardEntry {
    #[primarykey]
    identity: Identity,
    rank: u64,
    total_xp: u64,
    level: u32,
    updated_at: Timestamp,
}
```

#### `Message` (for chat – detailed in Chat Documentation)
```rust
#[spacetimedb(table)]
pub struct Message {
    #[primarykey]
    id: u64,
    sender: Identity,
    content: String,
    channel: String,        // "global", "lab-5", "direct:identity"
    timestamp: Timestamp,
    edited: Option<Timestamp>,
    deleted: bool,
}
```

#### `OnlinePresence` (for real‑time “who’s online”)
```rust
#[spacetimedb(table)]
pub struct OnlinePresence {
    #[primarykey]
    identity: Identity,
    last_seen: Timestamp,
    current_lab: Option<String>,
}
```

---

## 4. Reducers (Server Logic)

Reducers are functions that clients can call to modify the database. They run atomically on the server.

### 4.1 User Management

```rust
#[spacetimedb(reducer)]
pub fn register_user(ctx: &ReducerContext, username: String) -> Result<(), String> {
    // Validate username
    if ctx.db.user().identity().find(&ctx.sender).is_some() {
        return Err("User already registered".to_string());
    }
    if username.is_empty() || username.len() > 30 {
        return Err("Invalid username".to_string());
    }
    
    ctx.db.user().insert(User {
        identity: ctx.sender,
        username,
        display_name: None,
        level: 1,
        xp: 0,
        streak: 0,
        longest_streak: 0,
        last_activity: ctx.timestamp,
        avatar_url: None,
        is_online: true,
        created_at: ctx.timestamp,
    });
    
    ctx.db.user_progress().insert(UserProgress {
        identity: ctx.sender,
        completed_labs: Vec::new(),
        completed_modules: Vec::new(),
        unlocked_modules: vec![1],  // start with module 1
        achievements: Vec::new(),
        activity_log: Vec::new(),
    });
    
    Ok(())
}
```

### 4.2 Lab Progress

```rust
#[spacetimedb(reducer)]
pub fn complete_lab(ctx: &ReducerContext, lab_id: String, xp_earned: u64) -> Result<(), String> {
    // Find user
    let mut user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    
    // Add XP
    user.xp += xp_earned;
    
    // Level up calculation
    while user.xp >= xp_for_level(user.level + 1) {
        user.level += 1;
    }
    
    user.last_activity = ctx.timestamp;
    ctx.db.user().identity().update(user);
    
    // Mark lab as completed in progress
    let mut progress = ctx.db.user_progress().identity().find(ctx.sender)
        .ok_or("Progress not found")?;
    progress.completed_labs.push(lab_id);
    ctx.db.user_progress().identity().update(progress);
    
    // Update leaderboard
    update_leaderboard(ctx, ctx.sender)?;
    
    Ok(())
}

// Helper: XP required for a given level
fn xp_for_level(level: u32) -> u64 {
    if level <= 10 { (level * 100) as u64 }
    else { 1000 + (level - 10) * 500 as u64 }
}
```

### 4.3 Streak Management

```rust
#[spacetimedb(reducer)]
pub fn update_streak(ctx: &ReducerContext) -> Result<(), String> {
    let mut user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    
    let today = ctx.timestamp.date();
    let last = user.last_activity.date();
    
    if today > last {
        if today - last == 1 {
            // consecutive day
            user.streak += 1;
            if user.streak > user.longest_streak {
                user.longest_streak = user.streak;
            }
        } else {
            // gap > 1 day, reset streak
            user.streak = 1; // today counts as first day
        }
    }
    // else same day – do nothing
    
    user.last_activity = ctx.timestamp;
    ctx.db.user().identity().update(user);
    
    Ok(())
}
```

### 4.4 Presence Heartbeat

```rust
#[spacetimedb(reducer)]
pub fn heartbeat(ctx: &ReducerContext, current_lab: Option<String>) {
    // Update online presence
    if let Some(mut presence) = ctx.db.online_presence().identity().find(ctx.sender) {
        presence.last_seen = ctx.timestamp;
        presence.current_lab = current_lab;
        ctx.db.online_presence().identity().update(presence);
    } else {
        ctx.db.online_presence().insert(OnlinePresence {
            identity: ctx.sender,
            last_seen: ctx.timestamp,
            current_lab,
        });
    }
    
    // Mark user as online in User table (optional)
    if let Some(mut user) = ctx.db.user().identity().find(ctx.sender) {
        user.is_online = true;
        user.last_activity = ctx.timestamp;
        ctx.db.user().identity().update(user);
    }
}
```

### 4.5 Cleanup Job (Scheduled Reducer)

SpacetimeDB supports scheduled reducers. We can run a cleanup every minute to mark users offline.

```rust
#[spacetimedb(reducer, schedule(interval = 60))]
pub fn cleanup_offline_users(ctx: &ReducerContext) {
    let threshold = ctx.timestamp - Duration::from_secs(120); // 2 minutes
    for mut presence in ctx.db.online_presence().iter() {
        if presence.last_seen < threshold {
            ctx.db.online_presence().delete(presence.identity);
            
            // also update user.is_online
            if let Some(mut user) = ctx.db.user().identity().find(presence.identity) {
                user.is_online = false;
                ctx.db.user().identity().update(user);
            }
        }
    }
}
```

---

## 5. Client Integration (React)

### 5.1 Setup

```bash
npm install @clockworklabs/spacetimedb-sdk
```

### 5.2 Connection

```typescript
import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";

const client = new SpacetimeDBClient("ws://localhost:3000", "linux_terminal_academy");
await client.connect();
```

### 5.3 Using Auto‑Generated Bindings

After deploying the module, run the code generator:

```bash
spacetime generate --lang typescript --out-dir src/module_bindings
```

This creates types and reducer wrappers. Example usage:

```typescript
import { useReducer, useSubscription } from "./module_bindings";

function UserProfile() {
    const myIdentity = client.identity; // from connection
    
    // Subscribe to my user data
    const myUser = useSubscription(
        (ctx) => ctx.db.user.filter_by_identity(myIdentity)
    )[0];
    
    const completeLab = useReducer("complete_lab");
    
    return (
        <div>
            <h1>{myUser?.username}</h1>
            <p>Level {myUser?.level} • XP {myUser?.xp}</p>
            <button onClick={() => completeLab("lab-1", 50)}>
                Complete Lab 1
            </button>
        </div>
    );
}
```

### 5.4 Subscriptions for Real‑time UI

```typescript
function Leaderboard() {
    const entries = useSubscription(
        (ctx) => ctx.db.leaderboard_entry.order_by_rank().take(10)
    );
    
    return (
        <ol>
            {entries.map(e => (
                <li key={e.identity}>{e.rank}. User {e.identity} – {e.total_xp} XP</li>
            ))}
        </ol>
    );
}
```

### 5.5 Offline Support & Local Caching

Use Zustand (or React Context) to maintain a client‑side cache. The subscription updates will keep it in sync.

```typescript
import { create } from 'zustand';

interface UserStore {
    users: Map<string, User>;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    users: new Map(),
    setUser: (user) => set((state) => {
        const newMap = new Map(state.users);
        newMap.set(user.identity, user);
        return { users: newMap };
    })
}));

// In a component, combine subscription with store update
useEffect(() => {
    const sub = client.db.user().subscribe((user) => {
        useUserStore.getState().setUser(user);
    });
    return () => sub.unsubscribe();
}, []);
```

---

## 6. Deployment & Scaling

### 6.1 Local Development
```bash
spacetime start  # starts a local instance
spacetime publish -p /path/to/module
```

### 6.2 Production
- Deploy to SpacetimeDB Cloud or self‑host.
- Use `spacetime publish --cluster <cluster-name>`.
- Set environment variables for auth (e.g., JWT secret).

### 6.3 Scaling Considerations
- SpacetimeDB is single‑binary but can scale vertically.
- For massive scale, sharding can be implemented at the application level (separate modules for different regions).
- The database supports **150k+ transactions per second** on a single node , sufficient for thousands of concurrent users.

---

## 7. Security & Authentication

### 7.1 Identity
SpacetimeDB uses a built‑in `Identity` type that uniquely identifies each connection. You can associate an identity with a user account after verifying an external token (e.g., JWT).

### 7.2 Reducer Authorization
Always validate sender permissions inside reducers:

```rust
#[spacetimedb(reducer)]
pub fn delete_lab_state(ctx: &ReducerContext, state_id: u64) -> Result<(), String> {
    let state = ctx.db.lab_state().id().find(state_id)
        .ok_or("State not found")?;
    
    if state.user_identity != ctx.sender {
        return Err("Unauthorized".to_string());
    }
    
    ctx.db.lab_state().id().delete(state_id);
    Ok(())
}
```

### 7.3 Data Privacy
- Use subscriptions that only return data the user is allowed to see.
- For private messages, store them in a table keyed by both sender and recipient, and subscribe to messages where `recipient = my_identity`.

---

## 8. Monitoring & Observability

SpacetimeDB provides built‑in metrics via Prometheus endpoint. You can monitor:
- Connected clients
- Reducer call rates
- Database size
- Query latency

Integrate with Grafana for dashboards.

---

## 9. Backup & Restore

Use `spacetime dump` to export the entire database to a file. Schedule regular backups.

```bash
spacetime dump --database linux_terminal_academy > backup.spacetimedb
```

Restore with:
```bash
spacetime restore --database linux_terminal_academy backup.spacetimedb
```

---

## 10. Summary

SpacetimeDB eliminates the need for a separate backend API. All game logic lives in the database module, and the React frontend communicates directly via WebSocket with automatically generated bindings. This architecture is **simple, performant, and real‑time by design**.
