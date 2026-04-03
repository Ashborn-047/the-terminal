import { CommandContext, CommandResult, Signal } from '../types';

export const sleep = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'sleep: missing operand', exitCode: 1 };
    const seconds = parseFloat(args[0]);
    if (isNaN(seconds)) return { output: '', error: `sleep: invalid time interval '${args[0]}'`, exitCode: 1 };

    return new Promise((resolve) => {
        let timer: any;
        const cleanup = () => clearTimeout(timer);

        const abortHandler = () => {
            cleanup();
            const reason = context.abortSignal?.reason;
            // Distinguish exit codes based on signal if we wanted to (130 for SIGINT, 137 for SIGKILL, 143 for SIGTERM)
            const exitCode = reason === Signal.SIGKILL ? 137 : (reason === Signal.SIGTERM ? 143 : 130);
            resolve({ output: '', exitCode });
        };

        if (context.abortSignal) {
            context.abortSignal.addEventListener('abort', abortHandler);
            if (context.abortSignal.aborted) {
                return abortHandler();
            }
        }

        // Backward compatibility with the event emitter style signal handler
        context.onSignal((sig) => {
            if (sig === Signal.SIGINT || sig === Signal.SIGKILL || sig === Signal.SIGTERM) {
                // The AbortController handles it, but this acts as a fallback for older implementations
                if (!context.abortSignal) {
                     cleanup();
                     resolve({ output: '', exitCode: 130 });
                }
            }
        });

        timer = setTimeout(() => {
            if (context.abortSignal) {
                context.abortSignal.removeEventListener('abort', abortHandler);
            }
            resolve({ output: '', exitCode: 0 });
        }, seconds * 1000);
    });
};
