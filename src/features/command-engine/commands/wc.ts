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

    if (paths.length === 0) {
        const { l, w, c } = process(await readStream(input));
        return { output: `${countLines ? l : ''} ${countWords ? w : ''} ${countChars ? c : ''}`.trim(), exitCode: 0 };
    }

    const rows: string[] = [];
    let tl = 0, tw = 0, tc = 0;
    for (const p of paths) {
        const content = context.vfs.readFile(p, context.userId, context.groups);
        if (typeof content === 'string') {
            const { l, w, c } = process(content);
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
