import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch06Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c06_e01',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'Which command lists all block devices?',
        options: ['lsblk', 'fdisk -l', 'df -h', 'mount'],
        correctAnswer: 'lsblk',
        explanation: 'lsblk lists storage devices in a tree view.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e02',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'fdisk /dev/sdb' do?",
        options: ['Opens the partition editor for disk sdb', 'Formats sdb', 'Lists partitions', 'Deletes sdb'],
        correctAnswer: 'Opens the partition editor for disk sdb',
        explanation: 'fdisk is an interactive partition manager.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e03',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you create an XFS filesystem on /dev/sdb1?',
        options: ['mkfs.xfs /dev/sdb1', 'mkfs.ext4 /dev/sdb1', 'format xfs /dev/sdb1', 'makefs xfs /dev/sdb1'],
        correctAnswer: 'mkfs.xfs /dev/sdb1',
        explanation: 'mkfs.xfs creates an XFS filesystem.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e04',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you create swap space on a partition?',
        options: ['mkswap /dev/sdb2', 'swapon /dev/sdb2', 'format swap /dev/sdb2', 'swapcreate /dev/sdb2'],
        correctAnswer: 'mkswap /dev/sdb2',
        explanation: 'mkswap prepares the partition for swapping.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e05',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'Which command activates a swap partition?',
        options: ['swapon /dev/sdb2', 'swapctl on /dev/sdb2', 'mount -t swap /dev/sdb2', 'enableswap /dev/sdb2'],
        correctAnswer: 'swapon /dev/sdb2',
        explanation: 'swapon enables the swap area.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e06',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you make a mount permanent across reboots?',
        options: ['Add an entry in /etc/fstab', 'Use mount -p', 'Run systemctl enable mount', 'Add to /etc/mounts'],
        correctAnswer: 'Add an entry in /etc/fstab',
        explanation: '/etc/fstab defines persistent mounts.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e07',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'Which command shows UUIDs of partitions?',
        options: ['blkid', 'lsblk -f', 'uuidgen', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'blkid and lsblk -f both display UUID.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e08',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'mount -a' do?",
        options: ["Mounts all filesystems listed in /etc/fstab", "Shows all mounts", "Unmounts everything", "Mounts with options"],
        correctAnswer: "Mounts all filesystems listed in /etc/fstab",
        explanation: "mount -a reads fstab and mounts missing entries.",
        difficulty: 'easy'
    },
    {
        id: 't2c06_e09',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'Which fdisk command writes the changes to disk?',
        options: ['w', 'q', 's', 'x'],
        correctAnswer: 'w',
        explanation: 'w writes the partition table.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e10',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'mkfs.ext4' create?",
        options: ["An ext4 filesystem", "An extended file", "A partition", "A swap area"],
        correctAnswer: "An ext4 filesystem",
        explanation: "mkfs.ext4 formats a partition with ext4.",
        difficulty: 'easy'
    },
    {
        id: 't2c06_e11',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you view the current swap usage?',
        options: ['free -h', 'swapon --show', 'cat /proc/swaps', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All three show swap status.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e12',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'parted /dev/sdc mklabel gpt' do?",
        options: [
            "Creates a GPT partition table on /dev/sdc",
            "Creates an MBR table",
            "Labels the disk",
            "Formats the disk"
        ],
        correctAnswer: "Creates a GPT partition table on /dev/sdc",
        explanation: "GPT is the modern partition table format.",
        difficulty: 'easy'
    },
    {
        id: 't2c06_e13',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you check a filesystem for errors?',
        options: ['fsck.ext4 /dev/sdb1', 'chkdsk /dev/sdb1', 'fscheck /dev/sdb1', 'scanfs /dev/sdb1'],
        correctAnswer: 'fsck.ext4 /dev/sdb1',
        explanation: 'fsck is the filesystem check tool.',
        difficulty: 'easy'
    },
    {
        id: 't2c06_e14',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'partprobe' do?",
        options: [
            "Informs the kernel of partition table changes",
            "Creates partitions",
            "Formats partitions",
            "Mounts all partitions"
        ],
        correctAnswer: "Informs the kernel of partition table changes",
        explanation: "partprobe re-reads partition tables without reboot.",
        difficulty: 'easy'
    },
    {
        id: 't2c06_e15',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'Which command shows mounted filesystems?',
        options: ['mount', 'df -h', 'lsblk', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All show mounted filesystems.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c06_m01',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'What is the difference between MBR and GPT partition tables?',
        options: [
            "MBR supports up to 2TB disks and 4 primary partitions; GPT overcomes these limits and supports >128 partitions",
            "No difference",
            "GPT is only for SSDs",
            "MBR is newer"
        ],
        correctAnswer: "MBR supports up to 2TB disks and 4 primary partitions; GPT overcomes these limits and supports >128 partitions",
        explanation: "GPT is the modern replacement for MBR.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m02',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you change the partition type in fdisk?',
        options: ['t', 'p', 'n', 'c'],
        correctAnswer: 't',
        explanation: 't changes the partition system ID.',
        difficulty: 'medium'
    },
    {
        id: 't2c06_m03',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What is the purpose of 'xfs_repair'?",
        options: [
            "Repairs an XFS filesystem",
            "Creates an XFS filesystem",
            "Debugs XFS",
            "Converts ext4 to XFS"
        ],
        correctAnswer: "Repairs an XFS filesystem",
        explanation: "xfs_repair fixes XFS filesystems.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m04',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you mount a filesystem by label?',
        options: ["mount LABEL=mylabel /mnt", "mount -L mylabel /mnt", "mount -l mylabel /mnt", "mount /dev/disk/by-label/mylabel /mnt"],
        correctAnswer: "mount /dev/disk/by-label/mylabel /mnt",
        explanation: "All are valid methods.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m05',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'mkfs.xfs -L mydata' do?",
        options: [
            "Sets the filesystem label to 'mydata'",
            "Creates a logical volume",
            "Links the filesystem",
            "Labels the partition type"
        ],
        correctAnswer: "Sets the filesystem label to 'mydata'",
        explanation: "-L assigns a human-readable label.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m06',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you expand a filesystem after extending the underlying partition?',
        options: [
            "For XFS: xfs_growfs /mountpoint; for ext4: resize2fs /dev/sdxN",
            "Reboot",
            "Reformat",
            "Use fsck"
        ],
        correctAnswer: "For XFS: xfs_growfs /mountpoint; for ext4: resize2fs /dev/sdxN",
        explanation: "Filesystem must be grown after partition resize.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m07',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'du -sh /data' show?",
        options: ["Total size of /data", "Disk usage of the filesystem", "Free space", "Number of files"],
        correctAnswer: "Total size of /data",
        explanation: "du estimates directory size.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m08',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you prevent a filesystem from being mounted at boot without deleting the fstab entry?',
        options: [
            "Add 'noauto' to the mount options in fstab",
            "Comment the line",
            "Delete the mountpoint",
            "Use umount -a"
        ],
        correctAnswer: "Add 'noauto' to the mount options in fstab",
        explanation: "noauto prevents automatic mounting.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m09',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'fsck -N' do?",
        options: [
            "Dry-run: shows what would be checked without actually doing it",
            "No check",
            "Non-interactive",
            "New filesystem check"
        ],
        correctAnswer: "Dry-run: shows what would be checked without actually doing it",
        explanation: "-N shows the check sequence.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m10',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you see detailed information about an ext4 filesystem?',
        options: ["tune2fs -l /dev/sdb1", "dumpe2fs /dev/sdb1", "fsck -l", "Both A and B"],
        correctAnswer: 'Both A and B',
        explanation: "tune2fs -l and dumpe2fs display superblock info.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m11',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'What is the default filesystem type on RHEL?',
        options: ["XFS", "ext4", "btrfs", "ntfs"],
        correctAnswer: "XFS",
        explanation: "XFS is the default in Red Hat Enterprise Linux.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m12',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you create a swap file of 1GB?',
        options: [
            "dd if=/dev/zero of=/swapfile bs=1M count=1024; mkswap /swapfile; swapon /swapfile",
            "touch /swapfile; swapon /swapfile",
            "fallocate -l 1G /swapfile; swapon /swapfile",
            "Both A and C"
        ],
        correctAnswer: 'Both A and C',
        explanation: "Both dd and fallocate with mkswap are valid.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m13',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'lsblk -f' show that 'lsblk' doesn't?",
        options: ["Filesystem type, label, and UUID", "Partition size", "Device major/minor", "Mount options"],
        correctAnswer: "Filesystem type, label, and UUID",
        explanation: "-f adds filesystem attributes.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m14',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you create a new partition that uses all remaining free space?',
        options: [
            "In fdisk, specify the last sector as the maximum default (usually press Enter at the prompt)",
            "fdisk --max",
            "parted mkpart full",
            "Not possible"
        ],
        correctAnswer: "In fdisk, specify the last sector as the maximum default (usually press Enter at the prompt)",
        explanation: "fdisk accepts the default for last sector to use all free space.",
        difficulty: 'medium'
    },
    {
        id: 't2c06_m15',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What is the 'defaults' mount option equivalent to?",
        options: [
            "rw, suid, dev, exec, auto, nouser, async",
            "ro",
            "noexec",
            "nodev"
        ],
        correctAnswer: "rw, suid, dev, exec, auto, nouser, async",
        explanation: "Defaults match standard behavior.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c06_h01',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you resize an XFS filesystem?',
        options: [
            "xfs_growfs /mountpoint (only grow; cannot shrink XFS)",
            "resize2fs",
            "xfs_shrink",
            "xfsadm"
        ],
        correctAnswer: "xfs_growfs /mountpoint (only grow; cannot shrink XFS)",
        explanation: "XFS supports online growth only.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h02',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'What is the difference between a primary, extended, and logical partition in MBR?',
        options: [
            "Primary partitions are limited to 4; extended is a container for logical partitions",
            "No difference",
            "Logical partitions are for boot",
            "Extended partitions are for swap"
        ],
        correctAnswer: "Primary partitions are limited to 4; extended is a container for logical partitions",
        explanation: "MBR scheme uses extended to overcome the 4 primary limit.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h03',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you check the alignment of a partition on a 4K sector disk?',
        options: [
            "Check that the start sector is divisible by 8 (for 512e disks)",
            "fdisk -l shows alignment",
            "parted align-check",
            "Both A and C"
        ],
        correctAnswer: 'Both A and C',
        explanation: "Alignment is crucial for performance.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h04',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'mkfs.xfs -f' do?",
        options: [
            "Force overwrite an existing filesystem signature",
            "Fast format",
            "Format without journal",
            "Create fragmented filesystem"
        ],
        correctAnswer: "Force overwrite an existing filesystem signature",
        explanation: "-f forces overwrite.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h05',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you convert an MBR disk to GPT without data loss?',
        options: [
            "Use 'gdisk' on the disk and convert (if space at beginning is available for GPT header)",
            "Not possible",
            "Reformat",
            "Use fdisk -g"
        ],
        correctAnswer: "Use 'gdisk' on the disk and convert (if space at beginning is available for GPT header)",
        explanation: "gdisk can convert MBR to GPT in some cases.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h06',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "A 'filesystem signature' is?",
        options: [
            "A unique identifier for the filesystem type (e.g., 'XFSB')",
            "A checksum",
            "A label",
            "A partition type"
        ],
        correctAnswer: "A unique identifier for the filesystem type (e.g., 'XFSB')",
        explanation: "It's how blkid identifies the filesystem.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h07',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you enable trim/discard for SSDs in fstab?',
        options: ["Add 'discard' mount option", "Use 'ssd' option", "Format with -K", "Only possible with ext4"],
        correctAnswer: "Add 'discard' mount option",
        explanation: "The 'discard' option enables online TRIM.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h08',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What does 'wipefs' do?",
        options: [
            "Wipes filesystem signatures from a device",
            "Formats the disk",
            "Zeroes the disk",
            "Deletes partitions"
        ],
        correctAnswer: "Wipes filesystem signatures from a device",
        explanation: "wipefs removes signatures so tools don't get confused.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h09',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you list the files inside a swap partition?',
        options: ["Not possible; swap is raw storage, no filesystem", "swapon -l", "mkswap -l", "ls /swap"],
        correctAnswer: "Not possible; swap is raw storage, no filesystem",
        explanation: "Swap area is not a filesystem.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h10',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What is the difference between 'swapon' and 'swapoff'?",
        options: [
            "swapon enables; swapoff disables swap",
            "They are the same",
            "swapoff creates swap",
            "swapon disables"
        ],
        correctAnswer: "swapon enables; swapoff disables swap",
        explanation: "Standard on/off.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h11',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you create a filesystem with a specific block size?',
        options: ["mkfs.ext4 -b 4096 /dev/sdb1", "mkfs.xfs -b size=4096", "format -b 4096", "Both A and B"],
        correctAnswer: "mkfs.ext4 -b 4096 /dev/sdb1",
        explanation: "ext4 allows -b; XFS uses -s for sector size, but block size is determined by stripe geometry.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h12',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What is the purpose of 'fsadm'?",
        options: [
            "Resize an ext4 filesystem (or LVM logical volumes) with a single command",
            "File system administration GUI",
            "Check filesystems",
            "Mount management"
        ],
        correctAnswer: "Resize an ext4 filesystem (or LVM logical volumes) with a single command",
        explanation: "fsadm handles combined LV+FS resize.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h13',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How do you check for bad blocks when creating a filesystem?',
        options: ["mkfs.ext4 -c /dev/sdb1", "fsck -c", "badblocks", "Both A and C"],
        correctAnswer: 'Both A and C',
        explanation: "-c triggers a read-only bad block check.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h14',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: "What is the 'nofail' mount option useful for?",
        options: [
            "Prevents boot failure if the filesystem cannot be mounted",
            "Forces mount",
            "Disables checking",
            "Mounts read-only"
        ],
        correctAnswer: "Prevents boot failure if the filesystem cannot be mounted",
        explanation: "nofail is critical for removable or non-critical filesystems.",
        difficulty: 'hard'
    },
    {
        id: 't2c06_h15',
        chapterId: 'track2-ch06',
        type: 'mcq',
        question: 'How can you create a file system directly on a disk without partitioning?',
        options: [
            "mkfs.xfs /dev/sdb (unpartitioned disk) — possible but rarely recommended; the kernel will treat it as a single 'partition'",
            "Not possible",
            "Requires GPT",
            "Must use parted"
        ],
        correctAnswer: "mkfs.xfs /dev/sdb (unpartitioned disk) — possible but rarely recommended; the kernel will treat it as a single 'partition'",
        explanation: "You can format the whole device, but creating a partition is best practice.",
        difficulty: 'hard'
    }
];
