# Security Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

Security is a critical consideration for **The Terminal**, even though it is an educational platform. We must protect user data, prevent abuse, and ensure the integrity of the learning environment. This document covers:

- **Authentication & Identity** (SpacetimeDB built‑in identity, optional JWT)
- **Authorization** (reducer‑level permission checks)
- **Data Privacy** (encryption, access control to user data)
- **Input Validation** (preventing injection or unexpected behavior)
- **Rate Limiting & Abuse Prevention**
- **Secure Communication** (TLS/WSS)
- **Audit Logging**
- **Vulnerability Management**

---

## 2. Authentication & Identity

### 2.1 SpacetimeDB Built‑in Identity

SpacetimeDB automatically assigns a unique `Identity` to each connected client. This identity is persistent across sessions if the client stores the token.

- **New users:** When a client connects for the first time, SpacetimeDB generates an identity and sends it to the client. The client should store this token in `localStorage` and reuse it on subsequent visits.
- **Returning users:** The client presents the stored token, and SpacetimeDB recognizes them.

**Client-side storage:**
```typescript
// After connection, get the identity
const identity = client.identity;
localStorage.setItem('spacetime_identity', identity.toHexString());

// On app start, attempt to reconnect with stored identity
const storedIdentity = localStorage.getItem('spacetime_identity');
if (storedIdentity) {
  client.setIdentity(Identity.fromHexString(storedIdentity));
}
```

### 2.2 Optional: JWT Authentication

For future integration with external auth providers (Google, GitHub), we can issue JWTs that SpacetimeDB can validate. This requires setting a JWT secret in the SpacetimeDB server and having the client send the token.

**SpacetimeDB config:**
```bash
export SPACETIMEDB_AUTH_JWT_SECRET=your-secret-key
```

**Client:**
```typescript
client.setToken(jwtToken);
```

**When to use:** If we want to allow users to sign in with existing accounts or have more control over identity recovery. For MVP, the built‑in identity is sufficient.

---

## 3. Authorization (Reducer Permissions)

Every reducer must verify that the caller (`ctx.sender`) is allowed to perform the action.

### 3.1 User‑Specific Data

- Users can only modify their own `User` and `UserProgress` records.
- Users can only read others' data if it's non‑sensitive (e.g., usernames for chat, leaderboard entries).

**Example: Updating user profile**
```rust
#[spacetimedb(reducer)]
pub fn update_profile(ctx: &ReducerContext, display_name: String) -> Result<(), String> {
    let mut user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    user.display_name = Some(display_name);
    ctx.db.user().identity().update(user);
    Ok(())
}
```

### 3.2 Lab Progress

- Only the user themselves can mark a lab as completed.
- However, if we later add multiplayer labs, we'll need to allow modifications by authorized participants.

### 3.3 Chat Messages

- Users can edit/delete their own messages.
- Moderators (special flag in `User`) can delete any message.

**Example: Delete message with moderator check**
```rust
#[spacetimedb(reducer)]
pub fn delete_message(ctx: &ReducerContext, message_id: u64) -> Result<(), String> {
    let msg = ctx.db.message().id().find(message_id)
        .ok_or("Message not found")?;
    
    // Check if user is sender or moderator
    if msg.sender != ctx.sender {
        let user = ctx.db.user().identity().find(ctx.sender)
            .ok_or("User not found")?;
        if !user.is_moderator {
            return Err("Unauthorized".to_string());
        }
    }
    
    ctx.db.message().id().delete(message_id);
    Ok(())
}
```

### 3.4 Admin Reducers

Some reducers (e.g., resetting user progress, creating announcements) should be restricted to admin users. We can define an `is_admin` flag in the `User` table.

---

## 4. Data Privacy

### 4.1 What Data Do We Store?

| **Table**      | **Fields**                                                                 | **Sensitivity** |
|----------------|----------------------------------------------------------------------------|-----------------|
| `User`         | identity, username, display_name, level, xp, streak, last_activity, avatar | Low (public username, stats) |
| `UserProgress` | completed_labs, unlocked_modules, achievements, activity_log               | Medium (personal progress) |
| `LabState`     | vfs_snapshot, current_step                                                 | Low (lab state) |
| `Message`      | sender, content, channel, timestamp                                        | Medium (chat content) |
| `OnlinePresence`| last_seen, current_lab                                                     | Low (presence) |

### 4.2 Access Control

- **Public data:** Leaderboard entries (username, level, XP) are visible to all.
- **Private data:** UserProgress, LabState should only be accessible by the owner.
- **Chat messages:** Visible to channel participants. Direct messages visible only to the two participants.

**SpacetimeDB subscriptions enforce this:** Clients subscribe to queries that filter by their identity.

```typescript
// Subscribe to own progress
client.db.user_progress.filter_by_identity(myIdentity).subscribe();
```

### 4.3 Encryption

- All data at rest in SpacetimeDB is stored in its native format; we assume the hosting environment provides disk encryption (cloud providers do).
- Data in transit is encrypted via TLS/WSS (see Section 6).

---

## 5. Input Validation & Sanitization

### 5.1 Reducer Inputs

All reducer arguments must be validated before use.

- **Username:** Length, allowed characters (alphanumeric + underscore).
- **Message content:** Max length (e.g., 500 characters), no HTML/script injection (we treat as plain text; if we later allow markdown, we'll sanitize).
- **File paths:** In DIY lab verification, ensure paths are within allowed boundaries (e.g., no `../` escaping). Our VFS resolves paths safely, but we should still validate at reducer level if we accept paths.

**Example:**
```rust
if username.len() < 3 || username.len() > 20 {
    return Err("Username must be 3–20 characters".to_string());
}
if !username.chars().all(|c| c.is_alphanumeric() || c == '_') {
    return Err("Username can only contain letters, numbers, and underscores".to_string());
}
```

### 5.2 Command Input

The terminal command parser already handles escaping and injection is not a concern because commands run in a simulated VFS. However, we must ensure that commands cannot escape the simulation (e.g., via shell injection). Our parser does not invoke a real shell; it tokenizes and executes our own functions, so it's safe.

---

## 6. Secure Communication

### 6.1 TLS for WebSocket (WSS)

All production connections to SpacetimeDB must be over `wss://`. This is enforced by:

- Using a reverse proxy (Caddy/NGINX) with TLS termination.
- Or using SpacetimeDB Cloud, which provides TLS automatically.

**Caddy example:**
```caddyfile
spacetimedb.yourdomain.com {
    reverse_proxy localhost:3000
    header_up Sec-WebSocket-Protocol {http.request.header.Sec-WebSocket-Protocol}
    header_up X-Forwarded-For {remote_host}
}
```

### 6.2 Frontend Hosting

The React frontend should be served over HTTPS. Vercel/Netlify provide this by default.

### 6.3 HSTS

Enable HSTS to force browsers to always use HTTPS.

---

## 7. Rate Limiting

SpacetimeDB does not have built‑in rate limiting. To prevent abuse (e.g., spam in chat, repeated reducer calls), we have several options:

### 7.1 Application‑Level Rate Limiting

Implement rate limiting inside reducers using a simple cooldown based on timestamps stored in a table.

```rust
#[spacetimedb(table)]
pub struct RateLimit {
    #[primarykey]
    identity: Identity,
    last_message_time: Timestamp,
    message_count: u32,
}

#[spacetimedb(reducer)]
pub fn send_message(ctx: &ReducerContext, content: String) -> Result<(), String> {
    let mut rate = ctx.db.rate_limit().identity().find(ctx.sender)
        .unwrap_or(RateLimit { identity: ctx.sender, last_message_time: ctx.timestamp, message_count: 0 });
    
    let now = ctx.timestamp;
    if now - rate.last_message_time < Duration::from_secs(60) {
        rate.message_count += 1;
        if rate.message_count > 10 {
            return Err("Rate limit exceeded. Please wait.".to_string());
        }
    } else {
        rate.message_count = 1;
    }
    rate.last_message_time = now;
    ctx.db.rate_limit().identity().insert(rate);
    
    // ... proceed to send message
}
```

### 7.2 Reverse Proxy Level

Use a reverse proxy like Caddy with the `rate_limit` directive to limit connections per IP. However, this doesn't distinguish between users behind the same IP.

**Caddy rate limit example:**
```caddyfile
reverse_proxy localhost:3000 {
    rate_limit {
        zone dynamic {
            key {remote_host}
            events 100
            window 1m
        }
    }
}
```

### 7.3 Cloudflare

If we put the site behind Cloudflare, we can use their rate limiting features.

---

## 8. Audit Logging

For security‑relevant events, we should maintain an audit log table.

```rust
#[spacetimedb(table)]
pub struct AuditLog {
    #[primarykey]
    id: u64,
    timestamp: Timestamp,
    identity: Identity,
    action: String,      // e.g., "delete_message", "change_permissions"
    details: String,      // JSON with relevant info
}
```

Log events:
- User registration
- Message deletion (by moderator)
- Permission changes (if we add admin features)
- Lab progress manipulation (maybe)

This helps with incident investigation.

---

## 9. Vulnerability Management

### 9.1 Dependency Scanning

- Use `npm audit` for frontend dependencies.
- For Rust module, use `cargo audit` to check for vulnerable crates.

**CI Integration:**
```yaml
- name: Audit frontend
  run: npm audit --production
- name: Audit backend
  run: cargo install cargo-audit && cargo audit
```

### 9.2 Security Updates

- Keep SpacetimeDB binary updated to latest version.
- Monitor SpacetimeDB release notes for security patches.

### 9.3 Responsible Disclosure

Provide a way for security researchers to report issues (e.g., `security@yourdomain.com`). Include a `SECURITY.md` file in the repository.

---

## 10. Implementation Checklist

- [ ] Ensure all reducers check authorization.
- [ ] Add input validation for all user‑supplied fields.
- [ ] Set up TLS/WSS in production.
- [ ] Implement rate limiting for chat and critical reducers.
- [ ] Add audit logging for sensitive actions.
- [ ] Run dependency audits in CI.
- [ ] Write `SECURITY.md` with contact information.
- [ ] Test permission boundaries (e.g., try to access another user's data via subscriptions).

---

**This document completes the security considerations for the Linux Terminal Academy. All team members must adhere to these practices to protect users and maintain platform integrity.**
