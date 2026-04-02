import { CommandContext, CommandResult } from '../types';

export const true_cmd = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: '', exitCode: 0 });
export const false_cmd = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: '', exitCode: 1 });
