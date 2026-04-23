export type ChapterAssessmentType = 'mcq' | 'syntax_drill' | 'finale_terminal';

export interface ChapterAssessment {
    id: string;
    type: ChapterAssessmentType;
    question: string;
    options?: string[]; // For MCQ
    correctAnswer: string; // The correct option, or the exact command (or regex) for drill/finale
    regexMatch?: boolean; // If true, correctAnswer is treated as regex for syntax_drill/finale
    hint?: string;
    explanation?: string;
}

export interface ChapterPool {
    id: string;
    assessments: ChapterAssessment[];
}

export interface Chapter {
    id: string;
    title: string;
    description: string;
    moduleId: number;
    requiredLevel: number;
    xpReward: number;
    pools: ChapterPool[]; // Multiple pools to rotate questions on replay
}

export const chaptersData: Chapter[] = [
    {
        id: 'chap-1',
        title: 'The Kernel & Shell Fundamentals',
        description: 'Understand the core architecture of Linux, the role of the Kernel, and how the Shell interprets your commands.',
        moduleId: 1,
        requiredLevel: 1,
        xpReward: 200,
        pools: [
            {
                id: 'pool-1-a',
                assessments: [
                    {
                        id: 'c1-p1-q1',
                        type: 'mcq',
                        question: 'What is the primary role of the Linux Kernel?',
                        options: [
                            'To provide a graphical user interface',
                            'To manage hardware resources and act as a bridge to applications',
                            'To compile C code into executable binaries',
                            'To serve as the default package manager'
                        ],
                        correctAnswer: 'To manage hardware resources and act as a bridge to applications',
                        explanation: 'The kernel is the core of the OS that manages CPU, memory, and devices.'
                    },
                    {
                        id: 'c1-p1-q2',
                        type: 'syntax_drill',
                        question: 'Print the absolute path of the current working directory.',
                        correctAnswer: 'pwd',
                        hint: 'Print Working Directory'
                    },
                    {
                        id: 'c1-p1-q3',
                        type: 'finale_terminal',
                        question: 'Navigate to /var/log, list all files showing hidden ones, and print the working directory.',
                        correctAnswer: 'cd /var/log && ls -a && pwd',
                        regexMatch: true,
                        hint: 'Use && to chain commands'
                    }
                ]
            },
            {
                id: 'pool-1-b',
                assessments: [
                    {
                        id: 'c1-p2-q1',
                        type: 'mcq',
                        question: 'Which component directly interprets user commands?',
                        options: [
                            'The Kernel',
                            'The File System',
                            'The Shell',
                            'The Bootloader'
                        ],
                        correctAnswer: 'The Shell',
                        explanation: 'The shell takes text input and translates it into system calls for the kernel.'
                    },
                    {
                        id: 'c1-p2-q2',
                        type: 'syntax_drill',
                        question: 'List the contents of the current directory, including hidden files, using the long format.',
                        correctAnswer: 'ls -la',
                        hint: 'Combine the -l and -a flags'
                    },
                    {
                        id: 'c1-p2-q3',
                        type: 'finale_terminal',
                        question: 'Go to the root directory and list its contents.',
                        correctAnswer: 'cd / && ls',
                        regexMatch: true,
                        hint: 'Root is /'
                    }
                ]
            },
            {
                id: 'pool-1-c',
                assessments: [
                    {
                        id: 'c1-p3-q1',
                        type: 'mcq',
                        question: 'What is the difference between an absolute path and a relative path?',
                        options: [
                            'Absolute paths start from the root (/), relative paths start from the current directory.',
                            'Absolute paths are only for root users, relative paths for normal users.',
                            'Relative paths start with a tilde (~), absolute paths do not.',
                            'There is no difference, both are just ways to name files.'
                        ],
                        correctAnswer: 'Absolute paths start from the root (/), relative paths start from the current directory.',
                        explanation: 'An absolute path provides the full location from the system root, while a relative path depends on where you currently are.'
                    },
                    {
                        id: 'c1-p3-q2',
                        type: 'syntax_drill',
                        question: 'Return to your home directory using a single symbol shortcut.',
                        correctAnswer: 'cd ~',
                        hint: 'The tilde character represents the home directory.'
                    },
                    {
                        id: 'c1-p3-q3',
                        type: 'finale_terminal',
                        question: 'Print the phrase "Linux is powerful" to the terminal.',
                        correctAnswer: 'echo "Linux is powerful"',
                        regexMatch: true,
                        hint: 'Use the echo command.'
                    }
                ]
            },
            {
                id: 'pool-1-d',
                assessments: [
                    {
                        id: 'c1-p4-q1',
                        type: 'mcq',
                        question: 'How do you access the manual for a specific command, like "ls"?',
                        options: [
                            'help ls',
                            'ls --manual',
                            'man ls',
                            'info ls'
                        ],
                        correctAnswer: 'man ls',
                        explanation: 'The "man" command opens the system manual pager for the given command.'
                    },
                    {
                        id: 'c1-p4-q2',
                        type: 'syntax_drill',
                        question: 'Navigate to the directory immediately above your current one (the parent directory).',
                        correctAnswer: 'cd ..',
                        hint: 'Use the double-dot notation.'
                    },
                    {
                        id: 'c1-p4-q3',
                        type: 'finale_terminal',
                        question: 'List the 10 most recently executed commands in your session.',
                        correctAnswer: 'history | tail -n 10',
                        regexMatch: true,
                        hint: 'Use the history command.'
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-2',
        title: 'File System Hierarchy',
        description: 'Navigate the standard Linux file system structure and understand where different types of files live.',
        moduleId: 1,
        requiredLevel: 2,
        xpReward: 250,
        pools: [
            {
                id: 'pool-2-a',
                assessments: [
                    {
                        id: 'c2-p1-q1',
                        type: 'mcq',
                        question: 'Where are system-wide configuration files typically stored?',
                        options: ['/bin', '/usr', '/etc', '/var'],
                        correctAnswer: '/etc',
                        explanation: '/etc stands for "editable text configuration" and holds system configs.'
                    },
                    {
                        id: 'c2-p1-q2',
                        type: 'syntax_drill',
                        question: 'Create an empty file named "config.txt".',
                        correctAnswer: 'touch config.txt'
                    },
                    {
                        id: 'c2-p1-q3',
                        type: 'finale_terminal',
                        question: 'Create a directory called "testdir", navigate into it, and create a file "hello.txt".',
                        correctAnswer: 'mkdir testdir && cd testdir && touch hello.txt',
                        regexMatch: true
                    }
                ]
            },
            {
                id: 'pool-2-b',
                assessments: [
                    {
                        id: 'c2-p2-q1',
                        type: 'mcq',
                        question: 'Which directory is intended for variable data files like logs, databases, and spool files?',
                        options: ['/var', '/opt', '/lib', '/sys'],
                        correctAnswer: '/var',
                        explanation: '/var contains files to which the system writes data during the course of its operation.'
                    },
                    {
                        id: 'c2-p2-q2',
                        type: 'syntax_drill',
                        question: 'Create a directory named "backup" in the current directory.',
                        correctAnswer: 'mkdir backup'
                    },
                    {
                        id: 'c2-p2-q3',
                        type: 'finale_terminal',
                        question: 'Copy the file /etc/passwd to your current directory.',
                        correctAnswer: 'cp /etc/passwd .',
                        regexMatch: true,
                        hint: 'Use a dot (.) to represent the current directory.'
                    }
                ]
            },
            {
                id: 'pool-2-c',
                assessments: [
                    {
                        id: 'c2-p3-q1',
                        type: 'mcq',
                        question: 'What is the main difference between /bin and /sbin?',
                        options: [
                            '/bin is for source files, /sbin is for scripts.',
                            '/bin contains essential user binaries, /sbin contains essential system administration binaries.',
                            '/bin is for small files, /sbin is for large files.',
                            'There is no difference, they are identical.'
                        ],
                        correctAnswer: '/bin contains essential user binaries, /sbin contains essential system administration binaries.',
                        explanation: '/sbin typically requires root privileges to execute its contents.'
                    },
                    {
                        id: 'c2-p3-q2',
                        type: 'syntax_drill',
                        question: 'Rename the file "oldname.txt" to "newname.txt".',
                        correctAnswer: 'mv oldname.txt newname.txt'
                    },
                    {
                        id: 'c2-p3-q3',
                        type: 'finale_terminal',
                        question: 'Move the file "data.txt" into the "archive" directory.',
                        correctAnswer: 'mv data.txt archive/',
                        regexMatch: true
                    }
                ]
            },
            {
                id: 'pool-2-d',
                assessments: [
                    {
                        id: 'c2-p4-q1',
                        type: 'mcq',
                        question: 'Which directory is used for temporary files that are usually cleared on reboot?',
                        options: ['/var/tmp', '/tmp', '/dev', '/run'],
                        correctAnswer: '/tmp',
                        explanation: '/tmp is world-writable and used for short-lived temporary files.'
                    },
                    {
                        id: 'c2-p4-q2',
                        type: 'syntax_drill',
                        question: 'Remove the file named "temp.log" without prompting for confirmation.',
                        correctAnswer: 'rm -f temp.log',
                        hint: 'Use the force flag.'
                    },
                    {
                        id: 'c2-p4-q3',
                        type: 'finale_terminal',
                        question: 'Recursively and forcefully remove the directory "old_project" and all its contents.',
                        correctAnswer: 'rm -rf old_project',
                        regexMatch: true,
                        hint: 'Use recursive and force flags.'
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-3',
        title: 'Advanced Permissions & Security',
        description: 'Master file ownership, standard permissions (rwx), and special bits (SUID, SGID, Sticky).',
        moduleId: 2,
        requiredLevel: 5,
        xpReward: 350,
        pools: [
            {
                id: 'pool-3-a',
                assessments: [
                    {
                        id: 'c3-p1-q1',
                        type: 'mcq',
                        question: 'What does the octal permission 755 mean?',
                        options: [
                            'Owner: rwx, Group: r-x, Others: r-x',
                            'Owner: rwx, Group: rwx, Others: r-x',
                            'Owner: rw-, Group: r--, Others: r--',
                            'Owner: r-x, Group: rwx, Others: rwx'
                        ],
                        correctAnswer: 'Owner: rwx, Group: r-x, Others: r-x',
                        explanation: '7 = 4+2+1 (rwx), 5 = 4+1 (r-x).'
                    },
                    {
                        id: 'c3-p1-q2',
                        type: 'syntax_drill',
                        question: 'Change the permissions of "script.sh" to give the owner read, write, and execute permissions, and no permissions for anyone else (use octal notation).',
                        correctAnswer: 'chmod 700 script.sh'
                    },
                    {
                        id: 'c3-p1-q3',
                        type: 'finale_terminal',
                        question: 'Set the sticky bit on the /tmp directory.',
                        correctAnswer: 'chmod +t /tmp',
                        regexMatch: true
                    }
                ]
            },
            {
                id: 'pool-3-b',
                assessments: [
                    {
                        id: 'c3-p2-q1',
                        type: 'mcq',
                        question: 'Which octal permission represents read and write for the owner, and read-only for group and others?',
                        options: ['755', '600', '644', '777'],
                        correctAnswer: '644',
                        explanation: '6 = 4+2 (rw), 4 = 4 (r).'
                    },
                    {
                        id: 'c3-p2-q2',
                        type: 'syntax_drill',
                        question: 'Change the owner of "file.txt" to the user "alice" and the group to "developers".',
                        correctAnswer: 'chown alice:developers file.txt'
                    },
                    {
                        id: 'c3-p2-q3',
                        type: 'finale_terminal',
                        question: 'Add execute permission for everyone to the file "run.sh".',
                        correctAnswer: 'chmod +x run.sh',
                        regexMatch: true
                    }
                ]
            },
            {
                id: 'pool-3-c',
                assessments: [
                    {
                        id: 'c3-p3-q1',
                        type: 'mcq',
                        question: 'What is the effect of setting the SUID bit on an executable file?',
                        options: [
                            'It makes the file immutable.',
                            'It executes with the privileges of the file owner, rather than the user running it.',
                            'It hides the file from standard ls commands.',
                            'It encrypts the file execution.'
                        ],
                        correctAnswer: 'It executes with the privileges of the file owner, rather than the user running it.',
                        explanation: 'Set-User-ID allows users to perform tasks requiring elevated privileges temporarily (like the passwd command).'
                    },
                    {
                        id: 'c3-p3-q2',
                        type: 'syntax_drill',
                        question: 'Set the SUID bit on the file "/usr/bin/custom_tool" using symbolic notation.',
                        correctAnswer: 'chmod u+s /usr/bin/custom_tool'
                    },
                    {
                        id: 'c3-p3-q3',
                        type: 'finale_terminal',
                        question: 'Change the permissions of "secret.key" so only the owner can read or write it, and nobody else has access.',
                        correctAnswer: 'chmod 600 secret.key',
                        regexMatch: true
                    }
                ]
            },
            {
                id: 'pool-3-d',
                assessments: [
                    {
                        id: 'c3-p4-q1',
                        type: 'mcq',
                        question: 'What does setting the SGID bit on a directory do?',
                        options: [
                            'Prevents anyone but the owner from deleting files inside.',
                            'Forces all new files created in the directory to inherit the group ownership of the directory.',
                            'Makes the directory hidden.',
                            'Grants group members sudo access.'
                        ],
                        correctAnswer: 'Forces all new files created in the directory to inherit the group ownership of the directory.',
                        explanation: 'SGID on a directory is crucial for shared team folders so files remain accessible to the group.'
                    },
                    {
                        id: 'c3-p4-q2',
                        type: 'syntax_drill',
                        question: 'Set the SGID bit on the directory "shared_team_folder" using symbolic notation.',
                        correctAnswer: 'chmod g+s shared_team_folder'
                    },
                    {
                        id: 'c3-p4-q3',
                        type: 'finale_terminal',
                        question: 'Change the group ownership of the directory "project" recursively to "devs".',
                        correctAnswer: 'chown -R :devs project',
                        regexMatch: true,
                        hint: 'Use the recursive flag and omit the user to just change the group.'
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-4',
        title: 'Shell Scripting & Automation',
        description: 'Learn the basics of automating tasks using shell scripts, variables, and loops.',
        moduleId: 3,
        requiredLevel: 8,
        xpReward: 400,
        pools: [
            {
                id: 'pool-4-a',
                assessments: [
                    {
                        id: 'c4-p1-q1',
                        type: 'mcq',
                        question: 'What is the purpose of a shebang (e.g., #!/bin/bash) at the start of a script?',
                        options: [
                            'It encrypts the script',
                            'It tells the OS which interpreter to use to execute the script',
                            'It includes a standard library',
                            'It is just a comment ignored by the system'
                        ],
                        correctAnswer: 'It tells the OS which interpreter to use to execute the script',
                        explanation: 'The shebang dictates the interpreter for the executable.'
                    },
                    {
                        id: 'c4-p1-q2',
                        type: 'syntax_drill',
                        question: 'Output the value of the environment variable $USER.',
                        correctAnswer: 'echo $USER'
                    },
                    {
                        id: 'c4-p1-q3',
                        type: 'finale_terminal',
                        question: 'Write "echo Hello" into a file named script.sh and make it executable.',
                        correctAnswer: 'echo "echo Hello" > script.sh && chmod +x script.sh',
                        regexMatch: true
                    }
                ]
            },
            {
                id: 'pool-4-b',
                assessments: [
                    {
                        id: 'c4-p2-q1',
                        type: 'mcq',
                        question: 'What does the ">" operator do in the shell?',
                        options: [
                            'Appends output to a file.',
                            'Redirects standard output to a file, overwriting its contents.',
                            'Reads input from a file.',
                            'Pipes the output to another command.'
                        ],
                        correctAnswer: 'Redirects standard output to a file, overwriting its contents.',
                        explanation: 'The single > overwrites the file. Double >> appends to it.'
                    },
                    {
                        id: 'c4-p2-q2',
                        type: 'syntax_drill',
                        question: 'Append the text "End of log" to the file "app.log".',
                        correctAnswer: 'echo "End of log" >> app.log'
                    },
                    {
                        id: 'c4-p2-q3',
                        type: 'finale_terminal',
                        question: 'Search for the word "ERROR" in the file "syslog" and redirect only those lines to a new file named "errors.txt".',
                        correctAnswer: 'grep "ERROR" syslog > errors.txt',
                        regexMatch: true,
                        hint: 'Combine grep and redirection.'
                    }
                ]
            },
            {
                id: 'pool-4-c',
                assessments: [
                    {
                        id: 'c4-p3-q1',
                        type: 'mcq',
                        question: 'What is the function of the pipe operator (|)?',
                        options: [
                            'It runs commands in parallel.',
                            'It passes the standard output of one command as the standard input to the next command.',
                            'It creates a logical OR condition between two commands.',
                            'It stops the execution of a process.'
                        ],
                        correctAnswer: 'It passes the standard output of one command as the standard input to the next command.',
                        explanation: 'Piping is the core of the Unix philosophy: writing small tools that do one thing well and chaining them together.'
                    },
                    {
                        id: 'c4-p3-q2',
                        type: 'syntax_drill',
                        question: 'List all files in the current directory and pipe the output to the "wc -l" command to count the number of lines.',
                        correctAnswer: 'ls | wc -l'
                    },
                    {
                        id: 'c4-p3-q3',
                        type: 'finale_terminal',
                        question: 'Set an environment variable named "ENV_TYPE" to "production" and export it.',
                        correctAnswer: 'export ENV_TYPE="production"',
                        regexMatch: true,
                        hint: 'Use the export command.'
                    }
                ]
            },
            {
                id: 'pool-4-d',
                assessments: [
                    {
                        id: 'c4-p4-q1',
                        type: 'mcq',
                        question: 'How do you check the exit status (return code) of the last executed command?',
                        options: [
                            'echo $?',
                            'echo $!',
                            'echo $$',
                            'echo $#'
                        ],
                        correctAnswer: 'echo $?',
                        explanation: 'The special variable $? holds the exit status of the last executed command. 0 means success, anything else means an error.'
                    },
                    {
                        id: 'c4-p4-q2',
                        type: 'syntax_drill',
                        question: 'Use command substitution to echo the output of the "date" command inside a sentence: "Today is [date output]".',
                        correctAnswer: 'echo "Today is $(date)"',
                        hint: 'Use the $(command) syntax.'
                    },
                    {
                        id: 'c4-p4-q3',
                        type: 'finale_terminal',
                        question: 'Write a basic for loop in a single line that prints the numbers 1, 2, and 3. Use the syntax: for i in 1 2 3; do ... done',
                        correctAnswer: 'for i in 1 2 3; do echo $i; done',
                        regexMatch: true
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-5',
        title: 'Process Management & Monitoring',
        description: 'Understand how the Linux kernel manages processes, tracks resource usage, and sends signals.',
        moduleId: 3,
        requiredLevel: 10,
        xpReward: 450,
        pools: [
            {
                id: 'pool-5-a',
                assessments: [
                    {
                        id: 'c5-p1-q1',
                        type: 'mcq',
                        question: 'Which command provides a dynamic, real-time view of running processes?',
                        options: ['ps', 'top', 'free', 'jobs'],
                        correctAnswer: 'top',
                        explanation: 'While "ps" gives a static snapshot, "top" (and htop) provides a live, updating dashboard.'
                    },
                    {
                        id: 'c5-p1-q2',
                        type: 'syntax_drill',
                        question: 'Find the PID of a running process named "nginx" by using a process-search command.',
                        correctAnswer: 'pgrep nginx',
                        hint: 'Use the pgrep command.'
                    },
                    {
                        id: 'c5-p1-q3',
                        type: 'finale_terminal',
                        question: 'Send a SIGKILL signal (force kill) to process ID 1234.',
                        correctAnswer: 'kill -9 1234',
                        regexMatch: true,
                        hint: 'SIGKILL is signal number 9.'
                    }
                ]
            },
            {
                id: 'pool-5-b',
                assessments: [
                    {
                        id: 'c5-p2-q1',
                        type: 'mcq',
                        question: 'What does appending an ampersand (&) to a command do?',
                        options: [
                            'It creates a logical AND condition.',
                            'It runs the command as the root user.',
                            'It runs the command in the background, returning control of the terminal immediately.',
                            'It pipes the output to the void.'
                        ],
                        correctAnswer: 'It runs the command in the background, returning control of the terminal immediately.',
                        explanation: 'The & operator forks the process to the background, allowing you to continue using the shell.'
                    },
                    {
                        id: 'c5-p2-q2',
                        type: 'syntax_drill',
                        question: 'Bring the most recently backgrounded job to the foreground.',
                        correctAnswer: 'fg',
                        hint: 'Foreground command.'
                    },
                    {
                        id: 'c5-p2-q3',
                        type: 'finale_terminal',
                        question: 'View a snapshot of all processes running on the system for all users, in a full format.',
                        correctAnswer: 'ps aux',
                        regexMatch: true,
                        hint: 'Use the ps command with a, u, and x flags.'
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-6',
        title: 'Networking & Connectivity',
        description: 'Learn the core commands for diagnosing network issues, configuring interfaces, and testing connectivity.',
        moduleId: 4,
        requiredLevel: 12,
        xpReward: 500,
        pools: [
            {
                id: 'pool-6-a',
                assessments: [
                    {
                        id: 'c6-p1-q1',
                        type: 'mcq',
                        question: 'Which modern command has replaced "ifconfig" for viewing and managing network interfaces?',
                        options: ['netstat', 'ip', 'ping', 'route'],
                        correctAnswer: 'ip',
                        explanation: 'The "ip" suite from iproute2 is the modern standard, replacing net-tools commands like ifconfig.'
                    },
                    {
                        id: 'c6-p1-q2',
                        type: 'syntax_drill',
                        question: 'Test connectivity to "google.com" by sending exactly 4 ICMP echo requests.',
                        correctAnswer: 'ping -c 4 google.com',
                        hint: 'Use the count flag (-c).'
                    },
                    {
                        id: 'c6-p1-q3',
                        type: 'finale_terminal',
                        question: 'Display the routing table of the system.',
                        correctAnswer: 'ip route',
                        regexMatch: true,
                        hint: 'Use the ip command.'
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-7',
        title: 'Package Management',
        description: 'Understand how software is installed, updated, and removed on Debian/Ubuntu-based systems.',
        moduleId: 4,
        requiredLevel: 14,
        xpReward: 500,
        pools: [
            {
                id: 'pool-7-a',
                assessments: [
                    {
                        id: 'c7-p1-q1',
                        type: 'mcq',
                        question: 'What must you typically do before installing a new package via "apt" to ensure you get the latest version?',
                        options: [
                            'apt upgrade',
                            'apt clean',
                            'apt update',
                            'apt search'
                        ],
                        correctAnswer: 'apt update',
                        explanation: '"apt update" refreshes your local list of available packages from the remote repositories.'
                    },
                    {
                        id: 'c7-p1-q2',
                        type: 'syntax_drill',
                        question: 'Install the package named "curl" using apt.',
                        correctAnswer: 'apt install curl',
                        hint: 'You usually need sudo, but just write the base apt command.'
                    },
                    {
                        id: 'c7-p1-q3',
                        type: 'finale_terminal',
                        question: 'Remove the package "vim" including its configuration files.',
                        correctAnswer: 'apt purge vim',
                        regexMatch: true,
                        hint: 'Purge removes configs, whereas remove does not.'
                    }
                ]
            }
        ]
    },
    {
        id: 'chap-8',
        title: 'Text Processing & Filtering',
        description: 'Master powerful GNU utilities for searching, replacing, and manipulating text streams.',
        moduleId: 5,
        requiredLevel: 16,
        xpReward: 600,
        pools: [
            {
                id: 'pool-8-a',
                assessments: [
                    {
                        id: 'c8-p1-q1',
                        type: 'mcq',
                        question: 'Which tool is best suited for columnar data extraction (e.g., printing only the 3rd column of a CSV file)?',
                        options: ['grep', 'sed', 'awk', 'less'],
                        correctAnswer: 'awk',
                        explanation: 'Awk is a full programming language highly optimized for field and column extraction.'
                    },
                    {
                        id: 'c8-p1-q2',
                        type: 'syntax_drill',
                        question: 'Use "grep" to perform a case-insensitive search for the word "error" in "app.log".',
                        correctAnswer: 'grep -i "error" app.log',
                        hint: 'Use the ignore-case flag (-i).'
                    },
                    {
                        id: 'c8-p1-q3',
                        type: 'finale_terminal',
                        question: 'Use "sed" to replace the first occurrence of the word "foo" with "bar" in the file "test.txt", outputting to stdout.',
                        correctAnswer: 'sed "s/foo/bar/" test.txt',
                        regexMatch: true,
                        hint: 'Use the substitute (s) command in sed.'
                    }
                ]
            }
        ]
    }
];