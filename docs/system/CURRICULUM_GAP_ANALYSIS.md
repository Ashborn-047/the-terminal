# Curriculum Gap Analysis: Linux Mastery Track

This document outlines the remaining work required to achieve "Production-Ready" status for the Linux Simulator's educational curriculum.

## 1. Chapter Content Gaps (Data Layer)
The `src/data/chapters/chapter_content_data.ts` file is currently incomplete.

- **Track 1 (Foundational):** COMPLETE (Chapters 1-15).
- **Track 2 (Advanced):** MISSING (Chapters 1-12).
  - *Requirement:* All 12 advanced chapters need 3-4 sections of high-fidelity technical deep-dives (Bash scripting, SELinux, LVM, Firewalld, Podman).

## 2. Command Implementation Gaps (Logic Layer)
While many commands are "registered" in the `CommandRegistry`, their technical fidelity varies.

| Command Group | Current State | Required State |
| :--- | :--- | :--- |
| **System Services** | Simulated status strings. | Functional `systemctl` that toggles virtual daemon states. |
| **Storage (LVM)** | Strings only. | Logic to manage "Virtual Physical Volumes" and "Logical Volumes". |
| **Networking** | Static `nmcli` output. | Interactive configuration of virtual network profiles. |
| **Security (SELinux)** | Command not found. | Basic `semanage` and `restorecon` simulation for context changes. |
| **Containers** | Command not found. | `podman` logic for pulling/running virtualized container nodes. |

## 3. Lab Coverage (Experiential Layer)
We have ~20 foundational labs, but we lack hands-on scenarios for the advanced curriculum.

- **Missing Lab Modules:**
  - Automated Scheduling (Cron/Timers).
  - Performance Tuning (Nice/Tuned).
  - Advanced Storage (LVM resizing, Stratis).
  - Security Hardening (Firewalld zones, SELinux booleans).
  - Rootless Containers (Podman).

## 4. UI/UX Evolution (Presentation Layer)
The current UI presents chapters as a monolithic list.

- **Requirements:**
  - **Track Gating:** Visual separation between Track 1 (Novice-Adept) and Track 2 (Professional-Master).
  - **Prerequisite Checks:** Logic to ensure Track 1 is completed before Track 2 unlocks.
  - **Command Highlighting:** In-lesson terminal hints that highlight which commands are "currently available" in the simulator.

## 5. Next Steps Roadmap
1. [ ] Populate Track 2 content in `chapter_content_data.ts`.
2. [ ] Implement "Virtual Block Storage" logic in the Kernel.
3. [ ] Add `firewall-cmd` and `systemctl` logic to the Command Engine.
4. [ ] Create 12 Advanced "Mastery Labs" to accompany Track 2.
