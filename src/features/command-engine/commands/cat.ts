import { readStream, toLines } from '../utils';

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
        if (typeof input === 'string') {
            output = input;
        } else {
            const stream = async function* () {
                let i = 0;
                for await (const line of toLines(input)) {
                    if (context.isInterrupted()) break;
                    if (lineNumbers) {
                        yield `     ${i + 1}\t${line}\n`;
                    } else {
                        yield `${line}\n`;
                    }
                    i++;
                }
            }();
            return { output: '', stream, exitCode: 0 };
        }
    } else {
        // Validation check for the first file to provide immediate error feedback (Scenario 5 fix)
        if (filePaths.length === 1) {
            const fullPath = context.resolvePath(filePaths[0]);
            const content = await context.vfs.readFile(fullPath, context.userId, context.groups);
            if (typeof content === 'object' && 'error' in content) {
                return { output: '', error: `cat: ${filePaths[0]}: ${content.error}\n`, exitCode: 1 };
            }
        }

        // If multiple files, or passed validation, return a stream
        const stream = async function* () {
            let lineIdx = 0;
            for (const filePath of filePaths) {
                if (context.isInterrupted()) break;
                const fullPath = context.resolvePath(filePath);
                const content = await context.vfs.readFile(fullPath, context.userId, context.groups);
                if (typeof content === 'object' && 'error' in content) {
                    yield `cat: ${filePath}: ${content.error}\n`;
                    continue;
                } else {
                    const lines = content.split('\n');
                    for (const line of lines) {
                        if (lineNumbers) {
                            yield `     ${lineIdx + 1}\t${line}\n`;
                        } else {
                            yield `${line}\n`;
                        }
                        lineIdx++;
                    }
                }
            }
        }();
        return { output: '', stream, exitCode: 0 };
    }

    if (lineNumbers && output) {
        output = output.split('\n').map((line, i) => `     ${i + 1}\t${line}`).join('\n');
    }

    return { output, error: error.trim(), exitCode };
};
