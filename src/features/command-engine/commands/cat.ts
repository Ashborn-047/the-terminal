import { CommandContext, CommandResult } from '../types';
import { readStream } from '../utils';

export const cat = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let lineNumbers = false;
    const filePaths = args.filter(a => {
        if (a === '-n') { lineNumbers = true; return false; }
        return !a.startsWith('-');
    });

    let output = '';
    let error = '';
    let exitCode = 0;

    if (filePaths.length === 0) {
        output = await readStream(input);
    } else {
        for (const filePath of filePaths) {
            if (context.isInterrupted()) break;
            const fullPath = context.resolvePath(filePath);
            const content = context.vfs.readFile(fullPath, context.userId, context.groups);
            if (typeof content === 'object' && 'error' in content) {
                // Natural error formatting: program: message
                error += `cat: ${filePath}: ${content.error}\n`;
                exitCode = 1;
            } else {
                output += content + (content.endsWith('\n') ? '' : '\n');
            }
        }
    }

    if (lineNumbers) {
        output = output.split('\n').map((line, i) => `     ${i + 1}\t${line}`).join('\n');
    }

    return { output: output.trimEnd(), error: error.trim(), exitCode };
};
