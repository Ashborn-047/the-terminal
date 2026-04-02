import { CommandContext, CommandResult } from '../types';
import { CommandRegistry } from '../registry';

export const sudo = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'sudo: missing command', exitCode: 1 };
    
    // Simulating sudo privilege check. For now, everyone can sudo in this simulator.
    // In a more realistic impl, we might check an /etc/sudoers equivalent.
    
    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    const command = CommandRegistry.get(cmdName);
    
    if (!command) {
        return { output: '', error: `sudo: ${cmdName}: command not found`, exitCode: 127 };
    }
    
    // Elevate to root
    const rootContext: CommandContext = {
        ...context,
        userId: 'root',
        groups: ['root', ...context.groups.filter(g => g !== 'root')]
    };
    
    return await command(cmdArgs, rootContext, input);
};
