import { ChapterContent } from '../../../../types/chapters';

export const t2ch07Content: ChapterContent = {
    chapterId: 'track2-ch07',
    title: 'Managing Logical Volumes (LVM)',
    description: "Master flexible storage management with LVM: Physical Volumes, Volume Groups, Logical Volumes, snapshots, and online resizing.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Physical disks are rigid, but your storage needs aren't. You may need to grow a filesystem without downtime, combine multiple small disks into one big pool, or take instant snapshots. Logical Volume Manager (LVM) gives you this flexibility by introducing a layer between the raw disks and the filesystem. It's the backbone of enterprise storage on Linux."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to prepare physical volumes (`pvcreate`).",
                "How to create volume groups (`vgcreate`) and logical volumes (`lvcreate`).",
                "How to extend and reduce logical volumes (`lvextend`, `lvreduce`).",
                "How to grow the filesystem with `xfs_growfs` or `resize2fs`.",
                "How to take and restore LVM snapshots."
            ]
        },
        {
            type: 'text',
            id: 'architecture',
            heading: 'The LVM Architecture',
            content: "LVM stacks three abstraction layers:",
            list: [
                "**Physical Volumes (PVs)**: Actual disks or partitions initialized for LVM.",
                "**Volume Groups (VGs)**: Pools of storage created from one or more PVs.",
                "**Logical Volumes (LVs)**: The flexible \"virtual partitions\" carved from a VG."
            ],
            tips: [
                "Think of PVs as bricks, VGs as the wall, and LVs as the rooms you actually use."
            ]
        },
        {
            type: 'interactive',
            id: 'pv_creation',
            heading: 'Creating Physical Volumes',
            content: "First, create a standard Linux partition (or use a whole disk). Then initialize it as a PV:",
            terminal_blocks: [
                { command: "sudo pvcreate /dev/sdb1", showPrompt: true },
                { command: "pvs", showPrompt: true, output: "// Verify physical volumes" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "If you have a spare disk, create a partition and initialize it with `pvcreate`. Use `pvs` to confirm." }
            ]
        },
        {
            type: 'interactive',
            id: 'vg_creation',
            heading: 'Creating Volume Groups',
            content: "Pool the physical volumes into a volume group:",
            terminal_blocks: [
                { command: "sudo vgcreate vg_data /dev/sdb1 /dev/sdc1", showPrompt: true },
                { command: "vgs", showPrompt: true, output: "// Display VG summary" }
            ],
            tips: [
                "You can later add more PVs to the VG if you need more space using `vgextend vg_data /dev/sdd1`."
            ]
        },
        {
            type: 'interactive',
            id: 'lv_creation',
            heading: 'Creating Logical Volumes',
            content: "Now create a logical volume from the volume group pool:",
            terminal_blocks: [
                { command: "sudo lvcreate -n lv_share -L 10G vg_data", showPrompt: true },
                { command: "sudo mkfs.xfs /dev/vg_data/lv_share", showPrompt: true },
                { command: "sudo mount /dev/vg_data/lv_share /mnt/data", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a small LV (e.g., 1G), format it, mount it, and create a test file inside." }
            ],
            tips: [
                "Use `-l 100%FREE` to create an LV using all remaining space in the VG."
            ]
        },
        {
            type: 'interactive',
            id: 'lv_extending',
            heading: 'Extending a Logical Volume',
            content: "Need more space? Extend the LV and grow the filesystem while it's mounted (zero downtime):",
            terminal_blocks: [
                { command: "sudo lvextend -L +5G /dev/vg_data/lv_share", showPrompt: true },
                { command: "sudo xfs_growfs /mnt/data", showPrompt: true, output: "// For XFS filesystems" },
                { command: "sudo resize2fs /dev/vg_data/lv_share", showPrompt: true, output: "// For ext4 filesystems" }
            ]
        },
        {
            type: 'interactive',
            id: 'lv_reducing',
            heading: 'Reducing a Logical Volume (Danger Zone)',
            content: "Shrinking is delicate. **XFS cannot shrink.** For ext4, follow these exact steps:",
            list: [
                "1. Unmount the filesystem.",
                "2. Run `e2fsck -f /dev/vg_data/lv_share`.",
                "3. Shrink the filesystem: `resize2fs /dev/vg_data/lv_share 8G`.",
                "4. Shrink the LV: `lvreduce -L 8G /dev/vg_data/lv_share`.",
                "5. Remount."
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "If you shrink the LV before the filesystem, you will lose data. Always shrink the filesystem first." }
            ]
        },
        {
            type: 'interactive',
            id: 'snapshots',
            heading: 'LVM Snapshots',
            content: "A snapshot freezes a point-in-time copy of a logical volume. Great for backups or testing.",
            terminal_blocks: [
                { command: "sudo lvcreate -n snap_share -L 1G -s /dev/vg_data/lv_share", showPrompt: true },
                { command: "sudo mount -o ro /dev/vg_data/snap_share /mnt/snapshot", showPrompt: true },
                { command: "sudo lvconvert --merge /dev/vg_data/snap_share", showPrompt: true, output: "// Roll back to the snapshot state" }
            ]
        },
        {
            type: 'interactive',
            id: 'removal',
            heading: 'Removing LVM Components',
            content: "Remove in reverse order: LV → VG → PV.",
            terminal_blocks: [
                { command: "sudo lvremove /dev/vg_data/lv_share", showPrompt: true },
                { command: "sudo vgremove vg_data", showPrompt: true },
                { command: "sudo pvremove /dev/sdb1", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting to grow the filesystem** – Extending the LV only increases the \"container\". Use `xfs_growfs` or `resize2fs` to use the space.",
                "**Trying to shrink XFS** – It is impossible to shrink XFS. You must backup, recreate, and restore.",
                "**Running out of VG space** – Snapshots and new LVs need free extents in the Volume Group."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You now have flexible storage. Next, we push into advanced storage features — Stratis and VDO.",
            list: [
                "`pvcreate`, `vgcreate`, `lvcreate` — The core LVM workflow.",
                "`lvextend + xfs_growfs` — Online expansion with zero downtime.",
                "`lvcreate -s` — Creating point-in-time snapshots.",
                "`lvremove`, `vgremove`, `pvremove` — Clean removal of the stack."
            ]
        }
    ]
};
