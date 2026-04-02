import { CommandContext, CommandResult, Signal } from '../types';

export const sleep = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'sleep: missing operand', exitCode: 1 };
    const seconds = parseFloat(args[0]);
    if (isNaN(seconds)) return { output: '', error: `sleep: invalid time interval '${args[0]}'`, exitCode: 1 };

    return new Promise((resolve) => {
        let timer: any;
        const cleanup = () => clearTimeout(timer);

        const onSigInt = () => {
            cleanup();
            resolve({ output: '', exitCode: 130 });
        };

        context.onSignal((sig) => {
            if (sig === Signal.SIGINT) {
                onSigInt();
            }
        });

        timer = setTimeout(() => {
            resolve({ output: '', exitCode: 0 });
        }, seconds * 1000);
    });
};
