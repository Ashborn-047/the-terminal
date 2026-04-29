export type SectionType = 'text' | 'hands_on_examples' | 'common_mistakes' | 'pro_corner' | 'looking_ahead' | 'summary';

export interface Callout {
    type: 'pro_tip' | 'caution' | 'info';
    text: string;
}

export interface Subsection {
    heading: string;
    content: string;
    callouts?: Callout[];
    diagram?: {
        type: string;
        tree?: string[];
        caption?: string;
    };
}

export interface Exercise {
    title: string;
    command?: string;
    commands?: string[];
    expected_output?: string;
    explanation?: string;
    try_it_yourself: string;
    callouts?: Callout[];
    caution?: string;
}

export interface ChapterSection {
    type: SectionType;
    id: string;
    heading: string;
    content?: string;
    list?: string[];
    subsections?: Subsection[];
    intro?: string;
    exercises?: Exercise[];
    items?: string[];
    tips?: string[];
    bullets?: string[];
    // Legacy compatibility fields
    title?: string;
}

export interface ChapterContent {
    chapterId: string;
    title: string;
    description: string;
    sections: ChapterSection[];
}

export const chapterContents: Record<string, ChapterContent> = {
    'track1-ch01': {
        chapterId: 'track1-ch01',
        title: 'Your First Steps on the Linux Command Line',
        description: 'Merges terminal access, basic navigation, file operations, and FHS into a single beginner journey.',
        sections: [
            {
                type: 'text',
                id: 'why_matters',
                heading: '1. Why This Matters',
                content: "You've probably heard that Linux runs the world. Most servers, cloud platforms, Android phones, and even smart fridges run on it. But for a long time, the terminal — that black screen with a blinking cursor — can feel like a locked door. You might have opened it once, typed a few things, and quickly closed it. That changes today.\n\nThink of the command line as a direct conversation with your computer. Not through menus and icons, but through words. When you learn to speak this language, you stop being a passenger and start being the driver. Want to know exactly what your system is doing? Ask it. Want to automate boring tasks? Teach it. Curious why something broke? The terminal will tell you.\n\nIn this chapter, you'll take your first real steps. You'll learn to move around the filesystem like you're exploring a new city. By the end, that blinking cursor won't be intimidating — it'll feel like a trusted companion on your Linux journey. No imaginary bosses, no fake office crises. Just you, your machine, and the joy of figuring things out."
            },
            {
                type: 'text',
                id: 'what_learn',
                heading: "2. What You'll Learn",
                list: [
                    "What the terminal, shell, and kernel really are — and how they talk to each other.",
                    "How to see where you are (`pwd`) and what’s around you (`ls` with options).",
                    "How to move anywhere in the filesystem (`cd`) and create your own directories (`mkdir`).",
                    "How to create, copy, move, and remove files (`touch`, `cp`, `mv`, `rm`).",
                    "How to read the Linux Filesystem Hierarchy Standard (FHS) like a map.",
                    "The difference between absolute and relative paths — and when to use each."
                ]
            },
            {
                type: 'text',
                id: 'core_concepts',
                heading: '3. Core Concepts',
                subsections: [
                    {
                        heading: "3.1 The Terminal, the Shell, and Bash",
                        content: "When you open a terminal window (or connect via SSH from another computer), a special program starts running: a shell. The shell is your interpreter — it takes your typed commands and tells the Linux kernel what to do. The most common shell, and the one you'll use everywhere, is Bash (Bourne Again SHell).\n\nYou know the shell is ready when you see a prompt: something like [user@hostname ~]$. It’s the shell’s way of saying “I’m listening.” You type, press Enter, and Bash executes your command. If the command runs successfully, Bash quietly returns a new prompt. If something goes wrong, it shows an error message.",
                        callouts: [
                            {
                                type: 'pro_tip',
                                text: "Throughout these chapters, we’ll use Bash. The commands we teach work on practically every Linux distribution, on macOS in Terminal, and on Windows through WSL (Windows Subsystem for Linux). So wherever you are, you can follow along."
                            }
                        ]
                    },
                    {
                        heading: "3.2 The Filesystem: An Upside-Down Tree",
                        content: "Everything in Linux is a file or a directory, and they all live under a single root: /. No separate drive letters like C: or D:. Even external drives and network shares get mounted somewhere under /. This unified tree is defined by the Filesystem Hierarchy Standard (FHS).",
                        diagram: {
                            type: 'ascii_tree',
                            tree: [
                                "/",
                                "├── bin             (essential programs)",
                                "├── boot            (bootloader files)",
                                "├── dev             (device files)",
                                "├── etc             (configuration)",
                                "├── home            (user directories)",
                                "├── root            (superuser home)",
                                "├── run             (runtime data)",
                                "├── tmp             (temporary files)",
                                "├── usr             (user programs)",
                                "└── var             (variable data/logs)"
                            ],
                            caption: "Simplified FHS tree"
                        }
                    },
                    {
                        heading: "3.3 Absolute vs. Relative Paths",
                        content: "Absolute path: Starts with / and spells out the entire route from the root. Example: /home/alice/Music/song.mp3.\nRelative path: Describes where something is in relation to where you are right now. If you’re already in /home/alice, then Music/song.mp3 points to the same file.\n\nIt’s the difference between giving a full postal address and saying “two blocks north.” You’ll mix both depending on the situation."
                    }
                ]
            },
            {
                type: 'hands_on_examples',
                id: 'examples',
                heading: '4. Hands-On Examples',
                intro: "Before you begin: Open your separate terminal window. You should see a prompt ending with $. All the commands below are safe and won’t break your system. Type them exactly as shown.",
                exercises: [
                    {
                        title: "4.1 Where Am I? — pwd",
                        command: "pwd",
                        expected_output: "/home/student",
                        explanation: "pwd stands for print working directory. It shows your current location in the tree.",
                        try_it_yourself: "After you use cd to go somewhere else, run pwd again. Did it change?"
                    },
                    {
                        title: "4.2 What’s Here? — ls",
                        command: "ls -la",
                        explanation: "List all files including hidden ones, in long format.",
                        try_it_yourself: "Run ls, ls -l, ls -a, and ls -la. Observe the differences.",
                        callouts: [
                            {
                                type: 'pro_tip',
                                text: "Most commands follow this pattern: command -options arguments."
                            }
                        ]
                    },
                    {
                        title: "4.3 Moving Around — cd",
                        commands: ["cd /usr/share", "cd ..", "cd ~", "cd -"],
                        try_it_yourself: "Navigate from home to /etc, list its contents, then return home using the shortest sequence."
                    },
                    {
                        title: "4.4 Creating Directories and Files",
                        commands: ["mkdir my_experiments", "mkdir -p projects/linux_learning/day1", "touch notes.txt"],
                        try_it_yourself: "Create a directory called practice and inside it, a file called hello."
                    },
                    {
                        title: "4.5 Copy, Move, and Remove",
                        commands: ["cp notes.txt my_experiments/", "mv my_experiments/notes.txt my_experiments/old_notes.txt", "rm -r my_experiments"],
                        caution: "rm is permanent; no trash. Double-check before running.",
                        try_it_yourself: "In your practice directory, copy hello to hello.bak, rename hello.bak to greetings, then remove greetings."
                    }
                ]
            },
            {
                type: 'common_mistakes',
                id: 'mistakes',
                heading: '5. Common Mistakes (and How to Fix Them)',
                items: [
                    "Typing a command wrong → press Up to edit",
                    "No such file or directory → use pwd and ls to verify location",
                    "Permission Denied → normal user protection; sudo comes later",
                    "Directories vs. files → ls -l shows 'd' for directories"
                ]
            },
            {
                type: 'pro_corner',
                id: 'extra',
                heading: '6. Extra Info / Pro Corner',
                tips: [
                    "Hidden files start with a dot (use ls -a to see them)",
                    "Tab completion saves time and prevents typos",
                    "Command history: Up/Down arrows, Ctrl+R search",
                    "Clear screen: Ctrl+L or clear command"
                ]
            },
            {
                type: 'looking_ahead',
                id: 'look_ahead',
                heading: '7. Looking Ahead',
                content: "You just learned the basic verbs of the command line. Everything else builds on these: navigating, listing, creating, and deleting. In the next chapter, you’ll learn how to get help from the system itself (man, --help) so you never feel lost."
            },
            {
                type: 'summary',
                id: 'summary',
                heading: '8. Chapter Summary',
                bullets: [
                    "The terminal runs a shell (usually Bash) that interprets your commands.",
                    "The Linux filesystem is a single tree starting at /.",
                    "pwd prints your current location; ls lists directory contents.",
                    "cd changes directory; use .. for parent, ~ for home, - for previous.",
                    "mkdir creates directories; touch creates empty files.",
                    "cp copies, mv moves/renames, rm deletes.",
                    "Always verify with pwd and ls before destructive actions like rm."
                ]
            }
        ]
    },
    'track1-ch02': {
        chapterId: 'track1-ch02',
        title: 'Unlocking the Manual: How to Get Help in Linux',
        description: 'Master the built-in help systems: man, info, --help, and /usr/share/doc.',
        sections: [
            {
                type: 'text',
                id: 'why_matters',
                heading: '1. Why This Matters',
                content: "You're sitting in front of your terminal. You've just learned to move around, but now you're staring at a mysterious command like `tar -czf` and wondering what all those letters do. You could search the web, but the real answer is closer — it's already on your machine. Linux has one of the most thorough built‑in documentation systems in the computing world. Learning to use it is like being given a personal instruction manual for every tool you'll ever encounter.\n\nIn this chapter, you'll discover that the terminal itself can teach you. You'll learn to ask the system for help, read manuals, and find quick examples without ever leaving your keyboard. This transforms the command line from a scary void into a library full of friendly guides."
            },
            {
                type: 'text',
                id: 'what_learn',
                heading: "2. What You'll Learn",
                list: [
                    "How to bring up the complete manual for any command with `man`.",
                    "How to search manuals by keyword when you don't know the exact command name.",
                    "How to get short usage summaries with `--help` and `help`.",
                    "How to navigate the `info` system for more detailed documentation.",
                    "Where to find extra examples and configuration guidance in `/usr/share/doc`.",
                    "The different sections of the manual (user commands, system calls, config files) and why they matter."
                ]
            },
            {
                type: 'text',
                id: 'core_concepts',
                heading: '3. Core Concepts',
                subsections: [
                    {
                        heading: "3.1 The man Command: Your Personal Manual",
                        content: "`man` (short for “manual”) opens a formatted page about nearly every command, configuration file, and system function on your system. It's the first thing to try when you wonder what a command does or what options it accepts. \n\nSyntax: `man command_name` \n\nFor example: `man ls` opens the manual page inside a pager (usually `less`). You'll see a description, a list of options, and often examples. Press `q` to quit.",
                        diagram: {
                            type: 'ascii_table',
                            caption: "Common Manual Sections",
                            tree: [
                                "+---------+----------------------------------+--------------------+",
                                "| Section | Content                          | Example            |",
                                "+---------+----------------------------------+--------------------+",
                                "| 1       | User commands (executables)      | man 1 ls           |",
                                "| 5       | File formats and config files    | man 5 crontab      |",
                                "| 8       | System administration commands   | man 8 fdisk        |",
                                "+---------+----------------------------------+--------------------+"
                            ]
                        },
                        callouts: [
                            {
                                type: 'pro_tip',
                                text: "You can search the brief descriptions of all manual pages using `man -k keyword` or the `apropos` command. This is lifesaving when you can't remember the exact command name."
                            }
                        ]
                    },
                    {
                        heading: "3.2 Quick Answers with --help and help",
                        content: "Many commands support a `--help` flag that shows a short usage summary. It's less detailed than the man page but perfect for a quick option refresh: \n\n```bash\nls --help\n```\n\nFor shell built‑ins (like `cd`, `echo`, `pwd`), the man page may not exist as a separate entry because those are part of the shell itself. For those, use `help`: \n\n```bash\nhelp cd\n```"
                    },
                    {
                        heading: "3.3 The info System (and pinfo)",
                        content: "The `info` system provides hyperlinked, node‑based documentation, mostly for GNU utilities. It resembles a mini‑website you browse inside the terminal. To read about `coreutils` (the collection that includes `ls`, `cp`, etc.): \n\n```bash\ninfo coreutils\n```\n\nNavigation uses arrow keys, `Tab`, and `Enter`. Press `q` to quit. Some people find `info` cumbersome; `pinfo` is a more user‑friendly alternative on many systems."
                    },
                    {
                        heading: "3.4 Extra Documentation: /usr/share/doc",
                        content: "The directory `/usr/share/doc` contains subdirectories for many installed packages. Inside you'll often find README files, sample configurations, and even tutorials. It's a great place to look when the manual page feels too concise. For example: \n\n```bash\nls /usr/share/doc\n```"
                    }
                ]
            },
            {
                type: 'hands_on_examples',
                id: 'hands_on',
                heading: '4. Hands-On Examples',
                intro: "Open your separate terminal window. All commands are safe and read‑only except where noted (creating a directory is harmless). Follow along.",
                exercises: [
                    {
                        title: "4.1 Reading a Manual Page",
                        command: "man man",
                        explanation: "This is the manual for man itself. Use the up/down arrows to scroll, / to search, and q to quit.",
                        try_it_yourself: "Open the man page for ls. Find the option that sorts files by modification time. What is it? (Answer: -t)"
                    },
                    {
                        title: "4.2 Searching Without Knowing the Name",
                        commands: ["man -k calendar", "apropos calendar"],
                        explanation: "Find commands related to a keyword. Both commands are equivalent.",
                        try_it_yourself: "Try finding a command that lists processes — hint: the keyword is “process”."
                    },
                    {
                        title: "4.3 Navigating Different Sections",
                        commands: ["man 1 crontab", "man 5 crontab"],
                        explanation: "Notice the difference. Section 1 is the command, Section 5 is the file format.",
                        try_it_yourself: "Look up man 5 passwd and compare it with man 1 passwd."
                    },
                    {
                        title: "4.4 Using --help for a Quick Reference",
                        command: "grep --help | less",
                        explanation: "The output scrolls fast. Pipe it through less to read page by page.",
                        try_it_yourself: "Try it with other commands like df or du."
                    }
                ]
            },
            {
                type: 'common_mistakes',
                id: 'mistakes',
                heading: '5. Common Mistakes (and How to Fix Them)',
                items: [
                    "**Typing `man cd` and getting “No manual entry for cd”**: `cd` is a shell built‑in, not an external command. Use `help cd` instead.",
                    "**Not knowing which manual section you need**: If `man keyword` doesn't show what you expected, try `man -k keyword` or `man -a keyword` (which shows all sections).",
                    "**Scrolling past important info in `man`**: Use `/searchterm` inside `man` to jump straight to what you need.",
                    "**Confusing `info` with `pinfo`**: If `info` feels clunky, check if `pinfo` is installed. If not, just use `man` — it's perfectly fine."
                ]
            },
            {
                type: 'pro_corner',
                id: 'pro_corner',
                heading: '6. Extra Info / Pro Corner',
                tips: [
                    "**What Is `tldr`?**: A community‑driven tool that gives simplified, example‑focused pages.",
                    "**The `whatis` Command**: Prints the one‑line description from the manual. Quick and handy: `whatis ls`.",
                    "**Manual Pages on the Web**: Sites like `man7.org` provide online access, but local `man` is always more accurate for your specific version."
                ]
            },
            {
                type: 'looking_ahead',
                id: 'look_ahead',
                heading: '7. Looking Ahead',
                content: "Now you know how to find answers inside the system. This changes everything. When we later introduce new commands, you'll have the reflex to `man` them, understand their options, and even read the related config file manual pages. The command line is no longer a mystery — it's a conversation you can look up at any time.\n\nNext, you'll put your new navigation and help skills to use as we dive into creating, viewing, and editing text files. You'll meet vim, pipes, and redirection, turning the terminal into your primary workspace."
            },
            {
                type: 'summary',
                id: 'summary',
                heading: '8. Chapter Summary',
                bullets: [
                    "`man command` opens the full manual; press `q` to exit.",
                    "Use `man -k keyword` or `apropos` to search all manual pages.",
                    "Manual sections (1, 5, 8, etc.) separate different types of documentation.",
                    "`command --help` gives a short usage summary for most commands.",
                    "For shell built‑ins, use `help command`.",
                    "The `info` system provides node‑based hypertext docs.",
                    "`/usr/share/doc` contains additional READMEs and examples for installed packages."
                ]
            }
        ]
    },
    // Placeholder legacy entries to satisfy the curriculum mapping for now
    'track1-ch03': {
        chapterId: 'track1-ch03',
        title: 'Reading the Story: Viewing and Manipulating Text',
        description: 'Learn to view files, redirect streams, and chain commands with pipes.',
        sections: [
            {
                type: 'text',
                id: 'why_matters',
                heading: '1. Why This Matters',
                content: "You have a log file from a misbehaving application. You need to see the last 20 lines, filter out lines containing \"error\", sort them by timestamp, and save the result to a new file. All of that can be done in a single breath — no mouse, no spreadsheet, no heavy editor. This is the moment the terminal becomes your real workspace.\n\nIn this chapter, you'll learn to view files, pipe commands together like Lego bricks, and shape text output exactly how you need it. It's the foundation of everything from log analysis to automation."
            },
            {
                type: 'text',
                id: 'what_learn',
                heading: "2. What You'll Learn",
                list: [
                    "How to dump a file's entire contents to the screen with `cat`.",
                    "How to peek at the beginning (`head`) and end (`tail`) of a file — and follow live changes.",
                    "How to sort lines (`sort`) and remove duplicates (`uniq`).",
                    "How to redirect output to files (`>`, `>>`) and errors separately.",
                    "How to chain commands with pipes (`|`) to build powerful one-liners."
                ]
            },
            {
                type: 'text',
                id: 'core_concepts',
                heading: '3. Core Concepts',
                subsections: [
                    {
                        heading: "3.1 Standard Streams: STDOUT, STDIN, STDERR",
                        content: "Every command deals with three invisible streams:\n- **Standard Input (STDIN)**: where the command reads from (default: your keyboard).\n- **Standard Output (STDOUT)**: where the command prints normal results (default: your screen).\n- **Standard Error (STDERR)**: where the command sends error messages (default: your screen, kept separate so errors don't contaminate data).\n\nRedirection and pipes let you control these streams, sending output to files, feeding output of one command into another, and silencing errors."
                    },
                    {
                        heading: "3.2 Redirection Symbols",
                        content: "- `>` — redirect STDOUT to a file, **overwriting** it if it exists.\n- `>>` — redirect STDOUT to a file, **appending** to the end.\n- `2>` — redirect STDERR to a file.\n- `&>` — redirect both STDOUT and STDERR to the same file.\n\nExample: `ls /nonexistent 2> errors.txt` captures the error while letting normal output through."
                    },
                    {
                        heading: "3.3 Pipes: The Superpower",
                        content: "The pipe `|` takes the STDOUT of the left command and feeds it as STDIN to the right command. You can chain multiple pipes:\n\n```bash\ncat /var/log/messages | grep error | sort | uniq -c\n```\n\nThis reads the log, filters lines containing \"error\", sorts them, counts unique occurrences, and prints to screen. Each command is small and focused; the pipe connects them into something far more powerful."
                    }
                ]
            },
            {
                type: 'hands_on_examples',
                id: 'hands_on',
                heading: '4. Hands-On Examples',
                intro: "Open your separate terminal. Create a practice file using `cat` first: \n\n```bash\ncat > sample.txt <<EOF\napple\nbanana\napple\ncherry\nbanana\ndate\napple\nEOF\n```",
                exercises: [
                    {
                        title: "4.1 cat — Concatenate and Display",
                        command: "cat sample.txt",
                        explanation: "`cat` dumps the entire file. It's short for \"concatenate\" — it can join multiple files too: `cat file1 file2 > combined`.",
                        try_it_yourself: "Create two short files with touch and add some content using cat > file1 (Press Ctrl+D to end input). Then join them into a third file."
                    },
                    {
                        title: "4.2 head and tail — Top and Bottom Views",
                        commands: ["head -n 3 sample.txt", "tail -n 2 sample.txt"],
                        explanation: "head shows the beginning, tail shows the end. `tail -f` follows a file as it grows — perfect for watching logs live.",
                        try_it_yourself: "Try `tail -n +3 sample.txt`. What does it show? (Answer: everything starting from line 3.)"
                    },
                    {
                        title: "4.3 sort and uniq",
                        commands: ["sort sample.txt", "sort sample.txt | uniq -c"],
                        explanation: "`sort` orders lines. `uniq` handles duplicates (but only adjacent ones, so always sort first!).",
                        try_it_yourself: "What happens if you run uniq sample.txt without sorting first? Observe the output and understand why."
                    },
                    {
                        title: "4.4 Pipes in Action",
                        command: "cat sample.txt | sort | uniq -c | sort -rn",
                        explanation: "This gives you a frequency list sorted from most to least common. It's the kind of one-liner sysadmins use daily.",
                        try_it_yourself: "Try adding `head -3` to the end of the pipeline above. What's the result?"
                    }
                ]
            },
            {
                type: 'common_mistakes',
                id: 'mistakes',
                heading: '5. Common Mistakes (and How to Fix Them)',
                items: [
                    "**Using `>` when you meant `>>`**: You overwrite a file you meant to append to. Always double-check.",
                    "**Forgetting `| sort` before `uniq`**: `uniq` only removes *adjacent* duplicates.",
                    "**Redirection confusion**: `cat file > file` *truncates* the file before reading it, resulting in an empty file.",
                    "**`tail -f` followed by frantic Ctrl+C**: `tail -f` runs indefinitely; kill it with `Ctrl+C`."
                ]
            },
            {
                type: 'pro_corner',
                id: 'pro_corner',
                heading: '6. Extra Info / Pro Corner',
                tips: [
                    "**`less` is more**: For large files, use `less` instead of `cat`. It opens a scrollable, searchable view.",
                    "**`tee` — The Splitter**: Want to see output on screen *and* save it to a file simultaneously? `ls -l | tee listing.txt`.",
                    "**`wc` — Word Count**: Quick stats: `wc -l file` counts lines, `-w` words, `-c` characters.",
                    "**Avoiding useless `cat`**: `grep foo file` is often more efficient than `cat file | grep foo`."
                ]
            },
            {
                type: 'looking_ahead',
                id: 'look_ahead',
                heading: '7. Looking Ahead',
                content: "You can now slice, dice, and pipe text. This is the skill that turns you from a casual terminal visitor into a power user. Next, you'll need to *edit* text — not just view it. You'll meet `vim`, the legendary text editor that's on every Linux system."
            },
            {
                type: 'summary',
                id: 'summary',
                heading: '8. Chapter Summary',
                bullets: [
                    "`cat` displays and concatenates files.",
                    "`head` / `tail` show the first/last lines; `tail -f` follows live.",
                    "`sort` orders lines; `uniq` handles duplicates (sort first!).",
                    "Redirection `>`, `>>`, `2>`, `&>` control where output goes.",
                    "Pipes `|` chain commands, passing output to input.",
                    "Always test pipelines step by step."
                ]
            }
        ]
    },
    'track1-ch04': { chapterId: 'track1-ch04', title: 'Users & Groups', description: '', sections: [] },
    'track1-ch05': { chapterId: 'track1-ch05', title: 'Permissions', description: '', sections: [] },
    'track1-ch06': { chapterId: 'track1-ch06', title: 'Processes', description: '', sections: [] },
    'track1-ch07': { chapterId: 'track1-ch07', title: 'Services', description: '', sections: [] },
    'track1-ch08': { chapterId: 'track1-ch08', title: 'SSH', description: '', sections: [] },
    'track1-ch09': { chapterId: 'track1-ch09', title: 'Logs', description: '', sections: [] },
    'track1-ch10': { chapterId: 'track1-ch10', title: 'Networking', description: '', sections: [] },
    'track1-ch11': { chapterId: 'track1-ch11', title: 'Archiving', description: '', sections: [] },
    'track1-ch12': { chapterId: 'track1-ch12', title: 'Software', description: '', sections: [] },
    'track1-ch13': { chapterId: 'track1-ch13', title: 'File Systems', description: '', sections: [] },
    'track1-ch14': { chapterId: 'track1-ch14', title: 'Analysis', description: '', sections: [] }
};
