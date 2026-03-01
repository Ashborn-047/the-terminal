import { Lab } from '../../features/lab-engine/types';

export const INITIAL_LABS: Record<string, Lab> = {
    // ─── Module 1: Command Line Basics ───────────────────────────
    'lab-1-1': {
        id: 'lab-1-1',
        module: 1,
        title: 'Your First Command',
        description: 'Welcome to the terminal! Let\'s start with the basics. The `pwd` command shows you exactly where you are in the filesystem.',
        type: 'guided',
        xpReward: 50,
        prerequisites: [],
        steps: [
            {
                id: 'step-1',
                instruction: 'Identify your current location by typing `pwd`',
                expectedCommand: 'pwd',
                hint: 'Type `pwd` and press ENTER.',
            },
            {
                id: 'step-2',
                instruction: 'List the contents of your current directory using `ls`',
                expectedCommand: 'ls',
                hint: 'Type `ls` to see what\'s inside.',
            }
        ],
        completionMessage: 'Excellent! You\'ve taken your first steps into a larger world.',
    },
    'lab-1-2': {
        id: 'lab-1-2',
        module: 1,
        title: 'Navigation Challenge',
        description: 'Practice moving between directories. Create a new directory and enter it.',
        type: 'diy',
        xpReward: 100,
        prerequisites: ['lab-1-1'],
        verification: {
            conditions: [
                {
                    type: 'directory_exists',
                    path: '/home/guest/workspace',
                    message: 'Create a directory named `workspace` in your home folder.',
                }
            ]
        },
        hints: ['Use `mkdir workspace` to create the folder.'],
        completionMessage: 'You are now a master of your own domain!',
    },

    // ─── Module 2: File Management ───────────────────────────────
    'lab-2-1': {
        id: 'lab-2-1',
        module: 2,
        title: 'Creating Files',
        description: 'Learn to create files using `touch` and write content using output redirection.',
        type: 'guided',
        xpReward: 50,
        prerequisites: ['lab-1-2'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Create a new empty file called `notes.txt` using `touch`',
                expectedCommand: 'touch notes.txt',
                hint: 'Type `touch notes.txt`',
            },
            {
                id: 'step-2',
                instruction: 'Verify the file was created by listing directory contents',
                expectedCommand: 'ls',
                hint: 'Use `ls` to see your new file.',
            },
            {
                id: 'step-3',
                instruction: 'Write some text to your file using `echo "Hello World" > notes.txt`',
                expectedCommand: 'echo "Hello World" > notes.txt',
                hint: 'The `>` operator redirects output to a file.',
            },
            {
                id: 'step-4',
                instruction: 'Read the file contents with `cat notes.txt`',
                expectedCommand: 'cat notes.txt',
                hint: 'Use `cat filename` to display file contents.',
            },
        ],
        completionMessage: 'You\'ve learned to create, write, and read files!',
    },
    'lab-2-2': {
        id: 'lab-2-2',
        module: 2,
        title: 'Copying & Moving',
        description: 'Master the art of copying and moving files around the filesystem.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-2-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Create a directory called `backup` in your home directory',
                expectedCommand: 'mkdir backup',
                hint: 'Use `mkdir backup`',
            },
            {
                id: 'step-2',
                instruction: 'Copy `notes.txt` to the backup directory',
                expectedCommand: 'cp notes.txt backup/',
                hint: 'Use `cp source destination`',
            },
            {
                id: 'step-3',
                instruction: 'Rename `notes.txt` to `readme.txt` using `mv`',
                expectedCommand: 'mv notes.txt readme.txt',
                hint: 'Use `mv oldname newname` to rename',
            },
        ],
        completionMessage: 'File operations mastered! You can now copy, move, and rename.',
    },
    'lab-2-3': {
        id: 'lab-2-3',
        module: 2,
        title: 'File Management Challenge',
        description: 'Put your file management skills to the test. Create a project structure from scratch.',
        type: 'diy',
        xpReward: 150,
        prerequisites: ['lab-2-2'],
        verification: {
            conditions: [
                {
                    type: 'directory_exists',
                    path: '/home/guest/project',
                    message: 'Create a `project` directory in your home folder.',
                },
                {
                    type: 'directory_exists',
                    path: '/home/guest/project/src',
                    message: 'Create a `src` subdirectory inside `project`.',
                },
                {
                    type: 'file_exists',
                    path: '/home/guest/project/README.md',
                    message: 'Create a `README.md` file inside `project`.',
                },
            ]
        },
        hints: [
            'Use `mkdir -p project/src` to create nested directories.',
            'Use `touch project/README.md` to create the file.',
        ],
        completionMessage: 'You\'ve built your first project structure like a pro!',
    },

    // ─── Module 3: Searching & Filtering ─────────────────────────
    'lab-3-1': {
        id: 'lab-3-1',
        module: 3,
        title: 'Finding Text with Grep',
        description: 'Learn to search for text patterns inside files using `grep`.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-2-3'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Read the system log file with `cat /var/log/syslog`',
                expectedCommand: 'cat /var/log/syslog',
                hint: 'Display the contents of the syslog file.',
            },
            {
                id: 'step-2',
                instruction: 'Search for the word "error" in the log file using `grep error /var/log/syslog`',
                expectedCommand: 'grep error /var/log/syslog',
                hint: 'Use `grep pattern filename` to search.',
            },
            {
                id: 'step-3',
                instruction: 'Do a case-insensitive search with `grep -i error /var/log/syslog`',
                expectedCommand: 'grep -i error /var/log/syslog',
                hint: 'The `-i` flag makes grep case-insensitive.',
            },
        ],
        completionMessage: 'You\'re now a text-searching ninja!',
    },
    'lab-3-2': {
        id: 'lab-3-2',
        module: 3,
        title: 'The Power of Pipes',
        description: 'Combine commands using pipes to create powerful data processing chains.',
        type: 'guided',
        xpReward: 100,
        prerequisites: ['lab-3-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'List all files and pipe to `wc -l` to count them: `ls | wc -l`',
                expectedCommand: 'ls | wc -l',
                hint: 'The `|` symbol sends one command\'s output to another.',
            },
            {
                id: 'step-2',
                instruction: 'Read the passwd file and show only the first 3 lines: `cat /etc/passwd | head -n 3`',
                expectedCommand: 'cat /etc/passwd | head -n 3',
                hint: 'Use `head -n N` to show the first N lines.',
            },
        ],
        completionMessage: 'Pipes are your superpower. You can chain any commands together!',
    },

    // ─── Module 4: Permissions ───────────────────────────────────
    'lab-4-1': {
        id: 'lab-4-1',
        module: 4,
        title: 'Understanding Permissions',
        description: 'Learn how Linux file permissions work and how to read the `ls -l` output.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-3-2'],
        steps: [
            {
                id: 'step-1',
                instruction: 'View detailed file information with `ls -la`',
                expectedCommand: 'ls -la',
                hint: 'The `-l` flag shows permissions, owner, size, and dates.',
            },
            {
                id: 'step-2',
                instruction: 'Create a script file: `touch script.sh`',
                expectedCommand: 'touch script.sh',
                hint: 'Create the file first, then we\'ll set permissions.',
            },
            {
                id: 'step-3',
                instruction: 'Make it executable with `chmod 755 script.sh`',
                expectedCommand: 'chmod 755 script.sh',
                hint: '755 means: owner=rwx, group=r-x, others=r-x.',
            },
        ],
        completionMessage: 'You now understand the Linux permission system!',
    },

    // ─── Module 5: HPC Environment ──────────────────────────────
    'lab-5-1': {
        id: 'lab-5-1',
        module: 5,
        title: 'Environment Variables',
        description: 'Explore and set environment variables to configure your shell environment.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-4-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'View all environment variables with `env`',
                expectedCommand: 'env',
                hint: 'The `env` command lists all environment variables.',
            },
            {
                id: 'step-2',
                instruction: 'Check your current user with `whoami`',
                expectedCommand: 'whoami',
                hint: 'Type `whoami` to see your username.',
            },
            {
                id: 'step-3',
                instruction: 'Display system information with `uname -a`',
                expectedCommand: 'uname -a',
                hint: 'The `-a` flag shows all system info.',
            },
        ],
        completionMessage: 'You understand how the shell environment works!',
    },

    // ─── Module 6: Users & Groups ───────────────────────────────
    'lab-6-1': {
        id: 'lab-6-1',
        module: 6,
        title: 'User & Identity Basics',
        description: 'Learn about users, groups, and identity in Linux. Every file and process belongs to a user.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-5-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Check your current user identity with `id`',
                expectedCommand: 'id',
                hint: 'The `id` command shows your UID, GID, and groups.',
            },
            {
                id: 'step-2',
                instruction: 'See which groups you belong to with `groups`',
                expectedCommand: 'groups',
                hint: 'Type `groups` to see your group memberships.',
            },
            {
                id: 'step-3',
                instruction: 'View the system hostname with `hostname`',
                expectedCommand: 'hostname',
                hint: 'The `hostname` command shows the system name.',
            },
            {
                id: 'step-4',
                instruction: 'Look at the passwd file to see all users: `cat /etc/passwd`',
                expectedCommand: 'cat /etc/passwd',
                hint: 'The `/etc/passwd` file contains user account information.',
            },
        ],
        completionMessage: 'You understand Linux user and group concepts!',
    },
    'lab-6-2': {
        id: 'lab-6-2',
        module: 6,
        title: 'User Management Challenge',
        description: 'Create a new user account and set up their home directory. You\'ll need sudo for this!',
        type: 'diy',
        xpReward: 150,
        prerequisites: ['lab-6-1'],
        verification: {
            conditions: [
                {
                    type: 'directory_exists',
                    path: '/home/devuser',
                    message: 'Create a user named `devuser` (their home dir should exist at /home/devuser).',
                },
                {
                    type: 'file_exists',
                    path: '/home/devuser/.bashrc',
                    message: 'The devuser home directory should contain a `.bashrc` file.',
                },
            ]
        },
        hints: [
            'Use `sudo useradd devuser` to create the user.',
            'The useradd command automatically creates the home directory and .bashrc.',
        ],
        completionMessage: 'You\'ve successfully managed user accounts on a Linux system!',
    },

    // ─── Module 7: Process Management ───────────────────────────
    'lab-7-1': {
        id: 'lab-7-1',
        module: 7,
        title: 'Monitoring Processes',
        description: 'Learn to view and understand running processes using `ps`, `top`, and related commands.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-6-2'],
        steps: [
            {
                id: 'step-1',
                instruction: 'View running processes with `ps`',
                expectedCommand: 'ps',
                hint: 'The `ps` command shows a snapshot of running processes.',
            },
            {
                id: 'step-2',
                instruction: 'Get a full system view with `top`',
                expectedCommand: 'top',
                hint: '`top` shows a real-time view of processes and system resources.',
            },
            {
                id: 'step-3',
                instruction: 'Check system uptime with `uptime`',
                expectedCommand: 'uptime',
                hint: '`uptime` shows how long the system has been running.',
            },
            {
                id: 'step-4',
                instruction: 'Check memory usage with `free`',
                expectedCommand: 'free',
                hint: '`free` shows memory (RAM) and swap usage.',
            },
        ],
        completionMessage: 'You can now monitor system processes like a sysadmin!',
    },
    'lab-7-2': {
        id: 'lab-7-2',
        module: 7,
        title: 'Process Control Challenge',
        description: 'Practice managing processes: find a specific process and terminate it.',
        type: 'guided',
        xpReward: 100,
        prerequisites: ['lab-7-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'List all processes to find one to kill: `ps`',
                expectedCommand: 'ps',
                hint: 'Look for a process and note its PID.',
            },
            {
                id: 'step-2',
                instruction: 'Terminate the cron process with `kill 201`',
                expectedCommand: 'kill 201',
                hint: 'Use `kill PID` to send a terminate signal to a process.',
            },
        ],
        completionMessage: 'You can now manage processes from the command line!',
    },

    // ─── Module 8: Storage & Disk ───────────────────────────────
    'lab-8-1': {
        id: 'lab-8-1',
        module: 8,
        title: 'Disk Usage Analysis',
        description: 'Learn to check disk space and analyze storage usage with `df` and `du`.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-7-2'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Check overall disk usage with `df`',
                expectedCommand: 'df',
                hint: '`df` shows disk space usage for mounted filesystems.',
            },
            {
                id: 'step-2',
                instruction: 'Check directory size with `du /home`',
                expectedCommand: 'du /home',
                hint: '`du` shows the disk usage of a directory.',
            },
            {
                id: 'step-3',
                instruction: 'Get file information with `stat /etc/passwd`',
                expectedCommand: 'stat /etc/passwd',
                hint: '`stat` shows detailed information about a file.',
            },
        ],
        completionMessage: 'You now know how to analyze storage usage!',
    },
    'lab-8-2': {
        id: 'lab-8-2',
        module: 8,
        title: 'Archive & Compress Challenge',
        description: 'Practice creating archives and compressing files — essential for backups and file transfers.',
        type: 'guided',
        xpReward: 100,
        prerequisites: ['lab-8-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Create a backup directory: `mkdir /home/guest/backup`',
                expectedCommand: 'mkdir /home/guest/backup',
                hint: 'Use `mkdir` to create the backup directory.',
            },
            {
                id: 'step-2',
                instruction: 'Create a tar archive: `tar -cf backup.tar /home/guest/backup`',
                expectedCommand: 'tar -cf backup.tar /home/guest/backup',
                hint: '`tar -cf` creates a new archive file.',
            },
            {
                id: 'step-3',
                instruction: 'Compress it with gzip: `gzip backup.tar`',
                expectedCommand: 'gzip backup.tar',
                hint: '`gzip` compresses a file, adding a .gz extension.',
            },
        ],
        completionMessage: 'You can now create archives and compress files like a pro!',
    },

    // ─── Module 9: Networking Basics ────────────────────────────
    'lab-9-1': {
        id: 'lab-9-1',
        module: 9,
        title: 'Network Exploration',
        description: 'Explore basic networking commands to understand your system\'s network connectivity.',
        type: 'guided',
        xpReward: 75,
        prerequisites: ['lab-8-2'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Check your hostname with `hostname`',
                expectedCommand: 'hostname',
                hint: '`hostname` shows the system name on the network.',
            },
            {
                id: 'step-2',
                instruction: 'Test connectivity with `ping google.com`',
                expectedCommand: 'ping google.com',
                hint: '`ping` sends packets to check if a host is reachable.',
            },
            {
                id: 'step-3',
                instruction: 'Look up DNS info with `dig google.com`',
                expectedCommand: 'dig google.com',
                hint: '`dig` queries DNS servers for domain info.',
            },
        ],
        completionMessage: 'You understand the basics of Linux networking!',
    },
    'lab-9-2': {
        id: 'lab-9-2',
        module: 9,
        title: 'Web Requests Challenge',
        description: 'Practice fetching content from the web using command-line tools.',
        type: 'guided',
        xpReward: 100,
        prerequisites: ['lab-9-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Fetch a webpage with `curl https://example.com`',
                expectedCommand: 'curl https://example.com',
                hint: '`curl` fetches content from URLs.',
            },
            {
                id: 'step-2',
                instruction: 'Download a file with `wget https://example.com/file.txt`',
                expectedCommand: 'wget https://example.com/file.txt',
                hint: '`wget` downloads files from the web.',
            },
        ],
        completionMessage: 'You can now interact with the web from the terminal!',
    },

    // ─── Module 11: Shell Scripting I ───────────────────────────
    'lab-11-1': {
        id: 'lab-11-1',
        module: 11,
        title: 'Text Processing Pipeline',
        description: 'Learn to build powerful text processing pipelines using sort, uniq, cut, and other tools.',
        type: 'guided',
        xpReward: 100,
        prerequisites: ['lab-9-2'],
        steps: [
            {
                id: 'step-1',
                instruction: 'Create a data file: `echo "banana\\napple\\ncherry\\napple\\nbanana\\nbanana" > fruits.txt`',
                expectedCommand: 'echo "banana\\napple\\ncherry\\napple\\nbanana\\nbanana" > fruits.txt',
                hint: 'Create a file with some duplicate data to process.',
            },
            {
                id: 'step-2',
                instruction: 'Sort the file contents: `sort fruits.txt`',
                expectedCommand: 'sort fruits.txt',
                hint: '`sort` arranges lines in alphabetical order.',
            },
            {
                id: 'step-3',
                instruction: 'Sort and remove duplicates: `sort fruits.txt | uniq`',
                expectedCommand: 'sort fruits.txt | uniq',
                hint: '`uniq` removes adjacent duplicate lines (sort first!).',
            },
            {
                id: 'step-4',
                instruction: 'Count occurrences: `sort fruits.txt | uniq -c`',
                expectedCommand: 'sort fruits.txt | uniq -c',
                hint: 'The `-c` flag shows how many times each line appears.',
            },
        ],
        completionMessage: 'You\'re building powerful text processing pipelines!',
    },
    'lab-11-2': {
        id: 'lab-11-2',
        module: 11,
        title: 'Stream Editing with Sed & Awk',
        description: 'Master sed and awk — the two most powerful text processing tools in Unix.',
        type: 'guided',
        xpReward: 125,
        prerequisites: ['lab-11-1'],
        steps: [
            {
                id: 'step-1',
                instruction: 'View the passwd file: `cat /etc/passwd`',
                expectedCommand: 'cat /etc/passwd',
                hint: 'View the file we\'ll be processing.',
            },
            {
                id: 'step-2',
                instruction: 'Extract the first field (usernames) with cut: `cut -d: -f1 /etc/passwd`',
                expectedCommand: 'cut -d: -f1 /etc/passwd',
                hint: '`cut -d: -f1` splits by `:` and takes the first field.',
            },
            {
                id: 'step-3',
                instruction: 'Replace text with sed: `echo "Hello World" | sed s/World/Linux/`',
                expectedCommand: 'echo "Hello World" | sed s/World/Linux/',
                hint: '`sed s/old/new/` performs text substitution.',
            },
        ],
        completionMessage: 'You\'re now a text processing guru!',
    },
};
