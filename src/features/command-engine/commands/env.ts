import { CommandContext, CommandResult } from '../types';

export const env = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ 
    output: Object.entries(context.env).map(([k, v]) => `${k}=${v}`).join('\n'), 
    exitCode: 0 
});
