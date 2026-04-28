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
    // --- SYS1-CH01: Core Desktop & Shell ---
    {
        id: 'q-sys1-01-01',
        chapterId: 'sys1-ch01',
        type: 'mcq',
        question: 'Which of the following environments provides the standard graphical desktop interface in modern Enterprise Linux?',
        options: ['KDE Plasma', 'GNOME', 'XFCE', 'Cinnamon'],
        correctAnswer: 'GNOME',
        hint: 'It is the default Wayland-based desktop environment.'
    },
    {
        id: 'q-sys1-01-02',
        chapterId: 'sys1-ch01',
        type: 'syntax_drill',
        question: 'What command displays the current user\'s identity and group memberships?',
        correctAnswer: 'id',
        hint: 'Two letters, stands for identity.'
    },

    // --- SYS1-CH02: File Management ---
    {
        id: 'q-sys1-02-01',
        chapterId: 'sys1-ch02',
        type: 'syntax_drill',
        question: 'Write the command to create a directory named "reports" inside /var/log, including any necessary parent directories that might not exist.',
        correctAnswer: 'mkdir -p /var/log/reports',
        hint: 'Use the flag that creates parent directories.'
    },
    {
        id: 'q-sys1-02-02',
        chapterId: 'sys1-ch02',
        type: 'mcq',
        question: 'Which absolute path represents the directory where system configuration files are typically stored?',
        options: ['/var', '/usr', '/etc', '/opt'],
        correctAnswer: '/etc',
        hint: 'Etcetera.'
    },
    {
        id: 'q-sys1-02-finale',
        chapterId: 'sys1-ch02',
        type: 'finale_terminal',
        question: 'Final Challenge: Create a file named "mastery.txt" in your home directory, then move it to /tmp.',
        correctAnswer: 'mv ~/mastery.txt /tmp',
        regexMatch: true,
        hint: 'First "touch ~/mastery.txt", then "mv ~/mastery.txt /tmp".'
    },

    // --- SYS1-CH03: Getting Help ---
    {
        id: 'q-sys1-03-01',
        chapterId: 'sys1-ch03',
        type: 'syntax_drill',
        question: 'Write the command to view the manual page for the "passwd" configuration file, which is located in section 5 of the manual.',
        correctAnswer: 'man 5 passwd',
        hint: 'Syntax: man [section] [topic]'
    },
    {
        id: 'q-sys1-03-02',
        chapterId: 'sys1-ch03',
        type: 'syntax_drill',
        question: 'Write the command to search all manual page summaries for the keyword "partition".',
        correctAnswer: 'man -k partition',
        hint: 'The -k flag stands for keyword (apropos).'
    },

    // --- SYS1-CH04: Text Files ---
    {
        id: 'q-sys1-04-01',
        chapterId: 'sys1-ch04',
        type: 'syntax_drill',
        question: 'Write a command using a pipe to list all files in /etc and count how many lines are in the output.',
        correctAnswer: 'ls /etc | wc -l',
        hint: 'ls followed by wc with the lines flag.'
    },
    {
        id: 'q-sys1-04-02',
        chapterId: 'sys1-ch04',
        type: 'mcq',
        question: 'In the vim editor, which key is used to enter "Insert Mode"?',
        options: ['Esc', 'i', ':q', 'Ctrl+C'],
        correctAnswer: 'i',
        hint: 'Think "Insert".'
    },

    // --- SYS1-CH05: Users & Groups ---
    {
        id: 'q-sys1-05-01',
        chapterId: 'sys1-ch05',
        type: 'syntax_drill',
        question: 'Write the command to create a new user named "ashborn" with a primary group of "developers".',
        correctAnswer: 'useradd -g developers ashborn',
        hint: 'Use the -g flag for primary group.'
    },
    {
        id: 'q-sys1-05-02',
        chapterId: 'sys1-ch05',
        type: 'mcq',
        question: 'Which file contains the encrypted password hashes for users on a Linux system?',
        options: ['/etc/passwd', '/etc/shadow', '/etc/group', '/etc/gshadow'],
        correctAnswer: '/etc/shadow',
        hint: 'It is hidden in the shadows.'
    },

    // --- SYS1-CH06: Permissions ---
    {
        id: 'q-sys1-06-01',
        chapterId: 'sys1-ch06',
        type: 'syntax_drill',
        question: 'Write the command to set the permissions of "script.sh" so the owner has full access (rwx), the group has read/execute (r-x), and others have no access.',
        correctAnswer: 'chmod 750 script.sh',
        hint: 'rwx=7, r-x=5, ---=0.'
    },
    {
        id: 'q-sys1-06-02',
        chapterId: 'sys1-ch06',
        type: 'syntax_drill',
        question: 'Write the command to add the "Sticky Bit" to a directory named "/shared".',
        correctAnswer: 'chmod +t /shared',
        hint: 'The t bit is the sticky bit.'
    },

    // --- SYS1-CH07: Processes ---
    {
        id: 'q-sys1-07-01',
        chapterId: 'sys1-ch07',
        type: 'syntax_drill',
        question: 'Write the command to send a "SIGKILL" signal to a process with PID 1234.',
        correctAnswer: 'kill -9 1234',
        hint: 'SIGKILL is signal number 9.'
    },
    {
        id: 'q-sys1-07-02',
        chapterId: 'sys1-ch07',
        type: 'mcq',
        question: 'Which command provides a dynamic, real-time view of running processes and system resource usage?',
        options: ['ps', 'kill', 'top', 'uptime'],
        correctAnswer: 'top',
        hint: 'It sits at the top of the system.'
    },

    // --- SYS1-CH08: Services ---
    {
        id: 'q-sys1-08-01',
        chapterId: 'sys1-ch08',
        type: 'syntax_drill',
        question: 'Write the command to check if the "httpd" service is currently running.',
        correctAnswer: 'systemctl status httpd',
        hint: 'Use the status subcommand.'
    },
    {
        id: 'q-sys1-08-02',
        chapterId: 'sys1-ch08',
        type: 'syntax_drill',
        question: 'Write the command to ensure the "sshd" service starts automatically every time the system boots.',
        correctAnswer: 'systemctl enable sshd',
        hint: 'Use the enable subcommand.'
    },

    // --- SYS1-CH09: SSH ---
    {
        id: 'q-sys1-09-01',
        chapterId: 'sys1-ch09',
        type: 'syntax_drill',
        question: 'Write the command to generate a new RSA SSH key pair with a 4096-bit key length.',
        correctAnswer: 'ssh-keygen -t rsa -b 4096',
        hint: 'Use -t for type and -b for bits.'
    },
    {
        id: 'q-sys1-09-02',
        chapterId: 'sys1-ch09',
        type: 'mcq',
        question: 'In which file is the SSH daemon configuration stored?',
        options: ['/etc/ssh/ssh_config', '/etc/ssh/sshd_config', '/etc/sshd.conf', '/etc/ssh/config'],
        correctAnswer: '/etc/ssh/sshd_config',
        hint: 'The daemon configuration ends with "d".'
    },

    // --- SYS1-CH10: Logs ---
    {
        id: 'q-sys1-10-01',
        chapterId: 'sys1-ch10',
        type: 'syntax_drill',
        question: 'Write the command to view all journal logs for the "sshd" service since the last boot.',
        correctAnswer: 'journalctl -u sshd -b',
        hint: 'Use -u for unit and -b for boot.'
    },
    {
        id: 'q-sys1-10-02',
        chapterId: 'sys1-ch10',
        type: 'mcq',
        question: 'Which directory contains most of the system log files in a traditional Linux system?',
        options: ['/var/log', '/etc/log', '/usr/log', '/tmp/log'],
        correctAnswer: '/var/log',
        hint: 'Variable data logs.'
    },

    // --- SYS1-CH11: Networking ---
    {
        id: 'q-sys1-11-01',
        chapterId: 'sys1-ch11',
        type: 'syntax_drill',
        question: 'Write the command to show the IP address information for all network interfaces.',
        correctAnswer: 'ip addr',
        hint: 'Two short words.'
    },
    {
        id: 'q-sys1-11-02',
        chapterId: 'sys1-ch11',
        type: 'syntax_drill',
        question: 'Write the command to set the hostname of the system to "server.example.com".',
        correctAnswer: 'hostnamectl set-hostname server.example.com',
        hint: 'Use hostnamectl with the set-hostname subcommand.'
    },

    // --- SYS1-CH12: Archiving ---
    {
        id: 'q-sys1-12-01',
        chapterId: 'sys1-ch12',
        type: 'syntax_drill',
        question: 'Write the command to create a compressed gzip tar archive named "backup.tar.gz" of the /etc directory.',
        correctAnswer: 'tar -czf backup.tar.gz /etc',
        hint: 'Flags: c=create, z=gzip, f=file.'
    },
    {
        id: 'q-sys1-12-02',
        chapterId: 'sys1-ch12',
        type: 'syntax_drill',
        question: 'Write the command to securely copy "file.txt" to the /tmp directory on a remote server at 192.168.1.10 using the username "admin".',
        correctAnswer: 'scp file.txt admin@192.168.1.10:/tmp',
        hint: 'Similar to cp, but with remote destination.'
    },

    // --- SYS1-CH13: Software ---
    {
        id: 'q-sys1-13-01',
        chapterId: 'sys1-ch13',
        type: 'syntax_drill',
        question: 'Write the command to search for a package named "nginx" in the configured repositories.',
        correctAnswer: 'dnf search nginx',
        hint: 'Use the search subcommand.'
    },
    {
        id: 'q-sys1-13-02',
        chapterId: 'sys1-ch13',
        type: 'syntax_drill',
        question: 'Write the command to view detailed information about the installed "kernel" package.',
        correctAnswer: 'dnf info kernel',
        hint: 'Use the info subcommand.'
    },

    // --- SYS1-CH14: File Systems ---
    {
        id: 'q-sys1-14-01',
        chapterId: 'sys1-ch14',
        type: 'syntax_drill',
        question: 'Write the command to mount the file system on /dev/sdb1 to the /mnt/data directory.',
        correctAnswer: 'mount /dev/sdb1 /mnt/data',
        hint: 'Syntax: mount [device] [mountpoint]'
    },
    {
        id: 'q-sys1-14-02',
        chapterId: 'sys1-ch14',
        type: 'mcq',
        question: 'Which file contains the persistent mount configuration for the system?',
        options: ['/etc/mounts', '/etc/fstab', '/proc/mounts', '/etc/filesystems'],
        correctAnswer: '/etc/fstab',
        hint: 'File system table.'
    },

    // --- SYS1-CH15: System Analysis ---
    {
        id: 'q-sys1-15-01',
        chapterId: 'sys1-ch15',
        type: 'syntax_drill',
        question: 'Write the command to display disk space usage in human-readable format.',
        correctAnswer: 'df -h',
        hint: 'Disk free with human-readable flag.'
    },
    {
        id: 'q-sys1-15-02',
        chapterId: 'sys1-ch15',
        type: 'syntax_drill',
        question: 'Write the command to display the system\'s current uptime and load averages.',
        correctAnswer: 'uptime',
        hint: 'Tells you how long the system has been up.'
    },

    // --- SYS2-CH05: SELinux ---
    {
        id: 'q-sys2-05-01',
        chapterId: 'sys2-ch05',
        type: 'syntax_drill',
        question: 'Write the command to view the current operational mode of SELinux (Enforcing, Permissive, or Disabled).',
        correctAnswer: 'getenforce',
        hint: 'Get the enforce status.'
    },
    {
        id: 'q-sys2-05-02',
        chapterId: 'sys2-ch05',
        type: 'syntax_drill',
        question: 'Write the command to permanently change the default SELinux context of the /webdata directory (and its contents) to httpd_sys_content_t.',
        correctAnswer: 'semanage fcontext -a -t httpd_sys_content_t "/webdata(/.*)?"',
        hint: 'Use semanage fcontext with the add and type flags, followed by a regex for the directory.'
    },

    // --- SYS2-CH07: Logical Volumes (LVM) ---
    {
        id: 'q-sys2-07-01',
        chapterId: 'sys2-ch07',
        type: 'syntax_drill',
        question: 'Write the command to create a Volume Group named "data_vg" using the physical volume /dev/sdb1.',
        correctAnswer: 'vgcreate data_vg /dev/sdb1',
        hint: 'VG create.'
    },
    {
        id: 'q-sys2-07-02',
        chapterId: 'sys2-ch07',
        type: 'syntax_drill',
        question: 'Write the command to extend the logical volume "db_lv" in "data_vg" by exactly 5 Gigabytes.',
        correctAnswer: 'lvextend -L +5G /dev/data_vg/db_lv',
        hint: 'Use lvextend with the -L flag and a plus sign.'
    },

    // --- SYS2-CH12: Containers ---
    {
        id: 'q-sys2-12-01',
        chapterId: 'sys2-ch12',
        type: 'syntax_drill',
        question: 'Write the command to search the default configured registries for a container image named "httpd".',
        correctAnswer: 'podman search httpd',
        hint: 'podman is the tool.'
    },
    {
        id: 'q-sys2-12-02',
        chapterId: 'sys2-ch12',
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