use spacetimedb::{table, reducer, Identity, ReducerContext, Timestamp, Table};

#[table(public, accessor = user)]
pub struct User {
    #[primary_key]
    pub identity: Identity,
    #[unique]
    pub username: String,
    pub display_name: Option<String>,
    pub level: u32,
    pub xp: u64,
    pub streak: u32,
    pub longest_streak: u32,
    pub last_activity: Timestamp,
    pub avatar_url: Option<String>,
    pub is_online: bool,
    pub is_admin: bool,
    pub created_at: Timestamp,
}

#[derive(spacetimedb::SpacetimeType)]
pub struct ActivityEntry {
    pub timestamp: Timestamp,
    pub action: String,
    pub metadata: String,
}

#[table(public, accessor = user_progress)]
pub struct UserProgress {
    #[primary_key]
    pub identity: Identity,
    pub completed_labs: Vec<String>,
    pub completed_modules: Vec<u32>,
    pub unlocked_modules: Vec<u32>,
    pub achievements: Vec<String>,
    pub activity_log: Vec<ActivityEntry>,
}

#[table(public, accessor = channel)]
pub struct Channel {
    #[primary_key]
    pub name: String,
    pub description: Option<String>,
    pub created_by: Identity,
    pub is_private: bool,
    pub members: Vec<Identity>,
}

#[table(public, accessor = lab_state)]
pub struct LabState {
    #[primary_key]
    pub id: u64,
    pub user_identity: Identity,
    pub lab_id: String,
    pub vfs_snapshot: String,
    pub started_at: Timestamp,
    pub completed_at: Option<Timestamp>,
    pub current_step: u32,
    pub verified: bool,
}

#[table(public, accessor = leaderboard_entry)]
pub struct LeaderboardEntry {
    #[primary_key]
    pub identity: Identity,
    pub rank: u64,
    pub total_xp: u64,
    pub level: u32,
    pub updated_at: Timestamp,
}

#[table(public, accessor = message)]
pub struct Message {
    #[primary_key]
    pub id: u64,
    pub sender_identity: Identity,
    pub content: String,
    pub channel: String,
    pub timestamp: Timestamp,
    pub edited: Option<Timestamp>,
    pub deleted: bool,
    pub pinned: bool,
}

#[table(public, accessor = online_presence)]
pub struct OnlinePresence {
    #[primary_key]
    pub identity: Identity,
    pub last_seen: Timestamp,
    pub current_lab: Option<String>,
}

#[table(public, accessor = typing_indicator)]
pub struct TypingIndicator {
    #[primary_key]
    pub identity: Identity,
    pub channel: String,
    pub started_at: Timestamp,
}

#[reducer]
pub fn register_user(ctx: &ReducerContext, username: String) -> Result<(), String> {
    if ctx.db.user().identity().find(&ctx.sender()).is_some() {
        return Err("User already registered".into());
    }
    if username.is_empty() || username.len() > 30 {
        return Err("Invalid username".into());
    }

    ctx.db.user().insert(User {
        identity: ctx.sender(),
        username,
        display_name: None,
        level: 1,
        xp: 0,
        streak: 0,
        longest_streak: 0,
        last_activity: ctx.timestamp,
        avatar_url: None,
        is_online: true,
        is_admin: false,
        created_at: ctx.timestamp,
    });

    ctx.db.user_progress().insert(UserProgress {
        identity: ctx.sender(),
        completed_labs: Vec::new(),
        completed_modules: Vec::new(),
        unlocked_modules: vec![1],
        achievements: Vec::new(),
        activity_log: vec![ActivityEntry {
            timestamp: ctx.timestamp,
            action: "registration".into(),
            metadata: "User registered".into(),
        }],
    });

    update_leaderboard(ctx, ctx.sender())?;

    Ok(())
}

#[reducer]
pub fn create_channel(ctx: &ReducerContext, name: String, description: Option<String>, is_private: bool) -> Result<(), String> {
    if ctx.db.channel().name().find(&name).is_some() {
        return Err("Channel already exists".into());
    }

    ctx.db.channel().insert(Channel {
        name,
        description,
        created_by: ctx.sender(),
        is_private,
        members: if is_private { vec![ctx.sender()] } else { Vec::new() },
    });

    Ok(())
}

#[reducer]
pub fn update_streak(ctx: &ReducerContext) -> Result<(), String> {
    let mut user = ctx.db.user().identity().find(&ctx.sender()).ok_or("User not found")?;
    let last_activity = user.last_activity.to_micros_since_unix_epoch();
    let current_time = ctx.timestamp.to_micros_since_unix_epoch();
    
    let one_day_micros = 24 * 60 * 60 * 1_000_000;
    let gap = current_time - last_activity;

    if gap < (one_day_micros * 2) {
        if gap >= one_day_micros {
            user.streak += 1;
            if user.streak > user.longest_streak {
                user.longest_streak = user.streak;
            }
        }
    } else {
        user.streak = 1;
    }

    user.last_activity = ctx.timestamp;
    ctx.db.user().identity().update(user);

    Ok(())
}

#[reducer]
pub fn complete_lab(ctx: &ReducerContext, lab_id: String, xp_earned: u64) -> Result<(), String> {
    let mut user = ctx.db.user().identity().find(&ctx.sender()).ok_or("User not found")?;
    user.xp += xp_earned;

    while user.xp >= xp_for_level(user.level + 1) {
        user.level += 1;
    }

    user.last_activity = ctx.timestamp;
    ctx.db.user().identity().update(user);

    let mut progress = ctx.db.user_progress().identity().find(&ctx.sender()).ok_or("Progress not found")?;
    if !progress.completed_labs.contains(&lab_id) {
        progress.completed_labs.push(lab_id);
    }
    ctx.db.user_progress().identity().update(progress);

    update_leaderboard(ctx, ctx.sender())?;

    Ok(())
}

#[reducer]
pub fn send_message(ctx: &ReducerContext, channel_name: String, content: String) -> Result<(), String> {
    if content.trim().is_empty() {
        return Err("Message cannot be empty".into());
    }

    if let Some(chan) = ctx.db.channel().name().find(&channel_name) {
        if chan.is_private && !chan.members.contains(&ctx.sender()) {
            return Err("Not a member of this private channel".into());
        }
    }

    ctx.db.message().insert(Message {
        id: (ctx.timestamp.to_micros_since_unix_epoch() / 1000) as u64,
        sender_identity: ctx.sender(),
        content,
        channel: channel_name,
        timestamp: ctx.timestamp,
        edited: None,
        deleted: false,
        pinned: false,
    });

    Ok(())
}

#[reducer]
pub fn edit_message(ctx: &ReducerContext, message_id: u64, content: String) -> Result<(), String> {
    if let Some(mut msg) = ctx.db.message().id().find(&message_id) {
        if msg.sender_identity != ctx.sender() {
            return Err("Not authorized".into());
        }
        msg.content = content;
        msg.edited = Some(ctx.timestamp);
        ctx.db.message().id().update(msg);
        Ok(())
    } else {
        Err("Message not found".into())
    }
}

#[reducer]
pub fn delete_message(ctx: &ReducerContext, message_id: u64) -> Result<(), String> {
    if let Some(mut msg) = ctx.db.message().id().find(&message_id) {
        let is_owner = msg.sender_identity == ctx.sender();
        let is_admin = ctx.db.user().identity().find(&ctx.sender()).map(|u| u.is_admin).unwrap_or(false);
        
        if !is_owner && !is_admin {
            return Err("Not authorized".into());
        }
        msg.deleted = true;
        ctx.db.message().id().update(msg);
        Ok(())
    } else {
        Err("Message not found".into())
    }
}

#[reducer]
pub fn pin_message(ctx: &ReducerContext, message_id: u64, pinned: bool) -> Result<(), String> {
    let is_admin = ctx.db.user().identity().find(&ctx.sender()).map(|u| u.is_admin).unwrap_or(false);
    if !is_admin {
        return Err("Only admins can pin messages".into());
    }

    if let Some(mut msg) = ctx.db.message().id().find(&message_id) {
        msg.pinned = pinned;
        ctx.db.message().id().update(msg);
        Ok(())
    } else {
        Err("Message not found".into())
    }
}

#[reducer]
pub fn start_typing(ctx: &ReducerContext, channel: String) -> Result<(), String> {
    let sender = ctx.sender();
    if let Some(mut indicator) = ctx.db.typing_indicator().identity().find(&sender) {
        indicator.channel = channel;
        indicator.started_at = ctx.timestamp;
        ctx.db.typing_indicator().identity().update(indicator);
    } else {
        ctx.db.typing_indicator().insert(TypingIndicator {
            identity: sender,
            channel,
            started_at: ctx.timestamp,
        });
    }
    Ok(())
}

#[reducer]
pub fn stop_typing(ctx: &ReducerContext) -> Result<(), String> {
    ctx.db.typing_indicator().identity().delete(&ctx.sender());
    Ok(())
}

#[reducer]
pub fn heartbeat(ctx: &ReducerContext, current_lab: Option<String>) -> Result<(), String> {
    let sender = ctx.sender();
    let timestamp = ctx.timestamp;

    if let Some(mut presence) = ctx.db.online_presence().identity().find(&sender) {
        presence.last_seen = timestamp;
        presence.current_lab = current_lab;
        ctx.db.online_presence().identity().update(presence);
    } else {
        ctx.db.online_presence().insert(OnlinePresence {
            identity: sender,
            last_seen: timestamp,
            current_lab,
        });
    }

    if let Some(mut user) = ctx.db.user().identity().find(&sender) {
        user.is_online = true;
        user.last_activity = timestamp;
        ctx.db.user().identity().update(user);
    }

    Ok(())
}

#[reducer]
pub fn cleanup_offline_users(ctx: &ReducerContext) -> Result<(), String> {
    let timestamp = ctx.timestamp;
    let threshold_micros = timestamp.to_micros_since_unix_epoch() - (120 * 1_000_000);
    let typing_threshold_micros = timestamp.to_micros_since_unix_epoch() - (10 * 1_000_000);
    
    let mut to_cleanup_presence = Vec::new();
    for presence in ctx.db.online_presence().iter() {
        if presence.last_seen.to_micros_since_unix_epoch() < threshold_micros {
            to_cleanup_presence.push(presence.identity);
        }
    }

    for identity in to_cleanup_presence {
        ctx.db.online_presence().identity().delete(&identity);
        if let Some(mut user) = ctx.db.user().identity().find(&identity) {
            user.is_online = false;
            ctx.db.user().identity().update(user);
        }
    }

    let mut to_cleanup_typing = Vec::new();
    for indicator in ctx.db.typing_indicator().iter() {
        if indicator.started_at.to_micros_since_unix_epoch() < typing_threshold_micros {
            to_cleanup_typing.push(indicator.identity);
        }
    }

    for identity in to_cleanup_typing {
        ctx.db.typing_indicator().identity().delete(&identity);
    }

    Ok(())
}

fn xp_for_level(level: u32) -> u64 {
    if level <= 10 {
        (level * 100) as u64
    } else {
        1000 + ((level - 10) as u64 * 500)
    }
}

fn update_leaderboard(ctx: &ReducerContext, identity: Identity) -> Result<(), String> {
    let user = ctx.db.user().identity().find(&identity).ok_or("User not found")?;
    let timestamp = ctx.timestamp;
    
    if let Some(mut entry) = ctx.db.leaderboard_entry().identity().find(&identity) {
        entry.total_xp = user.xp;
        entry.level = user.level;
        entry.updated_at = timestamp;
        ctx.db.leaderboard_entry().identity().update(entry);
    } else {
        ctx.db.leaderboard_entry().insert(LeaderboardEntry {
            identity,
            rank: 0,
            total_xp: user.xp,
            level: user.level,
            updated_at: timestamp,
        });
    }

    Ok(())
}
