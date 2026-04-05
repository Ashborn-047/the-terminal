# Educational Value Assessment & Curriculum Transformation Strategy

## 3.1 — Certification Coverage Matrix

### RHCSA (EX200) Coverage
| Exam Objective | Covered by Module # | Covered by Lab # | Coverage Quality | Gap Notes |
|---|---|---|---|---|
| Understand and use essential tools (`tar`, `grep`, `awk`) | 1, 3, 8 | 3.1, 8.2 | Partial | `awk` is superficial, missing full regex. `tar` lacks bzip2/xz. |
| Operate running systems (boot/reboot/targets) | None | None | None | `systemctl isolate` missing. |
| Configure local storage (`fdisk`, `mkfs`) | None | None | None | Block devices not simulated. |
| Create and configure file systems (`mount`) | None | None | None | Missing `mount`/`umount`. |
| Deploy, configure, and maintain systems (Time, networking) | 9 | 9.1 | Partial | Static IP assignment missing. |
| Manage basic networking (`ip`, `ss`) | None | None | None | `ip` command absent. |
| Manage users and groups | 6 | 6.1, 6.2 | Full | Good coverage of UID/GID. |
| Manage security (SELinux, firewall) | None | None | None | Huge gap. No MAC or iptables. |

**Estimated RHCSA Coverage: ~25%**

### LFCS Coverage
| Exam Objective | Covered by Module # | Covered by Lab # | Coverage Quality | Gap Notes |
|---|---|---|---|---|
| Essential Commands | 1, 2, 3 | Multiple | Partial | Missing `sed` deep dive, `find -exec`. |
| Operation of Running Systems (Process management) | 7 | 7.1, 7.2 | Partial | Missing nice/renice, top. |
| User and Group Management | 6 | 6.1, 6.2 | Full | SUID/SGID covered. |
| Networking | 9 | 9.1 | None | `ping` exists, but routing/DNS config missing. |
| Service Configuration (SSH, HTTPD) | None | None | None | No service daemon simulation. |
| Storage Management | 8 | 8.1 | None | LVM, quotas missing. |

**Estimated LFCS Coverage: ~30%**

### LPIC-1 Coverage
| Exam Objective | Covered by Module # | Covered by Lab # | Coverage Quality | Gap Notes |
|---|---|---|---|---|
| System Architecture (Hardware, Boot) | None | None | None | BIOS/UEFI/GRUB not covered. |
| Linux Installation and Package Management | 10 | 10.1 | Partial | Simulated `apt`, missing `rpm`/`dpkg`. |
| GNU and Unix Commands | 1-3 | Multiple | Full | Excellent core utils coverage. |
| Devices, Linux Filesystems, FHS | 2 | 2.1 | Partial | FHS covered, devices missing. |
| Shells and Scripting | 5 | 5.1 | Partial | Missing loops/conditionals. |

**Estimated LPIC-1 Coverage: ~45%**

## 3.2 — Module Sequencing Audit

### [SEVERITY: P1] UI/Content Module Mismatch
**What**: `src/data/modules.ts` defines exactly 11 modules for the UI rendering, but `src/data/labs/initial.ts` defines labs that reference `module: 18`.
**Why it matters**: When a user completes the labs in Module 11 and progresses, the UI attempts to lookup metadata for Module 12. Because it does not exist in the array, the UI will crash or render empty states, completely blocking progression.
**How to fix**: Consolidate into a single source of truth. Expand the `MODULES` array in `modules.ts` to include entries up to 18 (and eventually up to 21 based on the proposed roadmap below).
**Verification**: Verify that mapping over all unique module IDs in `initial.ts` yields a valid object from `MODULES`.

### [SEVERITY: P2] Pedagogical Sequencing Flaw: Permissions vs Piping
**What**: Currently, Module 3 introduces `grep` and advanced piping before Module 4 teaches permissions.
**Why it matters**: Understanding standard error redirection (`2> /dev/null`) — which is often taught alongside piping to filter out "Permission denied" errors when searching `/` — is impossible without first understanding *why* permission is denied (DAC model).
**How to fix**: Swap the order. Move Permissions (currently Module 4) to become Module 3, and Power Tools (currently Module 3) to become Module 4.
**Verification**: Ensure lab prerequisites are updated to match the new sequence so students aren't locked out.

## 3.3 — Lab Quality Deep Dive

### Guided Labs
- **Critique**: Instructions focus heavily on the "what" (`Type 'ls -l'`) rather than the "why". Error paths are ignored.
- **Score**: Clarity: 4/5, Conceptual Depth: 2/5, Error Coverage: 1/5.

### DIY Labs & Exploitable Verification
### [SEVERITY: P1] Easily Exploitable Verification Engine
**What**: The static verification engine (`src/features/lab-engine/verification.ts`) relies purely on static state checks like `file_contains` or `permission_equals` without validating the command history that produced the state.
**Why it matters**:
1. If a lab asks to extract errors using `grep`, a student can just `echo "Error" > target.txt`.
2. A student can `chmod 777` everything instead of finding the precise correct mode.
3. Fails to verify *how* a file was created (e.g., did they use `tar -xf` or just `touch file`?).
This undermines the educational value completely.
**How to fix**: Implement the verification engine redesign outlined in Section 3.5, validating the `CommandContext` history alongside VFS state.
**Verification**: Write an integration test where `echo "Expected" > file` fails a regex extraction lab, but `grep 'pattern' source > file` passes it.

### Boss Labs
### [SEVERITY: P2] Boss Labs Lack Differentiation
**What**: Current Boss Labs are functionally identical to DIY labs, just with more steps.
**Why it matters**: They fail to test true mastery, which involves working under pressure or combining concepts dynamically without hand-holding.
**How to fix**: Boss Labs must simulate time-pressure outages or multi-stage architectural builds (see Section 3.4 for examples). Implement the `solved_within_time` verification condition.
**Verification**: Ensure a Boss lab fails if the user takes longer than the par time.

## 3.4 — Broken System Lab Paradigm (10 Scenarios)

These 10 labs simulate real-world break-fix scenarios.

**1. Sudoers Syntax Error**
- **Initial VFS State**: `/etc/sudoers` contains a syntax error.
- **Symptom**: Running `sudo anything` throws "parse error in /etc/sudoers".
- **Diagnosis steps**: Recognize `visudo` is required, or boot to single-user mode (simulated root shell).
- **Fix commands**: Edit the file, remove the bad line.
- **Verification**: `command_used_in_session: visudo` AND `sudo ls` succeeds.
- **Learning objective**: Safety of `visudo` over direct edits.
- **Difficulty**: Intermediate

**2. The 100% Full Disk Simulation**
- **Initial VFS State**: `/var/log` contains a massive 50GB dummy file. VFS quota is maxed. `> ⚠️ Requires new VFS snapshot`
- **Symptom**: `touch test.txt` fails with "No space left on device".
- **Diagnosis steps**: `df -h`, then `du -sh /*` to isolate the large file.
- **Fix commands**: `rm /var/log/massive.log` or `> /var/log/massive.log`.
- **Verification**: File creation succeeds, `du` shows normal size.
- **Learning objective**: Troubleshooting disk exhaustion.
- **Difficulty**: Beginner

**3. Cascading Symlink Nightmare**
- **Initial VFS State**: `/etc/resolv.conf` is a symlink to `/run/systemd/resolve/stub-resolv.conf` which links back to itself (loop).
- **Symptom**: Network resolution commands fail with "Too many levels of symbolic links".
- **Diagnosis steps**: `ls -l /etc/resolv.conf` to trace the chain.
- **Fix commands**: `rm /etc/resolv.conf` and recreate a valid file.
- **Verification**: `symlink_loop_resolved: /etc/resolv.conf`.
- **Learning objective**: Identifying and fixing symlink loops.
- **Difficulty**: Intermediate

**4. Attack of the Zombies**
- **Initial VFS State**: Process table contains 15 Zombie (`Z`) processes tied to a broken parent PID.
- **Symptom**: `ps aux` shows cluttered state, system "sluggish".
- **Diagnosis steps**: `ps aux | grep Z`. Identify the parent process.
- **Fix commands**: `kill -9 <Parent_PID>` to force init to reap them.
- **Verification**: Process table contains no `Z` states.
- **Learning objective**: Understanding process reaping and parent-child lifecycles.
- **Difficulty**: Advanced

**5. The Rogue SUID Backdoor**
- **Initial VFS State**: A hidden binary `/tmp/.backdoor` has `chmod 4755` (SUID root).
- **Symptom**: Security audit lab objective.
- **Diagnosis steps**: `find / -perm -4000 2>/dev/null`.
- **Fix commands**: `chmod -s /tmp/.backdoor` or `rm`.
- **Verification**: No unexpected SUID binaries exist.
- **Learning objective**: Finding and securing privileged binaries.
- **Difficulty**: Intermediate

**6. Locked Out (Missing Shadow Entry)**
- **Initial VFS State**: User `guest` is missing from `/etc/shadow`.
- **Symptom**: Simulated `su guest` fails with auth error.
- **Diagnosis steps**: Compare `/etc/passwd` to `/etc/shadow`.
- **Fix commands**: Add entry or use simulated `passwd guest`.
- **Verification**: Authentication succeeds.
- **Learning objective**: Understanding the split between `passwd` and `shadow`.
- **Difficulty**: Advanced

**7. PATH Destruction**
- **Initial VFS State**: `.bashrc` contains `export PATH=""`.
- **Symptom**: `ls` returns "command not found".
- **Diagnosis steps**: Realize absolute paths (`/bin/ls`) are needed.
- **Fix commands**: `/usr/bin/nano ~/.bashrc` and fix the export.
- **Verification**: Environment `PATH` is restored.
- **Learning objective**: Absolute vs Relative paths and environment variables.
- **Difficulty**: Beginner

**8. /tmp Sticky Bit Missing**
- **Initial VFS State**: `/tmp` is `chmod 777` without the sticky bit.
- **Symptom**: User B deletes User A's file in `/tmp`.
- **Diagnosis steps**: `ls -ld /tmp` shows `drwxrwxrwx` not `drwxrwxrwt`.
- **Fix commands**: `chmod +t /tmp`.
- **Verification**: `permission_equals: /tmp, 1777`.
- **Learning objective**: Purpose of the sticky bit.
- **Difficulty**: Intermediate

**9. Shared Library Missing Simulation**
- **Initial VFS State**: A simulated `ldd` command shows a missing `.so` for a required binary.
- **Symptom**: Binary refuses to execute.
- **Diagnosis steps**: Use `ldd`.
- **Fix commands**: Set `LD_LIBRARY_PATH` or symlink the missing file in `/lib`.
- **Verification**: Binary executes successfully.
- **Learning objective**: Dynamic linking basics.
- **Difficulty**: Advanced

**10. Conflicting Network Configs**
- **Initial VFS State**: `/etc/hosts` points `db.local` to 10.0.0.5, but simulated DNS points to 10.0.0.9.
- **Symptom**: Application simulation connects to wrong IP.
- **Diagnosis steps**: `cat /etc/hosts`.
- **Fix commands**: Remove conflicting entry.
- **Verification**: `ping db.local` resolves correctly.
- **Learning objective**: Resolution order (files vs dns).
- **Difficulty**: Intermediate

## 3.5 — Verification Engine Redesign

To prevent cheating, expand `src/features/lab-engine/types.ts`:

```typescript
export type VerificationConditionType =
    | 'static_state' // Existing (file_exists, permission_equals)
    | 'command_history_includes'
    | 'pipe_utilized'
    | 'script_executes_correctly'
    | 'no_hints_used'
    | 'compound_logic';

export interface CommandHistoryCondition {
    type: 'command_history_includes';
    commandRegex: string; // e.g. "^tar .* -z"
    message: string;
}

export interface CompoundCondition {
    type: 'compound_logic';
    operator: 'AND' | 'OR';
    conditions: VerificationCondition[];
}
```
*Implementation pattern in `verification.ts`*: Inject the full `CommandContext` (history, current state) into the `verify` function, not just the VFS.

## 3.6 — AI Mentorship Design

**The `hint` / `advisor` command:**
When a student types `hint`, the frontend bundles:
1. Current lab step.
2. Last 10 commands from history.
3. A diff of current VFS vs expected VFS.

**Socratic Guidance Prompt**:
*"You are a senior Linux SysAdmin mentoring a junior. Do NOT give them the answer. Look at their command history. If they are close, ask a leading question about a specific flag. If they are completely lost, point them to the `man` page of the right tool."*

## 3.7 — Content Roadmap: 10 New Modules

**1. Module 12: Systemd & Service Management**
- **Prerequisites**: Module 7 (Process Control)
- **Learning Objectives**:
  1. Understand systemd architecture and boot targets.
  2. Manage services (start, stop, enable, disable) using `systemctl`.
  3. Analyze system logs using `journalctl`.
- **Guided Labs (2)**:
  - *Starting and Enabling Services*: Using `systemctl` to manage an Nginx simulation.
  - *Reading the Journal*: Using `journalctl -u` and time-based filtering.
- **DIY Labs (2)**:
  - *Service Isolation*: Switching targets (`systemctl isolate multi-user.target`).
  - *Creating a Custom Service*: Writing a basic `.service` file to start a background script.
- **Boss Lab**: *The Unbootable Server* — The system boots into emergency mode due to a failing service. Diagnose the journal, mask the bad service, and restore `graphical.target`.
- **Certification Target**: RHCSA, LFCS

**2. Module 13: Container Fundamentals**
- **Prerequisites**: Module 12 (Systemd), Module 6 (Identity)
- **Learning Objectives**:
  1. Understand isolation using `chroot`.
  2. Explore kernel namespaces (`unshare`).
  3. Understand resource limits using `cgroups`.
- **Guided Labs (2)**:
  - *Building a Chroot Jail*: Creating a minimal environment and running a shell inside.
  - *Exploring Namespaces*: Simulating `unshare --mount --pid` to hide processes.
- **DIY Labs (1)**:
  - *Isolating a Web Server*: Run an Nginx simulation inside a custom namespace.
- **Boss Lab**: *The Escape Artist* — Escape a poorly configured chroot jail and retrieve a flag in the host VFS.
- **Certification Target**: Advanced / DevOps

**3. Module 14: Advanced Shell Scripting**
- **Prerequisites**: Module 5 (Environment), Module 3 (Power Tools)
- **Learning Objectives**:
  1. Master control flow (`if`, `for`, `while`, `case`).
  2. Utilize shell functions and understand scoping.
  3. Perform arithmetic and string manipulation.
- **Guided Labs (3)**:
  - *Conditional Logic*: Writing a script that checks if a file exists before backing it up.
  - *Looping Over Files*: Bulk renaming files using a `for` loop.
  - *Exit Codes and Error Handling*: Using `$?` and `set -e`.
- **DIY Labs (2)**:
  - *The Log Parser*: Write a script using `awk` and loops to summarize errors by IP.
  - *Interactive Scripts*: Using `read` and `case` to build a simulated menu.
- **Boss Lab**: *The Automator* — Write a single script that verifies system health (disk space, running services, CPU load) and writes a formatted HTML report to `/var/www/html/report.html`.
- **Certification Target**: LFCS, LPIC-1

**4. Module 15: Networking Deep Dive**
- **Prerequisites**: Module 9 (Networking Basics)
- **Learning Objectives**:
  1. Manage network interfaces using `ip link` and `ip addr`.
  2. Understand and modify routing tables (`ip route`).
  3. Troubleshoot DNS resolution (`/etc/hosts`, `resolv.conf`, `dig` simulation).
- **Guided Labs (3)**:
  - *Configuring Static IPs*: Adding a secondary IP to `eth0`.
  - *Routing Traffic*: Adding a static route for a specific subnet.
  - *DNS Troubleshooting*: Modifying `resolv.conf` to fix broken lookups.
- **DIY Labs (2)**:
  - *The Missing Gateway*: The system cannot reach the internet; add the correct default route.
  - *Socket Inspection*: Use `ss -tulpn` to find a rogue process listening on port 8080.
- **Boss Lab**: *The Network Outage* — You inherit a broken configuration with a down interface, wrong IP, missing route, and bad DNS. Fix all 4 to successfully `curl` a target server.
- **Certification Target**: LFCS, RHCSA

**5. Module 16: Security & SELinux**
- **Prerequisites**: Module 4 (Permissions), Module 12 (Systemd)
- **Learning Objectives**:
  1. Understand MAC vs DAC and SELinux contexts.
  2. Toggle SELinux modes and booleans (`setenforce`, `setsebool`).
  3. Restore default contexts (`restorecon`).
- **Guided Labs (2)**:
  - *Context Inspection*: Using `ls -Z` and `ps -Z`.
  - *Fixing Web Server Access*: Fixing an HTTPD simulation that cannot read `/var/www/html` due to wrong context.
- **DIY Labs (1)**:
  - *Boolean Toggling*: Allow an FTP server to access home directories via `setsebool`.
- **Boss Lab**: *The Hardened Server* — Deploy a simulated web application. You must configure DAC permissions, set the correct SELinux contexts, and enable the appropriate booleans without disabling SELinux.
- **Certification Target**: RHCSA

**6. Module 17: Firewalls & IPTables**
- **Prerequisites**: Module 15 (Networking Deep Dive)
- **Learning Objectives**:
  1. Understand Netfilter tables, chains, and rules.
  2. Configure basic firewall rules using `iptables` and `firewalld`.
  3. Implement SNAT/DNAT (Port forwarding).
- **Guided Labs (2)**:
  - *Dropping Traffic*: Block incoming SSH from a specific malicious IP.
  - *Using firewalld*: Add the `http` service to the public zone permanently.
- **DIY Labs (2)**:
  - *Port Forwarding*: Redirect incoming port 80 to port 8080.
  - *The Lockdown*: Set the default policy to DROP and explicitly allow only SSH and HTTP.
- **Boss Lab**: *The Bastion Host* — Configure a complex ruleset that allows web traffic globally, SSH only from a specific management subnet, and drops all ICMP traffic.
- **Certification Target**: RHCSA, LFCS

**7. Module 18: Storage, LVM & RAID**
- **Prerequisites**: Module 8 (Storage & Disk)
- **Learning Objectives**:
  1. Understand the Logical Volume Manager (PV, VG, LV).
  2. Create, extend, and reduce logical volumes.
  3. Understand software RAID levels (0, 1, 5).
- **Guided Labs (3)**:
  - *Creating an LVM Setup*: Initializing physical volumes and creating a volume group.
  - *Extending a Filesystem*: Growing an LV and using `resize2fs` (simulated).
  - *Building a RAID 1*: Simulating `mdadm` to mirror two disks.
- **DIY Labs (2)**:
  - *The Full Partition*: A web server partition is 100% full. Extend the LV by 5GB without unmounting.
  - *Failing Disk Replacement*: A disk in your RAID 1 array failed. Remove it and add a hot spare.
- **Boss Lab**: *The Storage Architect* — From 4 raw virtual disks, create a RAID 1 array for `/boot`, and an LVM setup spanning the remaining disks for `/` and `/var`, leaving 10GB of free extents for future growth.
- **Certification Target**: RHCSA, LFCS

**8. Module 19: Performance & Tuning**
- **Prerequisites**: Module 7 (Process Control)
- **Learning Objectives**:
  1. Analyze system load and bottlenecks (`top`, `uptime`, `iostat`).
  2. Tune kernel parameters via `/proc/sys` and `sysctl`.
  3. Trace system calls (`strace`).
- **Guided Labs (2)**:
  - *Hunting the Hog*: Use `top` to find and nice a CPU-bound process.
  - *Kernel Tuning*: Persistently disable ICMP ping responses via `sysctl.conf`.
- **DIY Labs (1)**:
  - *Why Did It Fail?*: Use `strace` to determine why a binary is failing (it's looking for a config file in the wrong path).
- **Boss Lab**: *The Slowdown* — A simulated database is performing poorly. Diagnose CPU vs I/O wait, trace the offending queries, and adjust the `swappiness` kernel parameter to stabilize the system.
- **Certification Target**: Advanced / LFCE

**9. Module 20: Backup, Archiving & Compression**
- **Prerequisites**: Module 8 (Storage & Disk)
- **Learning Objectives**:
  1. Master advanced `tar` and compression algorithms (`xz`, `bzip2`).
  2. Use `rsync` for differential synchronization.
  3. Schedule automated backups using `cron` (simulated).
- **Guided Labs (2)**:
  - *The Perfect Archive*: Creating a `tar.xz` archive while excluding `.git` directories.
  - *Rsync Basics*: Syncing `/var/www` to a backup directory locally.
- **DIY Labs (2)**:
  - *Incremental Backups*: Create a daily incremental archive script.
  - *Cron Jobs*: Schedule the rsync script to run every night at 2 AM.
- **Boss Lab**: *The Ransomware Recovery* — A simulated script encrypted `/home`. You must identify the exact time of infection from logs, locate the correct incremental backup archive, and restore `/home` while preserving ownership.
- **Certification Target**: LFCS, LPIC-1

**10. Module 21: High Availability Basics**
- **Prerequisites**: Module 15 (Networking Deep Dive)
- **Learning Objectives**:
  1. Understand virtual IPs and failover concepts.
  2. Simulate load balancing (e.g., HAProxy/Keepalived concepts).
  3. Handle split-brain scenarios.
- **Guided Labs (2)**:
  - *Floating IPs*: Assigning and migrating a secondary IP address between two simulated nodes.
  - *Round Robin*: Configuring a simple DNS round-robin setup in `/etc/hosts`.
- **DIY Labs (1)**:
  - *The Failover*: Node A dies. Manually execute the steps a cluster manager would take to bring the service up on Node B.
- **Boss Lab**: *Zero Downtime* — Perform a rolling update on two simulated web servers behind a load balancer without dropping any client requests during the process.
- **Certification Target**: Advanced Architecture