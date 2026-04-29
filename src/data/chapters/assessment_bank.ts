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

    // --- TRACK1-CH02: Getting Help ---
    // EASY
    {
        id: "ch02_e01",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which command opens the manual for 'ls'?",
        options: ["man ls", "info ls", "help ls", "open ls"],
        correctAnswer: "man ls",
        hint: "man opens the manual page; q to quit."
    },
    {
        id: "ch02_e02",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How do you exit a man page?",
        options: ["Ctrl+X", "Esc", "q", ":quit"],
        correctAnswer: "q",
        hint: "Pressing q quits the man viewer."
    },
    {
        id: "ch02_e03",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does 'man -k passwd' do?",
        options: [
            "Opens the manual for passwd",
            "Searches manual page descriptions for 'passwd'",
            "Kills the manual process",
            "Checks the passwd file syntax"
        ],
        correctAnswer: "Searches manual page descriptions for 'passwd'",
        hint: "man -k (or apropos) searches short descriptions."
    },
    {
        id: "ch02_e04",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which command is equivalent to 'man -k'?",
        options: ["whatis", "apropos", "man -f", "info"],
        correctAnswer: "apropos",
        hint: "apropos does the same keyword search."
    },
    {
        id: "ch02_e05",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How do you get a quick usage summary for most commands?",
        options: ["command --help", "command ?", "help command", "man command"],
        correctAnswer: "command --help",
        hint: "Most commands support --help for a brief summary."
    },
    {
        id: "ch02_e06",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which manual section contains system administration commands?",
        options: ["1", "5", "8", "3"],
        correctAnswer: "8",
        hint: "Section 8 is for system administration commands."
    },
    {
        id: "ch02_e07",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What command is used to get help on shell built-in commands like 'cd'?",
        options: ["man cd", "help cd", "info cd", "which cd"],
        correctAnswer: "help cd",
        hint: "help cd works because cd is a shell built-in; man cd usually fails."
    },
    {
        id: "ch02_e08",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does the 'whatis' command do?",
        options: [
            "Shows full manual",
            "Prints a one-line description from the manual",
            "Lists all commands",
            "Searches files by name"
        ],
        correctAnswer: "Prints a one-line description from the manual",
        hint: "whatis prints a short description, like man -f."
    },
    {
        id: "ch02_e09",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Where can you find extra documentation for installed packages?",
        options: ["/etc/doc", "/var/doc", "/usr/share/doc", "/home/doc"],
        correctAnswer: "/usr/share/doc",
        hint: "/usr/share/doc holds READMEs, changelogs, and examples."
    },
    {
        id: "ch02_e10",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What key combination searches within a man page?",
        options: ["Ctrl+F", "/", "Ctrl+S", "?"],
        correctAnswer: "/",
        hint: "Type / followed by the search term and press Enter."
    },
    {
        id: "ch02_e11",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which command starts the info documentation system?",
        options: ["info", "help", "man", "docs"],
        correctAnswer: "info",
        hint: "info opens the hyperlinked documentation for GNU tools."
    },
    {
        id: "ch02_e12",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How do you see the manual page for the configuration file 'crontab'?",
        options: ["man crontab", "man 5 crontab", "man config crontab", "man -c crontab"],
        correctAnswer: "man 5 crontab",
        hint: "Section 5 is for file formats; man 5 crontab shows the config file syntax."
    },
    {
        id: "ch02_e13",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What flag to man shows all sections for a keyword?",
        options: ["-a", "-k", "-f", "-l"],
        correctAnswer: "-a",
        hint: "man -a shows manual pages from all sections sequentially."
    },
    {
        id: "ch02_e14",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which of the following is NOT a built-in help source in Linux?",
        options: ["man", "info", "Google", "--help"],
        correctAnswer: "Google",
        hint: "Google is external; the others are built-in."
    },
    {
        id: "ch02_e15",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does 'pinfo' provide?",
        options: [
            "A password manager",
            "A user-friendly alternative to 'info'",
            "Process information",
            "Package information"
        ],
        correctAnswer: "A user-friendly alternative to 'info'",
        hint: "pinfo is a more navigable info viewer."
    },

    // MEDIUM
    {
        id: "ch02_m01",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "If you want to learn about the 'passwd' file format, which command is correct?",
        options: ["man passwd", "man 5 passwd", "man 1 passwd", "man file passwd"],
        correctAnswer: "man 5 passwd",
        hint: "Section 5 contains file formats; passwd(5) describes /etc/passwd."
    },
    {
        id: "ch02_m02",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What happens when you run 'man 1 crontab' vs 'man 5 crontab'?",
        options: [
            "They are identical",
            "One shows the command, the other the config file format",
            "The second fails",
            "There is no difference"
        ],
        correctAnswer: "One shows the command, the other the config file format",
        hint: "Section 1 is for commands, section 5 for config files."
    },
    {
        id: "ch02_m03",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which command would give you a list of all manual pages related to 'disk'?",
        options: ["man disk", "man -k disk", "man -f disk", "apropos disk"],
        correctAnswer: "man -k disk",
        hint: "man -k disk searches short descriptions. (Note: apropos is equivalent)."
    },
    {
        id: "ch02_m04",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which section would contain a system call like 'open'?",
        options: ["1", "2", "5", "8"],
        correctAnswer: "2",
        hint: "Section 2 is for system calls."
    },
    {
        id: "ch02_m05",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How do you search for a command that sets the system time without knowing its name?",
        options: ["man time", "man -k time", "which time", "ls /usr/bin/time"],
        correctAnswer: "man -k time",
        hint: "man -k time will list commands with 'time' in their description."
    },
    {
        id: "ch02_m06",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What is the difference between 'man' and 'info'?",
        options: [
            "No difference",
            "info is a hypertext-based documentation system often used by GNU projects",
            "info only works for kernel functions",
            "man is only for user commands"
        ],
        correctAnswer: "info is a hypertext-based documentation system often used by GNU projects",
        hint: "info provides node-based, linked documentation for GNU software."
    },
    {
        id: "ch02_m07",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does 'info coreutils' give you?",
        options: [
            "A list of all core utilities",
            "Documentation for a collection of essential commands like ls, cp",
            "System information",
            "Kernel documentation"
        ],
        correctAnswer: "Documentation for a collection of essential commands like ls, cp",
        hint: "coreutils is the GNU package containing many basic commands; info coreutils documents them."
    },
    {
        id: "ch02_m08",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which command will NOT give you help for 'cd'?",
        options: ["help cd", "man cd", "cd --help", "bash -c 'help cd'"],
        correctAnswer: "man cd",
        hint: "man cd typically shows 'No manual entry for cd' because cd is a built-in."
    },
    {
        id: "ch02_m09",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Where would you look for examples of how to use a package?",
        options: [
            "/etc/examples",
            "/usr/share/doc/<packagename>",
            "/var/lib",
            "man examples"
        ],
        correctAnswer: "/usr/share/doc/<packagename>",
        hint: "/usr/share/doc often contains sample configurations and tutorials."
    },
    {
        id: "ch02_m10",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What is the purpose of 'man -f whatis'?",
        options: [
            "Shows full manual for whatis",
            "Displays a short description of whatis",
            "Searches whatis in descriptions",
            "Formats the manual"
        ],
        correctAnswer: "Displays a short description of whatis",
        hint: "man -f is equivalent to whatis; it prints a one-line description."
    },
    {
        id: "ch02_m11",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which option to 'less' (the pager used by man) searches forward?",
        options: ["/", "?", "f", "s"],
        correctAnswer: "/",
        hint: "/ searches forward; ? searches backward."
    },
    {
        id: "ch02_m12",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does 'man ls | col -b' do?",
        options: [
            "Removes formatting for piping",
            "Colors the output",
            "Converts the manual to PDF",
            "Deletes the manual"
        ],
        correctAnswer: "Removes formatting for piping",
        hint: "col -b removes backspaces/formatting, useful for saving man output."
    },
    {
        id: "ch02_m13",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "If 'man signal' gives you something unexpected, what could you try?",
        options: [
            "man 2 signal",
            "man 7 signal",
            "man -k signal",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "signal can be in section 2 (system calls) or 7 (overview); searching helps."
    },
    {
        id: "ch02_m14",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Why is 'man --help' different from 'man man'?",
        options: [
            "They are the same",
            "--help gives a short usage summary, man man gives the full manual",
            "--help only works for built-ins",
            "man man doesn't exist"
        ],
        correctAnswer: "--help gives a short usage summary, man man gives the full manual",
        hint: "Most commands provide brief help with --help."
    },
    {
        id: "ch02_m15",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does the number in parentheses mean in 'echo(1)'?",
        options: [
            "The version",
            "The manual section",
            "The priority",
            "The number of options"
        ],
        correctAnswer: "The manual section",
        hint: "It refers to the manual section."
    },

    // HARD
    {
        id: "ch02_h01",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "You try 'man 5 passwd' but get nothing. What is likely the problem?",
        options: [
            "The manual pages are not installed",
            "The section number is wrong",
            "You need to be root",
            "The command is misspelled"
        ],
        correctAnswer: "The manual pages are not installed",
        hint: "If man pages are missing, install the 'man-pages' package or check MANPATH."
    },
    {
        id: "ch02_h02",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How can you permanently save a formatted man page as a PDF?",
        options: [
            "man -t ls | ps2pdf - > ls.pdf",
            "man ls > ls.pdf",
            "save man ls",
            "man --pdf ls"
        ],
        correctAnswer: "man -t ls | ps2pdf - > ls.pdf",
        hint: "man -t produces PostScript; ps2pdf converts to PDF."
    },
    {
        id: "ch02_h03",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does 'info --subnodes' do?",
        options: [
            "Shows all subnodes recursively",
            "Hides subnodes",
            "Creates a new info node",
            "Deletes info pages"
        ],
        correctAnswer: "Shows all subnodes recursively",
        hint: "--subnodes outputs all nodes recursively."
    },
    {
        id: "ch02_h04",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which command would you use to find how 'strace' works?",
        options: [
            "man strace",
            "strace --help",
            "info strace",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All are valid help sources, though info may be absent for strace."
    },
    {
        id: "ch02_h05",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What is the effect of setting MANWIDTH in the environment?",
        options: [
            "Controls the line width of manual pages",
            "Sets the number of columns in a terminal",
            "Defines the path to manuals",
            "Disables man pages"
        ],
        correctAnswer: "Controls the line width of manual pages",
        hint: "MANWIDTH overrides the default formatting width."
    },
    {
        id: "ch02_h06",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How do you search all man pages for the word 'signal' including descriptions and content?",
        options: [
            "man -K signal",
            "man -k signal",
            "grep -r signal /usr/share/man",
            "man -w signal"
        ],
        correctAnswer: "man -K signal",
        hint: "man -K does a full-text search (capital K)."
    },
    {
        id: "ch02_h07",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What is the difference between 'man -k' and 'man -K'?",
        options: [
            "No difference",
            "-k searches short descriptions, -K searches full text",
            "-k is for kernel, -K for key",
            "-k kills man, -K keeps"
        ],
        correctAnswer: "-k searches short descriptions, -K searches full text",
        hint: "-k (apropos) vs -K (full-text grep)."
    },
    {
        id: "ch02_h08",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which manual section discusses file formats like /etc/passwd?",
        options: ["1", "4", "5", "7"],
        correctAnswer: "5",
        hint: "Section 5: File Formats and Configurations."
    },
    {
        id: "ch02_h09",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does 'man -P cat' do?",
        options: [
            "Uses cat as the pager instead of less",
            "Formats for printing",
            "Outputs to a file",
            "Displays the manual for cat"
        ],
        correctAnswer: "Uses cat as the pager instead of less",
        hint: "-P sets the pager; cat just dumps the output."
    },
    {
        id: "ch02_h10",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Where are the manual page source files typically stored?",
        options: [
            "/usr/share/man",
            "/etc/man",
            "/var/lib/man",
            "/opt/man"
        ],
        correctAnswer: "/usr/share/man",
        hint: "Manual pages are stored under /usr/share/man."
    },
    {
        id: "ch02_h11",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What is the effect of running 'help' without arguments?",
        options: [
            "Lists all shell built-in commands",
            "Shows error",
            "Opens the bash manual",
            "Displays help for help"
        ],
        correctAnswer: "Lists all shell built-in commands",
        hint: "Plain 'help' prints a list of built-in commands."
    },
    {
        id: "ch02_h12",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "If 'man' displays nothing, how can you troubleshoot?",
        options: [
            "Check if man-db package is installed",
            "Run mandb to rebuild index",
            "Set MANPATH correctly",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All may be necessary if manuals are missing."
    },
    {
        id: "ch02_h13",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How would you open the manual page for the 'write' system call?",
        options: ["man write", "man 2 write", "man 1 write", "man -s 2 write"],
        correctAnswer: "man 2 write",
        hint: "Section 2 is system calls; man 2 write."
    },
    {
        id: "ch02_h14",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does the 'SEE ALSO' section in a man page typically contain?",
        options: [
            "Related commands and documentation",
            "Author information",
            "Bug reports",
            "Copyright"
        ],
        correctAnswer: "Related commands and documentation",
        hint: "It lists related man pages and references."
    },
    {
        id: "ch02_h15",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What is the purpose of the 'mandb' command?",
        options: [
            "Creates or updates the manual page index cache",
            "Downloads missing manuals",
            "Manages database man pages",
            "Formats man pages"
        ],
        correctAnswer: "Creates or updates the manual page index cache",
        hint: "mandb updates the whatis/apropos database."
    },

    // --- TRACK1-CH03: Reading the Story ---
    // EASY
    {
        id: "ch03_e01",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command displays the entire content of a file?",
        options: ["head", "tail", "cat", "wc"],
        correctAnswer: "cat",
        hint: "cat concatenates and prints the whole file."
    },
    {
        id: "ch03_e02",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'head -n 5 file.txt' do?",
        options: [
            "Shows last 5 lines",
            "Shows first 5 lines",
            "Deletes first 5 lines",
            "Counts lines"
        ],
        correctAnswer: "Shows first 5 lines",
        hint: "head outputs the first lines; -n 5 specifies the count."
    },
    {
        id: "ch03_e03",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command shows the last 10 lines of a file?",
        options: ["head -10", "tail -10", "cat -10", "wc -l"],
        correctAnswer: "tail -10",
        hint: "tail outputs the last part of a file."
    },
    {
        id: "ch03_e04",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does the '>' symbol do in a command?",
        options: [
            "Appends output to a file",
            "Redirects output overwriting a file",
            "Chains commands",
            "Comments"
        ],
        correctAnswer: "Redirects output overwriting a file",
        hint: "> redirects stdout to a file, overwriting it."
    },
    {
        id: "ch03_e05",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which symbol appends output to a file without overwriting?",
        options: [">", ">>", "|", "<"],
        correctAnswer: ">>",
        hint: ">> appends to a file."
    },
    {
        id: "ch03_e06",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does the pipe '|' do?",
        options: [
            "Redirects output to a file",
            "Sends output of one command as input to another",
            "Separates commands on one line",
            "Grep pattern"
        ],
        correctAnswer: "Sends output of one command as input to another",
        hint: "| connects stdout of the left command to stdin of the right."
    },
    {
        id: "ch03_e07",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command sorts lines alphabetically?",
        options: ["uniq", "sort", "grep", "wc"],
        correctAnswer: "sort",
        hint: "sort orders lines."
    },
    {
        id: "ch03_e08",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'uniq' do?",
        options: [
            "Sorts unique lines",
            "Removes adjacent duplicate lines",
            "Counts characters",
            "Transliterates"
        ],
        correctAnswer: "Removes adjacent duplicate lines",
        hint: "uniq removes or reports adjacent duplicate lines."
    },
    {
        id: "ch03_e09",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you combine 'sort' and 'uniq' to get only unique lines?",
        options: [
            "sort | uniq",
            "uniq | sort",
            "sort -u",
            "Both sort | uniq and sort -u"
        ],
        correctAnswer: "Both sort | uniq and sort -u",
        hint: "sort file | uniq and sort -u both work."
    },
    {
        id: "ch03_e10",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'tail -f' do?",
        options: [
            "Shows last 10 lines and exits",
            "Follows a file, displaying new lines as added",
            "Shows file format",
            "Formats output"
        ],
        correctAnswer: "Follows a file, displaying new lines as added",
        hint: "tail -f keeps watching for appended data."
    },
    {
        id: "ch03_e11",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command counts lines, words, and characters?",
        options: ["wc", "count", "wc -l", "ls"],
        correctAnswer: "wc",
        hint: "wc (word count) with no flags shows all three."
    },
    {
        id: "ch03_e12",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you redirect stderr to a file?",
        options: [">", "2>", "&>", "1>"],
        correctAnswer: "2>",
        hint: "2> redirects standard error."
    },
    {
        id: "ch03_e13",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What is the output of 'cat file1 file2'?",
        options: [
            "Appends file2 to file1",
            "Displays file1 then file2",
            "Only file1",
            "Error"
        ],
        correctAnswer: "Displays file1 then file2",
        hint: "cat concatenates and prints the combined content."
    },
    {
        id: "ch03_e14",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command combines stdout and stderr into one file?",
        options: ["> file 2>&1", "&> file", "1>&2", "Both > file 2>&1 and &> file"],
        correctAnswer: "Both > file 2>&1 and &> file",
        hint: "Both > file 2>&1 and &> file redirect both streams."
    },
    {
        id: "ch03_e15",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -r' do?",
        options: [
            "Sorts randomly",
            "Sorts in reverse order",
            "Removes duplicates",
            "Sorts numerically"
        ],
        correctAnswer: "Sorts in reverse order",
        hint: "-r reverses the sort order."
    },

    // MEDIUM
    {
        id: "ch03_m01",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'cat file.txt > file.txt' do?",
        options: [
            "Doubles file size",
            "Empties the file",
            "Does nothing",
            "Shows error"
        ],
        correctAnswer: "Empties the file",
        hint: "The shell truncates the output file before cat reads it."
    },
    {
        id: "ch03_m02",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How would you display only the 3rd line of a file?",
        options: [
            "head -3 file | tail -1",
            "tail -3 file | head -1",
            "sed -n '3p' file",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All are valid methods."
    },
    {
        id: "ch03_m03",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -n' do?",
        options: [
            "Sorts numerically",
            "Sorts by name",
            "Sorts ignoring case",
            "Sorts unique"
        ],
        correctAnswer: "Sorts numerically",
        hint: "-n sorts by numeric value."
    },
    {
        id: "ch03_m04",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Why might 'uniq file' not remove all duplicates?",
        options: [
            "uniq only works on sorted input",
            "uniq only removes adjacent duplicates",
            "uniq requires -d",
            "uniq is for unique files only"
        ],
        correctAnswer: "uniq only removes adjacent duplicates",
        hint: "uniq works on adjacent lines, so duplicates must be grouped."
    },
    {
        id: "ch03_m05",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which pipeline gives a count of each unique line?",
        options: [
            "sort | uniq -c",
            "sort | uniq -d",
            "sort -u | wc -l",
            "uniq -c | sort"
        ],
        correctAnswer: "sort | uniq -c",
        hint: "sort groups them, uniq -c prepends counts."
    },
    {
        id: "ch03_m06",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'tee' do?",
        options: [
            "Splits output, writing to files and stdout",
            "Creates a pipe",
            "Counts lines",
            "Truncates files"
        ],
        correctAnswer: "Splits output, writing to files and stdout",
        hint: "tee reads stdin and writes to both files and stdout."
    },
    {
        id: "ch03_m07",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What will 'ls -l 2> error.log' do?",
        options: [
            "Redirects errors to error.log, normal output to screen",
            "Redirects all output to error.log",
            "Ignores errors",
            "Sends errors to screen"
        ],
        correctAnswer: "Redirects errors to error.log, normal output to screen",
        hint: "2> redirects only stderr."
    },
    {
        id: "ch03_m08",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you avoid the 'Useless Use of Cat'?",
        options: [
            "Use grep file instead of cat file | grep",
            "Always use cat",
            "Use awk instead",
            "Never use pipes"
        ],
        correctAnswer: "Use grep file instead of cat file | grep",
        hint: "grep can read files directly: grep pattern file."
    },
    {
        id: "ch03_m09",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command concatenates two files and saves the output?",
        options: [
            "cat file1 file2 > output",
            "cp file1+file2 output",
            "mv file1 file2 output",
            "join file1 file2"
        ],
        correctAnswer: "cat file1 file2 > output",
        hint: "cat file1 file2 > output does the job."
    },
    {
        id: "ch03_m10",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -t: -k3,3 /etc/passwd' do?",
        options: [
            "Sorts by third field using ':' as delimiter",
            "Sorts reverse",
            "Sorts unique",
            "Sorts ignoring colons"
        ],
        correctAnswer: "Sorts by third field using ':' as delimiter",
        hint: "-t sets delimiter, -k selects field."
    },
    {
        id: "ch03_m11",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'wc -l' count?",
        options: ["Words", "Characters", "Lines", "Files"],
        correctAnswer: "Lines",
        hint: "-l counts lines."
    },
    {
        id: "ch03_m12",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you redirect both stdout and stderr to the same file using simple syntax?",
        options: ["&> file", "> file 2>&1", "2>&1 > file", "Both &> file and > file 2>&1"],
        correctAnswer: "Both &> file and > file 2>&1",
        hint: "&> and > file 2>&1 both work."
    },
    {
        id: "ch03_m13",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command displays the file with line numbers?",
        options: ["cat -n", "nl", "wc -l", "Both cat -n and nl"],
        correctAnswer: "Both cat -n and nl",
        hint: "cat -n and nl both add line numbers."
    },
    {
        id: "ch03_m14",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does '2>&1' mean?",
        options: [
            "Redirects stderr to stdout",
            "Redirects stdout to stderr",
            "Sends file descriptor 2 to file 1",
            "Error"
        ],
        correctAnswer: "Redirects stderr to stdout",
        hint: "It makes stderr go to the same place as stdout."
    },
    {
        id: "ch03_m15",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "If you run 'sort -u file', what is the equivalent pipeline?",
        options: [
            "sort file | uniq",
            "uniq file | sort",
            "cat file | uniq -c",
            "sort file | wc -l"
        ],
        correctAnswer: "sort file | uniq",
        hint: "sort -u outputs unique sorted lines, same as sort | uniq."
    },

    // HARD
    {
        id: "ch03_h01",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you reverse the order of lines in a file?",
        options: ["tac file", "sort -r file", "rev file", "cat file | reverse"],
        correctAnswer: "tac file",
        hint: "tac concatenates files in reverse line order."
    },
    {
        id: "ch03_h02",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What will 'sort -t: -k2n /etc/passwd' do?",
        options: [
            "Sort by second field numerically",
            "Sort by first field",
            "Remove duplicates",
            "Translate delimiters"
        ],
        correctAnswer: "Sort by second field numerically",
        hint: "-t: sets delimiter, -k2n means second field numeric sort."
    },
    {
        id: "ch03_h03",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which of these is equivalent to 'tail -n +10 file'?",
        options: [
            "sed '1,9d' file",
            "awk 'NR>=10' file",
            "head -n -9 file",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All skip the first 9 lines and print rest."
    },
    {
        id: "ch03_h04",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you join lines of a file into a single line, separated by commas?",
        options: [
            "paste -s -d, file",
            "tr '\\n' ',' < file",
            "awk '{printf \"%s,\", $0}' file",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All achieve the same result."
    },
    {
        id: "ch03_h05",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'split -l 100 file' do?",
        options: [
            "Splits the file into pieces of 100 lines each",
            "Deletes 100 lines",
            "Counts every 100 lines",
            "Shows 100 lines"
        ],
        correctAnswer: "Splits the file into pieces of 100 lines each",
        hint: "split creates smaller files based on line count."
    },
    {
        id: "ch03_h06",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What is the effect of 'cat *.log > combined.log'?",
        options: [
            "Concatenates all .log files into combined.log",
            "Deletes all log files",
            "Shows an error if combined.log exists",
            "Only copies one file"
        ],
        correctAnswer: "Concatenates all .log files into combined.log",
        hint: "The shell expands *.log and cat joins them."
    },
    {
        id: "ch03_h07",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command outputs lines common to two sorted files?",
        options: ["comm -12 file1 file2", "diff", "uniq", "sort -m"],
        correctAnswer: "comm -12 file1 file2",
        hint: "comm -12 shows lines in both files."
    },
    {
        id: "ch03_h08",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How would you find the 5 largest files in /var/log?",
        options: [
            "ls -lS /var/log | head -5",
            "du -a /var/log | sort -n -r | head -5",
            "find /var/log -type f -exec ls -s {} + | sort -n -r | head -5",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "Various methods, but all can produce the result."
    },
    {
        id: "ch03_h09",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What is the difference between '> file 2>&1' and '2>&1 > file'?",
        options: [
            "The latter doesn't redirect stderr correctly",
            "No difference",
            "The former is backwards",
            "First only redirects stderr"
        ],
        correctAnswer: "The latter doesn't redirect stderr correctly",
        hint: "Order matters: 2>&1 > file duplicates stderr to the original stdout, then redirects stdout to file, leaving stderr on terminal."
    },
    {
        id: "ch03_h10",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'tr' do in a pipeline?",
        options: [
            "Translates or deletes characters",
            "Traces files",
            "Tracks changes",
            "Terminates processes"
        ],
        correctAnswer: "Translates or deletes characters",
        hint: "tr translates, squeezes, or deletes characters."
    },
    {
        id: "ch03_h11",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you display a file in reverse line order?",
        options: ["tac file", "rev file", "sort -r file", "cat file | reverse"],
        correctAnswer: "tac file",
        hint: "tac is cat reversed."
    },
    {
        id: "ch03_h12",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'paste' do?",
        options: [
            "Merges lines of files side by side",
            "Joins strings",
            "Creates files",
            "Appends text"
        ],
        correctAnswer: "Merges lines of files side by side",
        hint: "paste combines corresponding lines from multiple files."
    },
    {
        id: "ch03_h13",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "If you run 'sort -t: -k3n /etc/group', what does it sort by?",
        options: [
            "Third field numerically (GID)",
            "Group name",
            "Password field",
            "User list"
        ],
        correctAnswer: "Third field numerically (GID)",
        hint: "-k3n sorts on the third field as numbers."
    },
    {
        id: "ch03_h14",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'cut -d: -f1 /etc/passwd' produce?",
        options: [
            "List of usernames",
            "List of UIDs",
            "Home directories",
            "Encrypted passwords"
        ],
        correctAnswer: "List of usernames",
        hint: "cut extracts the first colon-delimited field (username)."
    },
    {
        id: "ch03_h15",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How would you count the number of unique users logged in?",
        options: [
            "who | cut -d' ' -f1 | sort -u | wc -l",
            "users | wc -w",
            "who | awk '{print $1}' | uniq | wc -l",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All are valid approaches."
    },


    // --- TRACK1-CH04: Mastering Vim ---
    // EASY
    {
        id: "ch04_e01",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which mode is Vim in when you first open it?",
        options: ["Insert mode", "Normal mode", "Visual mode", "Command mode"],
        correctAnswer: "Normal mode",
        hint: "Vim starts in Normal mode, where keys are commands."
    },
    {
        id: "ch04_e02",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you enter Insert mode?",
        options: ["Press i", "Press Esc", "Press :", "Press v"],
        correctAnswer: "Press i",
        hint: "i switches to Insert mode before the cursor."
    },
    {
        id: "ch04_e03",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you save a file and quit Vim?",
        options: [":q", ":w", ":wq", ":save"],
        correctAnswer: ":wq",
        hint: ":wq writes and quits. :x does the same."
    },
    {
        id: "ch04_e04",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you quit without saving?",
        options: [":q", ":q!", ":wq", ":x"],
        correctAnswer: ":q!",
        hint: ":q! forces quit, discarding changes."
    },
    {
        id: "ch04_e05",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key deletes a line in Normal mode?",
        options: ["x", "dd", "d", "dl"],
        correctAnswer: "dd",
        hint: "dd deletes the entire current line."
    },
    {
        id: "ch04_e06",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key copies (yanks) a line?",
        options: ["yy", "cc", "dd", "pp"],
        correctAnswer: "yy",
        hint: "yy yanks the current line into the buffer."
    },
    {
        id: "ch04_e07",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you paste yanked or deleted text?",
        options: ["Ctrl+v", "p", "y", "i"],
        correctAnswer: "p",
        hint: "p pastes after the cursor."
    },
    {
        id: "ch04_e08",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you undo in Vim?",
        options: ["Ctrl+z", "u", "Undo", ":undo"],
        correctAnswer: "u",
        hint: "u undoes the last change."
    },
    {
        id: "ch04_e09",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key moves the cursor up in Normal mode?",
        options: ["j", "k", "h", "l"],
        correctAnswer: "k",
        hint: "k moves up, j moves down."
    },
    {
        id: "ch04_e10",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you search for 'error' forward?",
        options: ["/error", "?error", "s/error", "f error"],
        correctAnswer: "/error",
        hint: "/ searches forward, ? searches backward."
    },
    {
        id: "ch04_e11",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you replace all occurrences of 'foo' with 'bar' in a file?",
        options: [":s/foo/bar/g", ":%s/foo/bar/g", ":replace foo bar", ":g/foo/bar"],
        correctAnswer: ":%s/foo/bar/g",
        hint: "% means whole file, s means substitute, g means global on each line."
    },
    {
        id: "ch04_e12",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key enters Visual mode for line selection?",
        options: ["v", "V", "Ctrl+v", "s"],
        correctAnswer: "V",
        hint: "V selects whole lines; v selects characters."
    },
    {
        id: "ch04_e13",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you go to the end of the file?",
        options: ["G", "gg", "$", "End"],
        correctAnswer: "G",
        hint: "G goes to the last line; gg goes to the first."
    },
    {
        id: "ch04_e14",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'dw' do in Normal mode?",
        options: ["Deletes the whole file", "Deletes a word", "Duplicates a word", "Draws a window"],
        correctAnswer: "Deletes a word",
        hint: "dw is the delete operator + word motion."
    },
    {
        id: "ch04_e15",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you append text at the end of the current line?",
        options: ["a", "A", "i", "o"],
        correctAnswer: "A",
        hint: "A jumps to end of line and enters Insert mode."
    },

    // MEDIUM
    {
        id: "ch04_m01",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is the difference between :wq and :x?",
        options: [
            "No difference — both save and quit",
            ":wq always writes, :x only writes if changed",
            ":x doesn't work on new files",
            ":wq quits without saving"
        ],
        correctAnswer: ":wq always writes, :x only writes if changed",
        hint: ":x saves only if the file was modified; :wq always writes."
    },
    {
        id: "ch04_m02",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you delete from the cursor to the end of the line?",
        options: ["d$", "dd", "dw", "d0"],
        correctAnswer: "d$",
        hint: "d$ uses the motion $ (end of line) with the delete operator."
    },
    {
        id: "ch04_m03",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'cw' do?",
        options: [
            "Copies a word",
            "Changes (deletes) a word and enters Insert mode",
            "Counts words",
            "Searches for a word"
        ],
        correctAnswer: "Changes (deletes) a word and enters Insert mode",
        hint: "cw is change word: deletes to end of word and enters Insert mode."
    },
    {
        id: "ch04_m04",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you redo after an undo?",
        options: ["Ctrl+r", "Ctrl+y", "u again", "R"],
        correctAnswer: "Ctrl+r",
        hint: "Ctrl+r redoes the last undone change."
    },
    {
        id: "ch04_m05",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which command deletes lines 5 through 10?",
        options: [":5,10d", ":d5-10", "5,10dd", ":delete 5 10"],
        correctAnswer: ":5,10d",
        hint: ":5,10d applies the delete command to that range."
    },
    {
        id: "ch04_m06",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you search for the word under the cursor?",
        options: ["*", "/word", "?word", "s/word"],
        correctAnswer: "*",
        hint: "Pressing * searches forward for the word under the cursor."
    },
    {
        id: "ch04_m07",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'yy' followed by '5p' do?",
        options: [
            "Pastes the yanked line 5 times",
            "Yanks 5 lines and pastes them",
            "Prints line 5",
            "Nothing"
        ],
        correctAnswer: "Pastes the yanked line 5 times",
        hint: "A number before p repeats the paste that many times."
    },
    {
        id: "ch04_m08",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you open a new line below the current one and enter Insert mode?",
        options: ["o", "O", "i", "Enter"],
        correctAnswer: "o",
        hint: "o opens a line below; O opens above."
    },
    {
        id: "ch04_m09",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':%s/old/new/gc' do?",
        options: [
            "Replace all 'old' with 'new', asking for confirmation each time",
            "Replace all without asking",
            "Only count matches",
            "Replace in current line only"
        ],
        correctAnswer: "Replace all 'old' with 'new', asking for confirmation each time",
        hint: "The c flag prompts for confirmation before each substitution."
    },
    {
        id: "ch04_m10",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you go to line 42?",
        options: [":42", "42G", "42gg", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: ":42 and 42G both jump to line 42."
    },
    {
        id: "ch04_m11",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'dG' do?",
        options: [
            "Deletes from cursor to end of file",
            "Deletes the whole file",
            "Deletes to beginning of file",
            "Duplicates the file"
        ],
        correctAnswer: "Deletes from cursor to end of file",
        hint: "dG deletes from current line to the end of the file."
    },
    {
        id: "ch04_m12",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you record a macro in Vim?",
        options: ["q followed by a register letter", "Ctrl+r", "m", ":macro"],
        correctAnswer: "q followed by a register letter",
        hint: "q<letter> starts recording; q again stops."
    },
    {
        id: "ch04_m13",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does Visual Block mode (Ctrl+v) allow you to do?",
        options: [
            "Select rectangular blocks of text",
            "Select whole lines only",
            "Draw ASCII art",
            "Select words"
        ],
        correctAnswer: "Select rectangular blocks of text",
        hint: "Ctrl+v enters Visual Block mode for column-wise selection."
    },
    {
        id: "ch04_m14",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you indent a block of selected lines?",
        options: [">", "<", "Tab", "i"],
        correctAnswer: ">",
        hint: "> indents; < unindents selected lines."
    },
    {
        id: "ch04_m15",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':%!sort' do?",
        options: [
            "Runs the external sort command on the file contents",
            "Sorts lines alphabetically inside Vim",
            "Opens the sort menu",
            "Nothing"
        ],
        correctAnswer: "Runs the external sort command on the file contents",
        hint: "%! pipes the entire buffer through an external command."
    },

    // HARD
    {
        id: "ch04_h01",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you open a file in read-only mode with Vim?",
        options: ["vim -R file", "vim -r file", "vim --readonly file", "view file"],
        correctAnswer: "view file",
        hint: "view opens Vim in read-only mode (equivalent to vim -R)."
    },
    {
        id: "ch04_h02",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is the difference between 'd' and 'x' in Normal mode?",
        options: [
            "d is an operator that takes a motion; x deletes a single character",
            "x is faster",
            "d works only on lines",
            "No difference"
        ],
        correctAnswer: "d is an operator that takes a motion; x deletes a single character",
        hint: "d combines with motions (dw, dd); x is a single character delete."
    },
    {
        id: "ch04_h03",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':set nu' do?",
        options: [
            "Enables line numbers",
            "Sets the number of lines",
            "Counts lines",
            "Clears the buffer"
        ],
        correctAnswer: "Enables line numbers",
        hint: ":set nu (or :set number) displays line numbers."
    },
    {
        id: "ch04_h04",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you split a window horizontally?",
        options: [":split", ":vsplit", ":sp", "Both A and C"],
        correctAnswer: "Both A and C",
        hint: ":split and :sp both open a horizontal split."
    },
    {
        id: "ch04_h05",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':e!' do?",
        options: [
            "Reloads the file from disk, discarding changes",
            "Opens a new file",
            "Exits Vim",
            "Executes a macro"
        ],
        correctAnswer: "Reloads the file from disk, discarding changes",
        hint: ":e! reloads the current file, losing unsaved changes."
    },
    {
        id: "ch04_h06",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is a Vim register?",
        options: [
            "A storage location for yanked or deleted text",
            "A window pane",
            "A file type",
            "A macro recording"
        ],
        correctAnswer: "A storage location for yanked or deleted text",
        hint: "Registers store text; \"ay yanks into register a, \"ap pastes from it."
    },
    {
        id: "ch04_h07",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you execute a macro recorded in register 'a' 10 times?",
        options: ["10@a", "@a10", "10a", "macro a 10"],
        correctAnswer: "10@a",
        hint: "A count before @ repeats the macro that many times."
    },
    {
        id: "ch04_h08",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':set paste' do?",
        options: [
            "Enables paste mode to avoid auto-indentation when pasting",
            "Pastes from clipboard",
            "Deletes all text",
            "Saves the file"
        ],
        correctAnswer: "Enables paste mode to avoid auto-indentation when pasting",
        hint: "paste mode disables auto-indent and other formatting for clean pasting."
    },
    {
        id: "ch04_h09",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you convert tabs to spaces in Vim?",
        options: [":set expandtab", ":retab", ":set noexpandtab", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: ":set expandtab tells Vim to use spaces; :retab converts existing tabs."
    },
    {
        id: "ch04_h10",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is the Vim leader key?",
        options: [
            "A customizable prefix for custom shortcuts",
            "The Esc key",
            "The colon key",
            "The same as Ctrl"
        ],
        correctAnswer: "A customizable prefix for custom shortcuts",
        hint: "The leader key (default \) allows custom key mappings."
    },
    {
        id: "ch04_h11",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':bufdo' do?",
        options: [
            "Executes a command on all open buffers",
            "Closes all buffers",
            "Lists buffers",
            "Saves all buffers"
        ],
        correctAnswer: "Executes a command on all open buffers",
        hint: ":bufdo applies a command to every buffer."
    },
    {
        id: "ch04_h12",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you diff two files in Vim?",
        options: ["vimdiff file1 file2", "vim -d file1 file2", ":diff file1 file2", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "vimdiff and vim -d both open a side-by-side diff."
    },
    {
        id: "ch04_h13",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'gg=G' do?",
        options: [
            "Re-indents the entire file",
            "Goes to top and bottom",
            "Deletes all lines",
            "Copies all lines"
        ],
        correctAnswer: "Re-indents the entire file",
        hint: "gg goes to top, = is the format operator, G is the motion to bottom."
    },
    {
        id: "ch04_h14",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you view open buffers and switch between them?",
        options: [":ls then :bN", ":buffers then :bN", ":files", "All of the above"],
        correctAnswer: "All of the above",
        hint: "All list buffers; :bN switches to buffer N."
    },
    {
        id: "ch04_h15",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'vip' do in Normal mode?",
        options: [
            "Selects the current paragraph visually",
            "Opens a VIP mode",
            "Deletes a paragraph",
            "Inserts at paragraph start"
        ],
        hint: "v enters visual mode, ip is the inner-paragraph text object."
    },
    // --- Chapter 5: Managing Local Users and Groups ---
    {
        id: "ch05-e01",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command creates a new user?",
        options: ["useradd", "adduser", "newuser", "createuser"],
        correctAnswer: "useradd",
        hint: "useradd is the standard command to create a user account."
    },
    {
        id: "ch05-e02",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which file stores user account information?",
        options: ["/etc/shadow", "/etc/passwd", "/etc/users", "/etc/accounts"],
        correctAnswer: "/etc/passwd",
        hint: "/etc/passwd holds user account definitions."
    },
    {
        id: "ch05-e03",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you set or change a user's password?",
        options: ["password user", "passwd user", "setpass user", "pwd user"],
        correctAnswer: "passwd user",
        hint: "passwd sets or updates a user's password."
    },
    {
        id: "ch05-e04",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command deletes a user?",
        options: ["deluser", "userdel", "rmuser", "deleteuser"],
        correctAnswer: "userdel",
        hint: "userdel removes a user account."
    },
    {
        id: "ch05-e05",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'su - bob' do?",
        options: [
          "Switches to user bob with full login environment",
          "Gives bob superuser privileges",
          "Starts a new shell as root",
          "Locks bob's account"
        ],
        correctAnswer: "Switches to user bob with full login environment",
        hint: "su - switches user and loads their login environment."
    },
    {
        id: "ch05-e06",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which file stores encrypted passwords?",
        options: ["/etc/passwd", "/etc/shadow", "/etc/secret", "/etc/encrypt"],
        correctAnswer: "/etc/shadow",
        hint: "/etc/shadow stores password hashes securely."
    },
    {
        id: "ch05-e07",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which group typically grants sudo access on RHEL?",
        options: ["sudo", "wheel", "admin", "root"],
        correctAnswer: "wheel",
        hint: "The wheel group grants sudo privileges on RHEL-based systems."
    },
    {
        id: "ch05-e08",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you modify a user's properties?",
        options: ["usermod", "useradd", "moduser", "chuser"],
        correctAnswer: "usermod",
        hint: "usermod modifies existing user accounts."
    },
    {
        id: "ch05-e09",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command creates a new group?",
        options: ["groupadd", "addgroup", "newgroup", "creategroup"],
        correctAnswer: "groupadd",
        hint: "groupadd creates a new group."
    },
    {
        id: "ch05-e10",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'userdel -r bob' do?",
        options: [
          "Removes bob and their home directory",
          "Renames bob",
          "Locks bob's account",
          "Removes only bob's home directory"
        ],
        correctAnswer: "Removes bob and their home directory",
        hint: "-r removes the user's home directory and mail spool."
    },
    {
        id: "ch05-e11",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command shows group memberships for a user?",
        options: ["groups user", "id user", "whoami", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "Both groups and id display group memberships."
    },
    {
        id: "ch05-e12",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the UID of the root user?",
        options: ["0", "1", "1000", "999"],
        correctAnswer: "0",
        hint: "Root always has UID 0."
    },
    {
        id: "ch05-e13",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you add a user to a supplementary group without removing existing ones?",
        options: ["usermod -G group user", "usermod -aG group user", "usermod -g group user", "groupmod -a user group"],
        correctAnswer: "usermod -aG group user",
        hint: "-aG appends the user to the group."
    },
    {
        id: "ch05-e14",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which file defines group memberships?",
        options: ["/etc/group", "/etc/passwd", "/etc/groups", "/etc/shadow"],
        correctAnswer: "/etc/group",
        hint: "/etc/group contains group definitions and members."
    },
    {
        id: "ch05-e15",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'sudo' stand for?",
        options: ["Super User Do", "System User Domain", "Switch User Domain", "Secure User Do"],
        correctAnswer: "Super User Do",
        hint: "sudo = superuser do."
    },
    {
        id: "ch05-m01",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the difference between 'su' and 'su -'?",
        options: [
          "su - loads the target user's full environment; su keeps the current one",
          "No difference",
          "su - is for root only",
          "su changes the shell"
        ],
        correctAnswer: "su - loads the target user's full environment; su keeps the current one",
        hint: "The dash gives you the user's login environment (PATH, home, etc.)."
    },
    {
        id: "ch05-m02",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'usermod -L bob' do?",
        options: [
          "Locks bob's account by prefixing password with !",
          "Deletes bob",
          "Logs bob out",
          "Lists bob's details"
        ],
        correctAnswer: "Locks bob's account by prefixing password with !",
        hint: "-L locks the account; -U unlocks."
    },
    {
        id: "ch05-m03",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command forces a password change on next login?",
        options: ["passwd -e user", "passwd -f user", "chage -d 0 user", "Both A and C"],
        correctAnswer: "Both A and C",
        hint: "Both expire the password immediately."
    },
    {
        id: "ch05-m04",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does the 'x' in the password field of /etc/passwd mean?",
        options: [
          "User has no password",
          "Password is stored in /etc/shadow",
          "Account is locked",
          "Password is expired"
        ],
        correctAnswer: "Password is stored in /etc/shadow",
        hint: "x indicates the encrypted password is in /etc/shadow."
    },
    {
        id: "ch05-m05",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you check which user you are currently logged in as?",
        options: ["whoami", "id", "who", "All of the above"],
        correctAnswer: "All of the above",
        hint: "All show the current user in different formats."
    },
    {
        id: "ch05-m06",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'gpasswd -a bob developers' do?",
        options: [
          "Adds bob to the developers group",
          "Changes bob's password",
          "Creates a group called developers",
          "Removes bob from developers"
        ],
        correctAnswer: "Adds bob to the developers group",
        hint: "gpasswd -a adds a user to a group."
    },
    {
        id: "ch05-m07",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the purpose of the /etc/skel directory?",
        options: [
          "Skeleton files copied to new users' home directories",
          "System kernel logs",
          "User skeleton processes",
          "Temporary files"
        ],
        correctAnswer: "Skeleton files copied to new users' home directories",
        hint: "/etc/skel contains default config files copied to ~ on creation."
    },
    {
        id: "ch05-m08",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you list all users currently logged in?",
        options: ["who", "w", "users", "All of the above"],
        correctAnswer: "All of the above",
        hint: "All three commands show logged-in users."
    },
    {
        id: "ch05-m09",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'useradd -s /sbin/nologin bob' do?",
        options: [
          "Creates bob without login shell access",
          "Creates bob with default shell",
          "Deletes bob's shell",
          "Changes bob's shell later"
        ],
        correctAnswer: "Creates bob without login shell access",
        hint: "Setting the shell to /sbin/nologin prevents interactive login."
    },
    {
        id: "ch05-m10",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which UID range do normal user accounts typically start from?",
        options: ["0", "500", "1000", "10000"],
        correctAnswer: "1000",
        hint: "Most distros assign UIDs starting at 1000; some (older RHEL) start at 500."
    },
    {
        id: "ch05-m11",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you remove a user from a group?",
        options: ["gpasswd -d user group", "usermod -r group user", "groupmod -r user group", "deluser group user"],
        correctAnswer: "gpasswd -d user group",
        hint: "gpasswd -d removes a user from a specific group."
    },
    {
        id: "ch05-m12",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What command edits the sudoers file safely?",
        options: ["visudo", "nano /etc/sudoers", "vim /etc/sudoers", "sudoedit"],
        correctAnswer: "visudo",
        hint: "visudo checks syntax before saving, preventing lockouts."
    },
    {
        id: "ch05-m13",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'chage -l bob' display?",
        options: [
          "Password aging information for bob",
          "Bob's login history",
          "Bob's group memberships",
          "Bob's file permissions"
        ],
        correctAnswer: "Password aging information for bob",
        hint: "chage -l lists password expiry and aging details."
    },
    {
        id: "ch05-m14",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the primary group vs supplementary groups?",
        options: [
          "Primary group is listed in /etc/passwd; supplementary in /etc/group",
          "They are the same",
          "Primary groups have more permissions",
          "Supplementary groups are for sudo only"
        ],
        correctAnswer: "Primary group is listed in /etc/passwd; supplementary in /etc/group",
        hint: "Each user has one primary GID and can belong to multiple supplementary groups."
    },
    {
        id: "ch05-m15",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you see all users in the system?",
        options: ["cat /etc/passwd", "getent passwd", "ls /home", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "Both cat and getent display user entries."
    },
    {
        id: "ch05-h01",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the correct way to give a user sudo access to only restart a specific service?",
        options: [
          "Add to wheel group",
          "Add a specific entry in /etc/sudoers via visudo",
          "Change the user's UID to 0",
          "Use 'sudo --limited' command"
        ],
        correctAnswer: "Add a specific entry in /etc/sudoers via visudo",
        hint: "sudoers can be configured to limit specific users to specific commands."
    },
    {
        id: "ch05-h02",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'useradd -u 1500 -g developers -G wheel,video -d /opt/bob -s /bin/zsh bob' do?",
        options: [
          "Creates bob with specific UID, primary group, supplementary groups, home, and shell",
          "Fails because too many options",
          "Creates a system user",
          "Modifies existing bob"
        ],
        correctAnswer: "Creates bob with specific UID, primary group, supplementary groups, home, and shell",
        hint: "All those options are valid and set the respective attributes."
    },
    {
        id: "ch05-h03",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the difference between locking an account with 'passwd -l' and 'usermod -L'?",
        options: [
          "No difference — both prefix password with !",
          "passwd -l also expires the account",
          "usermod -L deletes the password",
          "They use different lock files"
        ],
        correctAnswer: "No difference — both prefix password with !",
        hint: "Both do the same: add ! to the password hash in /etc/shadow."
    },
    {
        id: "ch05-h04",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How would you set a user's account to expire on a specific date?",
        options: ["chage -E YYYY-MM-DD user", "usermod -e YYYY-MM-DD user", "passwd -x user", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "Both chage -E and usermod -e set account expiration date."
    },
    {
        id: "ch05-h05",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the effect of setting a user's shell to /bin/false vs /sbin/nologin?",
        options: [
          "/bin/false exits immediately; /sbin/nologin prints a message and exits",
          "No difference",
          "/bin/false allows FTP access",
          "/sbin/nologin is only for system accounts"
        ],
        correctAnswer: "/bin/false exits immediately; /sbin/nologin prints a message and exits",
        hint: "nologin is friendlier, displaying a message; false just exits."
    },
    {
        id: "ch05-h06",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How does 'useradd -D' work?",
        options: [
          "Displays or changes default values for new users",
          "Deletes a user",
          "Disables a user",
          "Duplicates a user"
        ],
        correctAnswer: "Displays or changes default values for new users",
        hint: "useradd -D shows the default settings from /etc/default/useradd."
    },
    {
        id: "ch05-h07",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What happens if you delete a group that is a user's primary group?",
        options: [
          "The command fails because the user still references it",
          "The user is deleted too",
          "The group is deleted and the user gets UID as GID",
          "Nothing happens"
        ],
        correctAnswer: "The command fails because the user still references it",
        hint: "groupdel won't remove a group that is any user's primary group."
    },
    {
        id: "ch05-h08",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the purpose of the 'nobody' user?",
        options: [
          "An unprivileged account for running services with minimal rights",
          "A guest account",
          "The root backup account",
          "A debugging account"
        ],
        correctAnswer: "An unprivileged account for running services with minimal rights",
        hint: "nobody has very low privileges, used for unprivileged processes."
    },
    {
        id: "ch05-h09",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you list all members of a group, including primary group members?",
        options: [
          "grep group /etc/group",
          "getent group groupname",
          "lid -g groupname",
          "All require combining primary and supplementary lookups"
        ],
        correctAnswer: "All require combining primary and supplementary lookups",
        hint: "No single command shows both primary and supplementary members easily."
    },
    {
        id: "ch05-h10",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the 'sticky bit' on /tmp related to?",
        options: [
          "Prevents users from deleting files owned by others",
          "Makes files executable",
          "Anonymous access",
          "Memory management"
        ],
        correctAnswer: "Prevents users from deleting files owned by others",
        hint: "Sticky bit on /tmp only lets file owners delete their own files."
    },
    {
        id: "ch05-h11",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'pwconv' do?",
        options: [
          "Converts passwords from /etc/passwd to /etc/shadow",
          "Converts user accounts to groups",
          "Synchronizes password files",
          "Creates password hashes"
        ],
        correctAnswer: "Converts passwords from /etc/passwd to /etc/shadow",
        hint: "pwconv moves passwords to shadow and updates passwd with x."
    },
    {
        id: "ch05-h12",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How would you temporarily disable a user account for 30 days?",
        options: [
          "chage -E $(date -d '+30 days' +%F) user",
          "passwd -l user; sleep 30d; passwd -u user",
          "usermod -e +30 user",
          "You cannot set temporary expirations"
        ],
        correctAnswer: "chage -E $(date -d '+30 days' +%F) user",
        hint: "Setting an expiry date effectively disables the account after that date."
    },
    {
        id: "ch05-h13",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the difference between a system user and a regular user?",
        options: [
          "System users typically have UID < 1000 and no login shell",
          "System users have more permissions",
          "Regular users can't run services",
          "No difference"
        ],
        correctAnswer: "System users typically have UID < 1000 and no login shell",
        hint: "System users run services and typically have restricted shells."
    },
    {
        id: "ch05-h14",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you find which users have no password set?",
        options: [
          "awk -F: '($2 == \"\") {print $1}' /etc/shadow",
          "passwd -S -a | grep NP",
          "cat /etc/passwd | grep '::'",
          "Both A and B"
        ],
        correctAnswer: "awk -F: '($2 == \"\") {print $1}' /etc/shadow",
        hint: "Checking /etc/shadow for empty password fields reveals passwordless accounts."
    },
    {
        id: "ch05-h15",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the 'vipw' command used for?",
        options: [
          "Safely editing /etc/passwd or /etc/shadow with locking",
          "Viewing password files",
          "Validating user input",
          "Very important password warning"
        ],
        correctAnswer: "Safely editing /etc/passwd or /etc/shadow with locking",
        hint: "vipw locks the password files while editing, preventing corruption."
    },
    // --- Chapter 6: Controlling Access to Files ---
    {
        id: "ch06-e01",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'ls -l' display in its first column?",
        options: ["File size", "File permissions and type", "Owner name", "Modification date"],
        correctAnswer: "File permissions and type",
        hint: "The first column shows permissions like -rw-r--r--."
    },
    {
        id: "ch06-e02",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "In 'rw-r--r--', what can the owner do?",
        options: ["Read and write", "Only read", "Read, write, and execute", "Nothing"],
        correctAnswer: "Read and write",
        hint: "rw- means read and write, but not execute."
    },
    {
        id: "ch06-e03",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Which command changes file permissions?",
        options: ["chown", "chmod", "chgrp", "ls"],
        correctAnswer: "chmod",
        hint: "chmod modifies file permissions."
    },
    {
        id: "ch06-e04",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod 755 file' do?",
        options: [
          "rwxr-xr-x",
          "rw-r--r--",
          "rwxrwxrwx",
          "r--r--r--"
        ],
        correctAnswer: "rwxr-xr-x",
        hint: "7=rwx for owner, 5=r-x for group and others."
    },
    {
        id: "ch06-e05",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Which command changes file ownership?",
        options: ["chmod", "chown", "chgrp", "own"],
        correctAnswer: "chown",
        hint: "chown changes the user and/or group owner."
    },
    {
        id: "ch06-e06",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'r' mean on a file?",
        options: ["Remove", "Read", "Run", "Root"],
        correctAnswer: "Read",
        hint: "r grants read access."
    },
    {
        id: "ch06-e07",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'x' mean on a directory?",
        options: [
          "Delete the directory",
          "Enter the directory (cd)",
          "List files in the directory",
          "Nothing"
        ],
        correctAnswer: "Enter the directory (cd)",
        hint: "Execute on a directory allows you to cd into it."
    },
    {
        id: "ch06-e08",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the numeric value for rwx?",
        options: ["6", "7", "5", "4"],
        correctAnswer: "7",
        hint: "4(r)+2(w)+1(x) = 7."
    },
    {
        id: "ch06-e09",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod g-w file' do?",
        options: [
          "Removes write permission for group",
          "Adds write for group",
          "Removes group ownership",
          "Writes to the file"
        ],
        correctAnswer: "Removes write permission for group",
        hint: "g-w removes write permission from the group."
    },
    {
        id: "ch06-e10",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is umask?",
        options: [
          "Default permission mask for new files",
          "Maximum permissions",
          "A user mask",
          "A file type"
        ],
        correctAnswer: "Default permission mask for new files",
        hint: "umask subtracts from default maximum permissions."
    },
    {
        id: "ch06-e11",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chown alice file' do?",
        options: [
          "Changes file owner to alice",
          "Changes file group to alice",
          "Creates user alice",
          "Deletes user alice"
        ],
        correctAnswer: "Changes file owner to alice",
        hint: "chown sets the owner of the file."
    },
    {
        id: "ch06-e12",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Which command changes group ownership?",
        options: ["chown", "chmod", "chgrp", "groupmod"],
        correctAnswer: "chgrp",
        hint: "chgrp changes group ownership; chown can also do it with :group."
    },
    {
        id: "ch06-e13",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What permission does '6' in octal represent?",
        options: ["rwx", "rw-", "r-x", "r--"],
        correctAnswer: "rw-",
        hint: "6 = 4(r) + 2(w) = rw-."
    },
    {
        id: "ch06-e14",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does the first character 'd' mean in 'drwxr-xr-x'?",
        options: ["Device", "Directory", "Deleted", "Data"],
        correctAnswer: "Directory",
        hint: "d indicates a directory."
    },
    {
        id: "ch06-e15",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod a+x script' do?",
        options: [
          "Makes script executable for everyone",
          "Archives the script",
          "Removes execute permissions",
          "Appends to the script"
        ],
        correctAnswer: "Makes script executable for everyone",
        hint: "a+x adds execute permission for all (user, group, others)."
    },
    {
        id: "ch06-m01",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the result of 'chmod 640 file'?",
        options: ["rw-r-----", "rw-r--r--", "rwxr-----", "r--------"],
        correctAnswer: "rw-r-----",
        hint: "Owner rw- (6), group r-- (4), others --- (0)."
    },
    {
        id: "ch06-m02",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How do you add execute for the owner using symbolic notation?",
        options: ["chmod u+x file", "chmod o+x file", "chmod g+x file", "chmod +x file"],
        correctAnswer: "chmod u+x file",
        hint: "u+x targets the user (owner) specifically."
    },
    {
        id: "ch06-m03",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chown :developers file' do?",
        options: [
          "Changes group to developers, leaves owner unchanged",
          "Changes owner to developers",
          "Creates group developers",
          "Deletes group developers"
        ],
        correctAnswer: "Changes group to developers, leaves owner unchanged",
        hint: "The colon-prefix syntax changes only the group."
    },
    {
        id: "ch06-m04",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "With umask 022, what permissions do new files get?",
        options: ["644", "755", "600", "777"],
        correctAnswer: "644",
        hint: "666 - 022 = 644 (rw-r--r--)."
    },
    {
        id: "ch06-m05",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the sticky bit used for?",
        options: [
          "Prevents users from deleting files they don't own in shared directories",
          "Makes files sticky",
          "Locks files",
          "Encrypts files"
        ],
        correctAnswer: "Prevents users from deleting files they don't own in shared directories",
        hint: "Sticky bit on /tmp prevents deletion of others' files."
    },
    {
        id: "ch06-m06",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does SUID on an executable do?",
        options: [
          "Runs the program with the owner's effective UID",
          "Locks the program",
          "Deletes the program after execution",
          "Makes it setuid root only"
        ],
        correctAnswer: "Runs the program with the owner's effective UID",
        hint: "SUID makes the program run as the file owner, not the caller."
    },
    {
        id: "ch06-m07",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How is SGID represented in octal with the extra leading digit?",
        options: ["4", "2", "1", "0"],
        correctAnswer: "2",
        hint: "4=SUID, 2=SGID, 1=Sticky."
    },
    {
        id: "ch06-m08",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod u=rwx,go=r file' set?",
        options: ["rwxr--r--", "rwxr-xr-x", "rwxrwxrwx", "r--------"],
        correctAnswer: "rwxr--r--",
        hint: "Owner gets rwx, group and others get only r."
    },
    {
        id: "ch06-m09",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Why does 'chmod -R 777 /' destroy a system?",
        options: [
          "It makes everything world-writable and removes security restrictions",
          "It deletes all files",
          "It only changes directory permissions",
          "It's a harmless command"
        ],
        correctAnswer: "It makes everything world-writable and removes security restrictions",
        hint: "Recursive 777 opens all files to everyone, breaking security everywhere."
    },
    {
        id: "ch06-m10",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Who can change file ownership?",
        options: ["Only root", "The file owner", "Any user", "Anyone in the same group"],
        correctAnswer: "Only root",
        hint: "Only root can use chown. This prevents users from hiding files by giving them away."
    },
    {
        id: "ch06-m11",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the numeric value for permissions 'r-x'?",
        options: ["5", "6", "4", "7"],
        correctAnswer: "5",
        hint: "4(r)+1(x) = 5."
    },
    {
        id: "ch06-m12",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod -R g+w dir/' do?",
        options: [
          "Adds group write recursively to all files and subdirectories",
          "Removes group write",
          "Changes group ownership",
          "Deletes the directory"
        ],
        correctAnswer: "Adds group write recursively to all files and subdirectories",
        hint: "-R makes the change recursive."
    },
    {
        id: "ch06-m13",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "If a directory has permissions 'drwx------', what can others do?",
        options: ["Nothing", "List files", "Enter it", "Delete it"],
        correctAnswer: "Nothing",
        hint: "Others have no permissions at all."
    },
    {
        id: "ch06-m14",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the difference between 'chmod 755' and 'chmod 0755'?",
        options: [
          "Identical — leading zero is optional",
          "0755 is sticky",
          "755 is invalid",
          "0755 clears special bits"
        ],
        correctAnswer: "0755 clears special bits",
        hint: "Leading 0 explicitly clears SUID/SGID/Sticky bits."
    },
    {
        id: "ch06-m15",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How do you copy permissions from one file to another?",
        options: [
          "chmod --reference=source target",
          "cp --permissions",
          "chmod --copy",
          "getfacl source | setfacl --restore"
        ],
        correctAnswer: "chmod --reference=source target",
        hint: "--reference copies the permission bits."
    },
    {
        id: "ch06-h01",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'find / -perm -4000' do?",
        options: [
          "Finds all SUID files",
          "Finds files with 4000 permissions",
          "Finds directories",
          "Finds files larger than 4000 bytes"
        ],
        correctAnswer: "Finds all SUID files",
        hint: "-perm -4000 matches files with SUID bit set."
    },
    {
        id: "ch06-h02",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the security risk of a SUID shell script?",
        options: [
          "Race conditions and environment manipulation can escalate privileges",
          "No risk",
          "Shell scripts can't be SUID",
          "It can only be run by root"
        ],
        correctAnswer: "Race conditions and environment manipulation can escalate privileges",
        hint: "SUID scripts are dangerous due to TOCTOU and environment attacks."
    },
    {
        id: "ch06-h03",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod 4755 program' do?",
        options: [
          "Sets SUID + rwxr-xr-x",
          "Makes it world-readable",
          "Deletes the program",
          "Locks the program"
        ],
        correctAnswer: "Sets SUID + rwxr-xr-x",
        hint: "The leading 4 sets SUID; 755 is rwxr-xr-x."
    },
    {
        id: "ch06-h04",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How would you make a directory where only the file owner can delete their own files?",
        options: ["chmod +t dir", "chmod 777 dir", "chown root dir", "chmod 755 dir"],
        correctAnswer: "chmod +t dir",
        hint: "The sticky bit (+t or 1 in leading octal) enables this."
    },
    {
        id: "ch06-h05",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does the 't' at the end of permissions like 'rwxrwxrwt' mean?",
        options: [
          "Sticky bit is set and others have execute",
          "The file is temporary",
          "The file is truncated",
          "Text file"
        ],
        correctAnswer: "Sticky bit is set and others have execute",
        hint: "Lowercase t means sticky bit + execute; capital T means sticky without execute."
    },
    {
        id: "ch06-h06",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the effect of setting the SGID bit on a directory?",
        options: [
          "New files inside inherit the directory's group",
          "New files are executable",
          "The directory is deleted after use",
          "Nothing"
        ],
        correctAnswer: "New files inside inherit the directory's group",
        hint: "SGID on a directory forces group inheritance."
    },
    {
        id: "ch06-h07",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How do you find world-writable files?",
        options: [
          "find / -perm -2 -type f",
          "find / -perm 777",
          "find / -writable",
          "ls -lR | grep 'w'"
        ],
        correctAnswer: "find / -perm -2 -type f",
        hint: "-perm -2 matches the 'write for others' bit."
    },
    {
        id: "ch06-h08",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod u+s,g+s,o+t dir' do?",
        options: [
          "Sets SUID, SGID, and sticky on dir",
          "Makes dir world-writable",
          "Deletes dir",
          "Changes owner"
        ],
        correctAnswer: "Sets SUID, SGID, and sticky on dir",
        hint: "All three special bits are set."
    },
    {
        id: "ch06-h09",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Why might 'chmod 600 ~/.ssh/id_rsa' be necessary?",
        options: [
          "SSH refuses to use private keys with group/other permissions",
          "It makes the key faster",
          "It encrypts the key",
          "It's just a convention"
        ],
        correctAnswer: "SSH refuses to use private keys with group/other permissions",
        hint: "SSH requires private keys to be readable only by the owner."
    },
    {
        id: "ch06-h10",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What happens if you remove execute permission from /bin/ls?",
        options: [
          "Normal users can't run ls anymore",
          "Only root can run ls",
          "Nothing",
          "ls becomes a text file"
        ],
        correctAnswer: "Normal users can't run ls anymore",
        hint: "Without execute, the file can't be run as a program."
    },
    {
        id: "ch06-h11",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the purpose of the 'setfacl' command?",
        options: [
          "Sets Access Control Lists for finer-grained permissions",
          "Sets file attributes",
          "Changes file ownership",
          "Formats disks"
        ],
        correctAnswer: "Sets Access Control Lists for finer-grained permissions",
        hint: "ACLs allow more than just owner/group/others permissions."
    },
    {
        id: "ch06-h12",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How would you prevent users from listing each other's home directories while still allowing access?",
        options: [
          "chmod 711 /home/*",
          "chmod 700 /home/*",
          "chmod 755 /home/*",
          "chmod 777 /home/*"
        ],
        correctAnswer: "chmod 711 /home/*",
        hint: "711 gives rwx--x--x: you can enter and access files if you know the name, but can't list."
    },
    {
        id: "ch06-h13",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does the 'S' (capital S) in SUID position mean?",
        options: [
          "SUID is set but execute is not set for the owner",
          "SUID is disabled",
          "The file is special",
          "Sticky bit"
        ],
        correctAnswer: "SUID is set but execute is not set for the owner",
        hint: "Capital S means SUID without execute — unusual and usually a mistake."
    },
    {
        id: "ch06-h14",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How does umask 007 differ from umask 077?",
        options: [
          "077 blocks all group/other access; 007 blocks only other access",
          "No difference",
          "007 is more restrictive",
          "077 blocks only group"
        ],
        correctAnswer: "077 blocks all group/other access; 007 blocks only other access",
        hint: "The digits are owner/group/others; 007 removes nothing from owner, nothing from group, everything from others."
    },
    {
        id: "ch06-h15",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the purpose of 'chattr +i file'?",
        options: [
          "Makes the file immutable — cannot be modified, deleted, or renamed",
          "Inherits permissions",
          "Interactively edits",
          "Increases inode count"
        ],
        correctAnswer: "Makes the file immutable — cannot be modified, deleted, or renamed",
        hint: "The immutable attribute protects critical files from accidental modification."
    },
];
