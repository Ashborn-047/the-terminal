import { CommandRegistry } from '../registry';
import { CommandContext, CommandResult } from '../types';
import { Inode } from '../../vfs/types';
import { permissionsToOctal } from '../../vfs/vfs';
import { logger } from '../../../utils/logger';

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
        const result = context.vfs.resolve(dirPath, context.userId);
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

        if (!showAll) {
            children = children.filter(n => !n.name.startsWith('.'));
        }

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

    for (const p of paths) {
        listDir(p);
    }

    return {
        output: outputLines.join('\n').trim(),
        error: errors.join('\n').trim(),
        exitCode
    };
});

function formatPermissions(p: { owner: { read: boolean; write: boolean; execute: boolean }; group: { read: boolean; write: boolean; execute: boolean }; others: { read: boolean; write: boolean; execute: boolean } }): string {
    const fmt = (s: { read: boolean; write: boolean; execute: boolean }) =>
        `${s.read ? 'r' : '-'}${s.write ? 'w' : '-'}${s.execute ? 'x' : '-'}`;
    return `${fmt(p.owner)}${fmt(p.group)}${fmt(p.others)}`;
}

function formatHumanSize(bytes: number): string {
    if (bytes < 1024) return String(bytes).padStart(5);
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`.padStart(5);
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}M`.padStart(5);
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`.padStart(5);
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
    let recursive = false;
    let mode: string | undefined = undefined;
    const targets: string[] = [];

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-p') { recursive = true; continue; }
        if (arg === '-m' && i + 1 < args.length) {
            mode = args[++i];
            continue;
        }
        if (arg.startsWith('-')) continue;
        targets.push(arg);
    }

    if (targets.length === 0) {
        return { output: '', error: 'mkdir: missing operand', exitCode: 1 };
    }

    for (const dir of targets) {
        if (recursive) {
            const parts = dir.split('/').filter(p => p.length > 0);
            let currentPath = dir.startsWith('/') ? '' : context.cwd;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const checkPath = currentPath === '' ? '/' + part : (currentPath === '/' ? '/' + part : currentPath + '/' + part);
                if (!context.vfs.exists(checkPath, context.userId)) {
                    const parent = currentPath === '' ? '/' : currentPath;
                    const applyMode = (i === parts.length - 1) ? mode : undefined;
                    const result = context.vfs.mkdir(parent, part, context.userId, applyMode);
                    if (typeof result === 'string') {
                        return { output: '', error: `mkdir: ${result}`, exitCode: 1 };
                    }
                }
                currentPath = checkPath;
            }
        } else {
            const parts = dir.split('/').filter(p => p.length > 0);
            const name = parts.pop() || '';
            const parentRelative = parts.join('/');
            const parentPath = dir.startsWith('/') ? '/' + parentRelative : (parentRelative ? context.cwd + '/' + parentRelative : context.cwd);

            const result = context.vfs.mkdir(parentPath, name, context.userId, mode);
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
CommandRegistry.register('cat', async (args, context, stdin) => {
    let lineNumbers = false;
    const filePaths: string[] = [];

    for (const arg of args) {
        if (arg === '-n') lineNumbers = true;
        else if (!arg.startsWith('-')) filePaths.push(arg);
    }

    let output = '';
    let error = '';
    let exitCode = 0;

    if (filePaths.length === 0) {
        if (stdin) {
            output = stdin;
        }
    } else {
        for (const filePath of filePaths) {
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
//  rm — supports -r, -rf
// ======================================================================
CommandRegistry.register('rm', async (args, context) => {
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
        // Handle -i
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
//  cp — supports -r, -R
// ======================================================================
CommandRegistry.register('cp', async (args, context) => {
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

    if (targets.length < 2) {
        return { output: '', error: 'cp: missing file operand', exitCode: 1 };
    }

    const destPath = targets.pop()!;
    for (const srcPath of targets) {
        // Handle -i
        if (interactive && !force && context.vfs.exists(destPath, context.userId) && context.prompt) {
            const confirmed = await context.prompt(`cp: overwrite '${destPath}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }

        const result = context.vfs.cp(srcPath, destPath, recursive, context.userId);
        if (typeof result === 'string') {
            return { output: '', error: `cp: ${result}`, exitCode: 1 };
        }

        // Handle -p (preserve)
        if (preserve) {
            const srcMeta = context.vfs.getMetadata(srcPath, context.userId);
            const destFinalPath = context.vfs.isDirectory(destPath, context.userId)
                ? `${destPath}/${srcPath.split('/').pop()}`
                : destPath;
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
//  mv
// ======================================================================
CommandRegistry.register('mv', async (args, context) => {
    let interactive = false;
    let force = false;
    const targets: string[] = [];

    for (const arg of args) {
        if (arg === '-i') interactive = true;
        else if (arg === '-f') force = true;
        else if (!arg.startsWith('-')) targets.push(arg);
    }

    if (targets.length < 2) {
        return { output: '', error: 'mv: missing operand', exitCode: 1 };
    }

    const destPath = targets.pop()!;
    for (const srcPath of targets) {
        // Handle -i
        if (interactive && !force && context.vfs.exists(destPath, context.userId) && context.prompt) {
            const confirmed = await context.prompt(`mv: overwrite '${destPath}'? `);
            if (confirmed.toLowerCase() !== 'y') continue;
        }

        const result = context.vfs.mv(srcPath, destPath, context.userId);
        if (typeof result === 'string') {
            if (force && result === 'Destination already exists') {
                context.vfs.rm(destPath, true, context.userId);
                const retryResult = context.vfs.mv(srcPath, destPath, context.userId);
                if (typeof retryResult === 'string') {
                    return { output: '', error: `mv: ${retryResult}`, exitCode: 1 };
                }
                continue;
            }
            return { output: '', error: `mv: ${result}`, exitCode: 1 };
        }
    }

    return { output: '', exitCode: 0 };
});

// ======================================================================
//  grep — supports -i (case insensitive), -v (invert), -n (line numbers)
// ======================================================================
CommandRegistry.register('grep', async (args, context, stdin) => {
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

    // Helper to search content
    const searchContent = (content: string, prefix: string) => {
        const lines = content.split('\n');
        let matchCount = 0;
        let regex: RegExp;
        try {
            regex = new RegExp(pattern, caseInsensitive ? 'i' : '');
        } catch (e) {
            return 0; // Invalid regex
        }

        for (let i = 0; i < lines.length; i++) {
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
            const content = context.vfs.readFile(path, context.userId);
            if (typeof content === 'string') {
                const prefix = (filePaths.length > 1 || recursive) ? `${path}:` : '';
                const matchCount = searchContent(content, prefix);
                if (countOnly) outputLines.push(`${prefix}${matchCount}`);
            }
        } else if (inode.type === 'directory' && recursive) {
            if (inode.children) {
                for (const childId of inode.children) {
                    const child = context.vfs.getInode(childId);
                    if (child) {
                        const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                        processPath(childPath);
                    }
                }
            }
        }
    };

    // If no file given, use piped input
    if (filePaths.length === 0) {
        if (stdin) {
            searchContent(stdin, '');
        } else if (recursive) {
            processPath(context.cwd);
        } else {
            return { output: '', error: 'grep: No file specified', exitCode: 2 };
        }
    } else {
        for (const fp of filePaths) {
            processPath(fp);
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

    const recursive = args.includes('-R');
    const filteredArgs = args.filter(a => a !== '-R');
    const mode = filteredArgs[0];
    const paths = filteredArgs.slice(1);

    const applyMode = (path: string, inode: Inode) => {
        if (inode.ownerId !== context.userId && context.userId !== 'root') {
            logger.security('CHMOD_UNAUTHORIZED', { path, userId: context.userId });
            return `chmod: changing permissions of '${path}': Operation not permitted`;
        }

        if (/^[0-7]{3,4}$/.test(mode)) {
            const result = context.vfs.chmod(path, mode.slice(-3), context.userId);
            if (typeof result === 'string') return `chmod: ${result}`;
            logger.security('CHMOD_OCTAL', { path, mode, userId: context.userId });
        } else {
            const newPermissions = parseSymbolicMode(mode, inode.permissions);
            if (!newPermissions) return `chmod: invalid mode: '${mode}'`;
            inode.permissions = newPermissions;
            inode.modifiedAt = Date.now();
            logger.security('CHMOD_SYMBOLIC', { path, mode, userId: context.userId });
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

function parseSymbolicMode(mode: string, current: Inode['permissions']): Inode['permissions'] | null {
    const perms = JSON.parse(JSON.stringify(current)); // Deep clone
    const parts = mode.split(',');

    for (const part of parts) {
        const match = part.match(/^([ugoa]*)([+=-])([rwx]*)$/);
        if (!match) return null;

        const [, recipients, op, requested] = match;
        const targets: ('owner' | 'group' | 'others')[] = [];
        if (!recipients || recipients.includes('a')) {
            targets.push('owner', 'group', 'others');
        } else {
            if (recipients.includes('u')) targets.push('owner');
            if (recipients.includes('g')) targets.push('group');
            if (recipients.includes('o')) targets.push('others');
        }

        const read = requested.includes('r');
        const write = requested.includes('w');
        const execute = requested.includes('x');

        for (const target of targets) {
            if (op === '+') {
                if (read) perms[target].read = true;
                if (write) perms[target].write = true;
                if (execute) perms[target].execute = true;
            } else if (op === '-') {
                if (read) perms[target].read = false;
                if (write) perms[target].write = false;
                if (execute) perms[target].execute = false;
            } else if (op === '=') {
                perms[target].read = read;
                perms[target].write = write;
                perms[target].execute = execute;
            }
        }
    }
    return perms;
}

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
    let noNewline = false;
    let interpretEscapes = false;
    const textArgs: string[] = [];

    for (const arg of args) {
        if (arg === '-n') { noNewline = true; continue; }
        if (arg === '-e') { interpretEscapes = true; continue; }
        textArgs.push(arg);
    }

    const expanded = textArgs.map(a => {
        if (a.startsWith('$')) {
            const varName = a.slice(1);
            return context.env[varName] || '';
        }
        return a;
    });

    let result = expanded.join(' ');
    if (interpretEscapes) {
        result = result.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
    }
    if (noNewline) {
        // Return without trailing newline (output won't have \n appended)
        return { output: result, exitCode: 0 };
    }
    return { output: result, exitCode: 0 };
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
    logger.security('SUDO_EXEC', { command: commandName, args: commandArgs, userId: context.userId });
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
CommandRegistry.register('wc', async (args, context, stdin) => {
    let countLines = false;
    let countWords = false;
    let countChars = false;

    if (args.includes('-l')) countLines = true;
    if (args.includes('-w')) countWords = true;
    if (args.includes('-c') || args.includes('-m')) countChars = true;

    // Default if no flags: show all
    if (!countLines && !countWords && !countChars) {
        countLines = countWords = countChars = true;
    }

    const filePaths = args.filter(a => !a.startsWith('-'));
    let totalLines = 0;
    let totalWords = 0;
    let totalChars = 0;

    const processContent = (content: string) => {
        // Split by newline, filter out empty strings from trailing newlines, then count.
        // If content is empty, lines should be 0.
        const lines = content.length === 0 ? 0 : content.split('\n').filter(l => l.length > 0).length;
        // Trim to handle leading/trailing whitespace, split by one or more whitespace, filter out empty strings.
        // If content is empty or only whitespace, words should be 0.
        const words = content.trim().length === 0 ? 0 : content.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = content.length;
        return { lines, words, chars };
    };

    const outputRows: string[] = [];

    if (filePaths.length === 0) {
        if (stdin) {
            const { lines, words, chars } = processContent(stdin);
            totalLines += lines;
            totalWords += words;
            totalChars += chars;
            let row = '';
            if (countLines) row += `${lines} `;
            if (countWords) row += `${words} `;
            if (countChars) row += `${chars} `;
            outputRows.push(row.trim());
        } else {
            return { output: '', error: 'wc: missing operand', exitCode: 1 };
        }
    } else {
        for (const path of filePaths) {
            const content = context.vfs.readFile(path, context.userId);
            if (typeof content === 'string') {
                const { lines, words, chars } = processContent(content);
                totalLines += lines;
                totalWords += words;
                totalChars += chars;
                let row = '';
                if (countLines) row += `${lines} `;
                if (countWords) row += `${words} `;
                if (countChars) row += `${chars} `;
                row += ` ${path}`;
                outputRows.push(row.trim());
            } else {
                outputRows.push(`wc: ${path}: No such file or directory`);
            }
        }
        if (filePaths.length > 1) {
            let row = '';
            if (countLines) row += `${totalLines} `;
            if (countWords) row += `${totalWords} `;
            if (countChars) row += `${totalChars} `;
            row += ' total';
            outputRows.push(row.trim());
        }
    }

    return { output: outputRows.join('\n'), exitCode: 0 };
});

// ======================================================================
//  find — basic path/name search
// ======================================================================
CommandRegistry.register('find', async (args, context) => {
    const searchPath = args[0] || context.cwd;
    let namePattern = '';
    let typeFilter = '';
    let sizeFilter = '';
    let permFilter = '';
    let execCommand: string[] = [];

    const findArgs = [...args];
    for (let i = 0; i < findArgs.length; i++) {
        if (findArgs[i] === '-name' && findArgs[i + 1]) { namePattern = findArgs[i + 1]; i++; }
        else if (findArgs[i] === '-type' && findArgs[i + 1]) { typeFilter = findArgs[i + 1]; i++; }
        else if (findArgs[i] === '-size' && findArgs[i + 1]) { sizeFilter = findArgs[i + 1]; i++; }
        else if (findArgs[i] === '-perm' && findArgs[i + 1]) { permFilter = findArgs[i + 1]; i++; }
        else if (findArgs[i] === '-exec') {
            const endIdx = findArgs.indexOf('\;', i);
            if (endIdx !== -1) {
                execCommand = findArgs.slice(i + 1, endIdx);
                i = endIdx;
            }
        }
    }

    const results: string[] = [];

    const walk = async (path: string) => {
        const resolved = context.vfs.resolve(path, context.userId);
        if (typeof resolved === 'string') return;
        const inode = resolved as Inode;

        let passes = true;
        if (typeFilter === 'f' && inode.type !== 'file') passes = false;
        if (typeFilter === 'd' && inode.type !== 'directory') passes = false;

        if (sizeFilter) {
            const actualSize = inode.size || 0;
            const match = sizeFilter.match(/^([+-]?)(\d+)([KMG]?)$/);
            if (match) {
                const [, op, valueStr, unit] = match;
                let targetSize = parseInt(valueStr, 10);
                if (unit === 'K') targetSize *= 1024;
                else if (unit === 'M') targetSize *= 1024 * 1024;
                else if (unit === 'G') targetSize *= 1024 * 1024 * 1024;
                if (op === '+') passes = actualSize > targetSize;
                else if (op === '-') passes = actualSize < targetSize;
                else passes = actualSize === targetSize;
            }
        }

        if (permFilter && inode.permissions) {
            const actualPerms = permissionsToOctal(inode.permissions);
            if (actualPerms !== permFilter) passes = false;
        }

        if (namePattern && !matchGlob(inode.name, namePattern)) passes = false;

        if (passes) {
            results.push(path);
            if (execCommand.length > 0) {
                const cmdName = execCommand[0];
                const cmdArgs = execCommand.slice(1).map(a => a === '{}' ? path : a);
                const cmdFn = CommandRegistry.get(cmdName);
                if (cmdFn) await cmdFn(cmdArgs, context);
            }
        }

        if (inode.type === 'directory' && inode.children) {
            for (const childId of inode.children) {
                const child = context.vfs.getInode(childId);
                if (child) {
                    await walk(path === '/' ? `/${child.name}` : `${path}/${child.name}`);
                }
            }
        }
    };

    await walk(searchPath);
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
CommandRegistry.register('ps', async (args, context) => {
    const header = '  PID TTY          TIME CMD';
    const lines = context.processes.map(p => {
        const elapsed = Math.floor((Date.now() - p.startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        const timeStr = `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return `${p.pid.toString().padStart(5)} pts/0    ${timeStr} ${p.name}`;
    });
    return { output: `${header}\n${lines.join('\n')}`, exitCode: 0 };
});

// ======================================================================
//  top — simulated system monitor (snapshot)
// ======================================================================
CommandRegistry.register('top', async (args, context) => {
    const uptime = '22:50:00 up 1 day,  3:27,  1 user,  load average: 0.15, 0.12, 0.10';
    const tasks = `Tasks:   ${context.processes.length} total,   1 running,   ${context.processes.length - 1} sleeping`;
    const cpu = '%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.5 id,  0.2 wa';
    const mem = 'MiB Mem :   7966 total,   3726 free,   2291 used,   1949 buff/cache';

    const header = '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND';
    const rows = context.processes.map(p => {
        const elapsed = Math.floor((Date.now() - p.startTime) / 1000);
        const timeStr = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}.00`;
        return `${p.pid.toString().padStart(5)} ${p.user.padEnd(8)} 20   0    2356   1400    800 S   0.0   0.0   ${timeStr.padStart(7)} ${p.name}`;
    });

    const output = [
        `top - ${uptime}`,
        tasks,
        cpu,
        mem,
        '',
        header,
        ...rows
    ];
    return { output: output.join('\n'), exitCode: 0 };
});

// ======================================================================
//  kill — simulated
// ======================================================================
CommandRegistry.register('kill', async (args, context) => {
    if (args.length === 0) return { output: '', error: 'kill: missing operand', exitCode: 1 };

    // Support -9 flag
    const force = args.includes('-9');
    const pids = args.filter(a => !a.startsWith('-')).map(Number);

    if (pids.some(isNaN)) return { output: '', error: 'kill: invalid PID', exitCode: 1 };

    const newProcesses = context.processes.filter(p => !pids.includes(p.pid));

    if (newProcesses.length === context.processes.length) {
        return { output: '', error: `kill: (${pids.join(' ')}) - No such process`, exitCode: 1 };
    }

    context.updateProcesses(newProcesses);
    return { output: '', exitCode: 0 };
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
