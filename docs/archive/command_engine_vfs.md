# Command Engine & Virtual File System Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

The Command Engine and Virtual File System (VFS) form the heart of the terminal simulation. The VFS is an in‑memory representation of a Linux filesystem, and the Command Engine parses user input, executes commands against the VFS, and handles pipes, redirections, and output.

Together they enable a realistic, sandboxed Linux environment where users can safely practice commands.

---

## 2. Virtual File System (VFS)

### 2.1 Core Concepts

The VFS is a tree structure where each node represents a file or directory. It tracks:

- **Type:** `file` or `directory`
- **Name**
- **Path** (derived from tree position)
- **Content** (for files)
- **Permissions** (Unix‑style: owner/group/other read/write/execute)
- **Owner** and **Group** (user and group IDs)
- **Timestamps** (creation, modification, access)
- **Hard Links** (multiple paths pointing to the same inode)
- **Symbolic Links** (special file type pointing to another path)

### 2.2 Data Structures

```typescript
// types/vfs.ts

export interface Inode {
  id: string;                // unique identifier (UUID)
  type: 'file' | 'directory' | 'symlink';
  name: string;
  parentId: string | null;   // null for root
  permissions: string;       // e.g., "755" (owner:rwx, group:r-x, other:r-x)
  owner: string;             // username
  group: string;             // group name
  createdAt: number;         // timestamp
  modifiedAt: number;
  accessedAt: number;
}

export interface FileInode extends Inode {
  type: 'file';
  content: string;           // file data (text)
  size: number;
}

export interface DirectoryInode extends Inode {
  type: 'directory';
  children: string[];        // list of child inode IDs
}

export interface SymlinkInode extends Inode {
  type: 'symlink';
  target: string;            // path the link points to (absolute or relative)
}

export type AnyInode = FileInode | DirectoryInode | SymlinkInode;

export interface VFSOptions {
  rootUserId?: string;
  rootGroup?: string;
}
```

### 2.3 VFS Class

The `VFS` class provides an API for all file operations. It maintains an inode map and a root reference.

```typescript
// lib/vfs/VFS.ts

import { v4 as uuidv4 } from 'uuid';

export class VFS {
  private inodes: Map<string, AnyInode> = new Map();
  private rootId: string;
  private currentUserId: string;   // who is "running" the commands (for permissions)
  private currentGroup: string;
  
  constructor(options: VFSOptions = {}) {
    // Create root directory
    const root: DirectoryInode = {
      id: uuidv4(),
      type: 'directory',
      name: '/',
      parentId: null,
      children: [],
      permissions: '755',
      owner: options.rootUserId || 'root',
      group: options.rootGroup || 'root',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      accessedAt: Date.now(),
    };
    this.inodes.set(root.id, root);
    this.rootId = root.id;
    this.currentUserId = 'guest';
    this.currentGroup = 'guest';
  }
  
  // === Path Resolution ===
  
  /**
   * Resolve a path to an inode ID, following symlinks.
   * Returns the final inode ID and the resolved path (for symlinks).
   */
  resolve(path: string, followSymlinks = true): { id: string; resolvedPath: string } | null {
    // Handle absolute vs relative paths
    const parts = this.normalizePath(path).split('/').filter(p => p !== '');
    let currentId = path.startsWith('/') ? this.rootId : this.getCurrentDirectoryId();
    let currentPath = path.startsWith('/') ? '' : this.getPath(currentId);
    
    for (const part of parts) {
      if (part === '..') {
        const parent = this.getParent(currentId);
        if (!parent) return null; // beyond root
        currentId = parent.id;
        currentPath = this.getPath(currentId);
        continue;
      }
      if (part === '.') continue;
      
      const node = this.inodes.get(currentId);
      if (!node || node.type !== 'directory') return null;
      
      const child = this.findChild(node as DirectoryInode, part);
      if (!child) return null;
      
      // Handle symlink
      if (child.type === 'symlink' && followSymlinks) {
        const target = (child as SymlinkInode).target;
        const resolved = this.resolve(target, true);
        if (!resolved) return null;
        currentId = resolved.id;
        currentPath = resolved.resolvedPath;
      } else {
        currentId = child.id;
        currentPath = this.joinPath(currentPath, part);
      }
    }
    
    return { id: currentId, resolvedPath: currentPath };
  }
  
  // === File/Directory Operations ===
  
  listDirectory(path: string): AnyInode[] | null {
    const resolved = this.resolve(path);
    if (!resolved) return null;
    const node = this.inodes.get(resolved.id);
    if (!node || node.type !== 'directory') return null;
    
    // Check execute permission on directory (needed to list contents)
    if (!this.checkPermission(node, 'execute')) return null;
    
    const dir = node as DirectoryInode;
    return dir.children
      .map(id => this.inodes.get(id))
      .filter((n): n is AnyInode => n !== undefined);
  }
  
  createFile(path: string, content = ''): boolean {
    const { dirPath, baseName } = this.splitPath(path);
    const parentResolved = this.resolve(dirPath);
    if (!parentResolved) return false;
    
    const parent = this.inodes.get(parentResolved.id);
    if (!parent || parent.type !== 'directory') return false;
    
    // Check write permission on parent directory
    if (!this.checkPermission(parent, 'write')) return false;
    
    // Check if file already exists
    const existing = this.findChild(parent as DirectoryInode, baseName);
    if (existing) return false; // or overwrite? we'll implement touch behavior later
    
    const now = Date.now();
    const file: FileInode = {
      id: uuidv4(),
      type: 'file',
      name: baseName,
      parentId: parent.id,
      content,
      size: content.length,
      permissions: '644',
      owner: this.currentUserId,
      group: this.currentGroup,
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
    };
    
    this.inodes.set(file.id, file);
    (parent as DirectoryInode).children.push(file.id);
    parent.modifiedAt = now;
    
    return true;
  }
  
  // ... other operations: mkdir, remove, move, copy, readFile, writeFile, chmod, chown, etc.
  
  // === Permission Checking ===
  
  private checkPermission(node: AnyInode, operation: 'read' | 'write' | 'execute'): boolean {
    // Superuser (root) can do anything
    if (this.currentUserId === 'root') return true;
    
    const perm = node.permissions;
    const ownerMatch = node.owner === this.currentUserId;
    const groupMatch = node.group === this.currentGroup;
    
    let octal: number;
    if (operation === 'read') octal = 4;
    else if (operation === 'write') octal = 2;
    else octal = 1;
    
    if (ownerMatch) {
      return (parseInt(perm[0]) & octal) !== 0;
    } else if (groupMatch) {
      return (parseInt(perm[1]) & octal) !== 0;
    } else {
      return (parseInt(perm[2]) & octal) !== 0;
    }
  }
  
  // === Utility Methods ===
  
  private normalizePath(path: string): string {
    // collapse multiple slashes, resolve . and .. but keep for later
    return path.replace(/\/+/g, '/');
  }
  
  private getCurrentDirectoryId(): string {
    // return current working directory ID (tracked per user session)
    return this.cwd;
  }
  
  private setCurrentDirectoryId(id: string) {
    this.cwd = id;
  }
  
  // Additional helpers: getParent, findChild, getPath, joinPath, splitPath, etc.
}
```

### 2.4 VFS Initialization

We provide a set of predefined filesystem snapshots (e.g., "default", "hpc-base") that can be loaded at the start of a lab.

```typescript
// lib/vfs/snapshots.ts

import { VFS } from './VFS';

export function loadSnapshot(name: string): VFS {
  const vfs = new VFS();
  
  switch (name) {
    case 'default':
      // Basic Linux filesystem structure
      vfs.mkdir('/home', true);
      vfs.mkdir('/home/guest', true);
      vfs.mkdir('/etc', true);
      vfs.createFile('/etc/passwd', 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:Guest:/home/guest:/bin/bash');
      vfs.createFile('/etc/group', 'root:x:0:\nusers:x:100:');
      vfs.mkdir('/var', true);
      vfs.mkdir('/var/log', true);
      vfs.createFile('/var/log/syslog', 'Sample log entry\nAnother line');
      vfs.mkdir('/tmp', true);
      vfs.mkdir('/proc', true); // simulated as empty
      vfs.setCurrentUser('guest');
      vfs.setCurrentGroup('guest');
      break;
      
    case 'hpc-base':
      // HPC‑oriented structure
      vfs.mkdir('/home', true);
      vfs.mkdir('/home/guest', true);
      vfs.mkdir('/scratch', true);
      vfs.mkdir('/scratch/guest', true);
      vfs.mkdir('/software', true);
      vfs.mkdir('/software/modules', true);
      vfs.createFile('/software/modules/gromacs', '#%Module\nset version 2024.1');
      break;
      
    // ... other snapshots
  }
  
  return vfs;
}
```

### 2.5 State Persistence

The VFS state for a lab is stored in the lab's `LabState` in SpacetimeDB (as JSON). It can be serialized and deserialized.

```typescript
export function serializeVFS(vfs: VFS): string {
  // Convert inodes map to a plain object
  const inodes = Array.from(vfs.inodes.entries());
  return JSON.stringify({
    inodes,
    rootId: vfs.rootId,
    cwd: vfs.getCurrentDirectoryId(),
    currentUserId: vfs.currentUserId,
    currentGroup: vfs.currentGroup,
  });
}

export function deserializeVFS(data: string): VFS {
  const parsed = JSON.parse(data);
  const vfs = new VFS({ skipInit: true }); // option to not create default root
  vfs.inodes = new Map(parsed.inodes);
  vfs.rootId = parsed.rootId;
  vfs.setCurrentDirectoryId(parsed.cwd);
  vfs.currentUserId = parsed.currentUserId;
  vfs.currentGroup = parsed.currentGroup;
  return vfs;
}
```

---

## 3. Command Engine

### 3.1 Architecture

The Command Engine consists of:
- **Parser:** Tokenizes input, handles quotes, pipes, redirections.
- **Command Registry:** Maps command names to implementation functions.
- **Executor:** Runs the parsed command(s) with the VFS and returns output.

### 3.2 Parser

```typescript
// lib/commands/parser.ts

export interface ParsedCommand {
  command: string;
  args: string[];
  redirects: {
    stdout?: string;   // file path for > or >>
    stderr?: string;   // file path for 2> or 2>>
    appendStdout?: boolean;
    appendStderr?: boolean;
  };
  pipeTo?: ParsedCommand; // for chaining
}

export function parse(input: string): ParsedCommand | null {
  // Simplified parser – handles spaces, quotes, pipes, and redirects.
  // Full implementation must handle:
  // - Single and double quotes with escaping
  // - Pipe (|) between commands
  // - Redirections: >, >>, 2>, 2>>, &>, &>>
  // - Background (&) – maybe later
  // - Semicolon (;) for multiple commands – maybe later
}
```

### 3.3 Command Registry

```typescript
// lib/commands/registry.ts

import { VFS } from '../vfs/VFS';

export interface CommandContext {
  vfs: VFS;
  args: string[];
  stdin?: string;          // for piped input
  stdout: (output: string) => void;  // function to collect output
  stderr: (output: string) => void;
  env: Record<string, string>;
  user: string;
  group: string;
}

export type CommandFunction = (ctx: CommandContext) => Promise<number> | number;

export class CommandRegistry {
  private commands: Map<string, CommandFunction> = new Map();
  
  register(name: string, fn: CommandFunction) {
    this.commands.set(name, fn);
  }
  
  get(name: string): CommandFunction | undefined {
    return this.commands.get(name);
  }
  
  has(name: string): boolean {
    return this.commands.has(name);
  }
}
```

### 3.4 Executor

```typescript
// lib/commands/executor.ts

import { parse, ParsedCommand } from './parser';
import { CommandRegistry, CommandContext } from './registry';
import { VFS } from '../vfs/VFS';

export async function execute(
  input: string,
  vfs: VFS,
  registry: CommandRegistry,
  env: Record<string, string> = {}
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const parsed = parse(input);
  if (!parsed) {
    return { stdout: '', stderr: 'parse error', exitCode: 1 };
  }
  
  // Handle pipes recursively
  const result = await executePipeline(parsed, vfs, registry, env);
  return result;
}

async function executePipeline(
  cmd: ParsedCommand,
  vfs: VFS,
  registry: CommandRegistry,
  env: Record<string, string>
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  
  let currentStdin = '';
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  
  const ctx: CommandContext = {
    vfs,
    args: cmd.args,
    stdin: currentStdin,
    stdout: (out) => stdoutChunks.push(out),
    stderr: (err) => stderrChunks.push(err),
    env,
    user: vfs.getCurrentUser(),
    group: vfs.getCurrentGroup(),
  };
  
  const fn = registry.get(cmd.command);
  if (!fn) {
    return { stdout: '', stderr: `command not found: ${cmd.command}`, exitCode: 127 };
  }
  
  const exitCode = await fn(ctx);
  
  // Handle redirections
  let finalStdout = stdoutChunks.join('');
  let finalStderr = stderrChunks.join('');
  
  if (cmd.redirects.stdout) {
    const file = cmd.redirects.stdout;
    const append = cmd.redirects.appendStdout;
    try {
      if (append) {
        const existing = vfs.readFile(file) || '';
        vfs.writeFile(file, existing + finalStdout);
      } else {
        vfs.writeFile(file, finalStdout);
      }
      finalStdout = ''; // output not shown on terminal
    } catch (e) {
      finalStderr += `\n${file}: ${e.message}`;
    }
  }
  
  if (cmd.redirects.stderr) {
    // similar
  }
  
  // If there's a pipe, pass stdout to next command
  if (cmd.pipeTo) {
    const nextCtx = { ...ctx, stdin: finalStdout };
    const nextResult = await executePipeline(cmd.pipeTo, vfs, registry, env);
    return {
      stdout: nextResult.stdout,
      stderr: finalStderr + nextResult.stderr,
      exitCode: nextResult.exitCode,
    };
  }
  
  return { stdout: finalStdout, stderr: finalStderr, exitCode };
}
```

### 3.5 Command Implementations

Each command is a separate module exporting a function that matches `CommandFunction`.

**Example: `ls` command**

```typescript
// lib/commands/impl/ls.ts

import { CommandFunction } from '../registry';

export const ls: CommandFunction = (ctx) => {
  const { vfs, args, stdout, stderr } = ctx;
  
  // Parse options
  let showAll = false;
  let longFormat = false;
  const paths: string[] = [];
  
  for (const arg of args.slice(1)) { // args[0] is 'ls'
    if (arg === '-a') showAll = true;
    else if (arg === '-l') longFormat = true;
    else if (arg.startsWith('-')) {
      stderr(`ls: invalid option -- ${arg}`);
      return 1;
    } else {
      paths.push(arg);
    }
  }
  
  // If no path given, use current directory
  if (paths.length === 0) paths.push('.');
  
  let exitCode = 0;
  for (const path of paths) {
    const resolved = vfs.resolve(path);
    if (!resolved) {
      stderr(`ls: cannot access '${path}': No such file or directory`);
      exitCode = 1;
      continue;
    }
    
    const node = vfs.getInode(resolved.id);
    if (node.type === 'file' || node.type === 'symlink') {
      // Just print the name
      stdout(node.name);
    } else {
      // List directory contents
      const children = vfs.listDirectory(path);
      if (!children) {
        stderr(`ls: cannot open directory '${path}': Permission denied`);
        exitCode = 1;
        continue;
      }
      
      let filtered = children;
      if (!showAll) {
        filtered = children.filter(n => !n.name.startsWith('.'));
      }
      
      if (longFormat) {
        // Format like `ls -l`
        for (const n of filtered) {
          const perms = n.permissions;
          const type = n.type === 'directory' ? 'd' : (n.type === 'symlink' ? 'l' : '-');
          const links = 1; // placeholder
          const owner = n.owner;
          const group = n.group;
          const size = n.type === 'file' ? (n as FileInode).size : 0;
          const mtime = new Date(n.modifiedAt).toLocaleString();
          stdout(`${type}${perms} ${links} ${owner} ${group} ${size} ${mtime} ${n.name}`);
        }
      } else {
        const names = filtered.map(n => n.name).join('  ');
        stdout(names);
      }
    }
  }
  
  return exitCode;
};
```

**Other commands** follow similar patterns:
- `cd`: changes vfs current directory (needs to be tracked per session)
- `pwd`: prints current directory path
- `mkdir`, `rmdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, etc.
- Special commands: `sudo` (simulated by checking if user is in sudoers, then executing as root), `su` (switch user), etc.

### 3.6 Built‑in Commands

We maintain a list of all supported commands in a central registry.

```typescript
// lib/commands/index.ts

import { CommandRegistry } from './registry';
import { ls } from './impl/ls';
import { cd } from './impl/cd';
import { pwd } from './impl/pwd';
// ... import all

const registry = new CommandRegistry();

registry.register('ls', ls);
registry.register('cd', cd);
registry.register('pwd', pwd);
// ...

export { registry };
```

---

## 4. Integration with Terminal UI

### 4.1 useTerminal Hook

The `useTerminal` hook manages the terminal's state: input, history, and execution.

```typescript
// hooks/useTerminal.ts

import { useState, useCallback, useRef } from 'react';
import { execute } from '../lib/commands/executor';
import { registry } from '../lib/commands';
import { vfs } from '../lib/vfs/VFS';
import { useLabStore } from '../stores/labStore';

export interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: number;
}

export function useTerminal(initialVFS: VFS) {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [vfs] = useState(initialVFS);
  const historyIndexRef = useRef(-1);
  const commandHistoryRef = useRef<string[]>([]);
  
  const executeCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'input', content: cmd, timestamp: Date.now() }]);
    commandHistoryRef.current.push(cmd);
    historyIndexRef.current = commandHistoryRef.current.length;
    
    // Execute
    const { stdout, stderr, exitCode } = await execute(cmd, vfs, registry);
    
    // Add output
    const newLines: TerminalLine[] = [];
    if (stdout) {
      stdout.split('\n').forEach(line => {
        if (line) newLines.push({ type: 'output', content: line, timestamp: Date.now() });
      });
    }
    if (stderr) {
      stderr.split('\n').forEach(line => {
        if (line) newLines.push({ type: 'error', content: line, timestamp: Date.now() });
      });
    }
    setHistory(prev => [...prev, ...newLines]);
    
    // Check lab progress (if any)
    const { currentLab, labType, verifyLabStep } = useLabStore.getState();
    if (currentLab && labType === 'guided') {
      verifyLabStep(cmd);
    }
  }, [vfs]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndexRef.current > 0) {
        historyIndexRef.current--;
        setInput(commandHistoryRef.current[historyIndexRef.current]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
        historyIndexRef.current++;
        setInput(commandHistoryRef.current[historyIndexRef.current]);
      } else {
        historyIndexRef.current = commandHistoryRef.current.length;
        setInput('');
      }
    }
  }, [input, executeCommand]);
  
  return {
    history,
    input,
    setInput,
    handleKeyDown,
    vfs,
  };
}
```

### 4.2 Terminal Component

```tsx
// components/terminal/Terminal.tsx

import React, { useRef, useEffect } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import { Prompt } from './Prompt';
import { OutputLine } from './OutputLine';

interface TerminalProps {
  vfs: VFS; // initial VFS (could be from lab)
}

export function Terminal({ vfs }: TerminalProps) {
  const { history, input, setInput, handleKeyDown } = useTerminal(vfs);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  
  return (
    <div className="terminal bg-brutal-black border-3 border-brutal-white p-4 font-mono text-brutal-white h-full overflow-y-auto">
      {history.map((line, i) => (
        <OutputLine key={i} line={line} />
      ))}
      <div className="flex">
        <Prompt />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-brutal-white font-mono"
          autoFocus
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
```

---

## 5. Tab Completion

### 5.1 Completion Logic

```typescript
// lib/commands/completion.ts

export function getCompletions(partial: string, vfs: VFS, registry: CommandRegistry): string[] {
  const tokens = partial.split(' ');
  const lastToken = tokens[tokens.length - 1];
  
  // If it's the first token (or after pipe/semicolon), complete command names
  if (tokens.length === 1 || partial.endsWith(' ')) {
    // command completion
    return Array.from(registry.commands.keys())
      .filter(cmd => cmd.startsWith(lastToken))
      .map(cmd => cmd + ' ');
  } else {
    // file/directory completion
    const resolved = vfs.resolve(lastToken, false); // don't follow symlinks for completion
    if (!resolved) {
      // Try to complete partial path
      const { dirPath, baseName } = splitPath(lastToken);
      const dir = vfs.resolve(dirPath);
      if (!dir) return [];
      
      const children = vfs.listDirectory(dirPath);
      if (!children) return [];
      
      return children
        .filter(child => child.name.startsWith(baseName))
        .map(child => {
          const full = lastToken.slice(0, -baseName.length) + child.name;
          return child.type === 'directory' ? full + '/' : full + ' ';
        });
    }
    return [];
  }
}
```

### 5.2 Integration

In the terminal input, when Tab is pressed, call `getCompletions` and update input.

---

## 6. Error Handling

- Commands should return appropriate exit codes and write errors to `stderr`.
- The executor catches exceptions and returns a generic error.
- VFS operations throw typed errors (e.g., `PermissionDenied`, `NoSuchFile`) which commands can catch and report.

---

## 7. Testing

### 7.1 Unit Tests for Commands

```typescript
// lib/commands/impl/ls.test.ts

import { VFS } from '../../vfs/VFS';
import { ls } from './ls';

describe('ls command', () => {
  it('lists files in current directory', () => {
    const vfs = new VFS();
    vfs.createFile('/home/file1.txt');
    vfs.createFile('/home/file2.txt');
    vfs.setCurrentDirectory('/home');
    
    const stdout: string[] = [];
    const stderr: string[] = [];
    
    ls({
      vfs,
      args: ['ls'],
      stdout: (out) => stdout.push(out),
      stderr: (err) => stderr.push(err),
      env: {},
      user: 'guest',
      group: 'guest',
    });
    
    expect(stdout.join(' ')).toContain('file1.txt');
    expect(stdout.join(' ')).toContain('file2.txt');
    expect(stderr).toEqual([]);
  });
});
```

### 7.2 Integration Tests for Pipes

```typescript
// lib/commands/executor.test.ts

import { execute } from './executor';
import { registry } from './index';
import { VFS } from '../vfs/VFS';

it('handles pipes', async () => {
  const vfs = new VFS();
  vfs.createFile('/test.txt', 'apple\nbanana\ncherry');
  vfs.setCurrentDirectory('/');
  
  const result = await execute('cat test.txt | grep a', vfs, registry);
  expect(result.stdout).toBe('apple\n');
  expect(result.exitCode).toBe(0);
});
```

---

## 8. Implementation Checklist

- [ ] Implement VFS core (inode map, path resolution, permission checks).
- [ ] Write VFS snapshot loader.
- [ ] Build command parser (handling quotes, pipes, redirections).
- [ ] Create command registry and base command interface.
- [ ] Implement essential commands (ls, cd, pwd, mkdir, touch, cp, mv, rm, cat, grep, etc.).
- [ ] Implement executor with pipe and redirection support.
- [ ] Integrate VFS with command context.
- [ ] Build useTerminal hook.
- [ ] Add tab completion.
- [ ] Write unit and integration tests.
- [ ] Ensure serialization for lab state persistence.

---

**This document provides a complete blueprint for the Command Engine and VFS. All team members (including Antigravity) must adhere to these specifications when implementing terminal functionality.**
