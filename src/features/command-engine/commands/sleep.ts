import { CommandContext, CommandResult, Signal } from '../types';

export const sleep = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'sleep: missing operand', exitCode: 1 };
    const seconds = parseFloat(args[0]);
    if (isNaN(seconds)) return { output: '', error: `sleep: invalid time interval '${args[0]}'`, exitCode: 1 };

    const durationMs = seconds * 1000;
    const startTime = Date.now();
    let elapsed = 0;

    while (elapsed < durationMs) {
        // Check for suspension first (will await if suspended)
        await context.waitIfSuspended();

        // Check for interruption (Ctrl+C)
        if (context.isInterrupted()) {
            return { output: '', exitCode: 130 };
        }

        // Wait a bit
        const chunk = Math.min(100, durationMs - elapsed);
        await new Promise(r => setTimeout(r, chunk));
        elapsed = Date.now() - startTime;
    }

    return { output: '', exitCode: 0 };
};
