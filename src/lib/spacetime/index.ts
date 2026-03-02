import { DbConnection } from "./bindings";

class SpacetimeService {
    private conn: DbConnection | null = null;
    private onConnectCallbacks: Array<() => void> = [];
    private onUpdateCallbacks: Array<() => void> = [];
    private isConnected: boolean = false;

    constructor() {
        this.connect();
    }

    public connect() {
        const uri = "https://maincloud.spacetimedb.com";
        const databaseName = "terminal-backend";

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
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.registerUser({ username });
    }

    public async createChannel(name: string, description: string | undefined, isPrivate: boolean) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.createChannel({ name, description, isPrivate });
    }

    public async updateStreak() {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.updateStreak({});
    }

    public async completeLab(labId: string, xpEarned: bigint) {
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

    public async stopTyping() {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.stopTyping({});
    }

    public async heartbeat(currentLab: string | undefined) {
        if (!this.conn) throw new Error("Not connected");
        return this.conn.reducers.heartbeat({ currentLab });
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

    public getIsConnected() {
        return this.isConnected;
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
