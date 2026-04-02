import { CommandContext, CommandResult } from '../types';
import { CommandParser } from '../parser';
import { CommandExecutor } from '../executor';

/**
 * strace — trace system calls and signals
 */
export const strace = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'strace: must specify a command', exitCode: 1 };

    const cmdLine = args.join(' ');
    const pipeline = CommandParser.parse(cmdLine);
    if (pipeline.actions.length === 0) return { output: '', error: `strace: ${args[0]}: command not found`, exitCode: 1 };

    let traceOutput = '';
    const listener = (syscall: string, callArgs: any[], result: any) => {
        const argsStr = callArgs.map(a => JSON.stringify(a)).join(', ');
        traceOutput += `${syscall}(${argsStr}) = ${result}\n`;
    };

    context.vfs.addSyscallListener(listener);
    const executor = new CommandExecutor(context.vfs);
    const result = await executor.execute(pipeline, context);
    context.vfs.removeSyscallListener(listener);

    return { 
        output: traceOutput + result.output, 
        error: result.error, 
        exitCode: result.exitCode 
    };
};
