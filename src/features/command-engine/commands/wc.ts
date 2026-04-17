import { CommandContext, CommandResult } from '../types';
import { readStream } from '../utils';

export const wc = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let countLines = args.includes('-l'), countWords = args.includes('-w'), countChars = args.includes('-c') || args.includes('-m');
    if (!countLines && !countWords && !countChars) countLines = countWords = countChars = true;
    const paths = args.filter(a => !a.startsWith('-'));

    const process = (txt: string) => ({
        l: txt.trim().length === 0 ? 0 : txt.split('\n').filter(l => l.length > 0).length,
        w: txt.trim().length === 0 ? 0 : txt.trim().split(/\s+/).filter(w => w.length > 0).length,
        c: txt.length
    });

    const processStream = async (input: string | AsyncGenerator<string>) => {
        let l = 0, w = 0, c = 0;
        let inWord = false;

        if (typeof input === 'string') {
            c = input.length;
            l = input.split('\n').filter(line => line.length > 0).length;
            w = input.trim().split(/\s+/).filter(word => word.length > 0).length;
        } else {
            for await (const chunk of input) {
                if (context.isInterrupted()) break;
                await context.waitIfSuspended();
                
                c += chunk.length;
                for (let i = 0; i < chunk.length; i++) {
                    const char = chunk[i];
                    if (char === '\n') l++;
                    if (/\s/.test(char)) {
                        inWord = false;
                    } else if (!inWord) {
                        inWord = true;
                        w++;
                    }
                }
            }
        }
        return { l, w, c };
    };

    if (paths.length === 0) {
        const { l, w, c } = await processStream(input);
        return { output: `${countLines ? l : ''} ${countWords ? w : ''} ${countChars ? c : ''}`.trim(), exitCode: 0 };
    }

    const rows: string[] = [];
    let tl = 0, tw = 0, tc = 0;
    for (const p of paths) {
        const fullPath = context.resolvePath(p);
        const content = context.vfs.readFile(fullPath, context.userId, context.groups);
        if (typeof content === 'string') {
            const { l, w, c } = await processStream(content);
            tl += l; tw += w; tc += c;
            rows.push(`${countLines ? l : ''} ${countWords ? w : ''} ${countChars ? c : ''} ${p}`.trim());
        } else {
            rows.push(`wc: ${p}: No such file`);
        }
    }
    if (paths.length > 1) {
        rows.push(`${countLines ? tl : ''} ${countWords ? tw : ''} ${countChars ? tc : ''} total`.trim());
    }
    return { output: rows.join('\n'), exitCode: 0 };
};
