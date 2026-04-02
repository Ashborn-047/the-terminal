import { CommandContext, CommandResult } from '../types';
import { readStream } from '../utils';

export const sort = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let reverse = false;
    let numeric = false;
    let unique = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-') && arg !== '--') {
            if (arg.includes('r')) reverse = true;
            if (arg.includes('n')) numeric = true;
            if (arg.includes('u')) unique = true;
        } else {
            paths.push(arg);
        }
    }

    let content = '';
    if (paths.length === 0) {
        content = await readStream(input);
    } else {
        const fullPath = paths[0].startsWith('/') ? paths[0] : (context.cwd === '/' ? '/' + paths[0] : context.cwd + '/' + paths[0]);
        const fileContent = context.vfs.readFile(fullPath, context.userId, context.groups);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `sort: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    }

    let lines = content.split('\n').filter(l => l.length > 0);

    if (numeric) {
        lines.sort((a, b) => parseFloat(a) - parseFloat(b));
    } else {
        lines.sort();
    }

    if (reverse) lines.reverse();
    if (unique) lines = [...new Set(lines)];

    return { output: lines.join('\n') + (lines.length > 0 ? '\n' : ''), exitCode: 0 };
};

export const uniq = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let count = false;
    let duplicatesOnly = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-') && arg !== '--') {
            if (arg.includes('c')) count = true;
            if (arg.includes('d')) duplicatesOnly = true;
        } else {
            paths.push(arg);
        }
    }

    let content = '';
    if (paths.length === 0) {
        content = await readStream(input);
    } else {
        const fullPath = paths[0].startsWith('/') ? paths[0] : (context.cwd === '/' ? '/' + paths[0] : context.cwd + '/' + paths[0]);
        const fileContent = context.vfs.readFile(fullPath, context.userId, context.groups);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `uniq: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    }

    const inputLines = content.split('\n').filter(l => l.length > 0);
    const result: string[] = [];
    let prev = '';
    let prevCount = 0;

    const flush = () => {
        if (prevCount === 0) return;
        if (duplicatesOnly && prevCount < 2) return;
        if (count) {
            result.push(`      ${prevCount} ${prev}`);
        } else {
            result.push(prev);
        }
    };

    for (const line of inputLines) {
        if (line === prev) {
            prevCount++;
        } else {
            flush();
            prev = line;
            prevCount = 1;
        }
    }
    flush();

    return { output: result.join('\n') + (result.length > 0 ? '\n' : ''), exitCode: 0 };
};

export const cut = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let delimiter = '\t';
    let fields = '';
    const paths: string[] = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-d' && args[i + 1]) {
            delimiter = args[++i];
        } else if (args[i] === '-f' && args[i + 1]) {
            fields = args[++i];
        } else if (!args[i].startsWith('-')) {
            paths.push(args[i]);
        }
    }

    if (!fields) return { output: '', error: 'cut: you must specify a list of fields', exitCode: 1 };

    const fieldIndices: number[] = [];
    for (const part of fields.split(',')) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            for (let i = start; i <= end; i++) fieldIndices.push(i);
        } else {
            fieldIndices.push(Number(part));
        }
    }

    let content = '';
    if (paths.length === 0) {
        content = await readStream(input);
    } else {
        const fullPath = paths[0].startsWith('/') ? paths[0] : (context.cwd === '/' ? '/' + paths[0] : context.cwd + '/' + paths[0]);
        const fileContent = context.vfs.readFile(fullPath, context.userId, context.groups);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `cut: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    }

    const outputLines = content.split('\n').filter(l => l.length > 0).map(line => {
        const parts = line.split(delimiter);
        return fieldIndices.map(i => parts[i - 1] || '').join(delimiter);
    });

    return { output: outputLines.join('\n') + (outputLines.length > 0 ? '\n' : ''), exitCode: 0 };
};
