import { CommandContext, CommandResult } from '../types';

export const useradd = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (context.userId !== 'root') {
        return { output: '', error: 'useradd: Permission denied. Must be root.', exitCode: 1 };
    }
    if (args.length === 0) return { output: '', error: 'useradd: missing operand', exitCode: 1 };

    const username = args.filter(a => !a.startsWith('-')).pop() || '';
    context.vfs.mkdir('/home', username, context.userId, context.groups[0]);

    return { output: `useradd: user '${username}' created (simulated)\n`, exitCode: 0 };
};

export const passwd = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const user = args[0] || context.userId;
    // Realism: If root, can change anyone. If not, only self.
    if (context.userId !== 'root' && user !== context.userId) {
        return { output: '', error: 'passwd: You may not view or modify password information for others.', exitCode: 1 };
    }
    
    return { output: `passwd: password for '${user}' updated successfully (simulated)\n`, exitCode: 0 };
};
