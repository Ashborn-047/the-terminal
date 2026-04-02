import { CommandContext, CommandResult } from '../types';

export const whoami = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: context.userId, exitCode: 0 });
