import { CommandRegistry } from '../registry';

// ======================================================================
//  sort — sort lines of text files
//  Supports: -r (reverse), -n (numeric), -u (unique)
// ======================================================================
CommandRegistry.register('sort', async (args, context) => {
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
    if (paths.length === 0 && context.env.__piped_input) {
        content = context.env.__piped_input;
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
CommandRegistry.register('uniq', async (args, context) => {
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
    if (paths.length === 0 && context.env.__piped_input) {
        content = context.env.__piped_input;
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
CommandRegistry.register('cut', async (args, context) => {
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

    // Parse field spec: e.g. "1,3" or "1-3"
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
    if (paths.length === 0 && context.env.__piped_input) {
        content = context.env.__piped_input;
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
CommandRegistry.register('tee', async (args, context) => {
    const append = args.includes('-a');
    const paths = args.filter(a => !a.startsWith('-'));
    const input = context.env.__piped_input || '';

    for (const filePath of paths) {
        if (append) {
            const existing = context.vfs.readFile(filePath, context.userId);
            if (typeof existing === 'string') {
                context.vfs.writeFile(filePath, existing + input, context.userId);
            } else {
                // Create parent + file via touch then write
                const parts = filePath.split('/').filter(Boolean);
                const name = parts.pop() || '';
                const parentPath = '/' + parts.join('/');
                context.vfs.touch(parentPath || context.cwd, name, context.userId);
                context.vfs.writeFile(filePath, input, context.userId);
            }
        } else {
            const exists = context.vfs.resolve(filePath, context.userId);
            if (typeof exists !== 'string') {
                context.vfs.writeFile(filePath, input, context.userId);
            } else {
                const parts = filePath.split('/').filter(Boolean);
                const name = parts.pop() || '';
                const parentPath = '/' + parts.join('/');
                context.vfs.touch(parentPath || context.cwd, name, context.userId);
                context.vfs.writeFile(filePath, input, context.userId);
            }
        }
    }

    return { output: input, exitCode: 0 };
});

// ======================================================================
//  sed — stream editor (basic s/pattern/replacement/ only)
// ======================================================================
CommandRegistry.register('sed', async (args, context) => {
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

    // Parse s/pattern/replacement/[flags]
    const match = expression.match(/^s(.)(.+?)\1(.+?)\1(g?)$/);
    if (!match) return { output: '', error: 'sed: invalid expression (only s/pat/rep/[g] supported)', exitCode: 1 };

    const [, , pattern, replacement, globalFlag] = match;

    let content = '';
    if (paths.length === 0 && context.env.__piped_input) {
        content = context.env.__piped_input;
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
//  Supports: awk '{print $N}' and awk -F: '{print $1}'
// ======================================================================
CommandRegistry.register('awk', async (args, context) => {
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

    // Parse simple {print $N, $M} programs
    const printMatch = program.match(/^\{print\s+(.+)\}$/);
    if (!printMatch) return { output: '', error: 'awk: only {print $N} syntax supported', exitCode: 1 };

    const fieldSpecs = printMatch[1].split(/[,\s]+/).filter(Boolean);

    let content = '';
    if (paths.length === 0 && context.env.__piped_input) {
        content = context.env.__piped_input;
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
        const fields = ['', ...line.split(separator)]; // $0 = full line at index 0
        fields[0] = line; // $0 is the whole line
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
CommandRegistry.register('xargs', async (args, context) => {
    const input = context.env.__piped_input || '';
    const items = input.split(/\s+/).filter(Boolean);
    const cmdName = args[0] || 'echo';
    const cmdArgs = args.slice(1);

    const cmd = CommandRegistry.get(cmdName);
    if (!cmd) return { output: '', error: `xargs: ${cmdName}: command not found`, exitCode: 127 };

    const result = await cmd([...cmdArgs, ...items], context);
    return result;
});

// ======================================================================
//  tar — simulated archive tool
// ======================================================================
CommandRegistry.register('tar', async (args) => {
    const flags = args[0] || '';

    if (flags.includes('c')) {
        // Create archive — simulated
        const archiveName = args.find(a => a.endsWith('.tar') || a.endsWith('.tar.gz') || a.endsWith('.tgz')) || 'archive.tar';
        return { output: `tar: created archive '${archiveName}' (simulated)`, exitCode: 0 };
    } else if (flags.includes('x')) {
        return { output: 'tar: extracted archive (simulated)', exitCode: 0 };
    } else if (flags.includes('t')) {
        return { output: 'tar: listing archive contents (simulated — no real archive)', exitCode: 0 };
    }

    return { output: '', error: 'tar: You must specify one of -c, -x, or -t', exitCode: 1 };
});

// ======================================================================
//  gzip / gunzip — simulated compression
// ======================================================================
CommandRegistry.register('gzip', async (args) => {
    if (args.length === 0) return { output: '', error: 'gzip: missing operand', exitCode: 1 };
    return { output: `gzip: compressed '${args[0]}' (simulated)`, exitCode: 0 };
});

CommandRegistry.register('gunzip', async (args) => {
    if (args.length === 0) return { output: '', error: 'gunzip: missing operand', exitCode: 1 };
    return { output: `gunzip: decompressed '${args[0]}' (simulated)`, exitCode: 0 };
});

// ======================================================================
//  useradd — simulated user creation
// ======================================================================
CommandRegistry.register('useradd', async (args, context) => {
    if (context.userId !== 'root') {
        return { output: '', error: 'useradd: Permission denied. Must be root.', exitCode: 1 };
    }
    if (args.length === 0) return { output: '', error: 'useradd: missing operand', exitCode: 1 };

    const username = args.filter(a => !a.startsWith('-')).pop() || '';
    // Simulate: create home directory
    context.vfs.mkdir('/home', username, context.userId);

    return { output: `useradd: user '${username}' created (simulated)`, exitCode: 0 };
});

// ======================================================================
//  passwd — simulated password change
// ======================================================================
CommandRegistry.register('passwd', async (args, context) => {
    const user = args[0] || context.userId;
    return { output: `passwd: password for '${user}' updated successfully (simulated)`, exitCode: 0 };
});

// ======================================================================
//  hostname — display or set system hostname
// ======================================================================
CommandRegistry.register('hostname', async () => {
    return { output: 'the-terminal', exitCode: 0 };
});

// ======================================================================
//  id — print user/group info
// ======================================================================
CommandRegistry.register('id', async (args, context) => {
    const user = args[0] || context.userId;
    if (user === 'root') {
        return { output: 'uid=0(root) gid=0(root) groups=0(root)', exitCode: 0 };
    }
    return { output: `uid=1000(${user}) gid=1000(${user}) groups=1000(${user})`, exitCode: 0 };
});

// ======================================================================
//  groups — print group memberships
// ======================================================================
CommandRegistry.register('groups', async (args, context) => {
    const user = args[0] || context.userId;
    return { output: `${user} : ${user}`, exitCode: 0 };
});

// ======================================================================
//  which — locate a command
// ======================================================================
CommandRegistry.register('which', async (args) => {
    if (args.length === 0) return { output: '', exitCode: 1 };
    const cmd = CommandRegistry.get(args[0]);
    if (cmd) {
        return { output: `/usr/bin/${args[0]}`, exitCode: 0 };
    }
    return { output: '', error: `which: no ${args[0]} in (/usr/bin:/bin)`, exitCode: 1 };
});

// ======================================================================
//  type — describe a command
// ======================================================================
CommandRegistry.register('type', async (args) => {
    if (args.length === 0) return { output: '', exitCode: 1 };
    const cmd = CommandRegistry.get(args[0]);
    if (cmd) {
        return { output: `${args[0]} is /usr/bin/${args[0]}`, exitCode: 0 };
    }
    return { output: '', error: `bash: type: ${args[0]}: not found`, exitCode: 1 };
});

// ======================================================================
//  Simulated network commands — per security_documentation.md §5.2:
//  These run in a sandbox, so we simulate output
// ======================================================================

CommandRegistry.register('ping', async (args) => {
    if (args.length === 0) return { output: '', error: 'ping: missing host operand', exitCode: 1 };
    const host = args.filter(a => !a.startsWith('-'))[0] || 'localhost';
    const lines = [
        `PING ${host} (127.0.0.1) 56(84) bytes of data.`,
        `64 bytes from ${host} (127.0.0.1): icmp_seq=1 ttl=64 time=0.042 ms`,
        `64 bytes from ${host} (127.0.0.1): icmp_seq=2 ttl=64 time=0.038 ms`,
        `64 bytes from ${host} (127.0.0.1): icmp_seq=3 ttl=64 time=0.041 ms`,
        '',
        `--- ${host} ping statistics ---`,
        '3 packets transmitted, 3 received, 0% packet loss, time 2003ms',
        'rtt min/avg/max/mdev = 0.038/0.040/0.042/0.002 ms',
    ];
    return { output: lines.join('\n'), exitCode: 0 };
});

CommandRegistry.register('curl', async (args) => {
    if (args.length === 0) return { output: '', error: 'curl: no URL specified', exitCode: 1 };
    const url = args.filter(a => !a.startsWith('-'))[0] || '';
    return {
        output: `<!DOCTYPE html>\n<html><body><h1>Simulated response from ${url}</h1><p>curl runs in a sandboxed terminal. No real network access.</p></body></html>`,
        exitCode: 0,
    };
});

CommandRegistry.register('wget', async (args) => {
    if (args.length === 0) return { output: '', error: 'wget: missing URL', exitCode: 1 };
    const url = args.filter(a => !a.startsWith('-'))[0] || '';
    return {
        output: `--2025-01-15 22:50:00--  ${url}\nResolving... 127.0.0.1\nConnecting... connected.\nHTTP request sent, awaiting response... 200 OK\nSaving to: 'index.html' (simulated)`,
        exitCode: 0,
    };
});

CommandRegistry.register('ssh', async (args) => {
    if (args.length === 0) return { output: '', error: 'ssh: missing destination', exitCode: 1 };
    return {
        output: `ssh: Connection to ${args[0]} simulated.\nThis is a sandboxed terminal — no real SSH connections are made.`,
        exitCode: 0,
    };
});

CommandRegistry.register('scp', async (args) => {
    if (args.length < 2) return { output: '', error: 'scp: missing operand', exitCode: 1 };
    return {
        output: `scp: Copied ${args[0]} → ${args[1]} (simulated)\nThis is a sandboxed terminal — no real file transfers.`,
        exitCode: 0,
    };
});

CommandRegistry.register('dig', async (args) => {
    const domain = args.filter(a => !a.startsWith('-') && !a.startsWith('+'))[0] || 'example.com';
    const lines = [
        `; <<>> DiG 9.18.1 <<>> ${domain}`,
        ';; ANSWER SECTION:',
        `${domain}.		300	IN	A	93.184.216.34`,
        '',
        `;; Query time: 12 msec`,
        `;; SERVER: 127.0.0.53#53(127.0.0.53) (simulated)`,
    ];
    return { output: lines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  basename / dirname — path manipulation
// ======================================================================
CommandRegistry.register('basename', async (args) => {
    if (args.length === 0) return { output: '', error: 'basename: missing operand', exitCode: 1 };
    const parts = args[0].split('/').filter(Boolean);
    return { output: parts[parts.length - 1] || '/', exitCode: 0 };
});

CommandRegistry.register('dirname', async (args) => {
    if (args.length === 0) return { output: '', error: 'dirname: missing operand', exitCode: 1 };
    const parts = args[0].split('/').filter(Boolean);
    parts.pop();
    return { output: '/' + parts.join('/') || '.', exitCode: 0 };
});

// ======================================================================
//  seq — print a sequence of numbers
// ======================================================================
CommandRegistry.register('seq', async (args) => {
    if (args.length === 0) return { output: '', error: 'seq: missing operand', exitCode: 1 };

    let start = 1, step = 1, end = 1;
    if (args.length === 1) { end = parseInt(args[0], 10); }
    else if (args.length === 2) { start = parseInt(args[0], 10); end = parseInt(args[1], 10); }
    else { start = parseInt(args[0], 10); step = parseInt(args[1], 10); end = parseInt(args[2], 10); }

    const nums: number[] = [];
    if (step > 0) { for (let i = start; i <= end; i += step) nums.push(i); }
    else { for (let i = start; i >= end; i += step) nums.push(i); }

    return { output: nums.join('\n'), exitCode: 0 };
});

// ======================================================================
//  true / false — always return success / failure
// ======================================================================
CommandRegistry.register('true', async () => ({ output: '', exitCode: 0 }));
CommandRegistry.register('false', async () => ({ output: '', exitCode: 1 }));

// ======================================================================
//  sleep — simulated (returns immediately with message)
// ======================================================================
CommandRegistry.register('sleep', async (args) => {
    if (args.length === 0) return { output: '', error: 'sleep: missing operand', exitCode: 1 };
    return { output: `(slept ${args[0]}s — simulated)`, exitCode: 0 };
});

// ======================================================================
//  alias / unalias — simulated
// ======================================================================
CommandRegistry.register('alias', async () => {
    return { output: 'alias: aliases are not supported in this terminal', exitCode: 0 };
});

CommandRegistry.register('unalias', async () => {
    return { output: 'unalias: aliases are not supported in this terminal', exitCode: 0 };
});

// ======================================================================
//  export — set environment variable
// ======================================================================
CommandRegistry.register('export', async (args, context) => {
    for (const arg of args) {
        const eqIdx = arg.indexOf('=');
        if (eqIdx > 0) {
            const key = arg.slice(0, eqIdx);
            const value = arg.slice(eqIdx + 1);
            context.env[key] = value;
        }
    }
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  du — simulated disk usage
// ======================================================================
CommandRegistry.register('du', async (args, context) => {
    const paths = args.filter(a => !a.startsWith('-'));
    const target = paths[0] || context.cwd;
    return {
        output: `4\t${target}/.\n12\t${target}`,
        exitCode: 0,
    };
});

// ======================================================================
//  stat — display file status
// ======================================================================
CommandRegistry.register('stat', async (args, context) => {
    if (args.length === 0) return { output: '', error: 'stat: missing operand', exitCode: 1 };

    const path = args[0];
    const result = context.vfs.resolve(path, context.userId);
    if (typeof result === 'string') {
        return { output: '', error: `stat: cannot stat '${path}': ${result}`, exitCode: 1 };
    }

    const inode = result;
    const permStr = inode.permissions ? '0' + Object.values(inode.permissions).map((p: { read: boolean; write: boolean; execute: boolean }) => (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)).join('') : '0755';
    const lines = [
        `  File: ${inode.name}`,
        `  Size: ${inode.type === 'file' ? (inode.content?.length || 0) : 4096}\tBlocks: 8\tIO Block: 4096\t${inode.type}`,
        `Access: (${permStr})\tUid: (${inode.ownerId === 'root' ? '0' : '1000'}/${inode.ownerId})\tGid: (${inode.groupId === 'root' ? '0' : '1000'}/${inode.groupId})`,
        `Modify: ${new Date().toISOString()}`,
    ];
    return { output: lines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  file — determine file type
// ======================================================================
CommandRegistry.register('file', async (args, context) => {
    if (args.length === 0) return { output: '', error: 'file: missing operand', exitCode: 1 };

    const path = args[0];
    const result = context.vfs.resolve(path, context.userId);
    if (typeof result === 'string') {
        return { output: '', error: `file: ${path}: No such file or directory`, exitCode: 1 };
    }

    const inode = result;
    if (inode.type === 'directory') return { output: `${path}: directory`, exitCode: 0 };
    if (inode.type === 'symlink') return { output: `${path}: symbolic link`, exitCode: 0 };

    const content = inode.content || '';
    if (content.startsWith('#!/')) return { output: `${path}: script, ASCII text executable`, exitCode: 0 };
    return { output: `${path}: ASCII text`, exitCode: 0 };
});
