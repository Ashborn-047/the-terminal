# Technical Roadmap to 95% Linux Fidelity

## 2.1 — Priority Matrix

| Gap | Fidelity Impact (H/M/L) | Implementation Effort (H/M/L) | Priority Tier |
|---|---|---|---|
| Inode/Dentry Conflation & Hardlink Bug | H | M | P0 |
| `findParentId()` `O(n)` Performance Bottleneck | H | L | P0 |
| Signal Handler Memory Leak (`terminalStore.ts`) | H | L | P0 |
| Shell Control Flow Parsing (`if`/`for`/`while`) | H | H | P0 |
| Flat Process Model (Missing PPID/States) | H | M | P1 |
| Missing Critical Commands (`systemctl`, `ip`, `mount`) | H | H | P1 |
| Interactive Editor Missing (`vim`/`nano`) | H | H | P1 |
| Per-Process File Descriptor Tables | M | M | P1 |
| Block & Character Device Simulation | M | M | P2 |
| ACL & SELinux / MAC Simulation | M | H | P2 |
| Symlink Loop Handling & Edge Cases | M | L | P2 |
| Incomplete Command Flags (`find -exec`, `ls -i`) | M | M | P3 |

## 2.2 — Phase Implementation Plan

### Phase A (P0): True Inode System & Core VFS Fixes
- **Goals**: Resolve the hardlink bug, decouple dentries from inodes, and fix the `O(n)` bottleneck in path resolution.
- **Files**: `src/features/vfs/types.ts`, `src/features/vfs/vfs.ts`, `src/features/vfs/snapshots.ts`
- **New Types**: `Dentry`, refactored `Inode` (adding `ino`, `nlink`).
- **Refactors**: `vfs.ts` must manage an Inode table and a separate directory structure. `findParentId()` must be replaced by traversing dentries directly or maintaining an `O(1)` inverted index.
- **Complexity**: High (requires data migration for existing snapshots).

### Phase B (P0): Shell Control Flow & AST Parser
- **Goals**: Replace the primitive regex-based parser with an AST parser supporting `if/then/else`, `for`, `while`, and functions.
- **Files**: `src/features/command-engine/parser.ts`, `src/features/command-engine/executor.ts`
- **New Interfaces**: AST Node interfaces (`CommandNode`, `IfNode`, `PipelineNode`).
- **Refactors**: `executor.ts` becomes a true AST visitor/interpreter.
- **Complexity**: High.

### Phase C (P1): True Process Tree & Signal Cleanup
- **Goals**: Implement proper process lifecycle (fork/exec/wait), states (R/S/D/Z/T), process groups, and fix the signal memory leak.
- **Files**: `src/stores/terminalStore.ts`, `src/features/command-engine/types.ts`
- **Refactors**: Add `ppid`, `pgid`, and `state` to `Process`. Implement a `waitpid` equivalent. Fix line 61 in `terminalStore.ts` to sweep dead signal handlers on process exit.
- **Complexity**: Medium.

### Phase D (P1): File Descriptor Table Per-Process
- **Goals**: Isolate I/O redirection. Instead of passing strings around in memory, processes write to simulated FDs (0, 1, 2) which map back to VFS inodes or pipes.
- **Files**: `src/features/command-engine/types.ts`, `src/features/vfs/vfs.ts`
- **Complexity**: Medium.

### Phase E (P1): Missing Command Implementations
- **Goals**: Build the missing RHCSA command toolkit.
- **Files**: `src/features/command-engine/commands/*`
- **Priorities**: `systemctl` (stub service manager), `find` (add `-exec`), `ps` (add `aux`), interactive `vim` simulation.
- **Complexity**: High (volume of work).

### Phase F (P2): Mount Namespace Simulation
- **Goals**: Support `mount`, `umount`, and `chroot`.
- **Files**: `src/features/vfs/vfs.ts`
- **Complexity**: Medium.

### Phase G (P2): Device Model
- **Goals**: Support `/dev/sda`, `/dev/null`, `/dev/tty` with major/minor numbers.
- **Files**: `src/features/vfs/types.ts`, `src/features/vfs/vfs.ts`
- **Complexity**: Medium.

### Phase H (P2): SELinux/MAC Simulation Layer
- **Goals**: Add security contexts to inodes and processes, simulate enforcing/permissive modes.
- **Files**: `src/features/vfs/types.ts`, `src/features/command-engine/executor.ts`
- **Complexity**: High.

## 2.3 — Technical Blueprints

### Blueprint: Phase A (True Inode System)

**Refactor Pattern**: Split `Inode` into `Inode` and `Dentry`. An `Inode` represents the data and permissions. A `Dentry` represents the name and structure in the tree.

```typescript
// src/features/vfs/types.ts

// BEFORE (broken hardlinks)
export interface LegacyInode {
    id: string; // Used as both inode number and UUID
    name: string; // Dentry property
    children?: string[]; // Array of UUIDs
    content?: string;
    // ... permissions
}

// AFTER
export interface Inode {
    ino: number;          // Unique inode number
    nlink: number;        // Hardlink count
    type: FileType;
    content?: string;     // Raw data
    permissions: InodePermissions;
    ownerId: string;
    groupId: string;
    size: number;
    createdAt: number;
    modifiedAt: number;
}

export interface Dentry {
    name: string;
    ino: number;          // Points to Inode.ino
    children?: Record<string, Dentry>; // Directory structure: name -> Dentry
}

export interface VFSSnapshot {
    rootDentry: Dentry;
    inodeTable: Record<number, Inode>;
}
```

**Implementation Steps in `vfs.ts`**:
1. Change `this.inodes` to `this.inodeTable`.
2. Add `this.rootDentry`.
3. Rewrite `resolve()` to traverse `Dentry.children` matching by `name`, yielding the target `Dentry`, then looking up the `ino` in `inodeTable`.
4. Rewrite `ln()` to simply add a new key to the parent directory's `Dentry.children` that points to the existing target `ino`, and `inodeTable[ino].nlink++`. No UUID copying.
5. Fix `findParentId()` by passing the parent path context down during resolution, entirely eliminating the need for a global reverse lookup, solving the `O(n)` issue.

### Blueprint: Phase B (Shell Control Flow)

**Refactor Pattern**: Replace regex parsing with a tokenizer and AST builder.

```typescript
// src/features/command-engine/parser.ts
export interface ASTNode { type: string; }
export interface CommandNode extends ASTNode { type: 'Command'; args: string[]; }
export interface IfNode extends ASTNode {
    type: 'If';
    condition: ASTNode;
    thenBranch: ASTNode[];
    elseBranch?: ASTNode[];
}

// src/features/command-engine/executor.ts
export class Interpreter {
    async visit(node: ASTNode, context: CommandContext): Promise<number> {
        if (node.type === 'If') {
            const exitCode = await this.visit((node as IfNode).condition, context);
            if (exitCode === 0) {
                return this.visitBlock((node as IfNode).thenBranch, context);
            } else if ((node as IfNode).elseBranch) {
                return this.visitBlock((node as IfNode).elseBranch!, context);
            }
            return 0;
        }
        // ...
    }
}
```

### Blueprint: Phase C (True Process Tree)

**Refactor Pattern**: Add `ppid` and `state`. Modify `terminalStore.ts` to handle signals cleanly.

```typescript
// src/features/command-engine/types.ts
export type ProcessState = 'R' | 'S' | 'D' | 'Z' | 'T';

export interface Process {
    pid: number;
    ppid: number;
    pgid: number;
    name: string;
    user: string;
    state: ProcessState;
    exitCode?: number;
}
```
**Fixing the Memory Leak (`terminalStore.ts`)**:
```typescript
// Inside terminalStore.ts
removeProcess: (pid) => set((state) => {
    // FIX: Cleanup signal handlers to prevent memory leak
    signalHandlers.delete(pid);
    return { processes: state.processes.filter((p) => p.pid !== pid) };
}),
```

### Blueprint: Phase D (File Descriptor Table)

**Refactor Pattern**: Maintain an FD table per process in `CommandContext`.

```typescript
// src/features/command-engine/types.ts
export interface FileDescriptor {
    fd: number;
    inodeId: number; // Pointer to VFS
    offset: number;
    mode: 'r' | 'w' | 'rw';
}

export interface CommandContext {
    // ...
    fdTable: Record<number, FileDescriptor>; // 0: stdin, 1: stdout, 2: stderr
}
```

## 2.4 — Migration Strategy

**Snapshot Upgrades**:
To prevent breaking the 38+ existing labs, write a migration script (`src/features/vfs/migrations.ts`) that runs on `VFS` initialization. It should detect legacy snapshots (those with UUID `rootId` and flat `inodes` objects) and convert them dynamically to the new `inodeTable` + `Dentry` structure.

**Feature Flags**:
Use Zustand to store developer feature flags (e.g., `USE_AST_PARSER=false`). Build Phase B in parallel and flip the flag when tests pass, allowing incremental deployment without breaking production labs.

## 2.5 — Verification Criteria

- **Phase A (Hardlinks)**:
  - Test: `src/features/vfs/__tests__/hardlink.test.ts`
  - Case: Create `/dir/a`, run `ln /dir/a /dir/b`. Verify `a` and `b` share the same `ino`. Append to `a`, verify `b` reads the appended content. Remove `a`, verify `b` still exists and `nlink` drops to 1.
- **Phase A (Performance)**:
  - Test: `src/features/vfs/__tests__/performance.test.ts`
  - Case: Generate 10,000 files in a nested structure. Assert path resolution takes < 5ms (proving `O(n)` scan is removed).
- **Phase B (AST)**:
  - Test: `src/features/command-engine/__tests__/parser.test.ts`
  - Case: Parse `if [ -f file ]; then echo "yes"; fi`. Verify correct AST generation and execution.
- **Phase C (Zombies)**:
  - Test: `src/features/command-engine/__tests__/process.test.ts`
  - Case: Parent spawns background child. Child exits. Verify child enters state `Z` (Zombie) until parent calls `wait` or exits itself.