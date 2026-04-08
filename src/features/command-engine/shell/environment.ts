export class ShellEnvironment {
    private variables: Map<string, string> = new Map();
    private parent: ShellEnvironment | null = null;

    constructor(initialVars: Record<string, string> = {}, parent: ShellEnvironment | null = null) {
        this.parent = parent;
        for (const [key, value] of Object.entries(initialVars)) {
            this.variables.set(key, value);
        }
    }

    public get(name: string): string {
        if (this.variables.has(name)) {
            return this.variables.get(name)!;
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        return '';
    }

    public set(name: string, value: string): void {
        this.variables.set(name, value);
    }

    public clone(): ShellEnvironment {
        return new ShellEnvironment(Object.fromEntries(this.variables), this.parent);
    }

    public createChild(): ShellEnvironment {
        return new ShellEnvironment({}, this);
    }

    public exportToRecord(): Record<string, string> {
        const result: Record<string, string> = this.parent ? this.parent.exportToRecord() : {};
        for (const [key, value] of this.variables.entries()) {
            result[key] = value;
        }
        return result;
    }
}
