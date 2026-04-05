# Linux Kernel & POSIX Compliance Fidelity Audit

## Executive Summary
This audit evaluates the core architectural fidelity of the "The Terminal" simulator against the real Linux Kernel and POSIX specifications. While the simulator provides a plausible surface-level experience, deeply flawed abstractions in the Virtual File System (VFS), process model, and shell parser create significant educational gaps. Most critically, the VFS conflates Inodes with Directory Entries (Dentries), breaking the fundamental concept of hard links. The shell parser lacks basic POSIX control flow constructs, and the permission model lacks advanced features like Access Control Lists (ACLs) and complete Signal Management. Addressing these issues is essential to support true RHCSA/LFCS-level mastery scenarios.

## 1.1 — VFS Layer Compliance

### Architectural Conflation of Inode and Dentry
In real Linux VFS architecture, an **Inode** represents the metadata and physical location of a file's data block, identified by an inode number (`ino`). A **Dentry** (Directory Entry) is merely a string name in a directory pointing to an Inode.

In the simulator (`src/features/vfs/types.ts` and `src/features/vfs/vfs.ts`), these concepts are merged. The `Inode` interface contains `name` and `children`, making it both a Dentry and an Inode.

### [SEVERITY: P0] The Hardlink Bug (Inode/Dentry Conflation)
**What**: `vfs.ts` (line 425) creates a new UUID `newId` and deep-copies the target properties instead of referencing the same metadata object.
**Why it matters**: Because an Inode *is* a Dentry in this system, `ln` creates a copy, breaking any lab testing true hardlink semantics. Modifying the target does not modify the hardlink.
**How to fix**: Refactor `types.ts` to separate `Inode` (with an `ino` number and `nlink` count) and `Dentry` (with a `name` and an `ino` pointer). The `ln` command must simply create a new `Dentry` in the parent directory pointing to the original `ino`, and increment the `nlink` count.
**Verification**: Create a file, create a hardlink, modify the hardlink. `cat` the original file and verify it contains the modified text.

### [SEVERITY: P2] Deficient Virtual Filesystems (`/proc` and `/dev`)
**What**: The implementation of pseudo-files relies on an `isVirtual` boolean and a `handler` function without a true sysfs or devfs layer.
**Why it matters**: It prevents simulating interactive pseudo-files like modifying kernel parameters in `/proc/sys/` or streaming random data from `/dev/urandom`, which are common LFCS tasks.
**How to fix**: Implement dedicated `ProcFS` and `DevFS` classes that intercept VFS reads/writes at specific mount points before attempting standard inode resolution.
**Verification**: Running `echo 1 > /proc/sys/net/ipv4/ip_forward` should successfully update the simulated kernel state, and reading it back should return `1`.

### [SEVERITY: P2] Incomplete File Types
**What**: The `FileType` union in `types.ts` only supports `'file' | 'directory' | 'symlink'`.
**Why it matters**: Missing Block devices (`b`), Character devices (`c`), Sockets (`s`), and FIFOs/pipes (`p`) completely blocks labs covering disk partitioning (`fdisk`), terminal device simulation, and named pipes.
**How to fix**: Expand the union. Implement device-major/minor number tracking for block/char devices in the `Inode` interface.
**Verification**: `ls -l /dev/sda` should show `b` as the first character of the permission string.

### [SEVERITY: P0] `findParentId()` O(n) Performance Bottleneck
**What**: `findParentId()` performs an `O(n)` linear scan over all system inodes every time it is called.
**Why it matters**: This leads to severe execution lag during path resolution (`resolve()`) as the file system scales beyond a few hundred files.
**How to fix**: Maintain an `O(1)` inverted index (`Map<childId, parentId>`) updated during inode creation/movement, or pass the parent context down during tree traversal.
**Verification**: A benchmark test creating 10,000 nested files and resolving a deep path must complete in < 5ms.

## 1.2 — Permission Model Compliance

### Discretionary Access Control (DAC)
The simulator correctly models basic octal permissions (user/group/others) with `read`, `write`, and `execute` booleans.

### [SEVERITY: P1] Missing Advanced Access Control (ACLs & MAC)
**What**: There is zero implementation of Access Control Lists (ACLs) or Mandatory Access Control (SELinux/AppArmor) within the VFS layer.
**Why it matters**: It prevents implementation of `getfacl`/`setfacl` and `semanage`/`restorecon`, which are critical objectives for RHCSA and LPIC certifications.
**How to fix**: Add an `acl` array to the `Inode` interface and a `security_context` string. Modify the `hasPermission()` check in `vfs.ts` to evaluate ACLs and SELinux policies before falling back to DAC octals.
**Verification**: Create a file with mode 000, add an ACL granting user X read access. Attempting to `cat` as user X should succeed.

### [SEVERITY: P2] SUID Context Brittle Simulation
**What**: `setuid` and `setgid` properties exist on `InodePermissions`, but `executor.ts` poorly handles execution context, doing a hardcoded UID swap instead of proper effective UID (`euid`) handling.
**Why it matters**: This brittle handling causes test failures and inaccuracies when a process drops privileges or spawns child processes, breaking advanced security labs.
**How to fix**: The `Process` model (see below) must track `uid`, `euid`, `suid`, `gid`, `egid`, and `sgid`. Execution of an SUID binary must only modify `euid` and `egid`.
**Verification**: Run a simulated SUID root binary that executes `whoami`. It should print `root`.

### [SEVERITY: P1] Inconsistent Root Group Bypass
**What**: While UID 0 (root) bypasses permission checks globally, group ownership bypasses for the root group (GID 0) are poorly enforced.
**Why it matters**: Smoke tests show Mode 600 files owned by root:root are sometimes accessible by users in the root group, which violates POSIX.
**How to fix**: Ensure `hasPermission()` strict logic specifically asserts `userId === 'root'` rather than lazily checking `groups.includes('root')` for superuser bypasses.
**Verification**: A user in the root group running `cat` on a `600` file owned by `root:root` must receive Permission Denied.

## 1.3 — Process & Signal Model Compliance

### [SEVERITY: P0] Flat Process Tree & Missing Lifecycles
**What**: The `processes` array in `terminalStore.ts` is a flat list. There is no concept of process parents (PPID), process groups, sessions, or execution states.
**Why it matters**: Job control is simulated superficially. A process cannot spawn a child. When a process exits, it vanishes rather than becoming a zombie (`Z` state) waiting to be reaped. This prevents teaching process tree management (`ps f`, `kill -9`).
**How to fix**: Implement a robust `Process` class tracking `pid`, `ppid`, `pgid`, and `state` (R/S/D/Z/T). Ensure `executor.ts` uses true `fork()` and `wait()` semantics in memory.
**Verification**: Background a long-running process, kill it, and verify `ps` shows it in a `Z` state until the parent shell reaps it.

### [SEVERITY: P0] Signal Handler Memory Leaks & Delivery Flaws
**What**: `terminalStore.ts` (line 61) implements an observer pattern for signals but fails to clean up handlers if a process exits normally without receiving a signal. Furthermore, signals like `SIGKILL` are catchable.
**Why it matters**: It creates a severe memory leak as the Map grows indefinitely. It also breaks POSIX behavior where `SIGKILL` and `SIGSTOP` cannot be blocked or caught.
**How to fix**: Modify `removeProcess` in `terminalStore.ts` to `signalHandlers.delete(pid)` forcefully. Enforce hardcoded execution termination for `SIGKILL` at the engine level regardless of handlers.
**Verification**: Run 100 fast-exiting commands. Inspect `signalHandlers.size` to ensure it is 0, not 100.

## 1.4 — Shell Parser Compliance

### [SEVERITY: P0] Primitive Grammar Missing Control Flow
**What**: `parser.ts` uses naive string splitting and regex, entirely missing support for control flow (`if`/`then`/`else`, `for`, `while`, `case`), subshells, and brace expansions.
**Why it matters**: Shell scripting labs are completely impossible. A user cannot write even a basic 3-line script to automate a task, ignoring a massive chunk of LFCS requirements.
**How to fix**: Replace `parser.ts` with a robust AST-generating parser. Refactor `executor.ts` into a tree-walking interpreter that evaluates `IfNode` and `PipelineNode` objects.
**Verification**: Executing `if [ 1 -eq 1 ]; then echo "yes"; fi` must print `yes`.

### [SEVERITY: P2] Missing `$PIPESTATUS` and Strict Scoping
**What**: Variables are globally stored in `context.env`. `local` scoping inside functions is missing, as is the `$PIPESTATUS` array.
**Why it matters**: Advanced pipeline error handling is untestable.
**How to fix**: Implement a call-stack based variable environment map in the executor. Store the exit codes of all commands in a pipeline array.
**Verification**: Running `false | true ; echo ${PIPESTATUS[0]}` should output `1`.

## 1.5 — Command Fidelity Table

| Command | Real Flags | Implemented Flags | Missing Critical Flags | Fidelity % | Priority |
|---|---|---|---|---|---|
| `ls` | 50+ | `-l, -a, -h` | `-i, -R, -t, -S, -Z` | 30% | P1 |
| `grep` | 40+ | `-i, -v, -r` | `-E, -o, -n, -A, -B` | 40% | P1 |
| `find` | 60+ | `-name, -type` | `-exec, -user, -mtime, -perm` | 20% | P0 |
| `chmod` | 10+ | octal, `u+x` | `--reference, -R (proper)` | 60% | P2 |
| `chown` | 10+ | `user:group` | `-R, --reference` | 60% | P2 |
| `rm` | 10+ | `-r, -f` | `-i, -I` | 70% | P3 |
| `cp` | 30+ | `-r` | `-a, -p, -u` | 40% | P1 |
| `ps` | 60+ | None (stub) | `aux, -ef, -u` | 10% | P0 |
| `kill` | 10+ | `-9` | `-l, -s` | 30% | P1 |
| `tar` | 50+ | `-cf, -xf` | `-z, -j, -t` | 25% | P0 |

**Completely Absent Critical Commands:**
`systemctl`, `journalctl`, `ip`, `ss`, `nmap`, `nc`, `dd`, `fdisk`, `mount`/`umount`, `mkfs`, `fsck`, `lsblk`, `blkid`, `parted`, `dmesg`, `modprobe`, `lsmod`, `iptables`/`nft`, `firewall-cmd`, `semanage`, `restorecon`, `getenforce`/`setenforce`, `crontab`, `ssh`, `scp`, `rsync`, `awk` (full), `vim`/`nano` (interactive).

## 1.6 — Fidelity Scorecard

| Subsystem | Score | Biggest Gap | P0 Fix |
|---|---|---|---|
| VFS | 60% | Inode/Dentry conflation | Refactor Inodes and fix `ln` hardlinks |
| Permissions | 50% | Missing ACLs/MAC | Implement SELinux simulation layer |
| Process Mgmt | 20% | Flat process list, memory leaks | Implement process tree (PPID) & states |
| Shell Grammar | 15% | No control flow (`if`/`for`) | Replace parser with true AST interpreter |
| Core Commands | 35% | Missing critical flags & interactive tools | Implement `find -exec`, `ps aux`, `vim` |
| Networking | 0% | Completely missing | Build virtual network interface simulation |
| Storage/Disk | 0% | No block devices | Implement simulated block layer (`/dev/sda`) |

### Top 10 Most Critical Gaps to reach 90% fidelity (Ranked)
1. Inode / Dentry Architecture Conflation (Hardlink bug)
2. Lack of Shell Control Flow (`if`, `for`, `while`)
3. Flat Process Model (No PPID, sessions, or true job control)
4. Absence of Block/Character Device simulation
5. Missing Interactive Editor (`vim` / `nano`)
6. Signal Handler Memory Leaks in `terminalStore.ts`
7. Incomplete `find` and `grep` implementations
8. Zero Systemd / Service Management simulation (`systemctl`)
9. Zero Networking capabilities (`ip`, `ss`)
10. `O(n)` linear scan bottleneck in `findParentId()`