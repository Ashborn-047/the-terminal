import { ChapterAssessment } from '../features/lab-engine/providers/QuestionProvider';

export const staticQuestionBank: ChapterAssessment[] = [
    // --- TRACK1-CH01: Your First Steps ---
    // EASY
    {
        id: "ch01_e01",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does the command 'pwd' do?",
        options: [
            "Prints the current working directory",
            "Prints the user's password",
            "Lists all running processes",
            "Changes directory"
        ],
        correctAnswer: "Prints the current working directory",
        hint: "pwd stands for 'print working directory' and shows your current location in the filesystem."
    },
    {
        id: "ch01_e02",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command is used to list files and directories?",
        options: ["cd", "ls", "pwd", "rm"],
        correctAnswer: "ls",
        hint: "ls lists the contents of the current directory."
    },
    {
        id: "ch01_e03",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "How do you create a new empty file using the terminal?",
        options: ["mkdir", "touch", "create", "echo"],
        correctAnswer: "touch",
        hint: "touch creates an empty file (or updates timestamps if the file already exists)."
    },
    {
        id: "ch01_e04",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command moves a file from one location to another?",
        options: ["cp", "mv", "rm", "ls"],
        correctAnswer: "mv",
        hint: "mv moves (or renames) files and directories."
    },
    {
        id: "ch01_e05",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command deletes a file?",
        options: ["rm", "mv", "cp", "mkdir"],
        correctAnswer: "rm",
        hint: "rm removes files (and with -r, directories)."
    },
    {
        id: "ch01_e06",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What is the root directory in Linux?",
        options: ["/root", "/home", "/", "C:\\"],
        correctAnswer: "/",
        hint: "The root directory is '/' — the top of the filesystem tree."
    },
    {
        id: "ch01_e07",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which key completes a partially typed command or filename?",
        options: ["Enter", "Tab", "Esc", "Space"],
        correctAnswer: "Tab",
        hint: "Pressing Tab triggers shell auto-completion."
    },
    {
        id: "ch01_e08",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'cd ..' do?",
        options: [
            "Goes to the home directory",
            "Moves up one directory level",
            "Changes to the root directory",
            "Cancels the last command"
        ],
        correctAnswer: "Moves up one directory level",
        hint: "'..' represents the parent directory, so cd .. moves you up one level."
    },
    {
        id: "ch01_e09",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which option to 'ls' shows hidden files?",
        options: ["-h", "-a", "-l", "-r"],
        correctAnswer: "-a",
        hint: "ls -a shows all files, including hidden ones starting with a dot."
    },
    {
        id: "ch01_e10",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "How do you make a directory named 'test'?",
        options: ["mkdir test", "touch test", "cd test", "rm test"],
        correctAnswer: "mkdir test",
        hint: "mkdir creates directories."
    },
    {
        id: "ch01_e11",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'cp file1 file2' do?",
        options: [
            "Moves file1 to file2",
            "Copies file1 to file2",
            "Deletes file1",
            "Renames file1 to file2"
        ],
        correctAnswer: "Copies file1 to file2",
        hint: "cp copies a file; the first argument is the source, the second is the destination."
    },
    {
        id: "ch01_e12",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command clears the terminal screen?",
        options: ["refresh", "clear", "cls", "reset"],
        correctAnswer: "clear",
        hint: "clear (or Ctrl+L) clears the screen."
    },
    {
        id: "ch01_e13",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "How do you go to your home directory instantly?",
        options: ["cd home", "cd /", "cd ~", "cd .."],
        correctAnswer: "cd ~",
        hint: "cd ~ (or just cd) takes you to your home directory."
    },
    {
        id: "ch01_e14",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What is the Filesystem Hierarchy Standard (FHS)?",
        options: [
            "A set of commands for file management",
            "A standard defining the directory structure of Linux",
            "A type of filesystem like ext4",
            "A network protocol"
        ],
        correctAnswer: "A standard defining the directory structure of Linux",
        hint: "FHS defines the directory structure and what goes where in Linux."
    },
    {
        id: "ch01_e15",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command shows a detailed listing with file sizes and permissions?",
        options: ["ls", "ls -l", "ls -a", "ls -h"],
        correctAnswer: "ls -l",
        hint: "ls -l gives a long listing with permissions, size, owner, and date."
    },

    // MEDIUM
    {
        id: "ch01_m01",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "If you are in /home/user, which command takes you to /etc?",
        options: ["cd /etc", "cd ..", "cd ~", "cd etc"],
        correctAnswer: "cd /etc",
        hint: "/etc is an absolute path; cd /etc goes there directly."
    },
    {
        id: "ch01_m02",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What happens if you run 'rm myfile'?",
        options: [
            "The file is moved to a trash folder",
            "The file is permanently deleted",
            "The file is renamed to myfile.bak",
            "An error occurs if the file does not exist"
        ],
        correctAnswer: "The file is permanently deleted",
        hint: "rm permanently deletes the file. There is no recycle bin in the terminal."
    },
    {
        id: "ch01_m03",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which path is a relative path?",
        options: ["/home/user/docs", "docs/notes.txt", "/var/log", "/tmp"],
        correctAnswer: "docs/notes.txt",
        hint: "docs/notes.txt does not start with '/' and is relative to the current directory."
    },
    {
        id: "ch01_m04",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'mkdir -p a/b/c' do?",
        options: [
            "Creates only directory c if a and b exist",
            "Creates a, then b, then c, even if parents don't exist",
            "Creates a single directory named 'a/b/c'",
            "Fails because nested directories cannot be created at once"
        ],
        correctAnswer: "Creates a, then b, then c, even if parents don't exist",
        hint: "The -p flag creates parent directories as needed."
    },
    {
        id: "ch01_m05",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "If you run 'ls /nonexistent', what happens?",
        options: [
            "It lists nothing",
            "Error: No such file or directory",
            "It creates the directory",
            "It asks for confirmation"
        ],
        correctAnswer: "Error: No such file or directory",
        hint: "ls on a non-existent path prints an error."
    },
    {
        id: "ch01_m06",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'cd -' do?",
        options: [
            "Go to the home directory",
            "Go to the previous directory you were in",
            "Go to the root directory",
            "Open a new terminal"
        ],
        correctAnswer: "Go to the previous directory you were in",
        hint: "cd - toggles to the last working directory (stored in $OLDPWD)."
    },
    {
        id: "ch01_m07",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command will copy a directory and all its contents?",
        options: ["cp dir newdir", "cp -r dir newdir", "mv dir newdir", "rm -r dir"],
        correctAnswer: "cp -r dir newdir",
        hint: "cp -r recursively copies directories."
    },
    {
        id: "ch01_m08",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What is the effect of 'touch file.txt' if file.txt already exists?",
        options: [
            "Deletes the file",
            "Creates an empty copy",
            "Updates the modification timestamp",
            "Nothing"
        ],
        correctAnswer: "Updates the modification timestamp",
        hint: "touch updates timestamps; it does not overwrite content."
    },
    {
        id: "ch01_m09",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command renames 'old.txt' to 'new.txt'?",
        options: ["cp old.txt new.txt", "mv old.txt new.txt", "rename old.txt new.txt", "rm old.txt new.txt"],
        correctAnswer: "mv old.txt new.txt",
        hint: "mv is used for both moving and renaming files."
    },
    {
        id: "ch01_m10",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'rm -r' do?",
        options: [
            "Removes only empty directories",
            "Recursively removes a directory and its contents",
            "Renames files recursively",
            "Removes read-only files"
        ],
        correctAnswer: "Recursively removes a directory and its contents",
        hint: "-r stands for recursive; it deletes everything inside."
    },
    {
        id: "ch01_m11",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which option to ls shows human-readable file sizes?",
        options: ["-a", "-l", "-h", "-r"],
        correctAnswer: "-h",
        hint: "ls -lh shows sizes like 1K, 234M."
    },
    {
        id: "ch01_m12",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What will 'cd /home/../tmp' do?",
        options: [
            "Error because of double dots",
            "Go to /tmp",
            "Go to /home/tmp",
            "Go to /home"
        ],
        correctAnswer: "Go to /tmp",
        hint: "/home/.. resolves to /, so the path becomes /tmp."
    },
    {
        id: "ch01_m13",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What is the shell prompt typically ending with for a regular user?",
        options: ["#", "$", ">", "%"],
        correctAnswer: "$",
        hint: "A regular user prompt ends with $; root's prompt ends with #."
    },
    {
        id: "ch01_m14",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "How do you stop a command that is running forever (e.g., 'tail -f')?",
        options: ["Ctrl+Z", "Ctrl+C", "Ctrl+D", "q"],
        correctAnswer: "Ctrl+C",
        hint: "Ctrl+C sends SIGINT, which interrupts the current program."
    },
    {
        id: "ch01_m15",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which directory contains system configuration files?",
        options: ["/var", "/usr", "/etc", "/home"],
        correctAnswer: "/etc",
        hint: "/etc holds configuration files for the system and services."
    },

    // HARD
    {
        id: "ch01_h01",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What happens if you run 'cat file.txt > file.txt'?",
        options: [
            "The file content doubles",
            "The file becomes empty",
            "An error is thrown",
            "The file is unchanged"
        ],
        correctAnswer: "The file becomes empty",
        hint: "The shell truncates the output file before cat reads it, resulting in an empty file."
    },
    {
        id: "ch01_h02",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command deletes a non-empty directory 'mydir' and all its contents?",
        options: ["rm mydir", "rmdir mydir", "rm -r mydir", "del mydir"],
        correctAnswer: "rm -r mydir",
        hint: "rm -r recursively removes the directory and everything inside."
    },
    {
        id: "ch01_h03",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does the '..' entry represent in every directory?",
        options: [
            "The current directory",
            "The parent directory",
            "The root directory",
            "A hidden file"
        ],
        correctAnswer: "The parent directory",
        hint: ".. is a special entry pointing to the parent directory."
    },
    {
        id: "ch01_h04",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "If you are in /home/alice, how do you refer to /var/log using a relative path?",
        options: [
            "../../var/log",
            "../var/log",
            "/var/log",
            "../../../var/log"
        ],
        correctAnswer: "../../var/log",
        hint: "From /home/alice, you need to go up twice (../..) to reach /, then var/log."
    },
    {
        id: "ch01_h05",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which of the following is NOT a valid file or directory starting name?",
        options: [".hidden", "a file", "123file", "file/name"],
        correctAnswer: "file/name",
        hint: "The forward slash '/' is a path separator, not allowed in a filename."
    },
    {
        id: "ch01_h06",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'ls -ltr' do?",
        options: [
            "List all files with details sorted by time, oldest last",
            "List files reversed alphabetically",
            "List files sorted by size",
            "List files recursively"
        ],
        correctAnswer: "List all files with details sorted by time, oldest last",
        hint: "-l long format, -t sort by time, -r reverse; combined, shows oldest first."
    },
    {
        id: "ch01_h07",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "If you run 'cd /etc && pwd', what is printed?",
        options: ["/home/user", "/etc", "/", "The command fails"],
        correctAnswer: "/etc",
        hint: "cd /etc changes the directory, pwd prints /etc."
    },
    {
        id: "ch01_h08",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command will create a file 'notes.txt' only if it does not already exist, without overwriting?",
        options: ["touch notes.txt", "cp /dev/null notes.txt", "echo > notes.txt", "There is no such command"],
        correctAnswer: "touch notes.txt",
        hint: "touch creates an empty file if it doesn't exist, and only updates timestamp if it does."
    },
    {
        id: "ch01_h09",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What will 'mkdir -p existing/new' do if 'existing' already exists?",
        options: [
            "Fail because existing exists",
            "Create 'new' inside 'existing'",
            "Overwrite 'existing'",
            "Nothing"
        ],
        correctAnswer: "Create 'new' inside 'existing'",
        hint: "-p creates parent directories as needed and doesn't complain about existing ones."
    },
    {
        id: "ch01_h10",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "How do you list only directories in the current directory?",
        options: [
            "ls -d */",
            "ls -l | grep '^d'",
            "ls -F | grep /$",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All these methods filter directories. ls -d */ is simplest."
    },
    {
        id: "ch01_h11",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does the command 'cp -i' do?",
        options: [
            "Copies interactively, asking before overwriting",
            "Copies only if the source is newer",
            "Copies with integrity checks",
            "Creates incremental backups"
        ],
        correctAnswer: "Copies interactively, asking before overwriting",
        hint: "-i stands for interactive, prompting before overwriting."
    },
    {
        id: "ch01_h12",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What is the difference between 'rmdir' and 'rm -r'?",
        options: [
            "rmdir only deletes empty directories; rm -r deletes everything",
            "rmdir is faster",
            "rm -r only works on files",
            "They are the same"
        ],
        correctAnswer: "rmdir only deletes empty directories; rm -r deletes everything",
        hint: "rmdir removes only empty directories; rm -r recursively deletes any directory."
    },
    {
        id: "ch01_h13",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "Which command displays the last 10 lines of a file and continues to show new lines as they are added?",
        options: ["head -n 10", "tail -f", "cat -f", "less +F"],
        correctAnswer: "tail -f",
        hint: "tail -f follows a file and prints appended lines in real time."
    },
    {
        id: "ch01_h14",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "What does 'ls -R' do?",
        options: [
            "Recursively lists subdirectories",
            "Shows files in reverse order",
            "Displays files in random order",
            "Refreshes the listing"
        ],
        correctAnswer: "Recursively lists subdirectories",
        hint: "-R recursively lists all subdirectories and their contents."
    },
    {
        id: "ch01_h15",
        chapterId: "track1-ch01",
        type: "mcq",
        question: "How do you view command history?",
        options: ["history", "ls -h", "hist", "Ctrl+H"],
        correctAnswer: "history",
        hint: "The 'history' command prints a numbered list of recent commands."
    },

    // --- OTHER CHAPTERS (Legacy/Static) ---
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
        id: 'q-t1ch04-02',
        chapterId: 'track1-ch04',
        type: 'mcq',
        question: 'Which file contains the encrypted password hashes for users on a Linux system?',
        options: ['/etc/passwd', '/etc/shadow', '/etc/group', '/etc/gshadow'],
        correctAnswer: '/etc/shadow',
        hint: 'It is hidden in the shadows.'
    },
    {
        id: 'q-t1ch13-02',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'Which file is used to configure persistent file system mounts?',
        options: ['/etc/mtab', '/etc/fstab', '/etc/mounts', '/etc/exports'],
        correctAnswer: '/etc/fstab',
        hint: 'File system table.'
    }
];
