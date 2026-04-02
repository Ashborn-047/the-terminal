import { CommandContext, CommandResult } from '../types';

export const clear = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: '', exitCode: 0 });
