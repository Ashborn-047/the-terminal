import { CommandContext, CommandResult } from '../types';
import { CommandRegistry } from '../registry';

export const which = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', exitCode: 0 };

    const commandName = args[0];
    const pathEnv = context.env['PATH'] || '/bin:/usr/bin:/usr/local/bin';
    const paths = pathEnv.split(':');
    let output = '';

    for (const dir of paths) {
        const fullPath = dir === '/' ? `/${commandName}` : `${dir}/${commandName}`;
        if (context.vfs.exists(fullPath, context.userId, context.groups)) {
            output += `${fullPath}\n`;
            return { output, exitCode: 0 };
        }
    }

    // fallback: is it a registered command but not in VFS? 
    // This provides a realism win for 'built-in' commands.
    if (CommandRegistry.get(commandName)) {
        output += `builtin: ${commandName}\n`;
        return { output, exitCode: 0 };
    }

    return { output: '', exitCode: 1 };
};
