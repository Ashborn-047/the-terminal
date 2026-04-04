import { CommandResult } from './src/features/command-engine/types';

// Example of how pipeline streaming needs to be implemented.
// Currently in executor.ts we have:
// const result = await commandFn(expandedArgs, enrichedContext, input);
// lastOutput = result.stream || result.output; // Anti-pattern: awaiting the full completion of commandFn

// To do this correctly, executor.ts needs a fundamental rewrite to link the `result.stream` of
// command[i] to the `input` (which would need to be an AsyncGenerator itself) of command[i+1].

// The problem: Command functions (like `grep`, `echo`, `cat`) currently expect `input: string`.
// To support true streaming, EVERY command signature must change from:
// commandFn(args: string[], context: CommandContext, input?: string): Promise<CommandResult>
// to:
// commandFn(args: string[], context: CommandContext, input?: AsyncGenerator<string>): Promise<CommandResult>

// Implementing this rewrite across all 72 commands is far outside the scope of a single "PoC" fix
// and is explicitly listed as Phase 2 in the Architectural Audit Roadmap.
