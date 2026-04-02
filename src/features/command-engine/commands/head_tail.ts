import { CommandContext, CommandResult } from '../types';
import { readStream } from '../utils';

export const head = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let lines = 10;
    const paths = args.filter(a => {
        if (a === '-n' && args[args.indexOf(a) + 1]) {
            lines = parseInt(args[args.indexOf(a) + 1], 10);
            return false;
        }
        return !a.startsWith('-') && isNaN(parseInt(a, 10));
    });
    
    const content = paths.length > 0 
        ? context.vfs.readFile(paths[0], context.userId, context.groups) 
        : await readStream(input);
        
    if (typeof content !== 'string') return { output: '', error: `head: Error reading input`, exitCode: 1 };
    return { output: content.split('\n').slice(0, lines).join('\n'), exitCode: 0 };
};

export const tail = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let lines = 10;
    const paths = args.filter(a => {
        if (a === '-n' && args[args.indexOf(a) + 1]) {
            lines = parseInt(args[args.indexOf(a) + 1], 10);
            return false;
        }
        return !a.startsWith('-') && isNaN(parseInt(a, 10));
    });
    
    const content = paths.length > 0 
        ? context.vfs.readFile(paths[0], context.userId, context.groups) 
        : await readStream(input);
        
    if (typeof content !== 'string') return { output: '', error: `tail: Error reading input`, exitCode: 1 };
    const allLines = content.split('\n');
    return { output: allLines.slice(Math.max(0, allLines.length - lines)).join('\n'), exitCode: 0 };
};
