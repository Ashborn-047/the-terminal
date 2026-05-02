import { ChapterContent } from '../../../../types/chapters';

export const t2ch10Content: ChapterContent = {
    chapterId: 'track2-ch10',
    title: 'Controlling the Boot Process',
    description: "Master the Linux boot sequence. Learn to troubleshoot boot failures, switch systemd targets, reset lost root passwords, and manage kernel parameters.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "The boot process is the bridge between power‑on and a fully running system. If something breaks — a misconfigured service, a bad kernel parameter, or even a forgotten root password — you need to know how to interrupt the boot sequence and fix things. This chapter teaches you the escape hatches in systemd‑booted Linux."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to change the default boot target (runlevel) with `systemctl`.",
                "How to switch targets on the fly with `isolate`.",
                "How to reset the forgotten root password using the GRUB boot menu.",
                "How to boot into rescue and emergency modes.",
                "How to add temporary kernel parameters at boot."
            ]
        },
        {
            type: 'text',
            id: 'systemd_targets',
            heading: 'Systemd Targets',
            content: "Systemd **targets** are groups of units that bring the system to a certain state. They replace the old SysV runlevels.",
            table: {
                headers: ["Target", "Purpose", "Old runlevel"],
                rows: [
                    ["multi-user.target", "Command-line multi-user", "3"],
                    ["graphical.target", "Graphical desktop", "5"],
                    ["rescue.target", "Single-user, no network", "1"],
                    ["emergency.target", "Minimal root shell, basic file systems mounted", "S"]
                ]
            }
        },
        {
            type: 'interactive',
            id: 'change_target',
            heading: 'Checking and Changing the Default Target',
            content: "Manage your system's boot behavior and active state:",
            terminal_blocks: [
                { command: "systemctl get-default", showPrompt: true },
                { command: "sudo systemctl set-default multi-user.target", showPrompt: true },
                { command: "sudo systemctl isolate rescue.target", showPrompt: true }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Using `isolate` immediately stops all services not required by the new target. Ensure you save all work before switching states on a running system." }
            ]
        },
        {
            type: 'text',
            id: 'rescue_emergency',
            heading: 'Rescue and Emergency Modes',
            content: "These modes are essential for system recovery when normal booting fails.",
            list: [
                "**Rescue mode:** Mounts all local file systems and enables basic services, then provides a root shell. Enter by adding `systemd.unit=rescue.target` to kernel parameters.",
                "**Emergency mode:** Mounts only the root filesystem read-only and provides a minimal shell. Enter by adding `emergency` or `systemd.unit=emergency.target` to kernel parameters."
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Emergency mode is your 'last resort' when the system fails to boot due to a broken service, corrupted fstab, or hardware driver issues." }
            ]
        },
        {
            type: 'interactive',
            id: 'password_reset',
            heading: 'Resetting a Forgotten Root Password',
            content: "The standard procedure for administrative recovery:\n\n1. Reboot and press `e` on the kernel line in GRUB.\n2. Find the line starting with `linux` and append `rd.break` at the end.\n3. Press `Ctrl+x` to boot into the emergency shell.\n4. Remount the filesystem: `mount -o remount,rw /sysroot`.\n5. Enter the system: `chroot /sysroot`.\n6. Reset password: `passwd root`.\n7. Fix SELinux: `touch /.autorelabel`.\n8. Exit twice to reboot.",
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Practice this procedure in a safe VM environment. Confirm you can successfully regain access with the new credentials." }
            ]
        },
        {
            type: 'text',
            id: 'grub_temp',
            heading: 'Temporary Kernel Parameters (GRUB)',
            content: "You can temporarily add kernel parameters at the GRUB menu by pressing `e`. For example, appending `selinux=0` disables SELinux for that boot session only. Adding `1` or `single` boots directly into rescue mode."
        },
        {
            type: 'interactive',
            id: 'grub_perm',
            heading: 'Permanent Kernel Parameters',
            content: "To make kernel options persistent, edit `/etc/default/grub` and update `GRUB_CMDLINE_LINUX`.",
            terminal_blocks: [
                { command: "sudo vi /etc/default/grub", showPrompt: true },
                { command: "sudo grub2-mkconfig -o /boot/grub2/grub.cfg", showPrompt: true }
            ],
            tips: [
                "On UEFI systems, the output path for `grub2-mkconfig` is typically `/boot/efi/EFI/redhat/grub.cfg`."
            ]
        },
        {
            type: 'interactive',
            id: 'boot_logs',
            heading: 'Examining Boot Logs',
            content: "Diagnose boot failures or performance bottlenecks:",
            terminal_blocks: [
                { command: "journalctl -b -1", showPrompt: true },
                { command: "journalctl -k", showPrompt: true },
                { command: "systemd-analyze time", showPrompt: true },
                { command: "systemd-analyze blame", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Non-existent Targets** – Trying to set a target that hasn't been defined; `systemctl` will block this.",
                "**Read-only sysroot** – Forgetting to remount `/sysroot` as `rw` during password reset; the `passwd` command will fail to write changes.",
                "**SELinux Contexts** – Forgetting `/.autorelabel` after a password reset, which can prevent the system from allowing root login on the next boot."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You can now rescue a broken system. Next, we'll build your firewall fortress.",
            list: [
                "Targets: Manage system states with `set-default` and `isolate`.",
                "Recovery: Use `rd.break` and `chroot` for emergency repairs.",
                "GRUB: Control kernel behavior with persistent and temporary parameters.",
                "Diagnostics: Profile boot performance with `systemd-analyze`."
            ]
        }
    ]
};
