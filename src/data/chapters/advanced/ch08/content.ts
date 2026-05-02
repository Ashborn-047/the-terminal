import { ChapterContent } from '../../../../types/chapters';

export const t2ch08Content: ChapterContent = {
    chapterId: 'track2-ch08',
    title: 'Implementing Advanced Storage (Stratis, VDO)',
    description: "Master modern storage solutions with Stratis pooling and VDO deduplication/compression for efficient data management.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Beyond LVM, two technologies address modern storage challenges: **Stratis** simplifies pooling and snapshots with a file-system-in-userspace approach, while **VDO** (Virtual Data Optimizer) provides inline deduplication and compression, dramatically reducing storage footprint. Together, they bring enterprise features to any Linux server."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to set up Stratis pools and filesystems.",
                "How to manage Stratis snapshots and recovery.",
                "How to create a VDO volume and mount it.",
                "How to check deduplication and compression statistics with `vdostats`."
            ]
        },
        {
            type: 'interactive',
            id: 'stratis_overview',
            heading: 'Stratis – Overview',
            content: "Stratis combines existing Linux technologies (LVM, XFS) into an easy-to-manage layered storage solution. It handles block device pooling, thin provisioning, and snapshots through a clean CLI.",
            terminal_blocks: [
                { command: "sudo dnf install stratisd stratis-cli", showPrompt: true },
                { command: "sudo systemctl enable --now stratisd", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'stratis_pools',
            heading: 'Stratis Pools and Filesystems',
            content: "A **pool** is created from one or more block devices. Filesystems are then carved out from this pool.",
            terminal_blocks: [
                { command: "sudo stratis pool create mypool /dev/sdb", showPrompt: true },
                { command: "sudo stratis filesystem create mypool fs1", showPrompt: true },
                { command: "sudo mount /stratis/mypool/fs1 /mnt/data", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a Stratis pool, a filesystem, and mount it. Create a test file inside to verify it works." }
            ],
            tips: [
                "Add `/stratis/mypool/fs1 /mnt/data xfs defaults 0 0` to `/etc/fstab` for persistence."
            ]
        },
        {
            type: 'interactive',
            id: 'managing_stratis',
            heading: 'Managing Stratis',
            content: "Monitor and expand your Stratis storage:",
            terminal_blocks: [
                { command: "stratis pool list", showPrompt: true },
                { command: "stratis filesystem list", showPrompt: true },
                { command: "sudo stratis pool add-data mypool /dev/sdc", showPrompt: true },
                { command: "sudo stratis filesystem snapshot mypool fs1 snap1", showPrompt: true }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Stratis uses thin provisioning; monitor pool space closely with `stratis pool list` to avoid silent fill-ups." }
            ]
        },
        {
            type: 'interactive',
            id: 'vdo_overview',
            heading: 'VDO – Virtual Data Optimizer',
            content: "VDO operates below the filesystem to deduplicate and compress data blocks. It's especially effective for VM images and log data.",
            terminal_blocks: [
                { command: "sudo dnf install vdo kmod-kvdo", showPrompt: true },
                { command: "sudo vdo create --name=vdo1 --device=/dev/sdd --vdoLogicalSize=50G", showPrompt: true }
            ],
            tips: [
                "The VDO volume appears as `/dev/mapper/vdo1`."
            ]
        },
        {
            type: 'interactive',
            id: 'vdo_mounting',
            heading: 'Formatting and Mounting VDO',
            content: "Format the VDO block device with XFS and mount it:",
            terminal_blocks: [
                { command: "sudo mkfs.xfs -K /dev/mapper/vdo1", showPrompt: true },
                { command: "sudo mount /dev/mapper/vdo1 /mnt/vdo", showPrompt: true }
            ],
            tips: [
                "The `-K` flag with `mkfs.xfs` is critical; it prevents the command from preallocating the entire logical size, preserving the thin-provisioning benefits."
            ]
        },
        {
            type: 'interactive',
            id: 'vdo_monitoring',
            heading: 'Monitoring VDO',
            content: "Check your data savings from deduplication and compression:",
            terminal_blocks: [
                { command: "sudo vdostats --human-readable", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'use_case',
            heading: 'Real‑World Use Case',
            content: "Combine Stratis and VDO: create a Stratis pool on top of a VDO volume. This provides a snapshot-capable storage pool that is both compressed and deduplicated—an open-source equivalent of enterprise SAN features."
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Missing Drivers** – Forgetting to install `kmod-kvdo` causes VDO creation to fail.",
                "**Silent Over-provisioning** – Allocating logical space far beyond physical capacity without monitoring usage via `vdostats`.",
                "**Preallocation on Format** – Not using the `-K` flag when formatting VDO with `mkfs.xfs` forces immediate space allocation, defeating dedup savings."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Storage is now modern and efficient. Next, we'll connect to remote storage with NFS and autofs.",
            list: [
                "`stratis pool create` and `filesystem create` — The modern pooling workflow.",
                "`stratis filesystem snapshot` — Instant point-in-time recovery.",
                "`vdo create` — Enabling inline deduplication and compression.",
                "`vdostats` — Reporting on storage efficiency and savings."
            ]
        }
    ]
};
