import { ChapterContent } from '../../../../types/chapters';

export const ch14Content: ChapterContent = {
    chapterId: 'track1-ch14',
    title: 'Accessing Linux File Systems',
    description: "Disk space isn't infinite. Learn to list, identify, and mount file systems, and how to hunt down lost files with find and locate.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Disk space isn't infinite, and storage isn't just “there” — it must be **mounted** into the filesystem tree. When a drive fills up or a new disk is added, you need to know how to list, identify, and mount file systems, and how to hunt down lost files with `find`."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to list block devices and filesystems with `lsblk`, `blkid`.",
                "How to manually mount and unmount filesystems with `mount`, `umount`.",
                "How to make mounts permanent via `/etc/fstab`.",
                "How to check disk usage with `df` and `du`.",
                "How to find files like a detective with `find` and `locate`."
            ]
        },
        {
            type: 'interactive',
            id: 'listing_devices',
            heading: 'Listing Block Devices',
            content: "See all block devices (disks, partitions, USB drives):",
            terminal_blocks: [
                { command: "lsblk", showPrompt: true },
                { command: "lsblk -f", showPrompt: true, output: "// Detailed tree with filesystem types" },
                { command: "blkid", showPrompt: true, output: "// Display UUIDs and labels" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `lsblk` and identify your disk partitions. Which one is your root filesystem?" }
            ]
        },
        {
            type: 'interactive',
            id: 'mounting',
            heading: 'Mounting a Filesystem',
            content: "Attach a partition to a directory:",
            terminal_blocks: [
                { command: "mkdir -p /mnt/data\nsudo mount /dev/sdb1 /mnt/data", showPrompt: true },
                { command: "sudo mount -t xfs /dev/sdb1 /mnt/data", showPrompt: true, output: "// Mount with specific type" },
                { command: "sudo umount /mnt/data", showPrompt: true, output: "// Unmount filesystem" }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Never unplug a drive without unmounting. Use `umount` (no 'n') or `lsof` to see what's using it." }
            ]
        },
        {
            type: 'text',
            id: 'fstab',
            heading: 'Permanent Mounts – /etc/fstab',
            content: "The file `/etc/fstab` defines mounts that happen at boot. Format:",
            terminal_blocks: [
                { command: "UUID=1234-5678  /data  xfs  defaults  0 0", showPrompt: false }
            ],
            list: [
                "**Field 1**: Device or UUID.",
                "**Field 2**: Mountpoint.",
                "**Field 3**: Filesystem type.",
                "**Field 4**: Options (defaults, ro, rw, etc.).",
                "**Field 5**: Dump (usually 0).",
                "**Field 6**: Pass (fsck order)."
            ],
            tips: [
                "Find UUIDs with `blkid`.",
                "Always test with `sudo mount -a` after editing fstab."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "View your current `/etc/fstab`. Identify the entry for your root filesystem." }
            ]
        },
        {
            type: 'interactive',
            id: 'usage',
            heading: 'Disk Usage — df and du',
            content: "Monitor available space and directory sizes:",
            terminal_blocks: [
                { command: "df -h", showPrompt: true, output: "// Free space on all filesystems" },
                { command: "du -sh /home/user", showPrompt: true, output: "// Total size of directory" },
                { command: "du -h --max-depth=1 /var", showPrompt: true, output: "// Breakdown by subdirectory" }
            ]
        },
        {
            type: 'interactive',
            id: 'find_master',
            heading: 'Find – The Search Master',
            content: "Search for files by name, type, size, time, and more:",
            terminal_blocks: [
                { command: "find /home -name \"*.txt\"", showPrompt: true },
                { command: "find /var -type f -size +10M", showPrompt: true },
                { command: "find / -mtime -7", showPrompt: true, output: "// Modified in last 7 days" },
                { command: "find /etc -perm 644", showPrompt: true }
            ],
            tips: [
                "Run actions on found files:",
                "`find . -name \"*.tmp\" -delete`",
                "`find . -name \"*.log\" -exec gzip {} \\;`"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Use find to locate all files larger than 100MB under /var." }
            ]
        },
        {
            type: 'interactive',
            id: 'locate_tool',
            heading: 'Locate – The Fast Index',
            content: "`locate` searches a pre-built database. Much faster, but not real-time:",
            terminal_blocks: [
                { command: "locate passwd", showPrompt: true },
                { command: "sudo updatedb", showPrompt: true, output: "// Update the index database" }
            ]
        },
        {
            type: 'interactive',
            id: 'which_whereis',
            heading: 'Finding Executables – which and whereis',
            content: "`which` tells you which executable runs when you type a command:",
            terminal_blocks: [
                { command: "which python", showPrompt: true },
                { command: "whereis python", showPrompt: true, output: "// Binary, source, and manual pages" }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting to create the mountpoint directory** — mount fails.",
                "**Editing /etc/fstab incorrectly** — can prevent boot; always test with `mount -a`.",
                "**Using `find /` on a full system without filters** — slow, I/O heavy.",
                "**Relying on `locate` for newly created files** — the index may be stale."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You now manage the physical storage layer. In our final chapter, we'll learn to diagnose servers and generate support reports.",
            list: [
                "`lsblk` / `blkid` — list block devices and UUIDs.",
                "`mount` / `umount` — attach/detach filesystems.",
                "`/etc/fstab` — permanent mounts.",
                "`df -h` / `du -sh` — disk usage.",
                "`find` — search by name, size, time; `locate` — fast indexed search."
            ]
        }
    ]
};
