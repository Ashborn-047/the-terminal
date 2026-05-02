import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch07Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c07_e01',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'Which command initializes a disk as an LVM Physical Volume?',
        options: ['pvcreate', 'vgcreate', 'lvcreate', 'mkfs.lvm'],
        correctAnswer: 'pvcreate',
        explanation: 'pvcreate prepares a device for LVM.',
        difficulty: 'easy'
    },
    {
        id: 't2c07_e02',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'vgcreate vg_data /dev/sdb1' do?",
        options: [
            "Creates a volume group named vg_data using /dev/sdb1",
            "Creates a virtual disk",
            "Deletes a volume group",
            "Formats the disk"
        ],
        correctAnswer: "Creates a volume group named vg_data using /dev/sdb1",
        explanation: "vgcreate builds a volume group from physical volumes.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e03',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "How do you create a logical volume of 10G named 'lv_data'?",
        options: [
            "lvcreate -n lv_data -L 10G vg_data",
            "lvcreate -L 10G vg_data lv_data",
            "mkfs.lv 10G vg_data lv_data",
            "create lv_data 10G"
        ],
        correctAnswer: "lvcreate -n lv_data -L 10G vg_data",
        explanation: "-n specifies the name, -L the size.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e04',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What device path does an LVM logical volume typically get?',
        options: ["/dev/vgname/lvname", "/dev/lvname", "/dev/mapper/lvname", "/dev/disk/by-lvname"],
        correctAnswer: "/dev/vgname/lvname",
        explanation: "It's accessible via /dev/vgname/lvname and /dev/mapper.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e05',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'Which command extends a logical volume?',
        options: ["lvextend", "lvextendfs", "resize2fs", "xfs_growfs"],
        correctAnswer: "lvextend",
        explanation: "lvextend adds extents to the LV.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e06',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you grow an XFS filesystem after extending the LV?',
        options: ["xfs_growfs mountpoint", "resize2fs", "xfs_admin", "xfs_growlv"],
        correctAnswer: "xfs_growfs mountpoint",
        explanation: "xfs_growfs expands the filesystem to fill the LV.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e07',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What command shows information about all physical volumes?',
        options: ["pvs", "pvdisplay", "lvdisplay", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "pvs is a compact view; pvdisplay is detailed.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e08',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you create a snapshot of a logical volume?',
        options: [
            "lvcreate -n snap -L 1G -s /dev/vg/lv",
            "lvsnapshot -n snap /dev/vg/lv",
            "vgsnapshot",
            "snapshot create"
        ],
        correctAnswer: "lvcreate -n snap -L 1G -s /dev/vg/lv",
        explanation: "-s stands for snapshot.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e09',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you remove a logical volume?',
        options: ["lvremove /dev/vg/lv", "lvreduce", "lvdelete", "dellv"],
        correctAnswer: "lvremove /dev/vg/lv",
        explanation: "lvremove deletes the LV.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e10',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What is the correct order to remove LVM components?',
        options: ["LV → VG → PV", "PV → VG → LV", "VG → LV → PV", "Any order"],
        correctAnswer: "LV → VG → PV",
        explanation: "You must remove the LV first, then the VG, then the PV.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e11',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you list all logical volumes?',
        options: ["lvs", "lvdisplay", "lsblk", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "lvs is the compact version, lvdisplay detailed.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e12',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'vgextend vg_data /dev/sdc1' do?",
        options: [
            "Adds /dev/sdc1 to the volume group vg_data",
            "Extends a logical volume",
            "Creates a new VG",
            "Removes a PV from the VG"
        ],
        correctAnswer: "Adds /dev/sdc1 to the volume group vg_data",
        explanation: "vgextend increases the capacity pool.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e13',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you format a logical volume with XFS?',
        options: ["mkfs.xfs /dev/vg/lv", "format.xfs /dev/vg/lv", "xfs_format /dev/vg/lv", "makexfs /dev/vg/lv"],
        correctAnswer: "mkfs.xfs /dev/vg/lv",
        explanation: "mkfs.xfs works on LVs just like partitions.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e14',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'lvcreate -l 100%FREE -n lv_data vg_data' do?",
        options: [
            "Creates a logical volume using all remaining free space in the VG",
            "Creates a 100MB LV",
            "Uses 100% of the disk",
            "Error"
        ],
        correctAnswer: "Creates a logical volume using all remaining free space in the VG",
        explanation: "-l selects a percentage of free extents.",
        difficulty: 'easy'
    },
    {
        id: 't2c07_e15',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'Can you mount a snapshot volume?',
        options: ["Yes, it's mountable like any other LV", "No", "Only read-only", "Only if it's active"],
        correctAnswer: "Yes, it's mountable like any other LV",
        explanation: "Snapshots are usable as regular volumes.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c07_m01',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What is the difference between 'lvextend -L +5G' and 'lvextend -L 15G'?",
        options: [
            "The former adds 5G to the current size; the latter sets the size to 15G",
            "No difference",
            "-L 15G is invalid",
            "The + is required"
        ],
        correctAnswer: "The former adds 5G to the current size; the latter sets the size to 15G",
        explanation: "Relative (+5G) vs absolute (15G).",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m02',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "Why can't you shrink an XFS filesystem?",
        options: [
            "The XFS code does not support shrinking; its design choice",
            "It is possible but risky",
            "You can with xfs_repair",
            "Only under kernel 5.x"
        ],
        correctAnswer: "The XFS code does not support shrinking; its design choice",
        explanation: "XFS was designed to grow but not shrink.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m03',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What is the purpose of 'pvscan'?",
        options: [
            "Scans all disks for LVM physical volumes",
            "Scans for viruses",
            "Scans the VG",
            "Mounts all PVs"
        ],
        correctAnswer: "Scans all disks for LVM physical volumes",
        explanation: "pvscan updates the LVM cache of PVs.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m04',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you move data from one PV to another within the same VG?',
        options: ["pvmove /dev/oldpv /dev/newpv", "lvmove", "pvtransfer", "Not possible"],
        correctAnswer: "pvmove /dev/oldpv /dev/newpv",
        explanation: "pvmove migrates extents online.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m05',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'lvs -a' show?",
        options: [
            "All logical volumes including internal ones like snapshots and mirrors",
            "Active LVs only",
            "Archived LVs",
            "Authentication"
        ],
        correctAnswer: "All logical volumes including internal ones like snapshots and mirrors",
        explanation: "-a shows internal LVs.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m06',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What happens if you run 'lvextend' but forget to grow the filesystem?",
        options: [
            "The LV increases, but df still shows the old size",
            "The LV stays the same",
            "The filesystem is corrupted",
            "Nothing"
        ],
        correctAnswer: "The LV increases, but df still shows the old size",
        explanation: "The filesystem must be expanded separately.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m07',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you remove a physical volume from a volume group?',
        options: ["vgreduce vg_data /dev/sdb1", "pvremove /dev/sdb1", "lvremove vg_data", "vgremove vg_data"],
        correctAnswer: "vgreduce vg_data /dev/sdb1",
        explanation: "vgreduce removes a PV from the VG (if there's free space elsewhere).",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m08',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'lvdisplay -m' show?",
        options: ["The mapping of logical extents to physical extents", "Memory usage", "Mount points", "Mirror status"],
        correctAnswer: "The mapping of logical extents to physical extents",
        explanation: "-m shows the device mapping.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m09',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you rename a logical volume?',
        options: ["lvrename vg oldname newname", "lvm rename", "mv /dev/vg/old /dev/vg/new", "Both A and C"],
        correctAnswer: "lvrename vg oldname newname",
        explanation: "lvrename is the proper way.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m10',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What is a thin provisioned logical volume?',
        options: [
            "An LV that allocates space on demand from a thin pool, not fully at creation",
            "A small LV",
            "An LV without a filesystem",
            "A readonly LV"
        ],
        correctAnswer: "An LV that allocates space on demand from a thin pool, not fully at creation",
        explanation: "Thin provisioning overcommits storage.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m11',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you create a volume group with a specific extent size?',
        options: ["vgcreate -s 16M vg_data /dev/sdb1", "vgcreate --size 16M", "pvcreate --size", "Not possible"],
        correctAnswer: "vgcreate -s 16M vg_data /dev/sdb1",
        explanation: "-s sets the PE (Physical Extent) size.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m12',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'lvconvert --merge' do?",
        options: [
            "Merges a snapshot back into the original LV",
            "Converts LV type",
            "Merges two LVs",
            "Creates a mirror"
        ],
        correctAnswer: "Merges a snapshot back into the original LV",
        explanation: "Merge rolls back to the snapshot state.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m13',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you deactivate a logical volume?',
        options: ["lvchange -an vg/lv", "lvoff", "umount", "lvdeactivate"],
        correctAnswer: "lvchange -an vg/lv",
        explanation: "lvchange -a n deactivates the LV.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m14',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What is the default PE size?',
        options: ["4 MB", "8 MB", "16 MB", "1 MB"],
        correctAnswer: "4 MB",
        explanation: "The default physical extent size on most distributions is 4 MB.",
        difficulty: 'medium'
    },
    {
        id: 't2c07_m15',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you create a logical volume that is striped across PVs?',
        options: [
            "lvcreate -i 2 -n lv_stripe -L 10G vg_data",
            "lvcreate --stripe 2",
            "mkfs.lvm --raid0",
            "Not possible"
        ],
        correctAnswer: "lvcreate -i 2 -n lv_stripe -L 10G vg_data",
        explanation: "-i specifies the stripe count.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c07_h01',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What is the difference between a linear LV and a striped LV?',
        options: [
            "Linear writes to one PV then the next; striped interleaves writes for performance",
            "No difference",
            "Striped is for SSDs only",
            "Linear is faster"
        ],
        correctAnswer: "Linear writes to one PV then the next; striped interleaves writes for performance",
        explanation: "Striping distributes I/O across multiple PVs.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h02',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How does LVM mirroring work?',
        options: [
            "lvconvert -m1 vg/lv creates a mirrored LV (RAID1)",
            "lvcreate --mirror 1",
            "It's not supported",
            "Only via mdadm"
        ],
        correctAnswer: "lvconvert -m1 vg/lv creates a mirrored LV (RAID1)",
        explanation: "LVM can mirror (RAID1) using lvconvert.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h03',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What is a thin pool and how does it differ from a regular VG?',
        options: [
            "A thin pool allows over-provisioning and snapshots of thin volumes",
            "A smaller VG",
            "A pool for SSDs",
            "A cache pool"
        ],
        correctAnswer: "A thin pool allows over-provisioning and snapshots of thin volumes",
        explanation: "Thin provisioning allocates blocks on demand.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h04',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you view the layout of physical extents for an LV?',
        options: ["pvdisplay -m", "lvdisplay -m", "pvs -o+pe", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "Multiple commands show extent mapping.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h05',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you restore an LVM configuration backup?',
        options: [
            "Use 'vgcfgrestore' from the backup in /etc/lvm/archive",
            "Not possible",
            "Use lvm backup",
            "Copy /etc/lvm/backup/"
        ],
        correctAnswer: "Use 'vgcfgrestore' from the backup in /etc/lvm/archive",
        explanation: "vgcfgrestore reverts LVM metadata.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h06',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What happens if a PV in a VG fails?',
        options: [
            "The VG is lost if it's not redundant; all LVs may be affected",
            "Only the LV using that PV is gone",
            "LVM automatically recovers",
            "Nothing"
        ],
        correctAnswer: "The VG is lost if it's not redundant; all LVs may be affected",
        explanation: "Without RAID/mirroring, a PV failure damages the VG.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h07',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you split a volume group into two?',
        options: ["vgsplit", "vgmerge", "pvsplit", "lvsplit"],
        correctAnswer: "vgsplit",
        explanation: "vgsplit divides a VG.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h08',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you import a foreign volume group?',
        options: ["vgimport vg_name", "pvimport", "lvm import", "scan_vg"],
        correctAnswer: "vgimport vg_name",
        explanation: "vgimport registers a VG from another system.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h09',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What is the function of 'pvmove'?",
        options: [
            "Moves data from one PV to another within the VG without downtime",
            "Moves LVs to another VG",
            "Copies files",
            "Moves the mountpoint"
        ],
        correctAnswer: "Moves data from one PV to another within the VG without downtime",
        explanation: "pvmove relocates extents.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h10',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'What is an orphaned PV?',
        options: [
            "A PV that is not part of any VG",
            "A lost PV",
            "A deleted PV",
            "A backup PV"
        ],
        correctAnswer: "A PV that is not part of any VG",
        explanation: "Orphan PVs are visible but unassigned.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h11',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "How can you set a disk as a 'physical volume for the whole disk' without partitioning?",
        options: [
            "pvcreate /dev/sdb",
            "fdisk /dev/sdb then pvcreate",
            "parted /dev/sdb mklabel then pvcreate",
            "Not possible"
        ],
        correctAnswer: "pvcreate /dev/sdb",
        explanation: "pvcreate can be used directly on a disk device.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h12',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'lvmdiskscan' do?",
        options: [
            "Scans for all visible block devices that could be PVs",
            "Scans for LVs",
            "Scans for mounted disks",
            "Scans for errors"
        ],
        correctAnswer: "Scans for all visible block devices that could be PVs",
        explanation: "It's a discover utility.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h13',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How can you permanently remove the LVM metadata from a disk?',
        options: ["pvremove /dev/sdb1", "wipefs -a /dev/sdb1", "dd if=/dev/zero of=/dev/sdb1 count=1", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "pvremove or wipefs are needed.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h14',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: "What does 'lvchange -p rw' do?",
        options: ["Sets the LV permission to read-write", "Changes the policy", "Protects the LV", "Changes priority"],
        correctAnswer: "Sets the LV permission to read-write",
        explanation: "-p sets permission flags.",
        difficulty: 'hard'
    },
    {
        id: 't2c07_h15',
        chapterId: 'track2-ch07',
        type: 'mcq',
        question: 'How do you monitor the progress of pvmove?',
        options: ["lvs -a", "pvmove --progress", "lvmove status", "dmsetup status"],
        correctAnswer: "pvmove --progress",
        explanation: "pvmove can report progress with --progress.",
        difficulty: 'hard'
    }
];
