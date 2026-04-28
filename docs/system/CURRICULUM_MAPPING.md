# Enterprise Linux Curriculum Mapping & Migration Plan

> [!WARNING]
> **SUPERSEDED:** This document is outdated. The system now ships with a 27-chapter structure defined in `src/data/chapters/curriculum_metadata.ts` which fully maps foundational and advanced system administration tracks to professional certification domains. This document remains for historical context only.

## 1. Current State (`src/data/chaptersData.ts`)
We currently have 8 generic Linux chapters implemented:
1. The Kernel & Shell Fundamentals
2. File System Hierarchy
3. Advanced Permissions & Security
4. Shell Scripting & Automation
5. Process Management & Monitoring
6. Networking & Connectivity
7. Package Management
8. Text Processing & Filtering

*Verdict: These are good foundational topics, but they do not map cleanly to official enterprise certification objectives, and they miss massive chunks of professional requirements (Storage, Security context, Containers).*

## 2. The Actual Professional Curriculum (Enterprise Linux)
The professional preparation track is split into two courses:
* **Track I (System Administration I):** Core foundational skills (CLI, users, basic networking, basic packages, processes).
* **Track II (System Administration II):** Advanced skills (LVM, Storage, Security Contexts, Firewall, Containers, boot process).

Combined, these prepare you for the **Professional System Administrator Certification**. The exam is strictly categorized into 9 domains.

To make our "Chapters" fully compliant, we must map them directly to these 9 domains:

### Domain 1: Essential Tools (Track I)
* **Topics:** Shell basics, input/output redirection, `grep` with regular expressions, SSH, `tar`, `gzip`/`bzip2`, `vim`.
* *Current overlap:* Chapters 1 & 8 cover parts of this.

### Domain 2: Operate Running Systems (Track I & II)
* **Topics:** Booting, changing runlevels (systemd targets), `systemctl` (start/stop/enable services), `journalctl`, `ps`, `kill`, `top`.
* *Current overlap:* Chapter 5.

### Domain 3: Configure Local Storage (Track II)
* **Topics:** `fdisk`/`parted`, creating partitions, LVM (Physical Volumes, Volume Groups, Logical Volumes).
* *Current overlap:* **NONE**. (Needs to be built).

### Domain 4: Create & Configure File Systems (Track I & II)
* **Topics:** `mkfs` (xfs, ext4), `mount`/`umount`, `/etc/fstab`, standard permissions (`chmod`/`chown`), special permissions (SUID/SGID/Sticky), ACLs (`setfacl`).
* *Current overlap:* Chapters 2 & 3.

### Domain 5: Deploy, Configure, & Maintain Systems (Track I)
* **Topics:** `cron` and `at` for scheduling, `dnf`/`yum` package management, configuring chrony (NTP).
* *Current overlap:* Chapter 7.

### Domain 6: Manage Basic Networking (Track I)
* **Topics:** IP addressing, `nmcli` (NetworkManager) to configure connections, hostnamectl.
* *Current overlap:* Chapter 6.

### Domain 7: Manage Users & Groups (Track I)
* **Topics:** `useradd`, `usermod`, `passwd`, managing local groups, `sudo` access.
* *Current overlap:* Partially in Chapter 3, but needs a dedicated chapter.

### Domain 8: Manage Security (Track II)
* **Topics:** `firewall` (zones, rich rules), Security Contexts (enforcing/permissive, context management, booleans).
* *Current overlap:* **NONE**. (Needs to be built).

### Domain 9: Manage Containers (Track II)
* **Topics:** Container basics, finding/running images, attaching persistent storage to containers, running containers as system services.
* *Current overlap:* **NONE**. (Needs to be built).

---

## 3. Migration Action Plan
To implement this massive curriculum, we need to:
1. **Scrap the 8 generic chapters** in `src/data/chaptersData.ts`.
2. **Rebuild `chaptersData.ts`** to contain exactly the 9 domains listed above.
3. **Seed the Question Pools**: Each of the 9 chapters needs a pool of MCQ and syntax drills. For domains like Storage and Containers, we will need to author new, highly specific syntax drills (e.g., `nmcli con add...`, `lvcreate...`).
4. **Update the UI (`ChaptersPage.tsx`)**: Ensure the UI reflects these 9 modules properly and groups them visually into "Track I (Basics)" and "Track II (Advanced)".
