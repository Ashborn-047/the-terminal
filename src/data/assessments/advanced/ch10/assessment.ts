import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch10Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c10_e01',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'Which command shows the current default boot target?',
        options: ["systemctl get-default", "systemctl default", "systemctl show-target", "runlevel"],
        correctAnswer: "systemctl get-default",
        explanation: "systemctl get-default displays the active default target.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e02',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you change the default boot target to multi-user?',
        options: [
            "systemctl set-default multi-user.target",
            "systemctl default multi-user",
            "systemctl enable multi-user",
            "targetctl set default multi-user"
        ],
        correctAnswer: "systemctl set-default multi-user.target",
        explanation: "set-default changes the target symlink.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e03',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'Which target is equivalent to the old runlevel 3?',
        options: ["multi-user.target", "graphical.target", "rescue.target", "emergency.target"],
        correctAnswer: "multi-user.target",
        explanation: "multi-user.target provides CLI login without GUI.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e04',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What does 'systemctl isolate rescue.target' do?",
        options: [
            "Immediately switches the system to rescue mode",
            "Reboots into rescue",
            "Sets the default target",
            "Enables rescue services"
        ],
        correctAnswer: "Immediately switches the system to rescue mode",
        explanation: "isolate changes runlevel on the fly.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e05',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you interrupt the GRUB boot menu to edit kernel parameters?',
        options: [
            "Press 'e' on the selected kernel entry",
            "Press 'Esc'",
            "Press 'F2'",
            "Press 'Delete'"
        ],
        correctAnswer: "Press 'e' on the selected kernel entry",
        explanation: "Pressing e enters the editor for the current entry.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e06',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'Which kernel parameter is commonly used to reset the root password?',
        options: ["rd.break", "init=/bin/bash", "1", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "All provide a rescue shell for password reset.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e07',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'After resetting the root password via rd.break, what command makes the sysroot writable?',
        options: [
            "mount -o remount,rw /sysroot",
            "remount /sysroot",
            "chroot /sysroot",
            "mount /sysroot"
        ],
        correctAnswer: "mount -o remount,rw /sysroot",
        explanation: "The initial filesystem is usually mounted read-only.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e08',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the purpose of 'chroot /sysroot' during password recovery?",
        options: [
            "Changes the apparent root directory to the installed system",
            "Changes the root password",
            "Mounts the root filesystem",
            "Reboots"
        ],
        correctAnswer: "Changes the apparent root directory to the installed system",
        explanation: "chroot makes the tools see the real root filesystem.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e09',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you regenerate the GRUB configuration after editing /etc/default/grub?',
        options: [
            "grub2-mkconfig -o /boot/grub2/grub.cfg",
            "grub2-mkconfig",
            "update-grub",
            "Both A and C"
        ],
        correctAnswer: "Both A and C",
        explanation: "grub2-mkconfig or update-grub (on Debian).",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e10',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'What command shows boot time diagnostics?',
        options: ["systemd-analyze blame", "journalctl -b", "systemctl boot-time", "bootlog"],
        correctAnswer: "systemd-analyze blame",
        explanation: "systemd-analyze shows boot performance.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e11',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'Which target gives the most minimal root shell?',
        options: ["emergency.target", "rescue.target", "multi-user.target", "single.target"],
        correctAnswer: "emergency.target",
        explanation: "Emergency mounts only root and gives a minimal shell.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e12',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you temporarily disable SELinux at boot?',
        options: [
            "Add 'selinux=0' to the kernel command line",
            "edit /etc/selinux/config",
            "reboot and press F8",
            "Not possible"
        ],
        correctAnswer: "Add 'selinux=0' to the kernel command line",
        explanation: "Kernel parameters can override SELinux for one boot.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e13',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the function of 'touch /.autorelabel' after changing the root password?",
        options: [
            "Forces SELinux to relabel the filesystem on next boot",
            "Creates an empty file",
            "Removes the password",
            "Deletes the SELinux policy"
        ],
        correctAnswer: "Forces SELinux to relabel the filesystem on next boot",
        explanation: "It triggers a global relabel to fix contexts.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e14',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you view the kernel logs from the current boot?',
        options: ["dmesg", "journalctl -k", "journalctl -b", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "dmesg shows kernel ring buffer; journalctl -k shows from journal.",
        difficulty: 'easy'
    },
    {
        id: 't2c10_e15',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What does 'systemctl set-default graphical.target' accomplish?",
        options: [
            "Sets the default boot to graphical mode",
            "Starts the graphical interface immediately",
            "Switches to GUI",
            "Reboots into GUI"
        ],
        correctAnswer: "Sets the default boot to graphical mode",
        explanation: "It changes the symlink /etc/systemd/system/default.target.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c10_m01',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the difference between 'rescue.target' and 'emergency.target'?",
        options: [
            "Rescue mounts all local filesystems; emergency mounts only root and may not start any services",
            "No difference",
            "Emergency starts networking",
            "Rescue is for root password only"
        ],
        correctAnswer: "Rescue mounts all local filesystems; emergency mounts only root and may not start any services",
        explanation: "Rescue is a single user environment; emergency is more extreme.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m02',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you boot into a specific target from the GRUB command line?',
        options: [
            "Append 'systemd.unit=multi-user.target' to the kernel line",
            "Press the target key",
            "grub-set-target",
            "Not possible"
        ],
        correctAnswer: "Append 'systemd.unit=multi-user.target' to the kernel line",
        explanation: "systemd.unit=<target> overrides the default.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m03',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What does 'systemd-analyze critical-chain' show?",
        options: [
            "The time‑critical chain of units during boot",
            "Critical errors",
            "Boot chain only",
            "Nothing"
        ],
        correctAnswer: "The time‑critical chain of units during boot",
        explanation: "It shows which units delayed the boot the most.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m04',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'If you set the default target to a non‑existent target, what happens?',
        options: [
            "systemctl set-default will give an error",
            "System won't boot",
            "It defaults to rescue",
            "It creates the target"
        ],
        correctAnswer: "systemctl set-default will give an error",
        explanation: "Validation prevents invalid targets.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m05',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you prevent a specific service from starting at boot without disabling it?',
        options: [
            "Mask it: systemctl mask servicename",
            "systemctl disable servicename",
            "Remove the file",
            "Use chmod"
        ],
        correctAnswer: "Mask it: systemctl mask servicename",
        explanation: "Masking symlinks the unit to /dev/null.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m06',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What does 'kernel command line' refer to?",
        options: [
            "Parameters passed by the bootloader to the kernel at boot time",
            "The terminal command line",
            "A shell prompt",
            "The init system"
        ],
        correctAnswer: "Parameters passed by the bootloader to the kernel at boot time",
        explanation: "It's the string of arguments after the kernel image in GRUB.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m07',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you list all loaded units of a specific type?',
        options: [
            "systemctl list-units --type=target",
            "systemctl --type=target",
            "ls /etc/systemd/system",
            "ps -e"
        ],
        correctAnswer: "systemctl list-units --type=target",
        explanation: "list-units with --type filter.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m08',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the effect of appending 'quiet' to the kernel command line?",
        options: [
            "Reduces the verbosity of kernel messages during boot",
            "Makes the boot faster",
            "Disables boot",
            "Silences all logs"
        ],
        correctAnswer: "Reduces the verbosity of kernel messages during boot",
        explanation: "quiet suppresses most kernel log output.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m09',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "In a root password reset scenario, why might you need to run 'restorecon /etc/shadow'?",
        options: [
            "To restore the SELinux context on the password file",
            "To restore the file from backup",
            "To check the syntax",
            "To delete the password"
        ],
        correctAnswer: "To restore the SELinux context on the password file",
        explanation: "SELinux may block login if the context is wrong.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m10',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you see the boot log of a previous boot?',
        options: [
            "journalctl -b -1",
            "journalctl --last-boot",
            "dmesg -p",
            "bootlog -p"
        ],
        correctAnswer: "journalctl -b -1",
        explanation: "-b -1 shows the previous boot.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m11',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the difference between 'grub2-mkconfig' and 'grub2-install'?",
        options: [
            "mkconfig generates configuration files; install installs the bootloader to the disk",
            "No difference",
            "install creates config",
            "mkconfig installs to disk"
        ],
        correctAnswer: "mkconfig generates configuration files; install installs the bootloader to the disk",
        explanation: "mkconfig builds grub.cfg; grub2-install sets up the boot sector.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m12',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "How can you permanently add a kernel parameter like 'audit=1'?",
        options: [
            "Add it to GRUB_CMDLINE_LINUX in /etc/default/grub, then run grub2-mkconfig",
            "Edit /proc/cmdline",
            "Use sysctl",
            "Only temporary"
        ],
        correctAnswer: "Add it to GRUB_CMDLINE_LINUX in /etc/default/grub, then run grub2-mkconfig",
        explanation: "Permanent changes go in /etc/default/grub.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m13',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the purpose of the 'initrd'?",
        options: [
            "A temporary filesystem loaded by the kernel that contains drivers and tools needed to mount the real root",
            "The final root filesystem",
            "Boot configuration",
            "A kernel module"
        ],
        correctAnswer: "A temporary filesystem loaded by the kernel that contains drivers and tools needed to mount the real root",
        explanation: "initrd/initramfs provides early userspace.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m14',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How do you boot into multi-user mode when the default is graphical?',
        options: [
            "Add 'systemd.unit=multi-user.target' to the kernel command line at boot",
            "Press Ctrl+Alt+F2",
            "systemctl isolate multi-user.target after boot",
            "Both A and C"
        ],
        correctAnswer: "Both A and C",
        explanation: "You can override at boot or switch after.",
        difficulty: 'medium'
    },
    {
        id: 't2c10_m15',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What does 'systemctl rescue' do?",
        options: [
            "Equivalent to 'systemctl isolate rescue.target'",
            "Restarts all services",
            "Shuts down",
            "Sends rescue signal"
        ],
        correctAnswer: "Equivalent to 'systemctl isolate rescue.target'",
        explanation: "It's a shortcut for rescue mode.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c10_h01',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'What is the sequence of events in a systemd boot?',
        options: [
            "BIOS/UEFI → bootloader (GRUB2) → kernel (initrd) → systemd → default.target",
            "BIOS → kernel → GRUB",
            "GRUB → init → kernel",
            "Kernel → initrd → GRUB"
        ],
        correctAnswer: "BIOS/UEFI → bootloader (GRUB2) → kernel (initrd) → systemd → default.target",
        explanation: "Standard modern boot flow.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h02',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you break the boot sequence to enter a debug shell earlier than rescue.target?',
        options: [
            "Add 'rd.break' to the kernel command line",
            "Press Ctrl+Alt+Del",
            "Use systemctl emergency",
            "Add 'debug'"
        ],
        correctAnswer: "Add 'rd.break' to the kernel command line",
        explanation: "rd.break stops very early, before switching root.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h03',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the difference between 'rd.break' and 'init=/bin/bash'?",
        options: [
            "rd.break stops in the initrd before switch_root; init=/bin/bash starts bash as PID 1 after root is mounted",
            "No difference",
            "init=/bin/bash is earlier",
            "rd.break is later"
        ],
        correctAnswer: "rd.break stops in the initrd before switch_root; init=/bin/bash starts bash as PID 1 after root is mounted",
        explanation: "Two different points in the boot process.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h04',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you force a filesystem check on next boot?',
        options: [
            "Add 'fsck.mode=force' to the kernel command line",
            "touch /forcefsck",
            "shutdown -rF now",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Multiple ways to force fsck.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h05',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What does 'systemctl daemon-reload' do during boot troubleshooting?",
        options: [
            "Reloads systemd unit files after changes without rebooting",
            "Reboots the daemon",
            "Clears logs",
            "Restarts systemd"
        ],
        correctAnswer: "Reloads systemd unit files after changes without rebooting",
        explanation: "Essential after editing unit files.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h06',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you configure the bootloader to show a menu with a timeout?',
        options: [
            "Set GRUB_TIMEOUT=5 in /etc/default/grub",
            "Press Esc at boot",
            "Always shown",
            "Set GRUB_HIDDEN_TIMEOUT=0"
        ],
        correctAnswer: "Set GRUB_TIMEOUT=5 in /etc/default/grub",
        explanation: "GRUB_TIMEOUT controls the wait.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h07',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the function of 'grubby'?",
        options: [
            "Command‑line tool to modify GRUB boot entries and default kernel",
            "A GUI for GRUB",
            "A replacement for GRUB",
            "A log tool"
        ],
        correctAnswer: "Command‑line tool to modify GRUB boot entries and default kernel",
        explanation: "grubby manages kernel boot entries.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h08',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "How do you remove the 'rhgb quiet' options to see detailed boot messages?",
        options: [
            "Edit /etc/default/grub and remove them, then run grub2-mkconfig",
            "Press Esc during boot",
            "systemctl verbose-boot",
            "Not possible"
        ],
        correctAnswer: "Edit /etc/default/grub and remove them, then run grub2-mkconfig",
        explanation: "rhgb (Red Hat Graphical Boot) and quiet suppress messages.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h09',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is a 'target' in systemd comprised of?",
        options: [
            "A group of unit files with Wants/Requires dependencies",
            "A single service",
            "A mount unit",
            "A socket"
        ],
        correctAnswer: "A group of unit files with Wants/Requires dependencies",
        explanation: "Targets are unit groupings.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h10',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you create a custom target for a specific set of services?',
        options: [
            "Create a custom.target unit file, add the services with Wants=, and set it as default if needed",
            "Not possible",
            "Use runlevel 7",
            "Edit /etc/inittab"
        ],
        correctAnswer: "Create a custom.target unit file, add the services with Wants=, and set it as default if needed",
        explanation: "Targets are user-definable.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h11',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the purpose of 'plymouth'?",
        options: [
            "Graphical boot animation and prompt (replaces rhgb)",
            "A terminal",
            "A network manager",
            "A filesystem"
        ],
        correctAnswer: "Graphical boot animation and prompt (replaces rhgb)",
        explanation: "Provides splash screens and interaction during boot.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h12',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you skip a filesystem mount during boot?',
        options: [
            "Add the 'nofail' option in fstab; the system will continue if mount fails",
            "Delete fstab",
            "Use noauto",
            "Mask mount unit"
        ],
        correctAnswer: "Add the 'nofail' option in fstab; the system will continue if mount fails",
        explanation: "nofail prevents boot hang on missing drives.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h13',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the difference between 'reboot' and 'systemctl reboot'?",
        options: [
            "Both trigger the same systemd target; reboot may be a symlink",
            "reboot is immediate, systemctl is graceful",
            "systemctl reboot logs out users",
            "reboot is deprecated"
        ],
        correctAnswer: "Both trigger the same systemd target; reboot may be a symlink",
        explanation: "They ultimately ask systemd to perform a reboot.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h14',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: 'How can you boot directly into the UEFI firmware setup from the OS?',
        options: ["systemctl reboot --firmware-setup", "reboot uefi", "Not possible", "Use boot menu key"],
        correctAnswer: "systemctl reboot --firmware-setup",
        explanation: "systemctl reboot --firmware-setup boots into the BIOS/UEFI setup.",
        difficulty: 'hard'
    },
    {
        id: 't2c10_h15',
        chapterId: 'track2-ch10',
        type: 'mcq',
        question: "What is the 'machine-id' used for in systemd?",
        options: [
            "Uniquely identifies the installation for journal and network naming",
            "Identifies the hardware",
            "CPU ID",
            "Disk serial"
        ],
        correctAnswer: "Uniquely identifies the installation for journal and network naming",
        explanation: "It's a unique system identifier.",
        difficulty: 'hard'
    }
];
