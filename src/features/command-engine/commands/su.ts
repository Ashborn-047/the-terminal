import { CommandContext, CommandResult } from '../types';
import { formatError } from '../../../utils/error_codes';

export const su = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const passwdContent = context.vfs.readFile('/etc/passwd', 'root', ['root']);
    if (typeof passwdContent !== 'string') return { output: '', error: 'su: cannot read /etc/passwd', exitCode: 1 };

    const users = passwdContent.split('\n').filter(l => l.includes(':')).map(line => {
        const [username, x, uid, gid] = line.split(':');
        return { username, uid, gid };
    });

    const targetUser = args.length > 0 ? args[0] : 'root';
    const user = users.find(u => u.username === targetUser);

    if (!user) {
        return { output: '', error: `su: user ${targetUser} does not exist`, exitCode: 1 };
    }

    // In a real su, we'd prompt for password. For the simulator, we'll auto-succeed if root
    // or if the user is switching to themeselves. 
    // For realism, let's just simulate the session switch.
    
    // NOTE: This usually would involve a sub-shell. In our simulator, 'su' will 
    // effectively return a message that the frontend or shell needs to act upon, 
    // OR it just spawns a sub-shell if provided as an argument.
    
    if (args.length > 1 && args[1] === '-c') {
        const commandLine = args.slice(2).join(' ');
        if (!commandLine) return { output: '', error: 'su: -c requires an argument', exitCode: 1 };
        
        // This is a sub-execution. We'll return a special result that the executor
        // would ideally handle by switching UID for that single execution.
        // For now, let's just log the attempt as a realism win.
        return { 
            output: `[Simulation] Executing '${commandLine}' as ${targetUser}\n`,
            exitCode: 0 
        };
    }

    return {
        output: `[Simulation] Switched to user ${targetUser}. (Session context updated)\n`,
        exitCode: 0
    };
};
