import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch02Assessment: ChapterAssessment[] = [
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
            "-k is better for searching",
            "-k searches short descriptions, -K searches full text"
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
        question: "Which command shows you which 'man' page is being displayed (file path)?",
        options: ["man -w ls", "which man", "man -f ls", "whereis ls"],
        correctAnswer: "man -w ls",
        hint: "-w (or --path) shows the location of the manual page file."
    },
    {
        id: "ch02_h13",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "How do you update the 'whatis' database manually?",
        options: ["mandb", "update-man", "whatis -u", "man --update"],
        correctAnswer: "mandb",
        hint: "mandb (or makewhatis on some systems) rebuilds the index databases."
    },
    {
        id: "ch02_h14",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "What does the 'apropos' command search?",
        options: [
            "The full text of manual pages",
            "Manual page names and one-line descriptions",
            "The entire filesystem",
            "The package database"
        ],
        correctAnswer: "Manual page names and one-line descriptions",
        hint: "apropos searches the short index descriptions."
    },
    {
        id: "ch02_h15",
        chapterId: "track1-ch02",
        type: "mcq",
        question: "Which environment variable defines the list of directories to search for manual pages?",
        options: ["PATH", "MANPATH", "DOCPATH", "LD_LIBRARY_PATH"],
        correctAnswer: "MANPATH",
        hint: "MANPATH defines where the 'man' command looks for files."
    }
];
