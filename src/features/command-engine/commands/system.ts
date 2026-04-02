import { CommandContext, CommandResult } from '../types';

export const uname = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: args.includes('-a') ? 'Linux the-terminal 6.1.0 #1 SMP x86_64 GNU/Linux' : 'Linux', exitCode: 0 });

export const uptime = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: ' 22:50:00 up 1 day,  3:27,  1 user,  load average: 0.15, 0.12, 0.10', exitCode: 0 });

export const df = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: 'Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       51200000 4200000  47000000   9% /', exitCode: 0 });

export const free = async (args: string[], context: CommandContext): Promise<CommandResult> => ({ output: '              total        used        free      shared  buff/cache   available\nMem:        8157980     2345672     3812308      102400     2000000     5512308\nSwap:       2097148           0     2097148', exitCode: 0 });
