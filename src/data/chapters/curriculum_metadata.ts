export interface ChapterMetadata {
    id: string;
    title: string;
    objectiveCode: string; // e.g., "SYS1-CH01"
    description: string;
    requiredLevel: number;
    xpReward: number;
    track: 1 | 2; // Track 1 (Foundational) or Track 2 (Advanced)
}

export const sysadmin1Chapters: ChapterMetadata[] = [
    {
        id: 'track1-ch01',
        title: 'Your First Steps on the Linux Command Line',
        objectiveCode: 'T1-CH01',
        description: 'Master terminal access, basic navigation, file operations, and the Filesystem Hierarchy Standard (FHS).',
        requiredLevel: 1,
        xpReward: 250,
        track: 1
    },
    {
        id: 'track1-ch02',
        title: 'Unlocking the Manual: How to Get Help in Linux',
        objectiveCode: 'T1-CH02',
        description: 'Discover the power of built-in documentation using man, info, and --help to find answers without leaving your keyboard.',
        requiredLevel: 2,
        xpReward: 100,
        track: 1
    },
    {
        id: 'track1-ch03',
        title: 'Reading the Story: Viewing and Manipulating Text',
        objectiveCode: 'T1-CH03',
        description: 'Master standard streams (STDOUT/ERR), output redirection (>), and command chaining with pipes (|).',
        requiredLevel: 3,
        xpReward: 200,
        track: 1
    },
    {
        id: 'track1-ch04',
        title: 'Mastering Vim: The Text Editor That’s Everywhere',
        objectiveCode: 'T1-CH04',
        description: 'Survival skills for the legendary modal editor. Open, edit, save, and navigate at the speed of thought.',
        requiredLevel: 4,
        xpReward: 250,
        track: 1
    },
    {
        id: 'track1-ch05',
        title: 'Managing Local Users and Groups',
        objectiveCode: 'T1-CH05',
        description: 'Create and manage local users and groups. Understand /etc/passwd and configure password aging.',
        requiredLevel: 5,
        xpReward: 250,
        track: 1
    },
    {
        id: 'track1-ch06',
        title: 'Controlling Access to Files',
        objectiveCode: 'T1-CH06',
        description: 'Secure files using standard Linux permissions (UGO, rwx), special permissions (SUID/SGID), and umask.',
        requiredLevel: 6,
        xpReward: 300,
        track: 1
    },
    {
        id: 'track1-ch07',
        title: 'Monitoring and Managing Linux Processes',
        objectiveCode: 'T1-CH07',
        description: 'Identify running processes (ps, top), control background jobs, and send signals (kill) to manage system load.',
        requiredLevel: 7,
        xpReward: 250,
        track: 1
    },
    {
        id: 'track1-ch08',
        title: 'Controlling Services and Daemons',
        objectiveCode: 'T1-CH08',
        description: 'Understand systemd architecture and use systemctl to start, stop, reload, and enable services at boot.',
        requiredLevel: 8,
        xpReward: 300,
        track: 1
    },
    {
        id: 'track1-ch09',
        title: 'Configuring and Securing SSH',
        objectiveCode: 'T1-CH09',
        description: 'Configure secure remote access using OpenSSH. Generate keys and manage sshd_config parameters.',
        requiredLevel: 9,
        xpReward: 250,
        track: 1
    },
    {
        id: 'track1-ch10',
        title: 'Analyzing and Storing Logs',
        objectiveCode: 'T1-CH10',
        description: 'Locate and interpret system log files. Use journalctl to query systemd journal data.',
        requiredLevel: 10,
        xpReward: 200,
        track: 1
    },
    {
        id: 'track1-ch11',
        title: 'Managing Enterprise Networking',
        objectiveCode: 'T1-CH11',
        description: 'Configure IPv4 network interfaces using nmcli. Validate connections with ping and ip routing commands.',
        requiredLevel: 11,
        xpReward: 350,
        track: 1
    },
    {
        id: 'track1-ch12',
        title: 'Archiving and Transferring Files',
        objectiveCode: 'T1-CH12',
        description: 'Create compressed tar archives and securely transfer files across the network using scp and rsync.',
        requiredLevel: 12,
        xpReward: 250,
        track: 1
    },
    {
        id: 'track1-ch13',
        title: 'Installing and Updating Software Packages',
        objectiveCode: 'T1-CH13',
        description: 'Manage RPM packages using dnf/yum. Configure software repositories and module streams.',
        requiredLevel: 13,
        xpReward: 300,
        track: 1
    },
    {
        id: 'track1-ch14',
        title: 'Accessing Linux File Systems',
        objectiveCode: 'T1-CH14',
        description: 'Identify block devices, mount/unmount file systems, and locate specific files using find and locate.',
        requiredLevel: 14,
        xpReward: 300,
        track: 1
    },
    {
        id: 'track1-ch15',
        title: 'Analyzing Servers and Getting Support',
        objectiveCode: 'T1-CH15',
        description: 'Generate diagnostic sosreports to assist vendor support teams in resolving system issues.',
        requiredLevel: 15,
        xpReward: 150,
        track: 1
    }
];

export const sysadmin2Chapters: ChapterMetadata[] = [
    {
        id: 'track2-ch01',
        title: 'Improving Command Line Productivity',
        objectiveCode: 'T2-CH01',
        description: 'Write advanced bash scripts with loops, conditional logic, and grep regular expressions.',
        requiredLevel: 12,
        xpReward: 300,
        track: 2
    },
    {
        id: 'track2-ch02',
        title: 'Scheduling Future Tasks',
        objectiveCode: 'T2-CH02',
        description: 'Automate system administration tasks using at, cron, and systemd timers.',
        requiredLevel: 13,
        xpReward: 250,
        track: 2
    },
    {
        id: 'track2-ch03',
        title: 'Tuning System Performance',
        objectiveCode: 'T2-CH03',
        description: 'Adjust process niceness and implement tuned profiles for specific workload optimizations.',
        requiredLevel: 13,
        xpReward: 200,
        track: 2
    },
    {
        id: 'track2-ch04',
        title: 'Controlling Access to Files with ACLs',
        objectiveCode: 'T2-CH04',
        description: 'Implement granular file permissions using Access Control Lists (setfacl, getfacl).',
        requiredLevel: 14,
        xpReward: 300,
        track: 2
    },
    {
        id: 'track2-ch05',
        title: 'Managing SELinux Security',
        objectiveCode: 'T2-CH05',
        description: 'Secure the system by managing SELinux contexts, booleans, and troubleshooting violations.',
        requiredLevel: 15,
        xpReward: 400,
        track: 2
    },
    {
        id: 'track2-ch06',
        title: 'Managing Basic Storage',
        objectiveCode: 'T2-CH06',
        description: 'Create partitions, format file systems (xfs, ext4), and configure persistent mounts in /etc/fstab.',
        requiredLevel: 16,
        xpReward: 350,
        track: 2
    },
    {
        id: 'track2-ch07',
        title: 'Managing Logical Volumes (LVM)',
        objectiveCode: 'T2-CH07',
        description: 'Build flexible storage using Physical Volumes, Volume Groups, and resizable Logical Volumes.',
        requiredLevel: 17,
        xpReward: 450,
        track: 2
    },
    {
        id: 'track2-ch08',
        title: 'Implementing Advanced Storage Features',
        objectiveCode: 'T2-CH08',
        description: 'Manage Stratis storage pools and configure Virtual Data Optimizer (VDO) for deduplication.',
        requiredLevel: 18,
        xpReward: 350,
        track: 2
    },
    {
        id: 'track2-ch09',
        title: 'Accessing Network-Attached Storage',
        objectiveCode: 'T2-CH09',
        description: 'Mount remote NFS exports and configure automounting with autofs.',
        requiredLevel: 18,
        xpReward: 300,
        track: 2
    },
    {
        id: 'track2-ch10',
        title: 'Controlling the Boot Process',
        objectiveCode: 'T2-CH10',
        description: 'Manage systemd targets, troubleshoot boot issues, and recover lost root passwords.',
        requiredLevel: 19,
        xpReward: 400,
        track: 2
    },
    {
        id: 'track2-ch11',
        title: 'Managing Network Security',
        objectiveCode: 'T2-CH11',
        description: 'Configure firewalld zones, open specific ports/services, and manage rich rules.',
        requiredLevel: 20,
        xpReward: 350,
        track: 2
    },
    {
        id: 'track2-ch12',
        title: 'Running Containers',
        objectiveCode: 'T2-CH12',
        description: 'Deploy and manage rootless containers using podman, including persistent storage and systemd integration.',
        requiredLevel: 20,
        xpReward: 500,
        track: 2
    }
];

export const allCurriculumChapters = [...sysadmin1Chapters, ...sysadmin2Chapters];