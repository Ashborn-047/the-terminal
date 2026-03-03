import { DbConnection } from "./bindings";

class SpacetimeService {
    private conn: DbConnection | null = null;
    private onConnectCallbacks: Array<() => void> = [];
    private onUpdateCallbacks: Array<() => void> = [];
    private isMock: boolean = false;
    private isConnected: boolean = false;

    constructor() {
        // Default to mock mode if not explicitly disabled
        this.isMock = import.meta.env.VITE_MOCK_SPACETIME !== 'false';
        if (!this.isMock) {
            try {
                this.connect();
            } catch (err) {
                console.error("SpacetimeDB initialization failed:", err);
            }
        } else {
            console.log("SpacetimeDB running in MOCK mode");
            this.isConnected = true;
        }
    }

    public connect() {
        const uri = "https://maincloud.spacetimedb.com";
        const databaseName = "the-terminal-linux-v1";

        this.conn = DbConnection.builder()
            .withUri(uri)
            .withDatabaseName(databaseName)
            .onConnect(() => {
                console.log("Connected to SpacetimeDB");
                this.isConnected = true;
                this.onConnectCallbacks.forEach(cb => cb());
                this.notifyObservers();
            })
            .onDisconnect(() => {
                console.log("Disconnected from SpacetimeDB");
                this.isConnected = false;
                this.notifyObservers();
                setTimeout(() => this.connect(), 5000);
            })
            .onConnectError((_ctx: any, err: Error) => {
                console.error("SpacetimeDB Connection Error:", err);
            })
            .build();
    }

    public onConnect(cb: () => void) {
        if (this.isConnected) {
            cb();
        } else {
            this.onConnectCallbacks.push(cb);
        }
    }

    public async registerUser(username: string) {
        if (this.isMock) {
            console.log("Mock registration for", username);
            return;
        }
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.registerUser({ username });
    }

    public async createChannel(name: string, description: string | undefined, isPrivate: boolean) {
        if (this.isMock) return;
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.createChannel({ name, description, isPrivate });
    }

    public async updateStreak() {
        if (this.isMock) return;
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.updateStreak({});
    }

    public async completeLab(labId: string, xpEarned: bigint) {
        if (this.isMock) {
            console.log("Mock lab completion for", labId, "XP:", xpEarned);
            return;
        }
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.completeLab({ labId, xpEarned });
    }

    public async sendMessage(channel: string, content: string) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.sendMessage({ channel, content });
    }

    public async editMessage(messageId: bigint, content: string) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.editMessage({ messageId, content });
    }

    public async deleteMessage(messageId: bigint) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.deleteMessage({ messageId });
    }

    public async pinMessage(messageId: bigint, pinned: boolean) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.pinMessage({ messageId, pinned });
    }

    public async startTyping(channel: string) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.startTyping({ channel });
    }

    public async completeQuest(questId: bigint) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.completeQuest({ questId });
    }

    public async upvoteMessage(messageId: bigint) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.upvoteMessage({ messageId });
    }

    public async stopTyping() {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.stopTyping({});
    }

    public async heartbeat(currentLab: string | undefined) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.heartbeat({ currentLab });
    }

    public getIsConnected() {
        return this.isConnected;
    }

    public subscribeToAll() {
        if (!this.conn) return;
        this.conn.subscriptionBuilder()
            .onApplied(() => {
                console.log("Initial data applied");
                this.notifyObservers();
            })
            .subscribeToAllTables();
    }

    public getUsers() {
        if (!this.conn) return [];
        return Array.from(this.conn.db.user.iter());
    }

    public getChannels() {
        if (!this.conn) return [];
        return Array.from(this.conn.db.channel.iter());
    }

    public getMessages(channel: string) {
        if (!this.conn) return [];
        const all = Array.from(this.conn.db.message.iter());
        return all.filter((m: any) => m.channel === channel && !m.deleted);
    }

    public getTypingIndicators(channel: string) {
        if (!this.conn) return [];
        const all = Array.from(this.conn.db.typing_indicator.iter());
        return all.filter((t: any) => t.channel === channel);
    }

    public getLeaderboard() {
        if (!this.conn) return [];
        const all = Array.from(this.conn.db.leaderboard_entry.iter());
        return all.sort((a: any, b: any) => Number(b.totalXp - a.totalXp));
    }

    public getLocalUser() {
        if (this.isMock) {
            return {
                identity: "mock-identity",
                username: "GuestPlayer",
                level: 5,
                xp: 1250n,
                streak: 3,
                longestStreak: 7,
                isOnline: true
            } as any;
        }
        if (!this.conn || !this.isConnected) return null;
        const identity = this.conn.identity;
        if (!identity) return null;
        return this.conn.db.user.identity.find(identity);
    }

    public getUserProgress() {
        if (this.isMock) {
            return {
                identity: "mock-identity",
                completedLabs: ["lab-1-1"],
                currentLab: "lab-1-1",
                xpTotal: 1250n,
                lastDailyActive: 0n,
                streakDays: 3
            } as any;
        }
        if (!this.conn || !this.isConnected) return null;
        const identity = this.conn.identity;
        if (!identity) return null;
        return this.conn.db.user_progress.identity.find(identity);
    }

    public getQuests() {
        if (this.isMock) {
            return [
                { id: 1n, title: "Welcome Hero", description: "Complete your first lab to start your journey.", xpReward: 100n },
                { id: 2n, title: "Chatterbox", description: "Send 5 messages in the global chat.", xpReward: 50n },
                { id: 3n, title: "Master Navigator", description: "Visit all main sections: Dashboard, Curriculum, Terminal, Profile.", xpReward: 75n }
            ] as any;
        }
        if (!this.conn || !this.isConnected) return [];
        return Array.from(this.conn.db.quest.iter());
    }

    public getUserQuests() {
        if (this.isMock) {
            return {
                identity: "mock-identity",
                activeQuestIds: [1n, 2n, 3n],
                completedQuestIds: [],
                lastDailyQuestReset: 0n,
                upvotedMessageIds: []
            } as any;
        }
        if (!this.conn || !this.isConnected) return null;
        const identity = this.conn.identity;
        if (!identity) return null;
        return this.conn.db.user_quest.identity.find(identity);
    }

    public onUpdate(cb: () => void) {
        this.onUpdateCallbacks.push(cb);
        return () => {
            this.onUpdateCallbacks = this.onUpdateCallbacks.filter(f => f !== cb);
        };
    }

    private notifyObservers() {
        this.onUpdateCallbacks.forEach(cb => cb());
    }
}

export const spacetime = new SpacetimeService();
