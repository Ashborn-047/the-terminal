
import { ChapterContent } from '../../../../types/chapters';

export const t2ch06Content: ChapterContent = {
    chapterId: 'track2-ch06',
    title: 'Managing Basic Storage',
    description: "Master the Linux storage stack: partitioning with fdisk/parted, formatting filesystems, persistent mounting, and swap management.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Adding a new disk isn't magic — it requires partitioning, formatting, and mounting. You'll learn the essential tools: `fdisk` for MBR/GPT partitions, `mkfs` for filesystems, and `mount` to attach storage. This chapter solidifies your understanding of the Linux storage stack from bare metal to usable space."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to list disks and partitions with `lsblk` and `fdisk -l`.",
                "How to create and manage partitions using `fdisk`.",
                "How to create filesystems with `mkfs.xfs` and `mkfs.ext4`.",
                "How to set up and use swap space with `mkswap` and `swapon`.",
                "How to mount and manage filesystems persistently via `/etc/fstab`."
            ]
        },
        {
            type: 'interactive',
            id: 'view_layout',
            heading: 'Viewing Current Storage Layout',
            content: "Before making changes, identify your block devices:",
            terminal_blocks: [
                { command: "lsblk", showPrompt: true, output: "// Lists storage devices in a tree view" },
                { command: "sudo fdisk -l", showPrompt: true, output: "// Detailed partition info" }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Be absolutely sure of the disk name (e.g., /dev/sdb). Picking the wrong disk will destroy data." }
            ]
        },
        {
            type: 'interactive',
            id: 'fdisk_usage',
            heading: 'Partitioning with fdisk',
            content: "Start `fdisk` on the target disk:",
            terminal_blocks: [
                { command: "sudo fdisk /dev/sdb", showPrompt: true }
            ],
            list: [
                "**p** — print the partition table",
                "**n** — new partition",
                "**d** — delete a partition",
                "**t** — change partition type",
                "**w** — write changes and exit",
                "**q** — quit without saving"
            ],
            tips: [
                "After writing, run `partprobe` to make the kernel re‑read the partition table without a reboot."
            ]
        },
        {
            type: 'interactive',
            id: 'mkfs_usage',
            heading: 'Creating a Filesystem',
            content: "Format the new partition (e.g., /dev/sdb1):",
            terminal_blocks: [
                { command: "sudo mkfs.xfs /dev/sdb1", showPrompt: true, output: "// Default on RHEL systems" },
                { command: "sudo mkfs.ext4 -L mydata /dev/sdb1", showPrompt: true, output: "// ext4 with a custom label" }
            ]
        },
        {
            type: 'interactive',
            id: 'mount_usage',
            heading: 'Mounting the Filesystem',
            content: "Attach the filesystem to your directory tree:",
            terminal_blocks: [
                { command: "sudo mkdir /data", showPrompt: true },
                { command: "sudo mount /dev/sdb1 /data", showPrompt: true },
                { command: "df -h", showPrompt: true, output: "// Verify mount and free space" }
            ],
            tips: [
                "For a permanent mount, use `blkid` to find the UUID and add an entry to `/etc/fstab`."
            ]
        },
        {
            type: 'interactive',
            id: 'swap_usage',
            heading: 'Swap Space',
            content: "Swap provides extra virtual memory when RAM is full.",
            terminal_blocks: [
                { command: "sudo mkswap /dev/sdb2", showPrompt: true },
                { command: "sudo swapon /dev/sdb2", showPrompt: true },
                { command: "free -h", showPrompt: true, output: "// Check current memory/swap usage" }
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "You can also use a swap file: `dd if=/dev/zero of=/swapfile bs=1M count=1024; chmod 600 /swapfile; mkswap /swapfile; swapon /swapfile`." }
            ]
        },
        {
            type: 'interactive',
            id: 'parted_usage',
            heading: 'Managing Partitions with parted',
            content: "`parted` is a more modern tool that works well with GPT and large disks (>2TB):",
            terminal_blocks: [
                { command: "sudo parted /dev/sdc mklabel gpt", showPrompt: true },
                { command: "sudo parted /dev/sdc mkpart primary xfs 0% 100%", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'repair_usage',
            heading: 'Filesystem Check and Repair',
            content: "Check and repair unmounted filesystems:",
            terminal_blocks: [
                { command: "sudo fsck.ext4 /dev/sdb1", showPrompt: true },
                { command: "sudo xfs_repair /dev/sdb1", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Writing to the wrong disk** – Always double-check with `lsblk` before starting `fdisk`.",
                "**Forgetting to write (w)** – Quitting `fdisk` without saving means no changes are applied.",
                "**Mounting over a non-empty directory** – This hides existing files until unmounted.",
                "**Skipping /etc/fstab** – Manual mounts are lost after a reboot."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "From raw disk to working filesystem — you've mastered the basic storage stack. Next we'll combine physical volumes into flexible logical volumes with LVM.",
            list: [
                "`lsblk`, `fdisk -l` — list disks and partitions.",
                "`fdisk` and `parted` — manage partition tables.",
                "`mkfs` tools — create XFS or EXT4 filesystems.",
                "`mount`, `blkid`, `/etc/fstab` — manage attachment and persistence.",
                "`mkswap`, `swapon` — manage swap areas."
            ]
        }
    ]
};
