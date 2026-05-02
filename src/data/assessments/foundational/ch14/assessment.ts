import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch14Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch14_e01',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'Which command lists all block devices and their mountpoints?',
        options: ['lsblk', 'blkid', 'fdisk -l', 'mount'],
        correctAnswer: 'lsblk',
        explanation: 'lsblk shows a tree of block devices with size and mountpoint.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e02',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you manually mount /dev/sdb1 to /mnt/data?',
        options: ['mount /dev/sdb1 /mnt/data', 'mount -t /dev/sdb1 /mnt/data', 'attach /dev/sdb1 /mnt/data', 'fmount /dev/sdb1 /data'],
        correctAnswer: 'mount /dev/sdb1 /mnt/data',
        explanation: 'mount device mountpoint.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e03',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'Which command unmounts /mnt/data?',
        options: ['umount /mnt/data', 'unmount /mnt/data', 'mount -u /mnt/data', 'detach /mnt/data'],
        correctAnswer: 'umount /mnt/data',
        explanation: "umount is the correct spelling (no 'n').",
        difficulty: 'easy'
    },
    {
        id: 'ch14_e04',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'Where are permanent mount definitions stored?',
        options: ['/etc/fstab', '/etc/mount.conf', '/etc/filesystems', '/etc/mtab'],
        correctAnswer: '/etc/fstab',
        explanation: 'fstab lists static filesystem mounts.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e05',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'df -h' show?",
        options: [
            'Disk space usage in human-readable format',
            'Directory files',
            'Disk format',
            'Hardware info'
        ],
        correctAnswer: 'Disk space usage in human-readable format',
        explanation: 'df displays free space; -h makes it readable.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e06',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you find the total size of a directory?',
        options: ['du -sh dir', 'df -h dir', 'ls -l dir', 'dirsize dir'],
        correctAnswer: 'du -sh dir',
        explanation: 'du estimates file space usage.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e07',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'Which command shows UUIDs and filesystem types?',
        options: ['blkid', 'lsblk -f', 'fdisk -l', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'blkid and lsblk -f both show filesystem attributes.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e08',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you find all .log files under /var?',
        options: ['find /var -name "*.log"', 'locate *.log', 'ls /var/*.log', 'find /var -type log'],
        correctAnswer: 'find /var -name "*.log"',
        explanation: 'find with -name searches by pattern.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e09',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "Which command shows which executable runs when you type 'python'?",
        options: ['which python', 'whereis python', 'locate python', 'find python'],
        correctAnswer: 'which python',
        explanation: 'which searches PATH for executables.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e10',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'mount -a' do?",
        options: [
            'Mounts all filesystems listed in /etc/fstab',
            'Shows all mounts',
            'Automounts USB drives',
            'Unmounts all'
        ],
        correctAnswer: 'Mounts all filesystems listed in /etc/fstab',
        explanation: 'mount -a reads fstab and mounts everything not already mounted.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e11',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you find files larger than 10MB?',
        options: ['find / -type f -size +10M', 'find / -size +10M', 'find / -type f -size 10M', 'find -bigger 10M'],
        correctAnswer: 'find / -type f -size +10M',
        explanation: '-size +10M matches files larger than 10 megabytes.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e12',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'fdisk -l' show?",
        options: ['Partition tables of disks', 'File system usage', 'File contents', 'Disk performance'],
        correctAnswer: 'Partition tables of disks',
        explanation: 'fdisk lists partition information.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e13',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you create an ext4 filesystem on /dev/sdb1?',
        options: ['mkfs.ext4 /dev/sdb1', 'mkfs -t ext4 /dev/sdb1', 'format /dev/sdb1', 'mke2fs /dev/sdb1'],
        correctAnswer: 'mkfs.ext4 /dev/sdb1',
        explanation: 'mkfs.ext4 creates an ext4 filesystem.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e14',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'lsof /mnt/data' show?",
        options: [
            'Processes using files in /mnt/data',
            'List of files',
            'Open fonts',
            'Symbolic links'
        ],
        correctAnswer: 'Processes using files in /mnt/data',
        explanation: 'lsof lists open files.',
        difficulty: 'easy'
    },
    {
        id: 'ch14_e15',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you update the locate database?',
        options: ['sudo updatedb', 'locate --update', 'updatedb', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'updatedb refreshes the database; requires sudo.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch14_m01',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'What is a UUID and why is it used in fstab?',
        options: [
            'Universally Unique Identifier; it remains consistent even if device names change',
            'User Unique ID',
            'Unit ID',
            'Uniform User ID'
        ],
        correctAnswer: 'Universally Unique Identifier; it remains consistent even if device names change',
        explanation: 'UUID avoids the problem of /dev/sda becoming /dev/sdb after reboot.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m02',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'lsblk -f' display that 'lsblk' alone does not?",
        options: ['Filesystem type and UUID', 'Partition size', 'Mount options', 'Inode count'],
        correctAnswer: 'Filesystem type and UUID',
        explanation: '-f adds filesystem attributes.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m03',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "How do you unmount a filesystem that is 'busy'?",
        options: [
            'Find processes using it (lsof, fuser) and terminate them, then umount',
            'umount -f',
            'umount --force',
            'Reboot'
        ],
        correctAnswer: 'Find processes using it (lsof, fuser) and terminate them, then umount',
        explanation: 'You need to free any open files or processes.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m04',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'find -mtime -7' mean?",
        options: [
            'Files modified in the last 7 days',
            'Files older than 7 days',
            'Files exactly 7 days old',
            'Files modified 7 times'
        ],
        correctAnswer: 'Files modified in the last 7 days',
        explanation: '-mtime -7 selects files with modification time less than 7 days ago.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m05',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "How do you execute 'gzip' on every .log file found by find?",
        options: ["find . -name '*.log' -exec gzip {} \\;", "find . -name '*.log' | xargs gzip", "find . -name '*.log' -exec gzip {} +", 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All variants work.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m06',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'df -i' show?",
        options: ['Inode usage instead of disk space', 'Disk info', 'Integrity check', 'Interval updates'],
        correctAnswer: 'Inode usage instead of disk space',
        explanation: '-i shows inode counts.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m07',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'What is the difference between /etc/mtab and /proc/mounts?',
        options: [
            "/proc/mounts is the kernel's view; /etc/mtab is maintained by mount command",
            'No difference',
            'mtab is deprecated',
            'proc/mounts only shows root'
        ],
        correctAnswer: "/proc/mounts is the kernel's view; /etc/mtab is maintained by mount command",
        explanation: 'mtab tracks user mounts; /proc/mounts is always accurate.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m08',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you mount an ISO file?',
        options: ['mount -o loop file.iso /mnt', 'mount file.iso /mnt', 'iso mount file.iso', 'Not possible'],
        correctAnswer: 'mount -o loop file.iso /mnt',
        explanation: '-o loop associates a loop device with the file.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m09',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'du --max-depth=1' do?",
        options: [
            'Shows sizes of the current directory and its immediate subdirectories',
            'Limits disk usage to 1GB',
            'Shows depth of filesystem',
            'Recursive unlimited'
        ],
        correctAnswer: 'Shows sizes of the current directory and its immediate subdirectories',
        explanation: 'Limits the recursion depth.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m10',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How can you find empty directories?',
        options: ['find / -type d -empty', 'find / -empty', 'find / -dir -size 0', "ls -R | grep '^$'"],
        correctAnswer: 'find / -type d -empty',
        explanation: '-empty matches empty files or directories.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m11',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'mount -o remount,rw /' do?",
        options: [
            'Remounts the root filesystem with read-write permissions',
            'Remounts read-only',
            'Unmounts and remounts',
            'Reads mount options'
        ],
        correctAnswer: 'Remounts the root filesystem with read-write permissions',
        explanation: 'remount changes mount options without unmounting.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m12',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you test an fstab entry before rebooting?',
        options: ['mount -a', 'fstab -t', 'mount --test', 'systemctl test-fstab'],
        correctAnswer: 'mount -a',
        explanation: 'mount -a attempts to mount everything in fstab.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m13',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'find -perm 4000' find?",
        options: ['Files with SUID bit set', 'Files with 4000 bytes', 'Directories', 'Symlinks'],
        correctAnswer: 'Files with SUID bit set',
        explanation: 'perm 4000 matches SUID.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m14',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you exclude a directory from find?',
        options: ["find / -not -path '/var/log/*'", 'find / -exclude /var/log', 'locate --exclude', 'find / -skip /var/log'],
        correctAnswer: "find / -not -path '/var/log/*'",
        explanation: '-not -path excludes matching paths.',
        difficulty: 'medium'
    },
    {
        id: 'ch14_m15',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'stat file' show?",
        options: [
            'Detailed file metadata (size, inode, timestamps, permissions)',
            'File contents',
            'File type',
            'File status only'
        ],
        correctAnswer: 'Detailed file metadata (size, inode, timestamps, permissions)',
        explanation: 'stat prints extensive file information.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch14_h01',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What is the difference between 'find -atime' and 'find -amin'?",
        options: [
            '-atime uses days, -amin uses minutes',
            '-atime is access time, -amin is modification',
            '-atime is for directories only',
            'No difference'
        ],
        correctAnswer: '-atime uses days, -amin uses minutes',
        explanation: '-atime -1 means accessed in last 24 hours; -amin -60 means last 60 minutes.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h02',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'find -links +1' detect?",
        options: ['Files with more than one hard link', 'Symbolic links', 'Broken links', 'Directories'],
        correctAnswer: 'Files with more than one hard link',
        explanation: 'Hard link count > 1.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h03',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How can you limit find to a specific filesystem?',
        options: ["find / -xdev -name 'file'", "find / -mount -name 'file'", "find / -samefile", 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: '-xdev and -mount prevent descending into other mountpoints.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h04',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'du --inodes' show?",
        options: ['Inode usage instead of disk space', 'Inode size', 'Inode limits', 'File counts'],
        correctAnswer: 'Inode usage instead of disk space',
        explanation: 'Reports inode consumption per directory.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h05',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you mount an NFS export?',
        options: [
            'mount -t nfs server:/export /mnt',
            'mount server:/export /mnt',
            'nfsmount server:/export /mnt',
            'mount -t nfs4 server:/export /mnt'
        ],
        correctAnswer: 'mount -t nfs server:/export /mnt',
        explanation: '-t nfs specifies the filesystem type.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h06',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'find -exec command {} +' do differently from '\\;'?",
        options: [
            'It passes multiple files to command at once instead of one per invocation',
            'No difference',
            'It deletes files',
            'It prints filenames'
        ],
        correctAnswer: 'It passes multiple files to command at once instead of one per invocation',
        explanation: '{} + reduces the number of exec calls for performance.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h07',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How would you find all files not owned by any user?',
        options: ['find / -nouser', 'find / -user nobody', 'find / -perm 0', 'find / -user 0'],
        correctAnswer: 'find / -nouser',
        explanation: '-nouser matches files with a UID that has no corresponding username.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h08',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What is the purpose of 'e2label'?",
        options: [
            'Sets or displays the label on an ext2/3/4 filesystem',
            'Edits the filesystem',
            'Labels partitions',
            'Checks disk errors'
        ],
        correctAnswer: 'Sets or displays the label on an ext2/3/4 filesystem',
        explanation: 'Labels can be used in fstab with LABEL=.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h09',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you check and repair an ext4 filesystem?',
        options: ['fsck.ext4 /dev/sdb1', 'e2fsck /dev/sdb1', 'fsck -t ext4 /dev/sdb1', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All are file system check tools.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h10',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'find -depth' control?",
        options: [
            'Processes directory contents before the directory itself (useful with -delete)',
            'Maximum depth',
            'Minimum depth',
            'Search depth'
        ],
        correctAnswer: 'Processes directory contents before the directory itself (useful with -delete)',
        explanation: '-depth ensures children are processed before the parent.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h11',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How would you list the top 10 largest files in /home?',
        options: [
            'find /home -type f -exec du -h {} + | sort -rh | head -10',
            'du -ah /home | sort -rh | head -10',
            'ls -lRh /home | sort -k5 | head',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'du and sort piped to head gives the largest files.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h12',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'blkid -p /dev/sdb1' do?",
        options: [
            'Probes the device and prints detailed info',
            'Lists partitions',
            'Partitions the disk',
            'Wipes the signature'
        ],
        correctAnswer: 'Probes the device and prints detailed info',
        explanation: '-p performs a low-level probe.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h13',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How do you view the UUID of a partition?',
        options: ['blkid /dev/sdb1', 'lsblk -f', 'tune2fs -l /dev/sdb1 | grep UUID', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'Multiple tools show UUID.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h14',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: "What does 'mount --bind' do?",
        options: [
            'Remounts a directory tree at another location',
            'Binds a device to a driver',
            'Mounts from network',
            'Creates a symbolic link'
        ],
        correctAnswer: 'Remounts a directory tree at another location',
        explanation: 'Bind mounts mirror a directory hierarchy.',
        difficulty: 'hard'
    },
    {
        id: 'ch14_h15',
        chapterId: 'track1-ch14',
        type: 'mcq',
        question: 'How can you see which filesystem types are supported by the kernel?',
        options: ['cat /proc/filesystems', 'lsmod | grep fs', 'fdisk -l', 'df -T'],
        correctAnswer: 'cat /proc/filesystems',
        explanation: '/proc/filesystems lists all registered filesystem types.',
        difficulty: 'hard'
    }
];
