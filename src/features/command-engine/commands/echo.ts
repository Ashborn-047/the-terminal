import { CommandContext, CommandResult } from '../types';

export const echo = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    let noNewline = false, interpretEscapes = false;
    const textArgs: string[] = [];
    for (const arg of args) {
        if (arg === '-n') { noNewline = true; continue; }
        if (arg === '-e') { interpretEscapes = true; continue; }
        textArgs.push(arg);
    }
    
    const expanded = textArgs.map(a => a.startsWith('$') ? (context.env[a.slice(1)] || '') : a);
    let out = expanded.join(' ');
    if (interpretEscapes) {
        out = out.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
    }
    
    return { output: out + (noNewline ? '' : '\n'), exitCode: 0 };
};
