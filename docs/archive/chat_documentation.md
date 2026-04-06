# Chat System Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Design Phase  

---

## 1. Overview

The chat system enables real‑time communication between users of the Linux Terminal Academy. It is built on top of SpacetimeDB and integrates seamlessly with the gamification and curriculum.

### Key Features
- Global chat channel
- Lab‑specific channels
- Direct messaging
- Online presence indicators
- Message history (persistent)
- Moderation tools (delete, edit)

---

## 2. Data Model

### 2.1 `Message` Table

```rust
#[spacetimedb(table)]
pub struct Message {
    #[primarykey]
    id: u64,
    sender: Identity,
    content: String,
    channel: String,          // e.g., "global", "lab:module-5", "dm:identity"
    timestamp: Timestamp,
    edited: Option<Timestamp>,
    deleted: bool,             // soft delete
    pinned: bool,              // for announcements
}
```

### 2.2 `Channel` Table (optional, for metadata)

```rust
#[spacetimedb(table)]
pub struct Channel {
    #[primarykey]
    name: String,              // same as channel string used in messages
    description: Option<String>,
    created_by: Identity,
    created_at: Timestamp,
    is_private: bool,
    members: Vec<Identity>,    // for private channels
}
```

### 2.3 `TypingIndicator` (ephemeral, not persisted)

```rust
#[spacetimedb(table)]
pub struct TypingIndicator {
    #[primarykey]
    identity: Identity,
    channel: String,
    started_at: Timestamp,
}
```

---

## 3. Reducers (Chat Logic)

### 3.1 Send Message

```rust
#[spacetimedb(reducer)]
pub fn send_message(ctx: &ReducerContext, channel: String, content: String) -> Result<(), String> {
    if content.trim().is_empty() {
        return Err("Message cannot be empty".to_string());
    }
    
    // Optional: check if user has access to channel
    if channel.starts_with("lab:") {
        // Verify user has unlocked that lab
        let progress = ctx.db.user_progress().identity().find(ctx.sender)
            .ok_or("User progress not found")?;
        let lab_id = channel.trim_start_matches("lab:");
        if !progress.completed_labs.contains(&lab_id.to_string()) {
            return Err("You must complete this lab to chat in its channel".to_string());
        }
    }
    
    ctx.db.message().insert(Message {
        id: ctx.timestamp().nanoseconds(), // simple unique ID
        sender: ctx.sender,
        content,
        channel,
        timestamp: ctx.timestamp,
        edited: None,
        deleted: false,
        pinned: false,
    });
    
    Ok(())
}
```

### 3.2 Edit Message

```rust
#[spacetimedb(reducer)]
pub fn edit_message(ctx: &ReducerContext, message_id: u64, new_content: String) -> Result<(), String> {
    let mut msg = ctx.db.message().id().find(message_id)
        .ok_or("Message not found")?;
    
    if msg.sender != ctx.sender {
        return Err("You can only edit your own messages".to_string());
    }
    
    if msg.deleted {
        return Err("Cannot edit a deleted message".to_string());
    }
    
    msg.content = new_content;
    msg.edited = Some(ctx.timestamp);
    ctx.db.message().id().update(msg);
    
    Ok(())
}
```

### 3.3 Delete Message (Soft)

```rust
#[spacetimedb(reducer)]
pub fn delete_message(ctx: &ReducerContext, message_id: u64) -> Result<(), String> {
    let mut msg = ctx.db.message().id().find(message_id)
        .ok_or("Message not found")?;
    
    // Allow deletion by sender or moderator (if we later add roles)
    if msg.sender != ctx.sender {
        // Check if user is moderator
        // (Moderator flag could be stored in User table)
        let user = ctx.db.user().identity().find(ctx.sender)
            .ok_or("User not found")?;
        if !user.is_moderator {
            return Err("Unauthorized".to_string());
        }
    }
    
    msg.deleted = true;
    ctx.db.message().id().update(msg);
    
    Ok(())
}
```

### 3.4 Typing Indicator

```rust
#[spacetimedb(reducer)]
pub fn start_typing(ctx: &ReducerContext, channel: String) {
    // Insert or update typing indicator
    if let Some(mut typing) = ctx.db.typing_indicator().identity().find(ctx.sender) {
        typing.channel = channel;
        typing.started_at = ctx.timestamp;
        ctx.db.typing_indicator().identity().update(typing);
    } else {
        ctx.db.typing_indicator().insert(TypingIndicator {
            identity: ctx.sender,
            channel,
            started_at: ctx.timestamp,
        });
    }
}

#[spacetimedb(reducer)]
pub fn stop_typing(ctx: &ReducerContext) {
    ctx.db.typing_indicator().identity().delete(ctx.sender);
}
```

Clients should call `start_typing` periodically while the user is typing, and `stop_typing` when they send or clear input.

---

## 4. Subscriptions (Client Queries)

### 4.1 Global Chat

```typescript
const messages = useSubscription(
    (ctx) => ctx.db.message
        .filter_by_channel("global")
        .order_by_timestamp()
        .take(100)
);
```

### 4.2 Lab Channel

```typescript
function LabChat({ labId }) {
    const messages = useSubscription(
        (ctx) => ctx.db.message
            .filter((msg) => msg.channel === `lab:${labId}`)
            .order_by_timestamp()
    );
    // ...
}
```

### 4.3 Direct Messages

```typescript
function DirectMessage({ otherIdentity }) {
    // DM channel identifier: "dm:" + sorted identities to be unique
    const channelId = `dm:${[myIdentity, otherIdentity].sort().join(':')}`;
    
    const messages = useSubscription(
        (ctx) => ctx.db.message
            .filter((msg) => msg.channel === channelId)
            .order_by_timestamp()
    );
    
    // Also check access: only if both are participants (already ensured by channel name)
    // ...
}
```

### 4.4 Online Presence

```typescript
const onlineUsers = useSubscription(
    (ctx) => ctx.db.online_presence.iter()
).map(p => p.identity);
```

---

## 5. Client Integration (React Components)

### 5.1 ChatProvider Context

```typescript
import React, { createContext, useContext } from 'react';
import { useSubscription, useReducer } from './module_bindings';

interface ChatContextType {
    sendMessage: (channel: string, content: string) => void;
    editMessage: (id: number, content: string) => void;
    deleteMessage: (id: number) => void;
    startTyping: (channel: string) => void;
    stopTyping: () => void;
    messages: Message[];
    typingUsers: Map<string, Identity[]>; // channel -> list of typing identities
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }) => {
    const messages = useSubscription(ctx => ctx.db.message.iter());
    const typingIndicators = useSubscription(ctx => ctx.db.typing_indicator.iter());
    
    const sendMessage = useReducer('send_message');
    const editMessage = useReducer('edit_message');
    const deleteMessage = useReducer('delete_message');
    const startTyping = useReducer('start_typing');
    const stopTyping = useReducer('stop_typing');
    
    // Group typing indicators by channel
    const typingUsers = useMemo(() => {
        const map = new Map();
        typingIndicators.forEach(t => {
            if (!map.has(t.channel)) map.set(t.channel, []);
            map.get(t.channel).push(t.identity);
        });
        return map;
    }, [typingIndicators]);
    
    return (
        <ChatContext.Provider value={{
            sendMessage,
            editMessage,
            deleteMessage,
            startTyping,
            stopTyping,
            messages,
            typingUsers,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
```

### 5.2 ChatWindow Component

```typescript
import { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from './ChatProvider';

function ChatWindow({ channel }) {
    const { messages, sendMessage, startTyping, stopTyping, typingUsers } = useContext(ChatContext);
    const [input, setInput] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);
    
    const channelMessages = messages
        .filter(m => m.channel === channel && !m.deleted)
        .sort((a,b) => a.timestamp - b.timestamp);
    
    const typingInChannel = typingUsers.get(channel) || [];
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [channelMessages]);
    
    const handleInputChange = (e) => {
        setInput(e.target.value);
        
        // Typing indicator logic
        if (typingTimeout) clearTimeout(typingTimeout);
        startTyping(channel);
        setTypingTimeout(setTimeout(() => {
            stopTyping();
        }, 3000));
    };
    
    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(channel, input);
        setInput('');
        stopTyping();
    };
    
    return (
        <div className="chat-window">
            <div className="messages">
                {channelMessages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {typingInChannel.length > 0 && (
                    <div className="typing-indicator">
                        {typingInChannel.length} user(s) typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
```

### 5.3 MessageBubble Component

```typescript
function MessageBubble({ message }) {
    const { editMessage, deleteMessage } = useContext(ChatContext);
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(message.content);
    const myIdentity = client.identity; // from somewhere
    
    const isMine = message.sender === myIdentity;
    
    const handleEdit = () => {
        if (editText !== message.content) {
            editMessage(message.id, editText);
        }
        setEditing(false);
    };
    
    return (
        <div className={`message ${isMine ? 'mine' : 'theirs'}`}>
            <div className="sender">{message.sender}</div>
            {editing ? (
                <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleEdit}
                    onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                    autoFocus
                />
            ) : (
                <div className="content">
                    {message.content}
                    {message.edited && <span className="edited"> (edited)</span>}
                </div>
            )}
            <div className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
            </div>
            {isMine && !editing && (
                <div className="actions">
                    <button onClick={() => setEditing(true)}>✎</button>
                    <button onClick={() => deleteMessage(message.id)}>🗑</button>
                </div>
            )}
        </div>
    );
}
```

---

## 6. Channels & Access Control

### 6.1 Channel Types

| **Type**   | **Naming Convention** | **Access Control** |
|------------|------------------------|---------------------|
| Global     | `"global"`             | All authenticated users |
| Lab        | `"lab:{labId}"`        | Users who have unlocked the lab (or completed it) |
| Direct     | `"dm:{id1}:{id2}"`     | Only the two participants |
| Instructor | `"instructor"`         | Special role (e.g., `is_instructor` flag) |

### 6.2 Access Enforcement

In reducers, always check permissions before inserting a message. For lab channels:

```rust
if channel.starts_with("lab:") {
    let lab_id = channel.trim_start_matches("lab:");
    let progress = ctx.db.user_progress().identity().find(ctx.sender)
        .ok_or("No progress")?;
    if !progress.unlocked_modules.contains(&lab_id) {
        return Err("Lab not unlocked".to_string());
    }
}
```

For DMs, ensure the channel name matches both participants.

---

## 7. Moderation Features

### 7.1 Roles

Add a field to `User`:
```rust
is_moderator: bool,
is_instructor: bool,
```

### 7.2 Pin Message

Only moderators/instructors can pin.
```rust
#[spacetimedb(reducer)]
pub fn pin_message(ctx: &ReducerContext, message_id: u64) -> Result<(), String> {
    let user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    if !user.is_moderator {
        return Err("Only moderators can pin messages".to_string());
    }
    
    let mut msg = ctx.db.message().id().find(message_id)
        .ok_or("Message not found")?;
    msg.pinned = true;
    ctx.db.message().id().update(msg);
    Ok(())
}
```

### 7.3 Mute / Ban (future)
Could be implemented with additional tables: `MutedUser`, `BannedUser`.

---

## 8. Real‑time Typing Indicators

- The `typing_indicator` table is ephemeral; we rely on clients calling `stop_typing` when done.
- To avoid stale entries, run a cleanup scheduled reducer:

```rust
#[spacetimedb(reducer, schedule(interval = 10))]
pub fn cleanup_typing(ctx: &ReducerContext) {
    let threshold = ctx.timestamp - Duration::from_secs(10);
    for typing in ctx.db.typing_indicator().iter() {
        if typing.started_at < threshold {
            ctx.db.typing_indicator().delete(typing.identity);
        }
    }
}
```

---

## 9. Message History & Pagination

SpacetimeDB subscriptions can be combined with `take()` and `skip()` for pagination. For infinite scroll, use a cursor based on timestamp.

```typescript
const [limit, setLimit] = useState(50);
const messages = useSubscription(
    (ctx) => ctx.db.message
        .filter_by_channel(channel)
        .order_by_timestamp_desc()
        .take(limit)
);
```

---

## 10. UI/UX Considerations

- **Notifications**: Show a badge on the chat icon when new messages arrive in channels the user is not currently viewing.
- **Mentions**: Highlight `@username` and notify the mentioned user.
- **Emoji support**: Allow Unicode emojis.
- **Markdown**: Basic formatting (bold, code blocks) can be rendered with a simple library.

---

## 11. Integration with Gamification

- **Achievement**: "First Message" – award when user sends their first chat message.
- **XP for helpfulness**: Users can upvote helpful messages, granting XP to the author (requires additional reducer).
- **Instructor‑led labs**: Instructors can post announcements in lab channels.

---

## 12. Testing

### 12.1 Unit Tests (Rust)

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_send_message() {
        let ctx = test_context();
        let result = send_message(&ctx, "global".to_string(), "Hello".to_string());
        assert!(result.is_ok());
        
        let msgs = ctx.db.message().iter().collect::<Vec<_>>();
        assert_eq!(msgs.len(), 1);
        assert_eq!(msgs[0].content, "Hello");
    }
}
```

### 12.2 Integration Tests

Use multiple WebSocket clients to simulate real interaction and verify sync.

---

## 13. Future Enhancements

- **Voice chat** – Using WebRTC, but SpacetimeDB can coordinate signaling.
- **Threaded replies** – Add `reply_to` field to messages.
- **Rich embeds** – Show previews of lab links shared in chat.
- **Search** – Full‑text search over messages (SpacetimeDB supports this via `LIKE` or future full‑text indexes).
