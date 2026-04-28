# RFC: Kernel and Userland Architecture Split

## 1. Introduction
Currently, The Terminal Simulator executes commands that directly import and mutate the Virtual File System (VFS) and the React Zustand state (`terminalStore`). While this works for basic shell parsing, it fundamentally breaks the Linux OS illusion. In a real system, commands (Userland) are unprivileged and must request the Operating System (Kernel) to perform actions via System Calls (Syscalls).

This RFC proposes an architectural shift to introduce a **Kernel Boundary**, abstracting the VFS, process state, and I/O into a secure, centralized `Kernel` class.

## 2. Core Concepts

### 2.1 The Kernel Object
The `Kernel` will be the single source of truth for the system. It will wrap:
- The `VFS` instance.
- The `ProcessManager` (abstracting `terminalStore`).
- The `FileDescriptorTable` (handling I/O streams).

Commands will no longer be passed the `VFS` directly. Instead, they will be given a `SyscallInterface`.

### 2.2 Process Control Block (PCB)
Every executing command will be represented by a PCB inside the Kernel. The PCB tracks:
- `PID` (Process ID)
- `UID` / `GID` (User and Group IDs for permissions)
- `CWD` (Current Working Directory)
- `FDs` (A map of open File Descriptors, default: 0=stdin, 1=stdout, 2=stderr)

### 2.3 System Calls (Syscalls)
When a command wants to read a file, it cannot call `vfs.readFile()`. It must call:
`await syscalls.sys_read(fd, bufferSize)`

When a command wants to print to the screen, it cannot just return a `{ output: string }`. It must call:
`await syscalls.sys_write(1, "Hello World")` (where 1 is stdout).

## 3. Implementation Plan

### Phase 1: Foundation (The PoC)
- Create `Kernel.ts` and `SyscallInterface`.
- Implement basic I/O syscalls (`sys_write`, `sys_read`).
- Implement basic Process syscalls (`sys_exit`, `sys_getpid`).

### Phase 2: Command Migration
- Gradually rewrite commands in `src/features/command-engine/commands/` to accept a `SyscallInterface` instead of a `CommandContext`.
- Example: `echo` writes to FD 1 instead of returning a string.

### Phase 3: The Shell Engine
- Update `executor.ts` to use `sys_fork` and `sys_exec` to spawn commands.
- Update pipeline execution (`|`) to pipe the output stream of FD 1 from Process A directly into FD 0 of Process B, enabling true streaming.

## 4. PoC Example

```typescript
// How a command looks today:
export const echo = async (args, context) => {
    return { output: args.join(' '), exitCode: 0 };
};

// How a command will look in the new architecture:
export const echo_kernel = async (args, syscalls) => {
    await syscalls.sys_write(1, args.join(' ') + '\n');
    await syscalls.sys_exit(0);
};
```
