import { CommandContext, CommandResult } from '../types';
import { CommandRegistry } from '../registry';

export const help = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const commands = CommandRegistry.list().sort();
    return { output: 'Available commands:\n' + commands.join('  '), exitCode: 0 };
};
