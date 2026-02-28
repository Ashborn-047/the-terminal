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
};
