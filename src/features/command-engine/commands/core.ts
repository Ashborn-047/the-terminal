import { CommandRegistry } from '../registry';
import { CommandContext, CommandResult, Signal } from '../types';
import { Inode } from '../../vfs/types';
import { permissionsToOctal } from '../../vfs/vfs';
import { readStream } from '../utils';
import { logger } from '../../../utils/logger';
import { useTerminalStore } from '../../../stores/terminalStore';


// ======================================================================
//  pwd — print working directory
// ======================================================================
CommandRegistry.register('pwd', async (args, context, input) => {
    return { output: context.cwd, exitCode: 0 };
});

// ======================================================================
//  ls  — list directory contents
//  Supports: -l, -a, -R, -h
// ======================================================================
CommandRegistry.register('ls', async (args, context, input) => {
    let showAll = false;
    let longFormat = false;
    let recursive = false;
    let humanReadable = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-')) {
            if (arg.includes('a')) showAll = true;
            if (arg.includes('l')) longFormat = true;
            if (arg.includes('R')) recursive = true;
            if (arg.includes('h')) humanReadable = true;
        } else {
            paths.push(arg);
        }
    }

    if (paths.length === 0) paths.push(context.cwd);

    const colorRoot = '\x1b[1;34m'; // Blue for dirs
    const colorFile = '\x1b[0m';    // Default
    const colorLink = '\x1b[1;36m'; // Cyan for links
    const colorReset = '\x1b[0m';

    const outputLines: string[] = [];
    const errors: string[] = [];
    let exitCode = 0;

    const listDir = (dirPath: string, isRecursiveCall: boolean = false) => {
        const result = context.vfs.resolveRelative(dirPath, context.cwd, context.userId);
        if (typeof result === 'string') {
            errors.push(`ls: cannot access '${dirPath}': ${result}`);
            exitCode = 1;
            return;
        }

        const inode = result as Inode;
        if (inode.type !== 'directory' || !inode.children) {
            outputLines.push(inode.name);
            return;
        }

        if (recursive || paths.length > 1 || isRecursiveCall) {
            outputLines.push(`${dirPath}:`);
        }

        const childrenResult = context.vfs.listChildren(dirPath, context.userId);
        if (typeof childrenResult === 'string') {
            errors.push(`ls: cannot open directory '${dirPath}': ${childrenResult}`);
            exitCode = 1;
            return;
        }

        let children = childrenResult || [];
        if (!showAll) children = children.filter(n => !n.name.startsWith('.'));

        if (longFormat) {
            for (const child of children) {
                const typeChar = child.type === 'directory' ? 'd' : (child.type === 'symlink' ? 'l' : '-');
                const permStr = formatPermissions(child.permissions);
                const rawSize = child.type === 'file' ? (child.size || 0) : 0;
                const sizeStr = humanReadable ? formatHumanSize(rawSize) : String(rawSize).padStart(5);
                const date = new Date(child.modifiedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                const color = child.type === 'directory' ? colorRoot : (child.type === 'symlink' ? colorLink : colorFile);
                const suffix = child.type === 'symlink' ? ` -> ${child.target || ''}` : '';
                outputLines.push(`${typeChar}${permStr} 1 ${child.ownerId} ${child.groupId} ${sizeStr} ${date} ${color}${child.name}${colorReset}${suffix}`);
            }
        } else {
            const list = children.map(n => {
                const color = n.type === 'directory' ? colorRoot : (n.type === 'symlink' ? colorLink : colorFile);
                return `${color}${n.name}${colorReset}${n.type === 'directory' ? '/' : ''}`;
            });
            outputLines.push(list.join('  '));
        }

        if (recursive) {
            outputLines.push('');
            for (const child of children) {
                if (child.type === 'directory' && child.name !== '.' && child.name !== '..') {
                    const childPath = dirPath === '/' ? `/${child.name}` : `${dirPath}/${child.name}`;
                    listDir(childPath, true);
                }
            }
        }
    };

    for (const p of paths) listDir(p);

    return {
        output: outputLines.join('\n').trim(),
        error: errors.join('\n').trim(),
        exitCode
    };
});

function formatPermissions(p: any): string {
    const fmt = (s: any) => `${s.read ? 'r' : '-'}${s.write ? 'w' : '-'}${s.execute ? 'x' : '-'}`;
    return `${fmt(p.owner)}${fmt(p.group)}${fmt(p.others)}`;
}

function formatHumanSize(bytes: number): string {
    if (bytes < 1024) return String(bytes).padStart(5);
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`.padStart(5);
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`.padStart(5);
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`.padStart(5);
}

// ======================================================================
//  cd — change directory
// ======================================================================
CommandRegistry.register('cd', async (args, context, input) => {
    let path = args.length > 0 ? args[0] : '/home/' + context.userId;
    if (path === '~' || path.startsWith('~/')) {
        path = '/home/' + context.userId + path.slice(1);
    }

    const result = context.vfs.resolveRelative(path, context.cwd, context.userId);
    if (typeof result === 'string') return { output: '', error: `cd: ${result}`, exitCode: 1 };

    const inode = result as Inode;
    if (inode.type !== 'directory') return { output: '', error: `cd: Not a directory: ${path}`, exitCode: 1 };

    return { output: context.vfs.getPath(inode.id), exitCode: 0 };
});

// ======================================================================
//  mkdir — create directories
// ======================================================================
CommandRegistry.register('mkdir', async (args, context, input) => {
    let recursive = false;
    let mode: string | undefined = undefined;
    const targets: string[] = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-p') { recursive = true; continue; }
        if (arg === '-m' && i + 1 < args.length) { mode = args[++i]; continue; }
        if (arg.startsWith('-')) continue;
        targets.push(arg);
    }

    if (targets.length === 0) return { output: '', error: 'mkdir: missing operand', exitCode: 1 };

    for (const dir of targets) {
        if (recursive) {
            const parts = dir.split('/').filter(p => p.length > 0);
            let currentPath = dir.startsWith('/') ? '' : context.cwd;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const checkPath = currentPath === '' ? '/' + part : (currentPath === '/' ? '/' + part : currentPath + '/' + part);
                if (!context.vfs.exists(checkPath, context.userId)) {
                    const parent = currentPath === '' ? '/' : currentPath;
                    const result = context.vfs.mkdir(parent, part, context.userId, (i === parts.length - 1) ? mode : undefined);
                    if (typeof result === 'string') return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
                }
                currentPath = checkPath;
            }
        } else {
            const parts = dir.split('/').filter(p => p.length > 0);
            const name = parts.pop() || '';
            const parentRelative = parts.join('/');
            const parentPath = dir.startsWith('/') ? '/' + parentRelative : (parentRelative ? context.cwd + '/' + parentRelative : context.cwd);
            const result = context.vfs.mkdir(parentPath, name, context.userId, mode);
            if (typeof result === 'string') return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
        }
    }
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  touch — change file timestamps / create empty files
// ======================================================================
CommandRegistry.register('touch', async (args, context, input) => {
    if (args.length === 0) return { output: '', error: 'touch: missing operand', exitCode: 1 };
    for (const name of args) context.vfs.touch(context.cwd, name, context.userId);
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  cat — concatenate files and print on the standard output
// ======================================================================
CommandRegistry.register('cat', async (args, context, input) => {
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
            const content = context.vfs.readFile(filePath, context.userId);
            if (typeof content === 'object' && 'error' in content) {
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
});

// ======================================================================
//  rm — remove files or directories
// ======================================================================
CommandRegistry.register('rm', async (args, context, input) => {
    let recursive = false;
    let force = false;
    let interactive = false;
    const paths: string[] = [];

    for (const arg of args) {
        if (arg === '-r' || arg === '-R') recursive = true;
        else if (arg === '-f') force = true;
        else if (arg === '-i') interactive = true;
        else if (arg === '-rf' || arg === '-fr') { recursive = true; force = true; }
        else if (!arg.startsWith('-')) paths.push(arg);
    }

    if (paths.length === 0) {
        if (force) return { output: '', exitCode: 0 };
        return { output: '', error: 'rm: missing operand', exitCode: 1 };
    }

    for (const path of paths) {
        if (interactive && !force && context.prompt) {
            const confirmed = await context.prompt(`rm: remove file '${path}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }
        const result = context.vfs.rm(path, recursive, context.userId);
        if (typeof result === 'string') {
            if (force && result === 'No such file or directory') continue;
            return { output: '', error: `rm: cannot remove '${path}': ${result}`, exitCode: 1 };
        }
    }
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  cp — copy files and directories
// ======================================================================
CommandRegistry.register('cp', async (args, context, input) => {
    let recursive = false;
    let interactive = false;
    let force = false;
    let preserve = false;
    const targets: string[] = [];

    for (const arg of args) {
        if (arg === '-r' || arg === '-R') recursive = true;
        else if (arg === '-i') interactive = true;
        else if (arg === '-f') force = true;
        else if (arg === '-p') preserve = true;
        else if (!arg.startsWith('-')) targets.push(arg);
    }

    if (targets.length < 2) return { output: '', error: 'cp: missing file operand', exitCode: 1 };

    const destPath = targets.pop()!;
    for (const srcPath of targets) {
        if (interactive && !force && context.vfs.exists(destPath, context.userId) && context.prompt) {
            const confirmed = await context.prompt(`cp: overwrite '${destPath}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }
        const result = context.vfs.cp(srcPath, destPath, recursive, context.userId);
        if (typeof result === 'string') return { output: '', error: `cp: ${result}`, exitCode: 1 };
        if (preserve) {
            const srcMeta = context.vfs.getMetadata(srcPath, context.userId);
            const destFinalPath = context.vfs.isDirectory(destPath, context.userId) ? `${destPath}/${srcPath.split('/').pop()}` : destPath;
            const destMeta = context.vfs.getMetadata(destFinalPath, context.userId);
            if (typeof srcMeta !== 'string' && typeof destMeta !== 'string') {
                destMeta.permissions = { ...srcMeta.permissions };
                destMeta.modifiedAt = srcMeta.modifiedAt;
            }
        }
    }
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  mv — move (rename) files
// ======================================================================
CommandRegistry.register('mv', async (args, context, input) => {
    let interactive = false;
    let force = false;
    const targets: string[] = [];

    for (const arg of args) {
        if (arg === '-i') interactive = true;
        else if (arg === '-f') force = true;
        else if (!arg.startsWith('-')) targets.push(arg);
    }

    if (targets.length < 2) return { output: '', error: 'mv: missing operand', exitCode: 1 };

    const destPath = targets.pop()!;
    for (const srcPath of targets) {
        if (interactive && !force && context.vfs.exists(destPath, context.userId) && context.prompt) {
            const confirmed = await context.prompt(`mv: overwrite '${destPath}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }
        const result = context.vfs.mv(srcPath, destPath, context.userId);
        if (typeof result === 'string') {
            if (force && result === 'Destination already exists') {
                context.vfs.rm(destPath, true, context.userId);
                const retryResult = context.vfs.mv(srcPath, destPath, context.userId);
                if (typeof retryResult === 'string') return { output: '', error: `mv: ${retryResult}`, exitCode: 1 };
                continue;
            }
            return { output: '', error: `mv: ${result}`, exitCode: 1 };
        }
    }
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  grep — print lines that match patterns
// ======================================================================
CommandRegistry.register('grep', async (args, context, input) => {
    let caseInsensitive = false;
    let invert = false;
    let lineNumbers = false;
    let countOnly = false;
    let recursive = false;
    const nonFlags: string[] = [];

    for (const arg of args) {
        if (arg.startsWith('-') && arg !== '--') {
            if (arg.includes('i')) caseInsensitive = true;
            if (arg.includes('v')) invert = true;
            if (arg.includes('n')) lineNumbers = true;
            if (arg.includes('c')) countOnly = true;
            if (arg.includes('r') || arg.includes('R')) recursive = true;
        } else {
            nonFlags.push(arg);
        }
    }

    if (nonFlags.length < 1) return { output: '', error: 'Usage: grep [options] PATTERN [FILE...]', exitCode: 2 };

    const pattern = nonFlags[0];
    const filePaths = nonFlags.slice(1);
    const outputLines: string[] = [];

    const searchContent = (content: string, prefix: string) => {
        const lines = content.split('\n');
        let matchCount = 0;
        let regex: RegExp;
        try { regex = new RegExp(pattern, caseInsensitive ? 'i' : ''); } catch (e) { return 0; }

        for (let i = 0; i < lines.length; i++) {
            if (context.isInterrupted()) break;
            const line = lines[i];
            let matches = regex.test(line);
            if (invert) matches = !matches;
            if (matches) {
                matchCount++;
                if (!countOnly) {
                    const lineNum = lineNumbers ? `${i + 1}:` : '';
                    outputLines.push(`${prefix}${lineNum}${line}`);
                }
            }
        }
        return matchCount;
    };

    const processPath = (path: string): void => {
        const resolved = context.vfs.resolve(path, context.userId);
        if (typeof resolved === 'string') return;
        const inode = resolved as Inode;

        if (inode.type === 'file') {
            if (context.isInterrupted()) return;
            const content = context.vfs.readFile(path, context.userId);
            if (typeof content === 'string') {
                const prefix = (filePaths.length > 1 || recursive) ? `${path}:` : '';
                const matchCount = searchContent(content, prefix);
                if (countOnly) outputLines.push(`${prefix}${matchCount}`);
            }
        } else if (inode.type === 'directory' && recursive && inode.children) {
            for (const childId of inode.children) {
                if (context.isInterrupted()) return;
                const child = context.vfs.getInode(childId);
                if (child) {
                    const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                    processPath(childPath);
                }
            }
        }
    };

    if (filePaths.length === 0) {
        const content = await readStream(input);
        searchContent(content, '');
    } else {
        for (const fp of filePaths) processPath(fp);
    }

    return { output: outputLines.join('\n'), exitCode: outputLines.length > 0 ? 0 : 1 };
});

// ======================================================================
//  chmod — change file mode bits
// ======================================================================
CommandRegistry.register('chmod', async (args, context, input) => {
    if (args.length < 2) return { output: '', error: 'chmod: missing operand', exitCode: 1 };
    const recursive = args.includes('-R');
    const filteredArgs = args.filter(a => a !== '-R');
    const mode = filteredArgs[0];
    const paths = filteredArgs.slice(1);

    const applyMode = (path: string, inode: Inode) => {
        if (inode.ownerId !== context.userId && context.userId !== 'root') return `chmod: operation not permitted`;
        if (/^[0-7]{3,4}$/.test(mode)) {
            context.vfs.chmod(path, mode.slice(-3), context.userId);
        } else {
            const newPermissions = parseSymbolicMode(mode, inode.permissions);
            if (!newPermissions) return `chmod: invalid mode: '${mode}'`;
            inode.permissions = newPermissions;
        }
        return null;
    };

    const walk = (path: string): string | null => {
        const resolved = context.vfs.resolve(path, context.userId);
        if (typeof resolved === 'string') return resolved;
        const inode = resolved as Inode;
        const err = applyMode(path, inode);
        if (err) return err;
        if (recursive && inode.type === 'directory' && inode.children) {
            for (const childId of inode.children) {
                const child = context.vfs.getInode(childId);
                if (child) {
                    const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                    const walkErr = walk(childPath);
                    if (walkErr) return walkErr;
                }
            }
        }
        return null;
    };

    for (const path of paths) {
        const err = walk(path);
        if (err) return { output: '', error: err, exitCode: 1 };
    }
    return { output: '', exitCode: 0 };
});

function parseSymbolicMode(mode: string, current: any): any | null {
    const perms = JSON.parse(JSON.stringify(current));
    const parts = mode.split(',');
    for (const part of parts) {
        const match = part.match(/^([ugoa]*)([+=-])([rwx]*)$/);
        if (!match) return null;
        const [, recipients, op, requested] = match;
        const targets: ('owner' | 'group' | 'others')[] = [];
        if (!recipients || recipients.includes('a')) targets.push('owner', 'group', 'others');
        else {
            if (recipients.includes('u')) targets.push('owner');
            if (recipients.includes('g')) targets.push('group');
            if (recipients.includes('o')) targets.push('others');
        }
        const r = requested.includes('r'), w = requested.includes('w'), x = requested.includes('x');
        for (const t of targets) {
            if (op === '+') { if (r) perms[t].read = true; if (w) perms[t].write = true; if (x) perms[t].execute = true; }
            else if (op === '-') { if (r) perms[t].read = false; if (w) perms[t].write = false; if (x) perms[t].execute = false; }
            else if (op === '=') { perms[t].read = r; perms[t].write = w; perms[t].execute = x; }
        }
    }
    return perms;
}

// ======================================================================
//  chown — change file owner and group
// ======================================================================
CommandRegistry.register('chown', async (args, context, input) => {
    if (args.length < 2) return { output: '', error: 'chown: missing operand', exitCode: 1 };
    const owner = args[0];
    const paths = args.slice(1);
    for (const path of paths) {
        const result = context.vfs.chown(path, owner, context.userId);
        if (typeof result === 'string') return { output: '', error: `chown: ${result}`, exitCode: 1 };
    }
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  ln — make links between files
// ======================================================================
CommandRegistry.register('ln', async (args, context, input) => {
    const symbolic = args.includes('-s');
    const paths = args.filter(a => !a.startsWith('-'));
    if (paths.length < 2) return { output: '', error: 'ln: missing operand', exitCode: 1 };
    if (!symbolic) return { output: '', error: 'ln: hard links not supported, use -s', exitCode: 1 };

    const target = paths[0], linkName = paths[1];
    const parts = linkName.split('/').filter(p => p.length > 0);
    const name = parts.pop() || '', parentPath = linkName.startsWith('/') ? '/' + parts.join('/') : (parts.length > 0 ? parts.join('/') : context.cwd);
    const result = context.vfs.ln(parentPath || context.cwd, name, target, context.userId, symbolic);
    if (typeof result === 'string') return { output: '', error: `ln: ${result}`, exitCode: 1 };
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  whoami / date / clear / help
// ======================================================================
CommandRegistry.register('whoami', async (args, context, input) => ({ output: context.userId, exitCode: 0 }));
CommandRegistry.register('date', async (args, context, input) => ({ output: new Date().toString(), exitCode: 0 }));
CommandRegistry.register('clear', async (args, context, input) => ({ output: '', exitCode: 0 }));
CommandRegistry.register('help', async (args, context, input) => {
    const commands = CommandRegistry.list().sort();
    return { output: 'Available commands:\n' + commands.join('  '), exitCode: 0 };
});
CommandRegistry.register('true', async (args, context, input) => ({ output: '', exitCode: 0 }));
CommandRegistry.register('false', async (args, context, input) => ({ output: '', exitCode: 1 }));

// ======================================================================
//  echo — expand and print text
// ======================================================================
CommandRegistry.register('echo', async (args, context, input) => {
    let noNewline = false, interpretEscapes = false;
    const textArgs: string[] = [];
    for (const arg of args) {
        if (arg === '-n') { noNewline = true; continue; }
        if (arg === '-e') { interpretEscapes = true; continue; }
        textArgs.push(arg);
    }
    const expanded = textArgs.map(a => a.startsWith('$') ? (context.env[a.slice(1)] || '') : a);
    let out = expanded.join(' ');
    if (interpretEscapes) out = out.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
    return { output: out, exitCode: 0 };
});

// ======================================================================
//  history — print command history
// ======================================================================
CommandRegistry.register('history', async (args, context, input) => {
    const lines = context.history.map((cmd, i) => `  ${i + 1}  ${cmd}`);
    return { output: lines.join('\n'), exitCode: 0 };
});

// ======================================================================
//  sudo — execute a command with root privileges
// ======================================================================
CommandRegistry.register('sudo', async (args, context, input) => {
    if (args.length === 0) return { output: '', error: 'sudo: missing command', exitCode: 1 };
    const cmdName = args[0], cmdArgs = args.slice(1), cmdFn = CommandRegistry.get(cmdName);
    if (!cmdFn) return { output: '', error: `sudo: ${cmdName}: command not found`, exitCode: 127 };
    return await cmdFn(cmdArgs, { ...context, userId: 'root' }, input);
});

// ======================================================================
//  uname / uptime / df / free
// ======================================================================
CommandRegistry.register('uname', async (args, context, input) => ({ output: args.includes('-a') ? 'Linux the-terminal 6.1.0 #1 SMP x86_64 GNU/Linux' : 'Linux', exitCode: 0 }));
CommandRegistry.register('uptime', async (args, context, input) => ({ output: ' 22:50:00 up 1 day,  3:27,  1 user,  load average: 0.15, 0.12, 0.10', exitCode: 0 }));
CommandRegistry.register('df', async (args, context, input) => ({ output: 'Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       51200000 4200000  47000000   9% /', exitCode: 0 }));
CommandRegistry.register('free', async (args, context, input) => ({ output: '              total        used        free      shared  buff/cache   available\nMem:        8157980     2345672     3812308      102400     2000000     5512308\nSwap:       2097148           0     2097148', exitCode: 0 }));

// ======================================================================
//  ps — report a snapshot of the current processes
// ======================================================================
CommandRegistry.register('ps', async (args, context, input) => {
    const showAll = args.includes('-a') || args.includes('aux') || args.includes('-e');
    const header = showAll ? 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND' : '  PID TTY          TIME CMD';
    const lines = context.processes.map(p => {
        const elapsed = Math.floor((Date.now() - p.startTime) / 1000), mins = Math.floor(elapsed / 60), secs = elapsed % 60;
        const timeStr = `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (showAll) {
            const cpu = p.name === 'cryptominer' ? '99.9' : '0.0';
            return `${p.user.padEnd(8)} ${p.pid.toString().padStart(5)}  ${cpu}  0.1  2356   1400 pts/0    ${p.status || 'S'}    12:00   ${timeStr} ${p.name}`;
        }
        return `${p.pid.toString().padStart(5)} pts/0    ${timeStr} ${p.name}`;
    });
    return { output: `${header}\n${lines.join('\n')}`, exitCode: 0 };
});

// ======================================================================
//  top — display Linux processes
// ======================================================================
CommandRegistry.register('top', async (args, context, input) => {
    const hasRogue = context.processes.some(p => p.name === 'cryptominer');
    const cpuLine = hasRogue ? '%Cpu(s): 99.9 us,  0.1 sy,  0.0 ni,  0.0 id,  0.0 wa' : '%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.5 id,  0.2 wa';
    const rows = context.processes.map(p => {
        const elapsed = Math.floor((Date.now() - p.startTime) / 1000), timeStr = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}.00`;
        const cpu = p.name === 'cryptominer' ? 99.9 : 0.0;
        return { cpu, row: `${p.pid.toString().padStart(5)} ${p.user.padEnd(8)} 20   0    2356   1400    800 ${p.status || 'S'}  ${cpu.toFixed(1).padStart(4)}   0.0   ${timeStr.padStart(7)} ${p.name}` };
    }).sort((a, b) => b.cpu - a.cpu);

    const output = [
        `top - ${new Date().toLocaleTimeString()}, up 1 day, 3:27, 1 user, load average: 0.15, 0.12, 0.10`,
        `Tasks: ${context.processes.length} total, 1 running, ${context.processes.length - 1} sleeping`,
        cpuLine,
        'MiB Mem :   7966 total,   3726 free,   2291 used,   1949 buff/cache',
        '',
        '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        ...rows.map(r => r.row)
    ];
    return { output: output.join('\n'), exitCode: 0 };
});

// ======================================================================
//  kill — send a signal to a process
// ======================================================================
CommandRegistry.register('kill', async (args, context, input) => {
    if (args.length === 0) return { output: '', error: 'kill: missing operand', exitCode: 1 };
    
    let signalToEmit = Signal.SIGTERM;
    const signalArg = args.find(a => a.startsWith('-'));
    if (signalArg) {
        const sigNum = parseInt(signalArg.slice(1), 10);
        if (sigNum === 9) signalToEmit = Signal.SIGKILL;
        else if (sigNum === 15) signalToEmit = Signal.SIGTERM;
        else if (sigNum === 2) signalToEmit = Signal.SIGINT;
        // ... more signals could be added
    }

    const pids = args.filter(a => !a.startsWith('-')).map(Number);
    if (pids.some(isNaN)) return { output: '', error: 'kill: invalid PID', exitCode: 1 };
    
    const terminalStore = useTerminalStore.getState();
    let found = false;
    for (const pid of pids) {
        const proc = context.processes.find(p => p.pid === pid);
        if (proc) {
            terminalStore.sendSignal(pid, signalToEmit);
            found = true;
            // If SIGKILL or SIGTERM, we also remove it from the process list as a simulation shortcut
            if (signalToEmit === Signal.SIGKILL || signalToEmit === Signal.SIGTERM) {
                const nextProcesses = context.processes.filter(p => p.pid !== pid);
                context.updateProcesses(nextProcesses);
            }
        }
    }

    if (!found) return { output: '', error: `kill: (${pids.join(' ')}) - No such process`, exitCode: 1 };
    return { output: '', exitCode: 0 };
});

// ======================================================================
//  head / tail — output the first / last part of files
// ======================================================================
CommandRegistry.register('head', async (args, context, input) => {
    let lines = 10;
    const paths = args.filter(a => {
        if (a === '-n' && args[args.indexOf(a) + 1]) { lines = parseInt(args[args.indexOf(a) + 1], 10); return false; }
        return !a.startsWith('-') && isNaN(parseInt(a, 10)); // simple filter
    });
    const content = paths.length > 0 ? context.vfs.readFile(paths[0], context.userId) : await readStream(input);
    if (typeof content !== 'string') return { output: '', error: `head: Error reading input`, exitCode: 1 };
    return { output: content.split('\n').slice(0, lines).join('\n'), exitCode: 0 };
});

CommandRegistry.register('tail', async (args, context, input) => {
    let lines = 10;
    const paths = args.filter(a => {
        if (a === '-n' && args[args.indexOf(a) + 1]) { lines = parseInt(args[args.indexOf(a) + 1], 10); return false; }
        return !a.startsWith('-') && isNaN(parseInt(a, 10));
    });
    const content = paths.length > 0 ? context.vfs.readFile(paths[0], context.userId) : await readStream(input);
    if (typeof content !== 'string') return { output: '', error: `tail: Error reading input`, exitCode: 1 };
    const allLines = content.split('\n');
    return { output: allLines.slice(Math.max(0, allLines.length - lines)).join('\n'), exitCode: 0 };
});

// ======================================================================
//  wc — print newline, word, and byte counts for each file
// ======================================================================
CommandRegistry.register('wc', async (args, context, input) => {
    let countLines = args.includes('-l'), countWords = args.includes('-w'), countChars = args.includes('-c') || args.includes('-m');
    if (!countLines && !countWords && !countChars) countLines = countWords = countChars = true;
    const paths = args.filter(a => !a.startsWith('-'));

    const process = (txt: string) => ({
        l: txt.length === 0 ? 0 : txt.split('\n').filter(l => l.length > 0).length,
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
        const content = context.vfs.readFile(p, context.userId);
        if (typeof content === 'string') {
            const { l, w, c } = process(content);
            tl += l; tw += w; tc += c;
            rows.push(`${countLines ? l : ''} ${countWords ? w : ''} ${countChars ? c : ''} ${p}`.trim());
        } else rows.push(`wc: ${p}: No such file`);
    }
    if (paths.length > 1) rows.push(`${countLines ? tl : ''} ${countWords ? tw : ''} ${countChars ? tc : ''} total`.trim());
    return { output: rows.join('\n'), exitCode: 0 };
});

// ======================================================================
//  find — search for files in a directory hierarchy
// ======================================================================
CommandRegistry.register('find', async (args, context, input) => {
    const searchPath = args[0] || context.cwd;
    const results: string[] = [];
    const walk = async (path: string) => {
        const res = context.vfs.resolve(path, context.userId);
        if (typeof res === 'string') return;
        results.push(path);
        if (res.type === 'directory' && res.children) {
            for (const cid of res.children) {
                const child = context.vfs.getInode(cid);
                if (child) await walk(path === '/' ? `/${child.name}` : `${path}/${child.name}`);
            }
        }
    };
    await walk(searchPath);
    return { output: results.join('\n'), exitCode: 0 };
});

// ======================================================================
//  env — run a program in a modified environment
// ======================================================================
CommandRegistry.register('env', async (args, context, input) => ({ output: Object.entries(context.env).map(([k, v]) => `${k}=${v}`).join('\n'), exitCode: 0 }));

// ======================================================================
//  sleep — delay for a specified amount of time
// ======================================================================
CommandRegistry.register('sleep', async (args, context, input) => {
    if (args.length === 0) return { output: '', error: 'sleep: missing operand', exitCode: 1 };
    const seconds = parseFloat(args[0]);
    if (isNaN(seconds)) return { output: '', error: `sleep: invalid time interval '${args[0]}'`, exitCode: 1 };

    return new Promise((resolve) => {
        let timer: any;
        const cleanup = () => clearTimeout(timer);

        const onSigInt = () => {
            cleanup();
            resolve({ output: '', exitCode: 130 });
        };

        context.onSignal((sig) => {
            if (sig === Signal.SIGINT) onSigInt();
        });

        timer = setTimeout(() => {
            resolve({ output: '', exitCode: 0 });
        }, seconds * 1000);
    });
});
