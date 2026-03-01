import { User, UserProgress, OnlinePresence, Message, TypingIndicator } from '../module_bindings';
import { logger } from './logger';

/**
 * CLIENT-SIDE MOCK OF SPACETIMEDB
 * This simulates a relational database and server reducers.
 */
class SpacetimeDBClient {
    private users: Map<string, User> = new Map();
    private userProgress: Map<string, UserProgress> = new Map();
    private onlinePresence: Map<string, OnlinePresence> = new Map();
    private messages: Message[] = [];
    private typingIndicators: Map<string, TypingIndicator> = new Map();

    public identity: string = 'guest-identity'; // Default for simulation

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        try {
            const data = localStorage.getItem('the-terminal-spacetime-mock');
            if (data) {
                const parsed = JSON.parse(data);
                this.users = new Map(Object.entries(parsed.users || {}));
                this.userProgress = new Map(Object.entries(parsed.userProgress || {}));
                this.onlinePresence = new Map(Object.entries(parsed.onlinePresence || {}));
                this.messages = parsed.messages || [];
            }
        } catch (e) {
            logger.error('Failed to load simulated SpacetimeDB state', { error: e });
        }
    }

    private saveToStorage() {
        const data = {
            users: Object.fromEntries(this.users),
            userProgress: Object.fromEntries(this.userProgress),
            onlinePresence: Object.fromEntries(this.onlinePresence),
            messages: this.messages
        };
        localStorage.setItem('the-terminal-spacetime-mock', JSON.stringify(data));
    }

    // --- Reducers (Mocked) ---

    public async register_user(username: string): Promise<void> {
        if (this.users.has(this.identity)) {
            throw new Error("User already registered");
        }

        const now = Date.now();
        const newUser: User = {
            identity: this.identity,
            username,
            display_name: null,
            level: 1,
            xp: 0,
            streak: 0,
            longest_streak: 0,
            last_activity: now,
            avatar_url: null,
            is_online: true,
            created_at: now
        };

        const newProgress: UserProgress = {
            identity: this.identity,
            completed_labs: [],
            completed_modules: [],
            unlocked_modules: [1],
            achievements: [],
            activity_log: '[]'
        };

        this.users.set(this.identity, newUser);
        this.userProgress.set(this.identity, newProgress);
        this.saveToStorage();
        logger.info(`[SPACETIME] User registered: ${username}`);
    }

    public async complete_lab(labId: string, xpEarned: number): Promise<void> {
        const user = this.users.get(this.identity);
        const progress = this.userProgress.get(this.identity);

        if (!user || !progress) throw new Error("User not found");

        user.xp += xpEarned;
        user.last_activity = Date.now();

        // Simple level up logic
        const nextLevelXP = 100 * user.level; // Mocked simple formula
        if (user.xp >= nextLevelXP) {
            user.level += 1;
        }

        if (!progress.completed_labs.includes(labId)) {
            progress.completed_labs.push(labId);
        }

        this.users.set(this.identity, user);
        this.userProgress.set(this.identity, progress);
        this.saveToStorage();
        logger.info(`[SPACETIME] Lab completed: ${labId}, XP earned: ${xpEarned}`);
    }

    public async heartbeat(currentLab: string | null = null): Promise<void> {
        const now = Date.now();
        this.onlinePresence.set(this.identity, {
            identity: this.identity,
            last_seen: now,
            current_lab: currentLab
        });

        const user = this.users.get(this.identity);
        if (user) {
            user.is_online = true;
            user.last_activity = now;
            this.users.set(this.identity, user);
        }

        this.saveToStorage();
    }

    // --- Query Methods ---

    public getUser(identity: string): User | undefined {
        return this.users.get(identity);
    }

    public getProgress(identity: string): UserProgress | undefined {
        return this.userProgress.get(identity);
    }

    public getOnlineUsers(): OnlinePresence[] {
        return Array.from(this.onlinePresence.values());
    }

    // --- Chat Reducers ---

    public async send_message(channel: string, content: string): Promise<void> {
        if (!content.trim()) return;

        const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: this.identity,
            content: content.trim(),
            channel,
            timestamp: Date.now(),
            edited: null,
            deleted: false,
            pinned: false
        };

        this.messages.push(newMessage);
        this.saveToStorage();
        logger.info(`[SPACETIME] Message sent to ${channel}`);
    }

    public async edit_message(messageId: string, newContent: string): Promise<void> {
        const msg = this.messages.find(m => m.id === messageId);
        if (!msg) throw new Error("Message not found");
        if (msg.sender !== this.identity) throw new Error("Unauthorized: cannot edit others' messages");

        msg.content = newContent;
        msg.edited = Date.now();
        this.saveToStorage();
    }

    public async delete_message(messageId: string): Promise<void> {
        const msg = this.messages.find(m => m.id === messageId);
        if (!msg) throw new Error("Message not found");
        if (msg.sender !== this.identity) throw new Error("Unauthorized: cannot delete others' messages");

        msg.deleted = true;
        this.saveToStorage();
    }

    public async start_typing(channel: string): Promise<void> {
        this.typingIndicators.set(this.identity, {
            identity: this.identity,
            channel,
            started_at: Date.now()
        });
    }

    public async stop_typing(): Promise<void> {
        this.typingIndicators.delete(this.identity);
    }

    // --- Chat Queries ---

    public getMessages(channel?: string): Message[] {
        if (!channel) return this.messages;
        return this.messages.filter(m => m.channel === channel && !m.deleted);
    }

    public getTypingIndicators(channel: string): TypingIndicator[] {
        return Array.from(this.typingIndicators.values()).filter(t => t.channel === channel);
    }
}

export const spacetimeClient = new SpacetimeDBClient();
