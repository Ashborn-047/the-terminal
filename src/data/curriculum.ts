export interface LabStep {
    instruction: string;
    actionText: string;
    expectedCmd: string;
}

export interface LabGoal {
    id: string;
    text: string;
    verify: (vfs: any) => boolean; // Will be refined for new VFS
}

export interface Lab {
    id: string;
    title: string;
    type: 'guided' | 'diy';
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    icon: string;
    objectives: string[];
    steps?: LabStep[];
    scenario?: string;
    goals?: LabGoal[];
}

export const curriculum: Lab[] = [
    {
        id: 'lab-fs-utils',
        title: 'Filesystem Basics',
        type: 'guided',
        duration: '5 mins',
        difficulty: 'beginner',
        icon: '📁',
        objectives: [
            'List files with detailed formatting',
            'Copy files between directories',
            'Remove directories safely'
        ],
        steps: [
            {
                instruction: 'The "ls" command lists directory contents. The "-l" flag shows detailed information including permissions, owner, and size.',
                actionText: 'List files in long format',
                expectedCmd: 'ls -l'
            },
            {
                instruction: 'The "cp" command copies files. It takes two arguments: the source file and the destination.',
                actionText: 'Create a backup copy',
                expectedCmd: 'cp data.csv backup.csv'
            },
            {
                instruction: 'The "rm" command removes files. Use "-rf" to recursively force-delete directories.',
                actionText: 'Remove the downloads folder',
                expectedCmd: 'rm -rf downloads'
            }
        ]
    },
    {
        id: 'lab-sys-info',
        title: 'System Information',
        type: 'guided',
        duration: '5 mins',
        difficulty: 'beginner',
        icon: '💻',
        objectives: [
            'Check system architecture',
            'View hardware specifications',
            'Monitor memory usage'
        ],
        steps: [
            {
                instruction: 'The "uname" command displays system information. Use "-a" to show all available information.',
                actionText: 'Display system information',
                expectedCmd: 'uname -a'
            },
            {
                instruction: 'In Linux, hardware information is stored in the /proc directory. Let\'s read the CPU info.',
                actionText: 'View CPU specifications',
                expectedCmd: 'cat /proc/cpuinfo'
            },
            {
                instruction: 'The "free" command shows memory usage statistics for RAM and swap space.',
                actionText: 'Check memory usage',
                expectedCmd: 'free'
            },
            {
                instruction: 'The "w" command shows who is logged in and what they\'re doing.',
                actionText: 'View logged in users',
                expectedCmd: 'w'
            }
        ]
    },
    {
        id: 'lab-networking',
        title: 'Networking Commands',
        type: 'guided',
        duration: '5 mins',
        difficulty: 'intermediate',
        icon: '🌐',
        objectives: [
            'Test network connectivity',
            'Perform DNS lookups',
            'Download files from the internet'
        ],
        steps: [
            {
                instruction: 'The "ping" command tests network connectivity by sending ICMP packets to a host.',
                actionText: 'Test connectivity to Google',
                expectedCmd: 'ping google.com'
            },
            {
                instruction: 'The "dig" command performs DNS lookups and shows detailed DNS records.',
                actionText: 'Query DNS records',
                expectedCmd: 'dig google.com'
            },
            {
                instruction: 'The "wget" command downloads files from the internet directly to your server.',
                actionText: 'Download a script file',
                expectedCmd: 'wget script.sh'
            },
            {
                instruction: 'Verify the download was successful by listing the directory contents.',
                actionText: 'List files',
                expectedCmd: 'ls'
            }
        ]
    },
    {
        id: 'lab-rogue-process',
        title: 'Hunt the Rogue Process',
        type: 'diy',
        duration: '15 mins',
        difficulty: 'advanced',
        icon: '🔥',
        objectives: [
            'Identify a resource-intensive process',
            'Terminate the rogue process',
            'Remove the rogue executable'
        ],
        scenario: 'A rogue process named "cryptominer" is consuming excessive CPU on the server. Identify its PID, terminate it forcefully, and delete the executable file located somewhere in your home directory.',
        goals: [
            {
                id: 'kill-process',
                text: 'Terminate the "cryptominer" process',
                verify: (context: any) => {
                    // Check if cryptominer process is gone from context
                    return !context.processes?.some((p: any) => p.name === 'cryptominer');
                }
            },
            {
                id: 'delete-executable',
                text: 'Delete the "cryptominer" executable file',
                verify: (vfs: any) => {
                    // Assuming VFS has a way to find, for now just checking it doesn't exist in ~
                    const result = vfs.resolve('/home/guest/cryptominer', 'guest');
                    return typeof result === 'string'; // Returns string if not found
                }
            }
        ]
    },
    {
        id: 'lab-corrupted-config',
        title: 'Restore Corrupted Configuration',
        type: 'diy',
        duration: '15 mins',
        difficulty: 'advanced',
        icon: '🛠️',
        objectives: [
            'Identify corrupted configuration',
            'Restore configuration from backup',
            'Fix file permissions'
        ],
        scenario: 'The web server configuration file at /etc/nginx/nginx.conf has been corrupted. A backup exists at /var/backups/nginx.conf.bak. Copy the backup over the corrupted file, and ensure it is owned by root and has 644 permissions.',
        goals: [
            {
                id: 'copy-backup',
                text: 'Restore the backup file to /etc/nginx/nginx.conf',
                verify: (vfs: any) => {
                    const content = vfs.readFile('/etc/nginx/nginx.conf', 'root');
                    return typeof content === 'string' && content.includes('backup_data'); // Mock check
                }
            },
            {
                id: 'fix-perms',
                text: 'Set correct permissions (644)',
                verify: (vfs: any) => {
                    const inode = vfs.resolve('/etc/nginx/nginx.conf', 'root');
                    if (typeof inode === 'string') return false;
                    return inode.permissions.owner.read && inode.permissions.owner.write && !inode.permissions.owner.execute &&
                           inode.permissions.group.read && !inode.permissions.group.write && !inode.permissions.group.execute &&
                           inode.permissions.others.read && !inode.permissions.others.write && !inode.permissions.others.execute;
                }
            }
        ]
    }
];
