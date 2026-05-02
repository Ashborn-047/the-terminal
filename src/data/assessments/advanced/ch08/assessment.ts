import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch08Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c08_e01',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Which command creates a Stratis pool named \'mypool\'?',
        options: [
            "stratis pool create mypool /dev/sdb",
            "stratis create pool mypool /dev/sdb",
            "pool create mypool",
            "mkpool mypool /dev/sdb"
        ],
        correctAnswer: "stratis pool create mypool /dev/sdb",
        explanation: "Stratis uses 'stratis pool create'.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e02',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you create a filesystem in a Stratis pool?',
        options: [
            "stratis filesystem create mypool fs1",
            "mkfs.stratis mypool/fs1",
            "stratis mkfs mypool fs1",
            "stratis pool mkfs fs1"
        ],
        correctAnswer: "stratis filesystem create mypool fs1",
        explanation: "stratis filesystem create <pool> <fsname>.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e03',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Where are Stratis filesystems mounted from?',
        options: ["/stratis/poolname/fsname", "/dev/stratis/fsname", "/mnt/stratis", "/stratis/fsname"],
        correctAnswer: "/stratis/poolname/fsname",
        explanation: "The standard mount path uses /stratis/.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e04',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What does VDO stand for?',
        options: [
            "Virtual Data Optimizer",
            "Very Dense Operations",
            "Volume Deduplication Object",
            "Virtual Disk Overlay"
        ],
        correctAnswer: "Virtual Data Optimizer",
        explanation: "VDO is Red Hat's deduplication technology.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e05',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Which command creates a VDO volume?',
        options: [
            "vdo create --name=vdo1 --device=/dev/sdd --vdoLogicalSize=50G",
            "vdo make vdo1",
            "createvdo vdo1",
            "mkvdo /dev/sdd vdo1"
        ],
        correctAnswer: "vdo create --name=vdo1 --device=/dev/sdd --vdoLogicalSize=50G",
        explanation: "vdo create requires name, device, and logical size.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e06',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the block device name for a VDO volume called \'vdo1\'?',
        options: [
            "/dev/mapper/vdo1",
            "/dev/vdo1",
            "/dev/disk/vdo1",
            "/dev/block/vdo1"
        ],
        correctAnswer: "/dev/mapper/vdo1",
        explanation: "VDO volumes appear under /dev/mapper/.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e07',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Which option to mkfs.xfs is recommended for VDO?',
        options: ["-K", "-f", "-L", "-b"],
        correctAnswer: "-K",
        explanation: "-K avoids preallocating the entire logical size.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e08',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you view VDO deduplication statistics?',
        options: ["vdostats --human-readable", "vdo stat", "vdoinfo", "vdo -s"],
        correctAnswer: "vdostats --human-readable",
        explanation: "vdostats shows space savings.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e09',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the purpose of Stratis snapshots?',
        options: [
            "Point-in-time copies of filesystems",
            "Backup of the whole pool",
            "Temporary space",
            "Replication"
        ],
        correctAnswer: "Point-in-time copies of filesystems",
        explanation: "Snapshots preserve state for recovery.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e10',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you add more disks to a Stratis pool?',
        options: [
            "stratis pool add-data mypool /dev/sdc",
            "stratis pool extend mypool /dev/sdc",
            "vgextend mypool /dev/sdc",
            "Not possible"
        ],
        correctAnswer: "stratis pool add-data mypool /dev/sdc",
        explanation: "add-data adds disk space to the pool.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e11',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Which service must be running for Stratis?',
        options: ["stratisd", "stratis", "stratis-daemon", "stratismgr"],
        correctAnswer: "stratisd",
        explanation: "stratisd.service manages Stratis.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e12',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is VDO?',
        options: ["Virtual Data Optimizer", "Volume Dedup Object", "Virtual Disk Overlay", "Very Dense Operations"],
        correctAnswer: "Virtual Data Optimizer",
        explanation: "It's a kernel module for inline dedup and compression.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e13',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you list Stratis pools?',
        options: ["stratis pool list", "stratis list pools", "pool list", "stratis show"],
        correctAnswer: "stratis pool list",
        explanation: "stratis pool list is the command.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e14',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is thin provisioning?',
        options: [
            "Allocating space on demand rather than at creation",
            "Using small disks",
            "Partitioning",
            "Formatting"
        ],
        correctAnswer: "Allocating space on demand rather than at creation",
        explanation: "Both Stratis and VDO support thin provisioning.",
        difficulty: 'easy'
    },
    {
        id: 't2c08_e15',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you destroy a Stratis filesystem?',
        options: [
            "stratis filesystem destroy mypool fs1",
            "rm -rf /stratis/mypool/fs1",
            "stratis pool destroy mypool",
            "lvremove"
        ],
        correctAnswer: "stratis filesystem destroy mypool fs1",
        explanation: "stratis filesystem destroy removes the filesystem.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c08_m01',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How does VDO deduplication work?',
        options: [
            "It replaces duplicate data blocks with references to a single stored block",
            "It compresses files",
            "It deletes duplicates",
            "It just compresses"
        ],
        correctAnswer: "It replaces duplicate data blocks with references to a single stored block",
        explanation: "Inline dedup identifies identical blocks and stores references.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m02',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Can Stratis be used on a single disk?',
        options: [
            "Yes, a pool can contain just one device",
            "No, minimum 2",
            "Only for snapshots",
            "Only for testing"
        ],
        correctAnswer: "Yes, a pool can contain just one device",
        explanation: "Stratis works even with a single drive.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m03',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the maximum VDO logical size recommended?',
        options: [
            "Up to 4 PB, but depends on kernel and hardware",
            "Exactly 50G",
            "Unlimited",
            "Same as physical size"
        ],
        correctAnswer: "Up to 4 PB, but depends on kernel and hardware",
        explanation: "VDO supports massive logical spaces.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m04',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you make fstab mount a Stratis filesystem?',
        options: [
            "Add a line with '/stratis/pool/fsname /mountpoint xfs defaults 0 0'",
            "Use /dev/stratis/...",
            "Stratis manages mounts",
            "Not needed"
        ],
        correctAnswer: "Add a line with '/stratis/pool/fsname /mountpoint xfs defaults 0 0'",
        explanation: "Standard fstab entry with the Stratis path.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m05',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: "What does 'stratis pool add-cache' do?",
        options: [
            "Adds a fast device (SSD) as a cache tier",
            "Adds more storage",
            "Clears cache",
            "Increases memory"
        ],
        correctAnswer: "Adds a fast device (SSD) as a cache tier",
        explanation: "Cache improves performance.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m06',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: "What is the difference between 'vdo create' and 'vdocreate'?",
        options: [
            "No difference, but the standard syntax is 'vdo create'",
            "vdocreate is older",
            "vdo create is for logical volume",
            "vdocreate is a typo"
        ],
        correctAnswer: "No difference, but the standard syntax is 'vdo create'",
        explanation: "The official command is `vdo`.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m07',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you grow a Stratis filesystem?',
        options: [
            "Stratis filesystems are thin-provisioned and don't need growing; they expand as data is written",
            "Use xfs_growfs",
            "Use lvextend",
            "Not possible"
        ],
        correctAnswer: "Stratis filesystems are thin-provisioned and don't need growing; they expand as data is written",
        explanation: "Stratis filesystems are on a thin pool.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m08',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: "What does 'vdo stop --name vdo1' do?",
        options: ["Shuts down the VDO volume", "Stops deduplication", "Pauses VDO", "Deletes VDO"],
        correctAnswer: "Shuts down the VDO volume",
        explanation: "vdo stop deactivates the volume.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m09',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Which package provides the VDO kernel module?',
        options: ["kmod-kvdo", "vdo", "vdo-utils", "kernel-vdo"],
        correctAnswer: "kmod-kvdo",
        explanation: "kmod-kvdo is the kernel driver.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m10',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you monitor pool space in Stratis?',
        options: ["stratis pool list", "stratis pool info", "df -h /stratis/pool", "Both A and C"],
        correctAnswer: "Both A and C",
        explanation: "stratis pool list shows physical and logical usage.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m11',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the default compression algorithm in VDO?',
        options: ["LZ4", "Zstd", "Gzip", "None"],
        correctAnswer: "LZ4",
        explanation: "VDO uses LZ4 for speed.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m12',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you restore a Stratis snapshot?',
        options: [
            "Mount the snapshot and copy files, or use it to replace the original",
            "snapshot restore",
            "stratis pool revert",
            "Not possible"
        ],
        correctAnswer: "Mount the snapshot and copy files, or use it to replace the original",
        explanation: "Snapshots are filesystems you can mount.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m13',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'Can VDO be used on top of an LVM logical volume?',
        options: [
            "Yes, VDO can be built on an LV, then a filesystem on VDO",
            "No, only on raw disks",
            "Only on Stratis",
            "Only on physical partitions"
        ],
        correctAnswer: "Yes, VDO can be built on an LV, then a filesystem on VDO",
        explanation: "VDO is a block layer, works on any block device.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m14',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the advantage of using Stratis over plain LVM?',
        options: [
            "Simplified management, integrated thin provisioning and snapshots",
            "Faster performance",
            "More features",
            "Cheapers"
        ],
        correctAnswer: "Simplified management, integrated thin provisioning and snapshots",
        explanation: "Stratis abstracts LVM complexity.",
        difficulty: 'medium'
    },
    {
        id: 't2c08_m15',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you list active VDO volumes?',
        options: ["vdo list", "vdostats --list", "lvdisplay", "vdoinfo"],
        correctAnswer: "vdo list",
        explanation: "vdo list shows configured volumes.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c08_h01',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the difference between Stratis and LVM thin provisioning?',
        options: [
            "Stratis uses LVM thin pools under the hood, but provides a simpler API",
            "No underlying LVM",
            "Stratis is completely separate",
            "LVM thin pools don't support snapshots"
        ],
        correctAnswer: "Stratis uses LVM thin pools under the hood, but provides a simpler API",
        explanation: "Stratis uses LVM and XFS internally.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h02',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How does VDO handle data that doesn\'t deduplicate well (e.g., encrypted data)?',
        options: [
            "It still attempts dedup but will compress when possible; no data loss",
            "It fails",
            "It ignores that data",
            "It only works on text"
        ],
        correctAnswer: "It still attempts dedup but will compress when possible; no data loss",
        explanation: "VDO always writes, dedup is opportunistic.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h03',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the \'index\' in VDO?',
        options: [
            "A hash-based lookup structure for deduplication",
            "File index",
            "Inode table",
            "Directory listing"
        ],
        correctAnswer: "A hash-based lookup structure for deduplication",
        explanation: "The UDS index holds block fingerprints.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h04',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you encrypt a Stratis pool?',
        options: [
            "Use LUKS on the underlying devices before adding to the pool",
            "Stratis encrypt by default",
            "Not supported",
            "With stratis encrypt command"
        ],
        correctAnswer: "Use LUKS on the underlying devices before adding to the pool",
        explanation: "Stratis does not provide native encryption; disk encryption must be applied below.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h05',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the \'metadata volume\' in VDO?',
        options: [
            "Internal volume that stores deduplication index and configuration",
            "The filesystem",
            "Swap",
            "Backup"
        ],
        correctAnswer: "Internal volume that stores deduplication index and configuration",
        explanation: "Metadata must be stored separately.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h06',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you move a Stratis pool to another system?',
        options: [
            "Stop stratisd, move the disks, start stratisd and the pool is imported automatically",
            "Not possible",
            "Use stratis export/import",
            "Only by copying files"
        ],
        correctAnswer: "Stop stratisd, move the disks, start stratisd and the pool is imported automatically",
        explanation: "Stratis uses LVM; moving disks preserves the pool.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h07',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What does \'vdo remove\' do?',
        options: [
            "Removes the VDO volume configuration but keeps the data? (depends; usually deletes)",
            "Stops VDO",
            "Unmounts",
            "Reduces size"
        ],
        correctAnswer: "Removes the VDO volume configuration but keeps the data? (depends; usually deletes)",
        explanation: "vdo remove deletes the volume.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h08',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you convert a VDO volume to a physical volume for LVM?',
        options: [
            "pvcreate /dev/mapper/vdo1",
            "Not possible",
            "vdo convert",
            "vgcreate vdo1 /dev/mapper/vdo1"
        ],
        correctAnswer: "pvcreate /dev/mapper/vdo1",
        explanation: "You can layer LVM on VDO.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h09',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What does the VDO \'ack\' thread do?',
        options: [
            "Acknowledges writes to the upper layer after data is stored",
            "Not relevant",
            "ACK network requests",
            "Compression thread"
        ],
        correctAnswer: "Acknowledges writes to the upper layer after data is stored",
        explanation: "It's part of the VDO I/O path.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h10',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you adjust the VDO index memory size?',
        options: [
            "Specify --indexMem when creating the VDO volume",
            "vdo tune",
            "Edit /etc/vdo.conf",
            "Not possible"
        ],
        correctAnswer: "Specify --indexMem when creating the VDO volume",
        explanation: "Index memory is set at creation.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h11',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What happens if the physical backing of a VDO volume runs out of space?',
        options: [
            "Writes fail, and the filesystem may go read-only",
            "It automatically extends",
            "It uses swap",
            "Nothing"
        ],
        correctAnswer: "Writes fail, and the filesystem may go read-only",
        explanation: "Out-of-space errors propagate.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h12',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is the purpose of the \'block map cache\' in VDO?',
        options: [
            "Caches logical-to-physical block mappings for performance",
            "File cache",
            "Index cache",
            "Network cache"
        ],
        correctAnswer: "Caches logical-to-physical block mappings for performance",
        explanation: "Improves read performance.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h13',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How can you monitor VDO\'s index health?',
        options: ["vdostats --verbose", "vdo status", "cat /sys/kvdo/vdo1/...", "Not possible"],
        correctAnswer: "vdostats --verbose",
        explanation: "Detailed stats are available via sysfs and vdostats.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h14',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'What is Stratis\'s dependency on the XFS filesystem?',
        options: [
            "Each Stratis filesystem is formatted as XFS internally",
            "It uses ext4",
            "It's independent",
            "It uses btrfs"
        ],
        correctAnswer: "Each Stratis filesystem is formatted as XFS internally",
        explanation: "Stratis creates XFS on top.",
        difficulty: 'hard'
    },
    {
        id: 't2c08_h15',
        chapterId: 'track2-ch08',
        type: 'mcq',
        question: 'How do you remove a disk from a Stratis pool?',
        options: [
            "Currently not directly supported; you must destroy and recreate",
            "stratis pool remove-data",
            "vgreduce",
            "pvmove"
        ],
        correctAnswer: "Currently not directly supported; you must destroy and recreate",
        explanation: "Stratis can add but cannot yet remove a single disk from a pool.",
        difficulty: 'hard'
    }
];
