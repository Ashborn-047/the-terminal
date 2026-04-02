import { CommandContext, CommandResult } from '../types';

export const date = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: new Date().toString(), exitCode: 0 });
