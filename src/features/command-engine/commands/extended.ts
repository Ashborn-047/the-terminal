import { CommandRegistry } from '../registry';
import { readStream } from '../utils';

// ======================================================================
//  sort — sort lines of text files
//  Supports: -r (reverse), -n (numeric), -u (unique)
// ======================================================================
CommandRegistry.register('sort', async (args, context, input) => {
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
    } else if (paths.length > 0) {
        const fileContent = context.vfs.readFile(paths[0], context.userId);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `sort: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    } else {
        return { output: '', error: 'sort: missing operand', exitCode: 1 };
    }

    let lines = content.split('\n').filter(l => l.length > 0);

    if (numeric) {
        lines.sort((a, b) => parseFloat(a) - parseFloat(b));
    } else {
        lines.sort();
    }

    if (reverse) lines.reverse();
    if (unique) lines = [...new Set(lines)];

    return { output: lines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  uniq — report or omit repeated lines
//  Supports: -c (count), -d (duplicates only)
// ======================================================================
CommandRegistry.register('uniq', async (args, context, input) => {
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
    } else if (paths.length > 0) {
        const fileContent = context.vfs.readFile(paths[0], context.userId);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `uniq: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    } else {
        return { output: '', error: 'uniq: missing operand', exitCode: 1 };
    }

    const inputLines = content.split('\n');
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

    return { output: result.join('\n'), exitCode: 0 };
});

// ======================================================================
//  cut — remove sections from each line of files
//  Supports: -d (delimiter), -f (fields)
// ======================================================================
CommandRegistry.register('cut', async (args, context, input) => {
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
    } else if (paths.length > 0) {
        const fileContent = context.vfs.readFile(paths[0], context.userId);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `cut: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    } else {
        return { output: '', error: 'cut: missing operand', exitCode: 1 };
    }

    const outputLines = content.split('\n').map(line => {
        const parts = line.split(delimiter);
        return fieldIndices.map(i => parts[i - 1] || '').join(delimiter);
    });

    return { output: outputLines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  tee — read from stdin, write to stdout and files
// ======================================================================
CommandRegistry.register('tee', async (args, context, input) => {
    const append = args.includes('-a');
    const paths = args.filter(a => !a.startsWith('-'));
    const content = await readStream(input);

    for (const filePath of paths) {
        if (append) {
            const existing = context.vfs.readFile(filePath, context.userId);
            if (typeof existing === 'string') {
                context.vfs.writeFile(filePath, existing + content, context.userId);
            } else {
                const parts = filePath.split('/').filter(Boolean);
                const name = parts.pop() || '';
                const parentPath = '/' + parts.join('/');
                context.vfs.touch(parentPath || '/', name, context.userId);
                context.vfs.writeFile(filePath, content, context.userId);
            }
        } else {
            const result = context.vfs.resolve(filePath, context.userId);
            if (typeof result !== 'string') {
                context.vfs.writeFile(filePath, content, context.userId);
            } else {
                const parts = filePath.split('/').filter(Boolean);
                const name = parts.pop() || '';
                const parentPath = '/' + parts.join('/');
                context.vfs.touch(parentPath || '/', name, context.userId);
                context.vfs.writeFile(filePath, content, context.userId);
            }
        }
    }
    return { output: content, exitCode: 0 };
});

// ======================================================================
//  sed — stream editor (basic s/pattern/replacement/ only)
// ======================================================================
CommandRegistry.register('sed', async (args, context, input) => {
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
    } else if (paths.length > 0) {
        const fileContent = context.vfs.readFile(paths[0], context.userId);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `sed: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    } else {
        return { output: '', error: 'sed: missing operand', exitCode: 1 };
    }

    const regex = new RegExp(pattern, globalFlag ? 'g' : '');
    const result = content.split('\n').map(line => line.replace(regex, replacement)).join('\n');

    return { output: result, exitCode: 0 };
});

// ======================================================================
//  awk — pattern scanning (basic: print fields)
// ======================================================================
CommandRegistry.register('awk', async (args, context, input) => {
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
    } else if (paths.length > 0) {
        const fileContent = context.vfs.readFile(paths[0], context.userId);
        if (typeof fileContent !== 'string') {
            return { output: '', error: `awk: ${paths[0]}: No such file or directory`, exitCode: 1 };
        }
        content = fileContent;
    } else {
        return { output: '', error: 'awk: missing operand', exitCode: 1 };
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

    return { output: outputLines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  xargs — build and execute command lines from stdin (basic)
// ======================================================================
CommandRegistry.register('xargs', async (args, context, input) => {
    const pipedText = await readStream(input);
    const items = pipedText.split(/\s+/).filter(Boolean);
    const cmdName = args[0] || 'echo';
    const cmdArgs = args.slice(1);

    const cmd = CommandRegistry.get(cmdName);
    if (!cmd) return { output: '', error: `xargs: ${cmdName}: command not found`, exitCode: 127 };

    const result = await cmd([...cmdArgs, ...items], context, '');
    return result;
});

// ======================================================================
//  tar — simulated archive tool
// ======================================================================
CommandRegistry.register('tar', async (args, context, input) => {
    const flags = args[0] || '';

    if (flags.includes('c')) {
        const archiveName = args.find(a => a.endsWith('.tar') || a.endsWith('.tar.gz') || a.endsWith('.tgz')) || 'archive.tar';
        return { output: `tar: created archive '${archiveName}' (simulated)`, exitCode: 0 };
    } else if (flags.includes('x')) {
        return { output: 'tar: extracted archive (simulated)', exitCode: 0 };
    } else if (flags.includes('t')) {
        return { output: 'tar: listing archive contents (simulated)', exitCode: 0 };
    }

    return { output: '', error: 'tar: You must specify one of -c, -x, or -t', exitCode: 1 };
});

// ======================================================================
//  gzip / gunzip — simulated compression
// ======================================================================
CommandRegistry.register('gzip', async (args, context, input) => {
    if (args.length === 0) return { output: '', error: 'gzip: missing operand', exitCode: 1 };
    return { output: `gzip: compressed '${args[0]}' (simulated)`, exitCode: 0 };
});

CommandRegistry.register('gunzip', async (args, context, input) => {
    if (args.length === 0) return { output: '', error: 'gunzip: missing operand', exitCode: 1 };
    return { output: `gunzip: decompressed '${args[0]}' (simulated)`, exitCode: 0 };
});

// ======================================================================
//  useradd — simulated user creation
// ======================================================================
CommandRegistry.register('useradd', async (args, context, input) => {
    if (context.userId !== 'root') {
        return { output: '', error: 'useradd: Permission denied. Must be root.', exitCode: 1 };
    }
    if (args.length === 0) return { output: '', error: 'useradd: missing operand', exitCode: 1 };

    const username = args.filter(a => !a.startsWith('-')).pop() || '';
    context.vfs.mkdir('/home', username, context.userId);

    return { output: `useradd: user '${username}' created (simulated)`, exitCode: 0 };
});

// ======================================================================
//  passwd — simulated password change
// ======================================================================
CommandRegistry.register('passwd', async (args, context, input) => {
    const user = args[0] || context.userId;
    return { output: `passwd: password for '${user}' updated successfully (simulated)`, exitCode: 0 };
});

// ======================================================================
//  yum / dnf — simulated package managers
// ======================================================================
const handlePkgManager = (cmd: string, args: string[], context: any) => {
    if (args.length === 0) return { output: `${cmd}: missing command`, exitCode: 1 };
    if (context.userId !== 'root') {
        return { output: '', error: `Error: This command has to be run with superuser privileges (use sudo).`, exitCode: 1 };
    }

    const action = args[0];
    const pkg = args[1] || '';

    if (action === 'install' || action === 'update') {
        return {
            output: `Dependencies Resolved\n\nPackage                     Arch   Version                     Repository   Size\n================================================================================\n Installing:\n ${pkg || 'package'}           x86_64 1.2.3-1.el9                 appstream    42 k\n\nTransaction Summary\n================================================================================\nInstall  1 Package\n\nTotal download size: 42 k\nInstalled size: 108 k\nIs this ok [y/N]: y\nDownloading Packages:\nRunning transaction check\nTransaction check succeeded.\nRunning transaction test\nTransaction test succeeded.\nRunning transaction\n  Installing : ${pkg || 'package'}-1.2.3-1.el9.x86_64                                1/1 \n  Verifying  : ${pkg || 'package'}-1.2.3-1.el9.x86_64                                1/1 \n\nInstalled:\n  ${pkg || 'package'}-1.2.3-1.el9.x86_64\n\nComplete!`,
            exitCode: 0
        };
    }

    return { output: `${cmd}: ${action} ${pkg} (simulated)`, exitCode: 0 };
};

CommandRegistry.register('yum', async (args, context, input) => handlePkgManager('yum', args, context));
CommandRegistry.register('dnf', async (args, context, input) => handlePkgManager('dnf', args, context));
