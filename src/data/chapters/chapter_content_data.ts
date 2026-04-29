export type SectionType = 'text' | 'hands_on_examples' | 'common_mistakes' | 'pro_corner' | 'looking_ahead' | 'summary' | 'interactive';

export interface Callout {
    type: 'pro_tip' | 'caution' | 'info' | 'try_it';
    text?: string;
    icon?: string;
    content?: string;
}

export interface TerminalBlock {
    command?: string;
    output?: string;
    showPrompt?: boolean;
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
    terminal_blocks?: TerminalBlock[];
    terminal_blocks_after?: TerminalBlock[];
    terminal_blocks_extra?: TerminalBlock[];
    diagram_block?: string;
    reveal?: {
        summary: string;
        content: string;
    };
    callouts?: Callout[];
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
        description: 'Explore the terminal, navigate the filesystem, and master basic file operations in this interactive journey.',
        sections: [
            {
                type: 'text',
                id: 'why_matters',
                heading: 'Why This Matters',
                content: "You've probably heard that Linux runs the world. Most servers, cloud platforms, Android phones, and even smart fridges run on it. But for a long time, the terminal — that black screen with a blinking cursor — can feel like a locked door. You might have opened it once, typed a few things, and quickly closed it. That changes today.\n\nThink of the command line as a direct conversation with your computer. When you learn to speak this language, you stop being a passenger and start being the driver. In this chapter, you'll take your first real steps."
            },
            {
                type: 'text',
                id: 'what_learn',
                heading: "What You'll Learn",
                list: [
                    "What the terminal, shell, and kernel really are.",
                    "How to see where you are (pwd) and what’s around you (ls).",
                    "How to move (cd) and create directories (mkdir).",
                    "How to create, copy, move, and remove files (touch, cp, mv, rm).",
                    "How to read the Linux filesystem map (FHS).",
                    "Absolute vs. relative paths."
                ]
            },
            {
                type: 'interactive',
                id: 'terminal_bash',
                heading: 'The Terminal, the Shell, and Bash',
                content: "When you open a terminal, a special program starts running: a **shell**. The shell is your interpreter — it takes your typed commands and tells the Linux kernel what to do. The most common shell is **Bash**.",
                terminal_blocks: [
                    { command: "pwd", output: "/home/student", showPrompt: true }
                ],
                callouts: [
                    { type: 'pro_tip', icon: '🧠', content: "All commands in these pages work on any Linux, macOS, and Windows with WSL." }
                ]
            },
            {
                type: 'interactive',
                id: 'filesystem_tree',
                heading: 'The Linux Filesystem – An Upside-Down Tree',
                content: "Everything in Linux lives under a single root: `/`. Even external drives get *mounted* somewhere in this tree. Here’s a simplified map:",
                diagram_block: "/\n├── bin         (essential commands)\n├── boot        (startup files)\n├── dev         (device files)\n├── etc         (system configs)\n├── home        (user directories)\n│   ├── alice\n│   └── bob\n├── root        (superuser home)\n├── tmp         (temporary files)\n├── usr         (shareable programs)\n│   ├── bin\n│   ├── lib\n│   └── share\n└── var         (logs, caches)\n    ├── log\n    └── spool",
                tips: ["Don’t memorise it now — you’ll learn where things live as we go."]
            },
            {
                type: 'text',
                id: 'paths',
                heading: 'Absolute vs Relative Paths',
                bullets: [
                    "**Absolute path:** starts with `/`, e.g. `/home/alice/Music/song.mp3`.",
                    "**Relative path:** points from where you are now, e.g. `Music/song.mp3` if you’re already in `/home/alice`."
                ],
                content: "Think of an absolute path as your full postal address, a relative path as “two doors down”."
            },
            {
                type: 'interactive',
                id: 'hands_on_pwd',
                heading: 'Try It: Where Am I? (pwd)',
                terminal_blocks: [
                    { command: "pwd", showPrompt: true }
                ],
                reveal: {
                    summary: "Show output",
                    content: "/home/student"
                },
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Try it in your own terminal. Then use `cd` to go anywhere else and run `pwd` again." }
                ]
            },
            {
                type: 'interactive',
                id: 'hands_on_ls',
                heading: 'Listing Files (ls)',
                content: "`ls` shows what’s inside the current directory.",
                terminal_blocks: [
                    { command: "ls", showPrompt: true }
                ],
                reveal: {
                    summary: "Reveal",
                    content: "Long format. It shows permissions, owner, size, and modification date."
                },
                terminal_blocks_after: [
                    { command: "ls -l", showPrompt: true }
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Predict what `ls -lh` does, then test it." }
                ]
            },
            {
                type: 'interactive',
                id: 'hands_on_cd',
                heading: 'Moving Around (cd)',
                content: "`cd` Changes Directory. Try these shortcuts:",
                list: [
                    "`cd /usr/share` — absolute move",
                    "`cd ..` — up one level",
                    "`cd ~` — home sweet home",
                    "`cd -` — jump back to last location (super handy!)"
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Navigate from home to `/etc`, list its contents with `ls`, then return home using the shortest sequence." }
                ]
            },
            {
                type: 'interactive',
                id: 'mkdir_touch',
                heading: 'Creating Directories (mkdir) and Empty Files (touch)',
                content: "`mkdir` makes a directory. `touch` makes an empty file (or updates a file’s timestamp).",
                terminal_blocks: [
                    { command: "mkdir my_experiments", showPrompt: true },
                    { command: "touch notes.txt", showPrompt: true }
                ],
                terminal_blocks_extra: [
                    { command: "mkdir -p projects/linux/day1", showPrompt: true }
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Create a directory called `practice` and inside it, a file called `hello`. Use `ls -l practice` to confirm." }
                ]
            },
            {
                type: 'interactive',
                id: 'cp',
                heading: 'Copying Files (cp)',
                content: "The `cp` command copies a file from source to destination. It works like `cp source destination`.",
                terminal_blocks: [
                    { command: "cp notes.txt my_experiments/", showPrompt: true }
                ],
                tips: [
                    "What happened? A copy of `notes.txt` now lives inside `my_experiments`.",
                    "If you want to copy a directory and its contents, use `-r` (recursive)."
                ],
                terminal_blocks_extra: [
                    { command: "cp -r my_experiments backup_experiments", showPrompt: true }
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Create a file called `original.txt`, then copy it to `duplicate.txt`. Check with `ls`." }
                ]
            },
            {
                type: 'interactive',
                id: 'mv',
                heading: 'Moving & Renaming Files (mv)',
                content: "`mv` moves (or renames) a file or directory. Its syntax: `mv source destination`.",
                terminal_blocks: [
                    { command: "mv notes.txt old_notes.txt", showPrompt: true },
                    { command: "mv old_notes.txt my_experiments/", showPrompt: true },
                    { command: "mv my_experiments/old_notes.txt archive/final_notes.txt", showPrompt: true }
                ],
                callouts: [
                    { type: 'caution', icon: '⚠️', content: "If the destination already exists, `mv` will *overwrite* it silently. Be careful." },
                    { type: 'try_it', icon: '🧪', content: "Rename `duplicate.txt` to `backup.txt`, then move it into your `practice` directory." }
                ]
            },
            {
                type: 'interactive',
                id: 'rm',
                heading: 'Removing Files & Directories (rm)',
                content: "`rm` permanently deletes files and directories. There is **no Trash** in the terminal.",
                terminal_blocks: [
                    { command: "rm old_notes.txt", showPrompt: true }
                ],
                terminal_blocks_extra: [
                    { command: "rm -r my_experiments", showPrompt: true }
                ],
                callouts: [
                    { type: 'caution', icon: '⚠️', content: "`rm -r` is powerful. Always double-check the path before pressing Enter." },
                    { type: 'try_it', icon: '🧪', content: "Inside your `practice` directory, create a few files and a subdirectory. Then safely delete them one by one." }
                ]
            },
            {
                type: 'common_mistakes',
                id: 'mistakes',
                heading: 'Common Mistakes (and How to Fix Them)',
                list: [
                    "**Wrong command:** e.g., `sl` instead of `ls` — press up arrow to edit.",
                    "**“No such file or directory”:** check with `pwd` and `ls`.",
                    "**Permission denied:** you’re acting safely. Later `sudo` will help.",
                    "**Using `rm` on a directory without `-r`:** just add `-r`."
                ]
            },
            {
                type: 'pro_corner',
                id: 'pro_corner',
                heading: 'Extra Info / Pro Corner',
                list: [
                    "Hidden files start with `.` – use `ls -a`.",
                    "**Tab completion:** type a partial name and hit Tab.",
                    "**History:** Up/Down arrows, `Ctrl+R` to search.",
                    "**Clear screen:** `Ctrl+L` or `clear`.",
                    "Want to copy and see progress? `cp -v` (verbose)."
                ]
            },
            {
                type: 'summary',
                id: 'summary',
                heading: 'Looking Ahead & Chapter Summary',
                content: "You now speak the command line’s basic verbs: navigate, list, create, copy, move, delete. Next you’ll learn to get help directly inside the terminal with `man` and `--help`.",
                bullets: [
                    "pwd – where am I?",
                    "ls – what’s here?",
                    "cd – move around",
                    "mkdir, touch – create",
                    "cp – copy",
                    "mv – move/rename",
                    "rm – delete (careful!)"
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
