import { CommandContext, CommandResult } from '../types';
import { readStream } from '../utils';

export const sed = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    const paths: string[] = [];
    let expression = '';

    for (const arg of args) {
        if (!expression && (arg.startsWith('s') || arg.startsWith("'"))) {
            expression = arg.replace(/^'|'$/g, '');
        } else if (!arg.startsWith('-')) {
            paths.push(arg);
        }
    }

    if (!expression) return { output: '', error: 'sed: no expression given', exitCode: 1 };

    const match = expression.match(/^s(.)(.+?)\1(.+?)\1(g?)$/);
    if (!match) return { output: '', error: 'sed: invalid expression (only s/pat/rep/[g] supported)', exitCode: 1 };

    const [, , pattern, replacement, globalFlag] = match;

    let content = '';
    if (paths.length === 0) {
        content = await readStream(input);
    } else {
        const fullPath = paths[0].startsWith('/') ? paths[0] : (context.cwd === '/' ? '/' + paths[0] : context.cwd + '/' + paths[0]);
        const fileContent = context.vfs.readFile(fullPath, context.userId, context.groups);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `sed: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    }

    const regex = new RegExp(pattern, globalFlag ? 'g' : '');
    const result = content.split('\n').filter(l => l.length > 0).map(line => line.replace(regex, replacement)).join('\n');

    return { output: result + (result.length > 0 ? '\n' : ''), exitCode: 0 };
};

export const awk = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    let separator = /\s+/;
    let program = '';
    const paths: string[] = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-F' && args[i + 1]) {
            const sep = args[++i];
            separator = new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        } else if (args[i].startsWith("'{") || args[i].startsWith('{')) {
            program = args[i].replace(/^'|'$/g, '');
        } else if (!args[i].startsWith('-')) {
            paths.push(args[i]);
        }
    }

    if (!program) return { output: '', error: 'awk: no program given', exitCode: 1 };

    const printMatch = program.match(/^\{print\s+(.+)\}$/);
    if (!printMatch) return { output: '', error: 'awk: only {print $N} syntax supported', exitCode: 1 };

    const fieldSpecs = printMatch[1].split(/[,\s]+/).filter(Boolean);

    let content = '';
    if (paths.length === 0) {
        content = await readStream(input);
    } else {
        const fullPath = paths[0].startsWith('/') ? paths[0] : (context.cwd === '/' ? '/' + paths[0] : context.cwd + '/' + paths[0]);
        const fileContent = context.vfs.readFile(fullPath, context.userId, context.groups);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `awk: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    }

    const outputLines = content.split('\n').filter(l => l.length > 0).map(line => {
        const fields = ['', ...line.split(separator)];
        fields[0] = line;
        return fieldSpecs.map(spec => {
            if (spec === '$0') return line;
            const idx = parseInt(spec.replace('$', ''), 10);
            return fields[idx] || '';
        }).join(' ');
    });

    return { output: outputLines.join('\n') + (outputLines.length > 0 ? '\n' : ''), exitCode: 0 };
};
