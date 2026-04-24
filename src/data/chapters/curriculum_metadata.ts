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
        id: 'sys1-ch01',
        title: 'Getting Started with the Core Desktop',
        objectiveCode: 'SYS1-CH01',
        description: 'Access the command line locally and remotely. Understand desktop environments and terminal emulators.',
        requiredLevel: 1,
        xpReward: 100,
        track: 1
    },
    {
        id: 'sys1-ch02',
        title: 'Managing Files from the Command Line',
        objectiveCode: 'SYS1-CH02',
        description: 'Navigate the file system hierarchy, use relative/absolute paths, and manage files (cp, mv, rm, mkdir).',
        requiredLevel: 2,
        xpReward: 150,
        track: 1
    },
    {
        id: 'sys1-ch03',
        title: 'Getting Help in Enterprise Linux',
        objectiveCode: 'SYS1-CH03',
        description: 'Read local documentation using man pages, pinfo, and the /usr/share/doc directory to solve problems.',
        requiredLevel: 2,
        xpReward: 100,
        track: 1
    },
    {
        id: 'sys1-ch04',
        title: 'Creating, Viewing, and Editing Text Files',
        objectiveCode: 'SYS1-CH04',
        description: 'Master standard output/error redirection (>), pipe character (|), and basic vim editing.',
        requiredLevel: 3,
        xpReward: 200,
        track: 1
    },
    {
        id: 'sys1-ch05',
        title: 'Managing Local Users and Groups',
        objectiveCode: 'SYS1-CH05',
        description: 'Create and manage local users and groups. Understand /etc/passwd and configure password aging.',
        requiredLevel: 4,
        xpReward: 250,
        track: 1
    },
    {
        id: 'sys1-ch06',
        title: 'Controlling Access to Files',
        objectiveCode: 'SYS1-CH06',
        description: 'Secure files using standard Linux permissions (UGO, rwx), special permissions (SUID/SGID), and umask.',
        requiredLevel: 5,
        xpReward: 300,
        track: 1
    },
    {
        id: 'sys1-ch07',
        title: 'Monitoring and Managing Linux Processes',
        objectiveCode: 'SYS1-CH07',
        description: 'Identify running processes (ps, top), control background jobs, and send signals (kill) to manage system load.',
        requiredLevel: 6,
        xpReward: 250,
        track: 1
    },
    {
        id: 'sys1-ch08',
        title: 'Controlling Services and Daemons',
        objectiveCode: 'SYS1-CH08',
        description: 'Understand systemd architecture and use systemctl to start, stop, reload, and enable services at boot.',
        requiredLevel: 7,
        xpReward: 300,
        track: 1
    },
    {
        id: 'sys1-ch09',
        title: 'Configuring and Securing SSH',
        objectiveCode: 'SYS1-CH09',
        description: 'Configure secure remote access using OpenSSH. Generate keys and manage sshd_config parameters.',
        requiredLevel: 8,
        xpReward: 250,
        track: 1
    },
    {
        id: 'sys1-ch10',
        title: 'Analyzing and Storing Logs',
        objectiveCode: 'SYS1-CH10',
        description: 'Locate and interpret system log files. Use journalctl to query systemd journal data.',
        requiredLevel: 8,
        xpReward: 200,
        track: 1
    },
    {
        id: 'sys1-ch11',
        title: 'Managing Enterprise Networking',
        objectiveCode: 'SYS1-CH11',
        description: 'Configure IPv4 network interfaces using nmcli. Validate connections with ping and ip routing commands.',
        requiredLevel: 9,
        xpReward: 350,
        track: 1
    },
    {
        id: 'sys1-ch12',
        title: 'Archiving and Transferring Files',
        objectiveCode: 'SYS1-CH12',
        description: 'Create compressed tar archives and securely transfer files across the network using scp and rsync.',
        requiredLevel: 10,
        xpReward: 250,
        track: 1
    },
    {
        id: 'sys1-ch13',
        title: 'Installing and Updating Software Packages',
        objectiveCode: 'SYS1-CH13',
        description: 'Manage RPM packages using dnf/yum. Configure software repositories and module streams.',
        requiredLevel: 10,
        xpReward: 300,
        track: 1
    },
    {
        id: 'sys1-ch14',
        title: 'Accessing Linux File Systems',
        objectiveCode: 'SYS1-CH14',
        description: 'Identify block devices, mount/unmount file systems, and locate specific files using find and locate.',
        requiredLevel: 11,
        xpReward: 300,
        track: 1
    },
    {
        id: 'sys1-ch15',
        title: 'Analyzing Servers and Getting Support',
        objectiveCode: 'SYS1-CH15',
        description: 'Generate diagnostic sosreports to assist vendor support teams in resolving system issues.',
        requiredLevel: 12,
        xpReward: 150,
        track: 1
    }
];

export const sysadmin2Chapters: ChapterMetadata[] = [
    {
        id: 'sys2-ch01',
        title: 'Improving Command Line Productivity',
        objectiveCode: 'SYS2-CH01',
        description: 'Write advanced bash scripts with loops, conditional logic, and grep regular expressions.',
        requiredLevel: 12,
        xpReward: 300,
        track: 2
    },
    {
        id: 'sys2-ch02',
        title: 'Scheduling Future Tasks',
        objectiveCode: 'SYS2-CH02',
        description: 'Automate system administration tasks using at, cron, and systemd timers.',
        requiredLevel: 13,
        xpReward: 250,
        track: 2
    },
    {
        id: 'sys2-ch03',
        title: 'Tuning System Performance',
        objectiveCode: 'SYS2-CH03',
        description: 'Adjust process niceness and implement tuned profiles for specific workload optimizations.',
        requiredLevel: 13,
        xpReward: 200,
        track: 2
    },
    {
        id: 'sys2-ch04',
        title: 'Controlling Access to Files with ACLs',
        objectiveCode: 'SYS2-CH04',
        description: 'Implement granular file permissions using Access Control Lists (setfacl, getfacl).',
        requiredLevel: 14,
        xpReward: 300,
        track: 2
    },
    {
        id: 'sys2-ch05',
        title: 'Managing SELinux Security',
        objectiveCode: 'SYS2-CH05',
        description: 'Secure the system by managing SELinux contexts, booleans, and troubleshooting violations.',
        requiredLevel: 15,
        xpReward: 400,
        track: 2
    },
    {
        id: 'sys2-ch06',
        title: 'Managing Basic Storage',
        objectiveCode: 'SYS2-CH06',
        description: 'Create partitions, format file systems (xfs, ext4), and configure persistent mounts in /etc/fstab.',
        requiredLevel: 16,
        xpReward: 350,
        track: 2
    },
    {
        id: 'sys2-ch07',
        title: 'Managing Logical Volumes (LVM)',
        objectiveCode: 'SYS2-CH07',
        description: 'Build flexible storage using Physical Volumes, Volume Groups, and resizable Logical Volumes.',
        requiredLevel: 17,
        xpReward: 450,
        track: 2
    },
    {
        id: 'sys2-ch08',
        title: 'Implementing Advanced Storage Features',
        objectiveCode: 'SYS2-CH08',
        description: 'Manage Stratis storage pools and configure Virtual Data Optimizer (VDO) for deduplication.',
        requiredLevel: 18,
        xpReward: 350,
        track: 2
    },
    {
        id: 'sys2-ch09',
        title: 'Accessing Network-Attached Storage',
        objectiveCode: 'SYS2-CH09',
        description: 'Mount remote NFS exports and configure automounting with autofs.',
        requiredLevel: 18,
        xpReward: 300,
        track: 2
    },
    {
        id: 'sys2-ch10',
        title: 'Controlling the Boot Process',
        objectiveCode: 'SYS2-CH10',
        description: 'Manage systemd targets, troubleshoot boot issues, and recover lost root passwords.',
        requiredLevel: 19,
        xpReward: 400,
        track: 2
    },
    {
        id: 'sys2-ch11',
        title: 'Managing Network Security',
        objectiveCode: 'SYS2-CH11',
        description: 'Configure firewalld zones, open specific ports/services, and manage rich rules.',
        requiredLevel: 20,
        xpReward: 350,
        track: 2
    },
    {
        id: 'sys2-ch12',
        title: 'Running Containers',
        objectiveCode: 'SYS2-CH12',
        description: 'Deploy and manage rootless containers using podman, including persistent storage and systemd integration.',
        requiredLevel: 20,
        xpReward: 500,
        track: 2
    }
];

export const allCurriculumChapters = [...sysadmin1Chapters, ...sysadmin2Chapters];