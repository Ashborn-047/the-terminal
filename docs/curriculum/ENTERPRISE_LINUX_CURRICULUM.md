# Enterprise Linux Administration Curriculum

This document outlines the exhaustive, 1-to-1 equivalent curriculum for industry-standard Enterprise Linux certification exams.
All proprietary trademarks have been removed.

## Track 1: Enterprise System Administration I (Foundational)
*Objective: Core administration, user management, basic networking, and local system operations.*

*   **Chapter 1: Getting Started with the Core Desktop**
    *   Subtopics: Accessing the command line, desktop environments, basic shell access using GNOME terminal.
*   **Chapter 2: Managing Files from the Command Line**
    *   Subtopics: Linux file system hierarchy, absolute vs relative paths, basic navigation (`cd`, `ls`, `pwd`), file manipulation (`cp`, `mv`, `rm`, `mkdir`).
*   **Chapter 3: Getting Help in Enterprise Linux**
    *   Subtopics: Reading `man` pages, using `pinfo`, exploring `/usr/share/doc`.
*   **Chapter 4: Creating, Viewing, and Editing Text Files**
    *   Subtopics: Standard output/error redirection (`>`, `>>`, `2>`), pipe character (`|`), basic `vim` navigation and editing.
*   **Chapter 5: Managing Local Users and Groups**
    *   Subtopics: User/group concepts, `/etc/passwd` & `/etc/shadow`, `useradd`/`usermod`/`userdel`, `groupadd`, managing passwords (`passwd`), managing password aging (`chage`).
*   **Chapter 6: Controlling Access to Files**
    *   Subtopics: Standard Linux permissions (UGO), read/write/execute concepts, `chmod` (symbolic and octal), changing ownership (`chown`/`chgrp`), special permissions (SUID, SGID, Sticky bit), default permissions (`umask`).
*   **Chapter 7: Monitoring and Managing Linux Processes**
    *   Subtopics: Process states, identifying processes (`ps`, `top`), controlling jobs (`bg`, `fg`, `jobs`), sending signals to processes (`kill`, `pkill`, `killall`).
*   **Chapter 8: Controlling Services and Daemons**
    *   Subtopics: Understanding systemd, using `systemctl` (start, stop, restart, reload, status), enabling/disabling services at boot.
*   **Chapter 9: Configuring and Securing SSH**
    *   Subtopics: OpenSSH basics, secure key-based authentication (`ssh-keygen`, `ssh-copy-id`), customizing `/etc/ssh/sshd_config` (disabling root login, changing ports).
*   **Chapter 10: Analyzing and Storing Logs**
    *   Subtopics: System logging architecture, reading `/var/log/messages`, using `journalctl` (filtering by time, unit, priority), preserving the systemd journal.
*   **Chapter 11: Managing Enterprise Networking**
    *   Subtopics: IPv4 concepts, configuring network interfaces using `nmcli` (NetworkManager), validating network config (`ip addr`, `ip route`, `ping`), editing network config files.
*   **Chapter 12: Archiving and Transferring Files**
    *   Subtopics: Creating tar archives (`tar -cvf`), compressing archives (`gzip`, `bzip2`, `xz`), transferring files securely (`scp`, `rsync`, `sftp`).
*   **Chapter 13: Installing and Updating Software Packages**
    *   Subtopics: RPM package concepts, managing software with `dnf` / `yum` (install, remove, update, search), configuring software repositories, managing module streams.
*   **Chapter 14: Accessing Linux File Systems**
    *   Subtopics: Identifying block devices, mounting file systems (`mount`, `umount`), identifying UUIDs (`blkid`), locating files on the system (`locate`, `find`).
*   **Chapter 15: Analyzing Servers and Getting Support**
    *   Subtopics: Generating sosreports for vendor support.


## Track 2: Enterprise System Administration II (Advanced)
*Objective: Advanced storage management, security hardening, containerization, and automated deployment.*

*   **Chapter 1: Improving Command Line Productivity**
    *   Subtopics: Advanced shell features, writing bash scripts, using variables (`$USER`), writing loops (`for`, `while`), conditional statements (`if/then/else`), regular expressions (`grep`, `egrep`).
*   **Chapter 2: Scheduling Future Tasks**
    *   Subtopics: Scheduling one-time jobs (`at`), scheduling recurring jobs (`cron`, `crontab`), understanding systemd timers.
*   **Chapter 3: Tuning System Performance**
    *   Subtopics: Adjusting process priority/niceness (`nice`, `renice`), tuning profiles with `tuned`.
*   **Chapter 4: Controlling Access to Files with ACLs**
    *   Subtopics: Understanding Access Control Lists, viewing ACLs (`getfacl`), setting ACLs (`setfacl`), setting default ACLs on directories.
*   **Chapter 5: Managing SELinux Security**
    *   Subtopics: SELinux concepts and modes (Enforcing, Permissive), viewing SELinux contexts (`-Z` flags), changing contexts (`chcon`, `semanage fcontext`), restoring contexts (`restorecon`), managing SELinux booleans (`getsebool`, `setsebool`), troubleshooting SELinux violations (`sealert`).
*   **Chapter 6: Managing Basic Storage**
    *   Subtopics: Adding partitions with `parted` or `fdisk`, formatting file systems (`mkfs.ext4`, `mkfs.xfs`), persistent mounting via `/etc/fstab`, managing swap space (`mkswap`, `swapon`).
*   **Chapter 7: Managing Logical Volumes (LVM)**
    *   Subtopics: LVM architecture, creating Physical Volumes (`pvcreate`), Volume Groups (`vgcreate`), and Logical Volumes (`lvcreate`), extending Logical Volumes and resizing file systems (`lvextend`, `xfs_growfs`, `resize2fs`).
*   **Chapter 8: Implementing Advanced Storage Features**
    *   Subtopics: Managing Stratis storage pools, using VDO (Virtual Data Optimizer) for compression and deduplication.
*   **Chapter 9: Accessing Network-Attached Storage**
    *   Subtopics: Mounting NFS exports, automounting network storage with `autofs`.
*   **Chapter 10: Controlling the Boot Process**
    *   Subtopics: The Linux boot process, selecting systemd targets (graphical vs multi-user), resetting a lost root password, repairing file system issues at boot.
*   **Chapter 11: Managing Network Security**
    *   Subtopics: Managing server firewalls with `firewalld`, configuring zones, opening ports/services (`firewall-cmd --add-service`, `--add-port`), making firewall changes persistent (`--permanent`).
*   **Chapter 12: Running Containers**
    *   Subtopics: Container concepts, installing `podman`, finding and pulling images, running containers (`podman run`), attaching persistent host storage to containers, managing containers as systemd services.