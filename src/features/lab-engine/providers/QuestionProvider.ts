export type AssessmentType = 'mcq' | 'syntax_drill' | 'finale_terminal';

export interface ChapterAssessment {
    id: string;
    chapterId: string;
    type: AssessmentType;
    question: string;
    options?: string[]; // Only used if type is 'mcq'
    correctAnswer: string;
    regexMatch?: boolean; // If true, correctAnswer is treated as a regex (useful for terminal verification)
    hint?: string;
    practiceOnly?: boolean;
}

// Since there are 27 chapters with 15+ questions each, defining them all statically would create a massive file.
// We will use procedural generators for syntax drills to provide infinite replayability,
// alongside a static bank for specific MCQ theory questions.

export const staticQuestionBank: ChapterAssessment[] = [
    // --- TRACK1-CH01: Your First Steps ---
    {
        id: 'q-t1ch01-01',
        chapterId: 'track1-ch01',
        type: 'mcq',
        question: 'Which component of the Linux system acts as the "interpreter" that takes your typed commands and tells the kernel what to do?',
        options: ['The Terminal Emulator', 'The Shell (Bash)', 'The BIOS', 'The Desktop Environment'],
        correctAnswer: 'The Shell (Bash)',
        hint: 'It is a program that reads your commands and executes them.'
    },
    {
        id: 'q-t1ch01-02',
        chapterId: 'track1-ch01',
        type: 'mcq',
        question: 'What character represents the "Root" directory, the top-level starting point of the entire Linux filesystem?',
        options: ['~', '/', '.', '..'],
        correctAnswer: '/',
        hint: 'It is a single forward slash.'
    },
    {
        id: 'q-t1ch01-03',
        chapterId: 'track1-ch01',
        type: 'syntax_drill',
        question: 'What is the command to print your current working directory?',
        correctAnswer: 'pwd',
        hint: 'Three letters, stands for Print Working Directory.'
    },
    {
        id: 'q-t1ch01-04',
        chapterId: 'track1-ch01',
        type: 'mcq',
        question: 'Which directory in the FHS is used for storing system-wide configuration files like user passwords and network settings?',
        options: ['/bin', '/usr', '/etc', '/var'],
        correctAnswer: '/etc',
        hint: 'Think "etcetera".'
    },
    {
        id: 'q-t1ch01-05',
        chapterId: 'track1-ch01',
        type: 'mcq',
        question: 'What does a path starting with a "/" (e.g., /home/student) represent?',
        options: ['A relative path', 'An absolute path', 'A hidden path', 'A root-only path'],
        correctAnswer: 'An absolute path',
        hint: 'It starts from the very top (root).'
    },
    {
        id: 'q-t1ch01-06',
        chapterId: 'track1-ch01',
        type: 'syntax_drill',
        question: 'Write the command to create a new directory named "linux_labs" in your current location.',
        correctAnswer: 'mkdir linux_labs',
        hint: 'Short for "make directory".'
    },
    {
        id: 'q-t1ch01-07',
        chapterId: 'track1-ch01',
        type: 'syntax_drill',
        question: 'Write the command to list all files in the current directory, including hidden ones.',
        correctAnswer: 'ls -a',
        hint: 'The flag starts with "a" for "all".'
    },
    {
        id: 'q-t1ch01-08',
        chapterId: 'track1-ch01',
        type: 'mcq',
        question: 'What command would you use to return immediately to your personal home directory (~)?',
        options: ['cd /', 'cd ..', 'cd', 'pwd'],
        correctAnswer: 'cd',
        hint: 'Just the command itself with no arguments defaults to home.'
    },
    {
        id: 'q-t1ch01-09',
        chapterId: 'track1-ch01',
        type: 'syntax_drill',
        question: 'Write the command to create an empty file named "test.txt".',
        correctAnswer: 'touch test.txt',
        hint: 'It "touches" the file system to create it.'
    },
    {
        id: 'q-t1ch01-10',
        chapterId: 'track1-ch01',
        type: 'finale_terminal',
        question: 'Final Challenge: Create a directory called "temp_work", move into it, create a file "ready.txt", and then return to your parent directory.',
        correctAnswer: 'mkdir temp_work && cd temp_work && touch ready.txt && cd ..',
        regexMatch: true,
        hint: 'Use && to chain: mkdir temp_work && cd temp_work && touch ready.txt && cd ..'
    },

    // --- TRACK1-CH02: Getting Help ---
    {
        id: 'q-t1ch02-01',
        chapterId: 'track1-ch02',
        type: 'mcq',
        question: 'Which command opens the full manual for a given command?',
        options: ['help', 'man', 'doc', 'info'],
        correctAnswer: 'man',
        hint: 'It is short for manual.'
    },
    {
        id: 'q-t1ch02-02',
        chapterId: 'track1-ch02',
        type: 'mcq',
        question: 'How do you exit from a "man" page viewer?',
        options: ['Esc', 'Ctrl+C', 'q', ':quit'],
        correctAnswer: 'q',
        hint: 'Just a single letter.'
    },
    {
        id: 'q-t1ch02-03',
        chapterId: 'track1-ch02',
        type: 'syntax_drill',
        question: 'Write the command to search all manual page descriptions for the keyword "partition".',
        correctAnswer: 'man -k partition',
        hint: 'Use the -k flag for keyword search.'
    },
    {
        id: 'q-t1ch02-04',
        chapterId: 'track1-ch02',
        type: 'mcq',
        question: 'Which manual section contains information about file formats and configuration files (like /etc/fstab)?',
        options: ['Section 1', 'Section 5', 'Section 8', 'Section 4'],
        correctAnswer: 'Section 5',
        hint: 'Section 1 is for user commands, Section 8 is for admin commands.'
    },
    {
        id: 'q-t1ch02-05',
        chapterId: 'track1-ch02',
        type: 'mcq',
        question: 'Which command is equivalent to "man -k" for searching manual keywords?',
        options: ['whatis', 'apropos', 'locate', 'search'],
        correctAnswer: 'apropos',
        hint: 'It starts with "a".'
    },
    {
        id: 'q-t1ch02-06',
        chapterId: 'track1-ch02',
        type: 'syntax_drill',
        question: 'Write the command to get a short usage summary for the "ls" command without opening the full manual.',
        correctAnswer: 'ls --help',
        hint: 'Use the double-dash help flag.'
    },
    {
        id: 'q-t1ch02-07',
        chapterId: 'track1-ch02',
        type: 'syntax_drill',
        question: 'What command should you use to get help for a shell built-in like "cd"?',
        correctAnswer: 'help cd',
        hint: 'Built-ins often don\'t have separate man pages.'
    },
    {
        id: 'q-t1ch02-08',
        chapterId: 'track1-ch02',
        type: 'mcq',
        question: 'Where would you look for extra package-specific documentation, READMEs, and examples?',
        options: ['/etc/doc', '/var/doc', '/usr/share/doc', '/usr/local/doc'],
        correctAnswer: '/usr/share/doc',
        hint: 'It is a common shared documentation directory.'
    },
    {
        id: 'q-t1ch02-09',
        chapterId: 'track1-ch02',
        type: 'mcq',
        question: 'While inside a man page, how do you search forward for the word "example"?',
        options: ['Ctrl+F example', '/example', '?example', 'grep example'],
        correctAnswer: '/example',
        hint: 'The forward slash is the standard search trigger in the less pager.'
    },
    {
        id: 'q-t1ch02-10',
        chapterId: 'track1-ch02',
        type: 'finale_terminal',
        question: 'Final Challenge: Search for a command that deals with "calendar", find its manual section 1 entry, and view it.',
        correctAnswer: 'man -k calendar && man 1 cal',
        regexMatch: true,
        hint: 'First "apropos calendar", then "man 1 cal".'
    },

    // --- TRACK1-CH03: Viewing and Manipulating Text ---
    {
        id: 'q-t1ch03-01',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'Which command displays the entire contents of a file on the screen?',
        options: ['head', 'cat', 'tail', 'less'],
        correctAnswer: 'cat',
        hint: 'It is short for concatenate.'
    },
    {
        id: 'q-t1ch03-02',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'Which symbol redirects output to a file, overwriting its current contents?',
        options: ['>>', '>', '|', '2>'],
        correctAnswer: '>',
        hint: 'A single arrow overwrites.'
    },
    {
        id: 'q-t1ch03-03',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'What does the "tail -f" command do?',
        options: [
            'Shows the first 10 lines and exits',
            'Shows the last 10 lines and exits',
            'Shows the last 10 lines and follows new additions live',
            'Formats a file'
        ],
        correctAnswer: 'Shows the last 10 lines and follows new additions live',
        hint: 'The -f flag stands for follow.'
    },
    {
        id: 'q-t1ch03-04',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'You want to append the word "done" to the end of a file named "tasks.txt". Which command is correct?',
        options: [
            'echo done > tasks.txt',
            'echo done >> tasks.txt',
            'echo done | tasks.txt',
            'cat done >> tasks.txt'
        ],
        correctAnswer: 'echo done >> tasks.txt',
        hint: 'Double arrows append.'
    },
    {
        id: 'q-t1ch03-05',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'What is the primary requirement for "uniq" to successfully remove all duplicate lines from a file?',
        options: [
            'The file must be small',
            'The file must be sorted first',
            'The file must be read-only',
            'The file must have a .txt extension'
        ],
        correctAnswer: 'The file must be sorted first',
        hint: 'uniq only compares adjacent lines.'
    },
    {
        id: 'q-t1ch03-06',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'Which stream does the "2>" operator redirect?',
        options: ['Standard Input (STDIN)', 'Standard Output (STDOUT)', 'Standard Error (STDERR)', 'Standard Result (STDRES)'],
        correctAnswer: 'Standard Error (STDERR)',
        hint: 'Stream 1 is output, stream 2 is error.'
    },
    {
        id: 'q-t1ch03-07',
        chapterId: 'track1-ch03',
        type: 'syntax_drill',
        question: 'Write the command to see only the first 5 lines of a file named "log.txt".',
        correctAnswer: 'head -n 5 log.txt',
        hint: 'Use the head command with the -n flag.'
    },
    {
        id: 'q-t1ch03-08',
        chapterId: 'track1-ch03',
        type: 'syntax_drill',
        question: 'Write a pipeline that sorts "names.txt" and removes all duplicates.',
        correctAnswer: 'sort names.txt | uniq',
        hint: 'Combine sort and uniq with a pipe.'
    },
    {
        id: 'q-t1ch03-09',
        chapterId: 'track1-ch03',
        type: 'mcq',
        question: 'What happens if you run "cat file.txt > file.txt"?',
        options: [
            'It copies the file to itself',
            'It appends the file to itself',
            'It empties (truncates) the file',
            'It displays the file content twice'
        ],
        correctAnswer: 'It empties (truncates) the file',
        hint: 'The shell opens the output file for writing before cat starts reading.'
    },
    {
        id: 'q-t1ch03-10',
        chapterId: 'track1-ch03',
        type: 'finale_terminal',
        question: 'Final Challenge: Count the number of lines in "sample.txt" that contain the word "apple", and save that number to a file called "count.txt".',
        correctAnswer: 'grep "apple" sample.txt | wc -l > count.txt',
        regexMatch: true,
        hint: 'Use grep to find, wc -l to count, and > to save.'
    },

    // --- TRACK1-CH04: Users & Groups ---
    {
        id: 'q-t1ch04-01',
        chapterId: 'track1-ch04',
        type: 'syntax_drill',
        question: 'Write the command to create a new user named "ashborn" with a primary group of "developers".',
        correctAnswer: 'useradd -g developers ashborn',
        hint: 'Use the -g flag for primary group.'
    },
    {
        id: 'q-t1ch04-02',
        chapterId: 'track1-ch04',
        type: 'mcq',
        question: 'Which file contains the encrypted password hashes for users on a Linux system?',
        options: ['/etc/passwd', '/etc/shadow', '/etc/group', '/etc/gshadow'],
        correctAnswer: '/etc/shadow',
        hint: 'It is hidden in the shadows.'
    },

    // --- TRACK1-CH05: Permissions ---
    {
        id: 'q-t1ch05-01',
        chapterId: 'track1-ch05',
        type: 'syntax_drill',
        question: 'Write the command to set the permissions of "script.sh" so the owner has full access (rwx), the group has read/execute (r-x), and others have no access.',
        correctAnswer: 'chmod 750 script.sh',
        hint: 'rwx=7, r-x=5, ---=0.'
    },
    {
        id: 'q-t1ch05-02',
        chapterId: 'track1-ch05',
        type: 'syntax_drill',
        question: 'Write the command to add the "Sticky Bit" to a directory named "/shared".',
        correctAnswer: 'chmod +t /shared',
        hint: 'The t bit is the sticky bit.'
    },

    // --- TRACK1-CH06: Process Management ---
    {
        id: 'q-t1ch06-01',
        chapterId: 'track1-ch06',
        type: 'syntax_drill',
        question: 'Write the command to display a real-time, dynamic view of running processes.',
        correctAnswer: 'top',
        hint: 'Standard process monitor.'
    },
    {
        id: 'q-t1ch06-02',
        chapterId: 'track1-ch06',
        type: 'syntax_drill',
        question: 'Write the command to send a SIGKILL signal to a process with PID 1234.',
        correctAnswer: 'kill -9 1234',
        hint: 'Kill -9 is the ultimate signal.'
    },

    // --- TRACK1-CH07: System Services ---
    {
        id: 'q-t1ch07-01',
        chapterId: 'track1-ch07',
        type: 'syntax_drill',
        question: 'Write the command to check the current status of the "ssh" service.',
        correctAnswer: 'systemctl status ssh',
        hint: 'Use systemctl.'
    },
    {
        id: 'q-t1ch07-02',
        chapterId: 'track1-ch07',
        type: 'syntax_drill',
        question: 'Write the command to enable the "httpd" service to start automatically at boot.',
        correctAnswer: 'systemctl enable httpd',
        hint: 'Use enable.'
    },

    // --- TRACK1-CH08: Remote Access (SSH) ---
    {
        id: 'q-t1ch08-01',
        chapterId: 'track1-ch08',
        type: 'syntax_drill',
        question: 'Write the command to connect to a remote server at 192.168.1.50 as the user "admin".',
        correctAnswer: 'ssh admin@192.168.1.50',
        hint: 'ssh user@host.'
    },
    {
        id: 'q-t1ch08-02',
        chapterId: 'track1-ch08',
        type: 'syntax_drill',
        question: 'Write the command to generate a new RSA SSH key pair.',
        correctAnswer: 'ssh-keygen -t rsa',
        hint: 'keygen tool.'
    },

    // --- TRACK1-CH09: Logging ---
    {
        id: 'q-t1ch09-01',
        chapterId: 'track1-ch09',
        type: 'syntax_drill',
        question: 'Write the command to view the last 50 lines of the system journal.',
        correctAnswer: 'journalctl -n 50',
        hint: 'Use journalctl with the -n flag.'
    },
    {
        id: 'q-t1ch09-02',
        chapterId: 'track1-ch09',
        type: 'syntax_drill',
        question: 'Write the command to follow new entries in the system journal in real-time.',
        correctAnswer: 'journalctl -f',
        hint: 'Follow flag.'
    },

    // --- TRACK1-CH10: Networking ---
    {
        id: 'q-t1ch10-01',
        chapterId: 'track1-ch10',
        type: 'syntax_drill',
        question: 'Write the command to display all IP addresses assigned to network interfaces.',
        correctAnswer: 'ip addr',
        hint: 'Modern iproute2 command.'
    },
    {
        id: 'q-t1ch10-02',
        chapterId: 'track1-ch10',
        type: 'syntax_drill',
        question: 'Write the command to test connectivity to "google.com" by sending 4 packets.',
        correctAnswer: 'ping -c 4 google.com',
        hint: 'Count flag.'
    },

    // --- TRACK1-CH11: Archiving & Compression ---
    {
        id: 'q-t1ch11-01',
        chapterId: 'track1-ch11',
        type: 'syntax_drill',
        question: 'Write the command to create a gzipped tar archive named "backup.tar.gz" of the directory "/home/student/data".',
        correctAnswer: 'tar -czf backup.tar.gz /home/student/data',
        hint: 'Create, Zip, File.'
    },
    {
        id: 'q-t1ch11-02',
        chapterId: 'track1-ch11',
        type: 'syntax_drill',
        question: 'Write the command to extract the contents of "archive.tar.gz" into the current directory.',
        correctAnswer: 'tar -xzf archive.tar.gz',
        hint: 'eXtract, Zip, File.'
    },

    // --- TRACK1-CH12: Software Management ---
    {
        id: 'q-t1ch12-01',
        chapterId: 'track1-ch12',
        type: 'syntax_drill',
        question: 'Write the command to install a package named "vim" using the default package manager.',
        correctAnswer: 'dnf install vim',
        hint: 'Standard enterprise manager.'
    },
    {
        id: 'q-t1ch12-02',
        chapterId: 'track1-ch12',
        type: 'syntax_drill',
        question: 'Write the command to remove a package named "nano".',
        correctAnswer: 'dnf remove nano',
        hint: 'dnf remove.'
    },

    // --- TRACK1-CH13: Storage & File Systems ---
    {
        id: 'q-t1ch13-01',
        chapterId: 'track1-ch13',
        type: 'syntax_drill',
        question: 'Write the command to list all block devices.',
        correctAnswer: 'lsblk',
        hint: 'List block devices.'
    },
    {
        id: 'q-t1ch13-02',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'Which file is used to configure persistent file system mounts?',
        options: ['/etc/mtab', '/etc/fstab', '/etc/mounts', '/etc/exports'],
        correctAnswer: '/etc/fstab',
        hint: 'File system table.'
    },

    // --- TRACK1-CH14: System Analysis ---
    {
        id: 'q-t1ch14-01',
        chapterId: 'track1-ch14',
        type: 'syntax_drill',
        question: 'Write the command to display disk space usage in human-readable format.',
        correctAnswer: 'df -h',
        hint: 'Disk free with human-readable flag.'
    },
    {
        id: 'q-t1ch14-02',
        chapterId: 'track1-ch14',
        type: 'syntax_drill',
        question: 'Write the command to display the system\'s current uptime and load averages.',
        correctAnswer: 'uptime',
        hint: 'Tells you how long the system has been up.'
    },

    // --- TRACK2-CH05: SELinux ---
    {
        id: 'q-t2ch05-01',
        chapterId: 'track2-ch05',
        type: 'syntax_drill',
        question: 'Write the command to view the current operational mode of SELinux (Enforcing, Permissive, or Disabled).',
        correctAnswer: 'getenforce',
        hint: 'Get the enforce status.'
    },
    {
        id: 'q-t2ch05-02',
        chapterId: 'track2-ch05',
        type: 'syntax_drill',
        question: 'Write the command to permanently change the default SELinux context of the /webdata directory (and its contents) to httpd_sys_content_t.',
        correctAnswer: 'semanage fcontext -a -t httpd_sys_content_t "/webdata(/.*)?"',
        hint: 'Use semanage fcontext with the add and type flags, followed by a regex for the directory.'
    },

    // --- TRACK2-CH07: Logical Volumes (LVM) ---
    {
        id: 'q-t2ch07-01',
        chapterId: 'track2-ch07',
        type: 'syntax_drill',
        question: 'Write the command to create a Volume Group named "data_vg" using the physical volume /dev/sdb1.',
        correctAnswer: 'vgcreate data_vg /dev/sdb1',
        hint: 'VG create.'
    },
    {
        id: 'q-t2ch07-02',
        chapterId: 'track2-ch07',
        type: 'syntax_drill',
        question: 'Write the command to extend the logical volume "db_lv" in "data_vg" by exactly 5 Gigabytes.',
        correctAnswer: 'lvextend -L +5G /dev/data_vg/db_lv',
        hint: 'Use lvextend with the -L flag and a plus sign.'
    },

    // --- TRACK2-CH12: Containers ---
    {
        id: 'q-t2ch12-01',
        chapterId: 'track2-ch12',
        type: 'syntax_drill',
        question: 'Write the command to search the default configured registries for a container image named "httpd".',
        correctAnswer: 'podman search httpd',
        hint: 'podman is the tool.'
    },
    {
        id: 'q-t2ch12-02',
        chapterId: 'track2-ch12',
        type: 'syntax_drill',
        question: 'Write the command to run a detached container named "web" using the "nginx" image, mapping host port 8080 to container port 80.',
        correctAnswer: 'podman run -d --name web -p 8080:80 nginx',
        hint: 'run detached (-d), name it, and publish (-p) ports host:container.'
    }
];

export class QuestionProvider {
    /**
     * Fetches a session subset of questions for a specific chapter.
     * In a full implementation, this would procedurally generate drills
     * based on the chapter ID to provide infinite replayability.
     */
    static async fetchSessionQuestions(chapterId: string, count: number = 5): Promise<ChapterAssessment[]> {
        // 1. Filter static bank
        const chapterQs = staticQuestionBank.filter(q => q.chapterId === chapterId);

        // 2. Procedural Generation (Fallback/Augmentation)
        // If we don't have enough static questions authored yet, generate synthetic ones
        // to ensure the UI doesn't break during this migration phase.
        while (chapterQs.length < count) {
            chapterQs.push(this.generateSyntheticDrill(chapterId, chapterQs.length));
        }

        // 3. Shuffle (Fisher-Yates)
        for (let i = chapterQs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chapterQs[i], chapterQs[j]] = [chapterQs[j], chapterQs[i]];
        }

        return chapterQs.slice(0, count);
    }

    private static generateSyntheticDrill(chapterId: string, index: number): ChapterAssessment {
        // A temporary synthetic generator to fulfill the "massive replayability" requirement
        // while the content team authors the thousands of specific variations required for all 27 chapters.
        const tools = ['grep', 'tar', 'systemctl', 'podman', 'nmcli', 'semanage', 'lvcreate'];
        const randomTool = tools[Math.floor(Math.random() * tools.length)];

        return {
            id: `synth-${chapterId}-${index}-${Date.now()}`,
            chapterId: chapterId,
            type: 'syntax_drill',
            question: `[Coming Soon] Practice: Write the command to check the version of the ${randomTool} utility.`,
            correctAnswer: `${randomTool} --version`,
            hint: 'This is a procedurally generated placeholder until the content DB is fully seeded. Practice only (No XP).',
            practiceOnly: true
        };
    }
}