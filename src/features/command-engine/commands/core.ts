import { CommandRegistry } from '../registry';
import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';
import { permissionsToOctal } from '../../vfs/vfs';

// ======================================================================
//  pwd
// ======================================================================
CommandRegistry.register('pwd', async (args, context) => {
    return { output: context.cwd, exitCode: 0 };
});

// ======================================================================
//  ls  — supports -l, -a, -la — per command_engine_vfs.md §3.5
// ======================================================================
CommandRegistry.register('ls', async (args, context) => {
    let showAll = false;
    let longFormat = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-')) {
            if (arg.includes('a')) showAll = true;
            if (arg.includes('l')) longFormat = true;
        } else {
            paths.push(arg);
        }
    }

    if (paths.length === 0) paths.push(context.cwd);

    const outputLines: string[] = [];
    let exitCode = 0;

    for (const path of paths) {
        const result = context.vfs.resolve(path, context.userId);
        if (typeof result === 'string') {
            return { output: '', error: `ls: cannot access '${path}': ${result}`, exitCode: 2 };
        }

        const inode = result as Inode;
        if (inode.type !== 'directory' || !inode.children) {
            outputLines.push(inode.name);
            continue;
        }

        let children = inode.children
            .map(id => context.vfs.getInode(id))
            .filter((n): n is Inode => !!n);

        if (!showAll) {
            children = children.filter(n => !n.name.startsWith('.'));
        }

        if (longFormat) {
            for (const child of children) {
                const typeChar = child.type === 'directory' ? 'd' : (child.type === 'symlink' ? 'l' : '-');
                const octal = permissionsToOctal(child.permissions);
                const permStr = formatPermissions(child.permissions);
                const size = child.type === 'file' ? (child.size || 0) : 0;
                const date = new Date(child.modifiedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                const suffix = child.type === 'symlink' ? ` -> ${child.target || ''}` : '';
                outputLines.push(`${typeChar}${permStr} 1 ${child.ownerId} ${child.groupId} ${String(size).padStart(5)} ${date} ${child.name}${suffix}`);
            }
        } else {
            outputLines.push(children.map(n => {
                if (n.type === 'directory') return n.name + '/';
                return n.name;
            }).join('  '));
        }
    }

    return { output: outputLines.join('\n'), exitCode };
});

function formatPermissions(p: { owner: { read: boolean; write: boolean; execute: boolean }; group: { read: boolean; write: boolean; execute: boolean }; others: { read: boolean; write: boolean; execute: boolean } }): string {
    const fmt = (s: { read: boolean; write: boolean; execute: boolean }) =>
        `${s.read ? 'r' : '-'}${s.write ? 'w' : '-'}${s.execute ? 'x' : '-'}`;
    return `${fmt(p.owner)}${fmt(p.group)}${fmt(p.others)}`;
}

// ======================================================================
//  cd
// ======================================================================
CommandRegistry.register('cd', async (args, context) => {
    let path = args.length > 0 ? args[0] : '/home/' + context.userId;

    // Handle ~ as home directory
    if (path === '~' || path.startsWith('~/')) {
        path = '/home/' + context.userId + path.slice(1);
    }

    const result = context.vfs.resolve(path, context.userId);
    if (typeof result === 'string') {
        return { output: '', error: `cd: ${result}`, exitCode: 1 };
    }

    const inode = result as Inode;
    if (inode.type !== 'directory') {
        return { output: '', error: `cd: Not a directory: ${path}`, exitCode: 1 };
    }

    // Return the resolved absolute path so useTerminal can update CWD
    const resolvedPath = context.vfs.getPath(inode.id);
    return { output: resolvedPath, exitCode: 0 };
});

// ======================================================================
//  mkdir — supports -p for recursive creation
// ======================================================================
CommandRegistry.register('mkdir', async (args, context) => {
    const recursive = args.includes('-p');
    const dirs = args.filter(a => !a.startsWith('-'));

    if (dirs.length === 0) {
        return { output: '', error: 'mkdir: missing operand', exitCode: 1 };
    }

    for (const dir of dirs) {
        if (recursive) {
            // Create path components one by one
            const parts = dir.split('/').filter(p => p.length > 0);
            let currentPath = dir.startsWith('/') ? '' : context.cwd;
            for (const part of parts) {
                const checkPath = currentPath === '' ? '/' + part : currentPath + '/' + part;
                if (!context.vfs.exists(checkPath, context.userId)) {
                    const parent = currentPath === '' ? '/' : currentPath;
                    const result = context.vfs.mkdir(parent, part, context.userId);
                    if (typeof result === 'string') {
                        return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
                    }
                }
                currentPath = currentPath === '' ? '/' + part : currentPath + '/' + part;
            }
        } else {
            const result = context.vfs.mkdir(context.cwd, dir, context.userId);
            if (typeof result === 'string') {
                return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
            }
        }
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  touch
// ======================================================================
CommandRegistry.register('touch', async (args, context) => {
    if (args.length === 0) {
        return { output: '', error: 'touch: missing operand', exitCode: 1 };
    }

    for (const name of args) {
        context.vfs.touch(context.cwd, name, context.userId);
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  clear
// ======================================================================
CommandRegistry.register('clear', async () => {
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  cat — per project_documentation.md: file operations
// ======================================================================
CommandRegistry.register('cat', async (args, context) => {
    if (args.length === 0) return { output: '', exitCode: 0 };

    let output = '';
    let error = '';
    let exitCode = 0;

    for (const filePath of args) {
        const content = context.vfs.readFile(filePath, context.userId);
        if (typeof content === 'object' && 'error' in content) {
            error += `cat: ${filePath}: ${content.error}\n`;
            exitCode = 1;
        } else {
            output += content + '\n';
        }
    }

    return { output: output.trimEnd(), error: error.trim(), exitCode };
});

// ======================================================================
//  rm — supports -r, -rf
// ======================================================================
CommandRegistry.register('rm', async (args, context) => {
    const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-f');
    const files = args.filter(a => !a.startsWith('-'));

    if (files.length === 0) return { output: '', error: 'rm: missing operand', exitCode: 1 };

    for (const path of files) {
        const result = context.vfs.rm(path, recursive, context.userId);
        if (typeof result === 'string') {
            return { output: '', error: `rm: cannot remove '${path}': ${result}`, exitCode: 1 };
        }
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  cp — supports -r, -R
// ======================================================================
CommandRegistry.register('cp', async (args, context) => {
    const recursive = args.includes('-r') || args.includes('-R');
    const paths = args.filter(a => !a.startsWith('-'));

    if (paths.length < 2) return { output: '', error: 'cp: missing destination file', exitCode: 1 };

    const dest = paths[paths.length - 1];
    const sources = paths.slice(0, -1);

    for (const src of sources) {
        const result = context.vfs.cp(src, dest, recursive, context.userId);
        if (typeof result === 'string') {
            return { output: '', error: `cp: ${result}`, exitCode: 1 };
        }
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  mv
// ======================================================================
CommandRegistry.register('mv', async (args, context) => {
    if (args.length < 2) return { output: '', error: 'mv: missing destination', exitCode: 1 };

    const dest = args[args.length - 1];
    const src = args[args.length - 2];

    const result = context.vfs.mv(src, dest, context.userId);
    if (typeof result === 'string') {
        return { output: '', error: `mv: ${result}`, exitCode: 1 };
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  grep — supports -i (case insensitive), -v (invert), -n (line numbers)
// ======================================================================
CommandRegistry.register('grep', async (args, context) => {
    let caseInsensitive = false;
    let invert = false;
    let lineNumbers = false;
    const nonFlags: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-') && arg !== '--') {
            if (arg.includes('i')) caseInsensitive = true;
            if (arg.includes('v')) invert = true;
            if (arg.includes('n')) lineNumbers = true;
        } else {
            nonFlags.push(arg);
        }
    }

    if (nonFlags.length < 1) return { output: '', error: 'Usage: grep [options] PATTERN [FILE...]', exitCode: 2 };

    const pattern = nonFlags[0];
    const filePaths = nonFlags.slice(1);
    const outputLines: string[] = [];

    // If no file given, use piped input
    if (filePaths.length === 0) {
        return { output: '', error: 'grep: No file specified', exitCode: 2 };
    }

    for (const fp of filePaths) {
        const content = context.vfs.readFile(fp, context.userId);
        if (typeof content !== 'string') continue;

        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let matches: boolean;
            if (caseInsensitive) {
                matches = line.toLowerCase().includes(pattern.toLowerCase());
            } else {
                matches = line.includes(pattern);
            }
            if (invert) matches = !matches;

            if (matches) {
                const prefix = filePaths.length > 1 ? `${fp}:` : '';
                const lineNum = lineNumbers ? `${i + 1}:` : '';
                outputLines.push(`${prefix}${lineNum}${line}`);
            }
        }
    }

    return {
        output: outputLines.join('\n'),
        exitCode: outputLines.length > 0 ? 0 : 1,
    };
});

// ======================================================================
//  chmod
// ======================================================================
CommandRegistry.register('chmod', async (args, context) => {
    if (args.length < 2) return { output: '', error: 'chmod: missing operand', exitCode: 1 };

    const mode = args[0];
    const paths = args.slice(1);

    for (const path of paths) {
        const result = context.vfs.chmod(path, mode, context.userId);
        if (typeof result === 'string') {
            return { output: '', error: `chmod: ${result}`, exitCode: 1 };
        }
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  chown — per project_documentation.md §4.1: Permission management
// ======================================================================
CommandRegistry.register('chown', async (args, context) => {
    if (args.length < 2) return { output: '', error: 'chown: missing operand', exitCode: 1 };

    const owner = args[0];
    const paths = args.slice(1);

    for (const path of paths) {
        const result = context.vfs.chown(path, owner, context.userId);
        if (typeof result === 'string') {
            return { output: '', error: `chown: ${result}`, exitCode: 1 };
        }
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  ln — per command_engine_vfs.md §2.2: Symlink support
// ======================================================================
CommandRegistry.register('ln', async (args, context) => {
    const symbolic = args.includes('-s');
    const paths = args.filter(a => !a.startsWith('-'));

    if (paths.length < 2) return { output: '', error: 'ln: missing operand', exitCode: 1 };

    if (!symbolic) {
        return { output: '', error: 'ln: hard links not supported, use -s', exitCode: 1 };
    }

    const target = paths[0];
    const linkName = paths[1];

    // Separate parent dir and name
    const parts = linkName.split('/').filter(p => p.length > 0);
    const name = parts.pop() || '';
    const parentPath = linkName.startsWith('/')
        ? '/' + parts.join('/')
        : (parts.length > 0 ? parts.join('/') : context.cwd);

    const result = context.vfs.ln(parentPath || context.cwd, name, target, context.userId);
    if (typeof result === 'string') {
        return { output: '', error: `ln: ${result}`, exitCode: 1 };
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  whoami
// ======================================================================
CommandRegistry.register('whoami', async (args, context) => {
    return { output: context.userId, exitCode: 0 };
});

// ======================================================================
//  date
// ======================================================================
CommandRegistry.register('date', async () => {
    return { output: new Date().toString(), exitCode: 0 };
});

// ======================================================================
//  echo — handles $VAR expansion
// ======================================================================
CommandRegistry.register('echo', async (args, context) => {
    const expanded = args.map(a => {
        if (a.startsWith('$')) {
            const varName = a.slice(1);
            return context.env[varName] || '';
        }
        return a;
    });
    return { output: expanded.join(' '), exitCode: 0 };
});

// ======================================================================
//  history
// ======================================================================
CommandRegistry.register('history', async (args, context) => {
    const lines = context.history.map((cmd, i) => `  ${i + 1}  ${cmd}`);
    return { output: lines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  help
// ======================================================================
CommandRegistry.register('help', async () => {
    const commands = CommandRegistry.list().sort();
    return { output: 'Available commands:\n' + commands.join('  '), exitCode: 0 };
});

// ======================================================================
//  sudo — per project_documentation.md §9: Simulated commands
// ======================================================================
CommandRegistry.register('sudo', async (args, context) => {
    if (args.length === 0) return { output: '', error: 'sudo: missing command', exitCode: 1 };

    const commandName = args[0];
    const commandArgs = args.slice(1);
    const commandFn = CommandRegistry.get(commandName);

    if (!commandFn) {
        return { output: '', error: `sudo: ${commandName}: command not found`, exitCode: 127 };
    }

    const rootContext = { ...context, userId: 'root' };
    return await commandFn(commandArgs, rootContext);
});

// ======================================================================
//  uname — per project_documentation.md §4.1: System info
// ======================================================================
CommandRegistry.register('uname', async (args) => {
    const all = args.includes('-a');
    if (all) {
        return { output: 'Linux the-terminal 6.1.0 #1 SMP x86_64 GNU/Linux', exitCode: 0 };
    }
    return { output: 'Linux', exitCode: 0 };
});

// ======================================================================
//  wc — word, line, character count
// ======================================================================
CommandRegistry.register('wc', async (args, context) => {
    const paths = args.filter(a => !a.startsWith('-'));

    if (paths.length === 0) return { output: '', error: 'wc: missing operand', exitCode: 1 };

    const outputLines: string[] = [];
    for (const fp of paths) {
        const content = context.vfs.readFile(fp, context.userId);
        if (typeof content !== 'string') {
            outputLines.push(`wc: ${fp}: No such file`);
            continue;
        }
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(Boolean).length;
        const chars = content.length;
        outputLines.push(`  ${lines}  ${words} ${chars} ${fp}`);
    }

    return { output: outputLines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  find — basic path/name search
// ======================================================================
CommandRegistry.register('find', async (args, context) => {
    const searchPath = args[0] || context.cwd;
    let namePattern = '';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-name' && args[i + 1]) {
            namePattern = args[i + 1];
        }
    }

    const results: string[] = [];

    const walk = (path: string) => {
        const resolved = context.vfs.resolve(path, context.userId);
        if (typeof resolved === 'string') return;
        const inode = resolved as Inode;

        const fullPath = path;
        if (!namePattern || matchGlob(inode.name, namePattern)) {
            results.push(fullPath);
        }

        if (inode.type === 'directory' && inode.children) {
            for (const childId of inode.children) {
                const child = context.vfs.getInode(childId);
                if (child) {
                    walk(fullPath === '/' ? `/${child.name}` : `${fullPath}/${child.name}`);
                }
            }
        }
    };

    walk(searchPath);
    return { output: results.join('\n'), exitCode: 0 };
});

function matchGlob(name: string, pattern: string): boolean {
    // Simple glob: * matches anything
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(name);
}

// ======================================================================
//  env — print environment variables
// ======================================================================
CommandRegistry.register('env', async (args, context) => {
    const lines = Object.entries(context.env).map(([k, v]) => `${k}=${v}`);
    return { output: lines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  uptime — simulated
// ======================================================================
CommandRegistry.register('uptime', async () => {
    return { output: ' 22:50:00 up 1 day,  3:27,  1 user,  load average: 0.15, 0.12, 0.10', exitCode: 0 };
});

// ======================================================================
//  df — simulated disk usage
// ======================================================================
CommandRegistry.register('df', async (args) => {
    const header = 'Filesystem     1K-blocks    Used Available Use% Mounted on';
    const row = '/dev/sda1       51200000 4200000  47000000   9% /';
    return { output: `${header}\n${row}`, exitCode: 0 };
});

// ======================================================================
//  free — simulated memory
// ======================================================================
CommandRegistry.register('free', async (args) => {
    const header = '              total        used        free      shared  buff/cache   available';
    const mem = 'Mem:        8157980     2345672     3812308      102400     2000000     5512308';
    const swap = 'Swap:       2097148           0     2097148';
    return { output: `${header}\n${mem}\n${swap}`, exitCode: 0 };
});

// ======================================================================
//  ps — simulated process list
// ======================================================================
CommandRegistry.register('ps', async (args) => {
    const header = '  PID TTY          TIME CMD';
    const lines = [
        '    1 ?        00:00:01 systemd',
        '  142 ?        00:00:00 sshd',
        '  501 pts/0    00:00:00 bash',
        '  892 pts/0    00:00:00 ps',
    ];
    return { output: `${header}\n${lines.join('\n')}`, exitCode: 0 };
});

// ======================================================================
//  top — simulated system monitor (snapshot)
// ======================================================================
CommandRegistry.register('top', async () => {
    const output = [
        'top - 22:50:00 up 1 day,  3:27,  1 user,  load average: 0.15, 0.12, 0.10',
        'Tasks:   4 total,   1 running,   3 sleeping',
        '%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.5 id,  0.2 wa',
        'MiB Mem :   7966 total,   3726 free,   2291 used,   1949 buff/cache',
        '',
        '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        '    1 root      20   0    2356   1400    800 S   0.0   0.0   0:01.00 systemd',
        '  501 guest     20   0    6240   3200   2800 S   0.0   0.0   0:00.10 bash',
    ];
    return { output: output.join('\n'), exitCode: 0 };
});

// ======================================================================
//  kill — simulated
// ======================================================================
CommandRegistry.register('kill', async (args) => {
    if (args.length === 0) return { output: '', error: 'kill: missing operand', exitCode: 1 };
    return { output: '', exitCode: 0 }; // Simulated — always succeeds
});

// ======================================================================
//  head / tail — display beginning/end of file
// ======================================================================
CommandRegistry.register('head', async (args, context) => {
    let lines = 10;
    const paths: string[] = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) { lines = parseInt(args[++i], 10); }
        else if (!args[i].startsWith('-')) { paths.push(args[i]); }
    }
    if (paths.length === 0) return { output: '', error: 'head: missing file', exitCode: 1 };

    const content = context.vfs.readFile(paths[0], context.userId);
    if (typeof content !== 'string') return { output: '', error: `head: ${paths[0]}: No such file`, exitCode: 1 };

    return { output: content.split('\n').slice(0, lines).join('\n'), exitCode: 0 };
});

CommandRegistry.register('tail', async (args, context) => {
    let lines = 10;
    const paths: string[] = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) { lines = parseInt(args[++i], 10); }
        else if (!args[i].startsWith('-')) { paths.push(args[i]); }
    }
    if (paths.length === 0) return { output: '', error: 'tail: missing file', exitCode: 1 };

    const content = context.vfs.readFile(paths[0], context.userId);
    if (typeof content !== 'string') return { output: '', error: `tail: ${paths[0]}: No such file`, exitCode: 1 };

    const allLines = content.split('\n');
    return { output: allLines.slice(Math.max(0, allLines.length - lines)).join('\n'), exitCode: 0 };
});
