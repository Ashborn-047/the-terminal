import { CommandContext, CommandResult } from './types';

export type CommandFunction = (args: string[], context: CommandContext, input?: string) => Promise<CommandResult>;

export class CommandRegistry {
    private static commands: Record<string, CommandFunction> = {};

    public static register(name: string, fn: CommandFunction) {
        this.commands[name] = fn;
    }

    public static get(name: string): CommandFunction | undefined {
        return this.commands[name];
    }

    public static list(): string[] {
        return Object.keys(this.commands);
    }
}
