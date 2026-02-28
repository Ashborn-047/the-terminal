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
    }
];
