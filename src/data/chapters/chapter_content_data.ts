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
                type: 'interactive',
                id: 'why_matters',
                heading: '1. Why This Matters',
                content: "You're sitting in front of your terminal. You've just learned to move around, but now you're staring at a mysterious command like `tar -czf` and wondering what all those letters do. You could search the web, but the real answer is closer — it's already on your machine. Linux has one of the most thorough built‑in documentation systems in the computing world.\n\nIn this chapter, you'll discover that the terminal itself can teach you. You'll learn to ask the system for help, read manuals, and find quick examples without ever leaving your keyboard. This transforms the command line from a scary void into a library full of friendly guides."
            },
            {
                type: 'interactive',
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
                type: 'interactive',
                id: 'man_intro',
                heading: '3. The man Command: Your Personal Manual',
                content: "`man` (short for “manual”) opens a formatted page about nearly every command, configuration file, and system function on your system. It's the first thing to try when you wonder what a command does or what options it accepts.",
                terminal_blocks: [
                    { command: "man ls", showPrompt: true }
                ],
                callouts: [
                    { type: 'pro_tip', icon: '🧠', content: "Use the up/down arrows to scroll, `/` to search for text inside the manual, and press `q` to quit and return to the terminal." }
                ]
            },
            {
                type: 'interactive',
                id: 'man_navigation',
                heading: '4. Navigating the Manual',
                content: "Manual pages use a 'pager' (usually `less`) to display text. This means you can search and jump around effectively.",
                list: [
                    "**Space**: Next page",
                    "**b**: Previous page",
                    "**/term**: Search forward for 'term'",
                    "**n**: Find next match",
                    "**q**: Quit"
                ],
                terminal_blocks: [
                    { command: "man man", showPrompt: true }
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Open `man man`, type `/pager` and hit Enter. It will jump to the section explaining how it views text." }
                ]
            },
            {
                type: 'interactive',
                id: 'man_sections',
                heading: '5. Manual Sections: Knowing Where to Look',
                content: "The manual is divided into numbered sections. Sometimes a name (like `passwd`) exists in multiple sections: one for the command and one for the configuration file.",
                diagram_block: "ascii\n+---------+----------------------------------+--------------------+\n| Section | Content                          | Example            |\n+---------+----------------------------------+--------------------+\n| 1       | User commands (executables)      | man 1 ls           |\n| 5       | File formats and config files    | man 5 crontab      |\n| 8       | System administration commands   | man 8 fdisk        |\n+---------+----------------------------------+--------------------+\n",
                callouts: [
                    { type: 'info', icon: 'ℹ️', content: "By default, `man` shows the lowest-numbered section. To see the config file for passwords, you must specify section 5: `man 5 passwd`." }
                ]
            },
            {
                type: 'interactive',
                id: 'apropos',
                heading: '6. Searching by Keyword (apropos)',
                content: "When you don't know the exact command name, use `apropos` (or `man -k`) to search the one-line descriptions of all manuals.",
                terminal_blocks: [
                    { command: "apropos \"list directory\"", showPrompt: true },
                    { command: "man -k calendar", showPrompt: true }
                ],
                callouts: [
                    { type: 'pro_tip', icon: '🧠', content: "This is the 'Google' of the terminal. If you know *what* you want to do but not *how*, start here." }
                ]
            },
            {
                type: 'interactive',
                id: 'help_flags',
                heading: '7. Quick Help with --help',
                content: "If you just need a quick reminder of a command's options, almost all tools support the `--help` flag. It prints a short summary and exits.",
                terminal_blocks: [
                    { command: "ls --help", showPrompt: true },
                    { command: "mkdir --help", showPrompt: true }
                ],
                callouts: [
                    { type: 'info', icon: 'ℹ️', content: "Unlike `man`, which opens a new screen, `--help` dumps text directly into your terminal history." }
                ]
            },
            {
                type: 'interactive',
                id: 'shell_help',
                heading: '8. Shell Built-ins vs. Commands',
                content: "Some commands (like `cd`, `history`, `pwd`) are part of the shell itself. They don't always have a `man` page. For these, use the `help` command.",
                terminal_blocks: [
                    { command: "help cd", showPrompt: true },
                    { command: "help history", showPrompt: true }
                ],
                callouts: [
                    { type: 'caution', icon: '⚠️', content: "If `man command` says \"No manual entry\", try `help command`." }
                ]
            },
            {
                type: 'interactive',
                id: 'info_system',
                heading: '9. The info System',
                content: "GNU tools use a deeper system called `info`. It's like a hyperlinked website inside your terminal. It's more detailed than `man` but harder to navigate.",
                terminal_blocks: [
                    { command: "info coreutils", showPrompt: true }
                ],
                callouts: [
                    { type: 'pro_tip', icon: '🧠', content: "Inside `info`, use `Tab` to jump between links and `Enter` to follow them. Press `q` to quit." }
                ]
            },
            {
                type: 'interactive',
                id: 'usr_share_doc',
                heading: '10. Documentation in /usr/share/doc',
                content: "For complex software, there is often extra documentation (READMEs, examples, changelogs) in `/usr/share/doc/package_name`.",
                terminal_blocks: [
                    { command: "ls /usr/share/doc", showPrompt: true }
                ],
                callouts: [
                    { type: 'info', icon: 'ℹ️', content: "When a manual page says 'See README for details', this is where you go looking." }
                ]
            },
            {
                type: 'interactive',
                id: 'tldr_whatis',
                heading: '11. Simplified Help: tldr & whatis',
                content: "`whatis` gives you a one-line summary of a command. `tldr` is a popular community tool (often installed) that gives practical examples instead of technical jargon.",
                terminal_blocks: [
                    { command: "whatis grep", showPrompt: true }
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "Try `whatis ls` to see a single-line summary of the list command." }
                ]
            },
            {
                type: 'common_mistakes',
                id: 'mistakes',
                heading: '12. Common Mistakes',
                list: [
                    "**Typing `man cd`**: This often fails. Remember: for built-ins, use `help`.",
                    "**Getting lost in a manual**: If you're overwhelmed, just hit `q` and use `--help` for a summary.",
                    "**Not checking sections**: If `man passwd` shows the command but you wanted the file format, use `man 5 passwd`.",
                    "**Searching without quotes**: If your keyword has spaces in `apropos`, wrap it in quotes."
                ]
            },
            {
                type: 'pro_corner',
                id: 'pro_corner',
                heading: '13. Pro Corner',
                list: [
                    "**Offline Help**: Man pages are available even without an internet connection.",
                    "**Search Forward/Backward**: In most pagers, `/` searches forward and `?` searches backward.",
                    "**MANPATH**: Controls where the system looks for manual pages.",
                    "**Whatis Database**: If `apropos` finds nothing, run `mandb` to rebuild the index."
                ]
            },
            {
                type: 'interactive',
                id: 'look_ahead',
                heading: '14. Looking Ahead',
                content: "Now you have the keys to the library. You don't need to memorize every flag — you just need to know how to find them. In the next chapter, we'll use these skills to master the 'Story of Data': viewing, redirecting, and manipulating text files like a pro."
            },
            {
                type: 'summary',
                id: 'summary',
                heading: '15. Chapter Summary',
                bullets: [
                    "**man** — The gold standard for full documentation.",
                    "**Sections** — 1 (Commands), 5 (Files), 8 (Admin).",
                    "**apropos** — Search by keyword when names fail.",
                    "**--help** — Quick option refresh.",
                    "**help** — For shell built-in commands.",
                    "**/usr/share/doc** — Deep dives and examples."
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
                type: 'interactive',
                id: 'why_matters',
                heading: '1. Why This Matters',
                content: "You have a log file from a misbehaving application. You need to see the last 20 lines, filter out lines containing \"error\", sort them by timestamp, and save the result to a new file. All of that can be done in a single breath — no mouse, no spreadsheet, no heavy editor. This is the moment the terminal becomes your real workspace.\n\nIn this chapter, you'll learn to view files, pipe commands together like Lego bricks, and shape text output exactly how you need it. It's the foundation of everything from log analysis to automation."
            },
            {
                type: 'interactive',
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
                type: 'interactive',
                id: 'cat_viewing',
                heading: '3. Viewing Files with cat',
                content: "`cat` (short for concatenate) is the most basic way to see what's inside a file. It dumps the entire content onto your screen at once.",
                terminal_blocks: [
                    { command: "cat /etc/hostname", showPrompt: true },
                    { command: "cat /etc/hosts", showPrompt: true }
                ],
                callouts: [
                    { type: 'caution', icon: '⚠️', content: "If you `cat` a very large file, it will flood your terminal. For large files, use `less` instead." }
                ]
            },
            {
                type: 'interactive',
                id: 'less_paging',
                heading: '4. Smarter Viewing with less',
                content: "`less` is a 'pager'. It opens a file in a scrollable view without flooding your screen. It's lightning fast even for huge files.",
                terminal_blocks: [
                    { command: "less /var/log/syslog", showPrompt: true }
                ],
                callouts: [
                    { type: 'pro_tip', icon: '🧠', content: "In `less`, use `Space` to scroll down, `/` to search, and `q` to quit." }
                ]
            },
            {
                type: 'interactive',
                id: 'head_tail',
                heading: '5. Peeking: head and tail',
                content: "Sometimes you only care about the start or end of a file. `head` shows the top 10 lines, and `tail` shows the bottom 10 lines by default.",
                terminal_blocks: [
                    { command: "head -n 5 /etc/passwd", showPrompt: true },
                    { command: "tail -n 3 /etc/group", showPrompt: true }
                ],
                callouts: [
                    { type: 'info', icon: 'ℹ️', content: "The `-n` flag lets you specify exactly how many lines you want to see." }
                ]
            },
            {
                type: 'interactive',
                id: 'tail_follow',
                heading: '6. Live Monitoring: tail -f',
                content: "The `-f` (follow) flag keeps `tail` open and displays new lines as they are written to the file in real-time.",
                terminal_blocks: [
                    { command: "tail -f /var/log/auth.log", showPrompt: true }
                ],
                callouts: [
                    { type: 'try_it', icon: '🧪', content: "This is how you watch logs live. Press `Ctrl+C` to stop following." }
                ]
            },
            {
                type: 'interactive',
                id: 'redirection_basic',
                heading: '7. Redirection Superpowers (>)',
                content: "By default, commands print to the screen (STDOUT). Redirection symbols let you send that output to a file instead.",
                list: [
                    "**`>`**: Redirects output to a file, **overwriting** it.",
                    "**`>>`**: Redirects output to a file, **appending** to it."
                ],
                terminal_blocks: [
                    { command: "echo \"Hello World\" > greeting.txt", showPrompt: true },
                    { command: "date >> greeting.txt", showPrompt: true }
                ]
            },
            {
                type: 'interactive',
                id: 'redirection_errors',
                heading: '8. Handling Errors (2>)',
                content: "Linux separates normal output (1) from error messages (2). You can redirect them independently.",
                terminal_blocks: [
                    { command: "ls /root 2> errors.log", showPrompt: true }
                ],
                callouts: [
                    { type: 'pro_tip', icon: '🧠', content: "Want to hide all errors? Redirect them to the black hole: `command 2> /dev/null`." }
                ]
            },
            {
                type: 'interactive',
                id: 'pipes',
                heading: '9. The Pipe: Chaining Commands (|)',
                content: "The pipe takes the output of one command and feeds it as the input to the next.",
                terminal_blocks: [
                    { command: "ls /etc | head -n 5", showPrompt: true }
                ],
                callouts: [
                    { type: 'info', icon: 'ℹ️', content: "The vertical bar `|` represents the pipe. You can chain as many as you like!" }
                ]
            },
            {
                type: 'interactive',
                id: 'sort_uniq',
                heading: '10. Sorting and Deduplicating',
                content: "`sort` reorders lines alphabetically. `uniq` removes duplicates—but only if they are adjacent.",
                terminal_blocks: [
                    { command: "sort /etc/passwd | head", showPrompt: true }
                ],
                callouts: [
                    { type: 'caution', icon: '⚠️', content: "Always `sort` before piping into `uniq`. Otherwise, `uniq` will miss non-adjacent duplicates." }
                ]
            },
            {
                type: 'interactive',
                id: 'complex_pipelines',
                heading: '11. Building Power Pipelines',
                content: "Combine small, simple tools to do complex things.",
                terminal_blocks: [
                    { command: "cut -d: -f1 /etc/passwd | sort | head -n 5", showPrompt: true }
                ]
            },
            {
                type: 'common_mistakes',
                id: 'mistakes',
                heading: '12. Common Mistakes',
                list: [
                    "**Overwriting with `>`**: Using `>` instead of `>>` can delete data.",
                    "**Forgetting `sort` before `uniq`**: This is a very common error.",
                    "**Pipeline order**: The order of commands in a pipeline matters!"
                ]
            },
            {
                type: 'pro_corner',
                id: 'pro_corner',
                heading: '13. Pro Corner',
                list: [
                    "**`tee` Command**: Save output to a file *and* see it on screen.",
                    "**Standard Streams**: STDIN (0), STDOUT (1), and STDERR (2).",
                    "**`wc` (Word Count)**: Count lines, words, and characters."
                ]
            },
            {
                type: 'interactive',
                id: 'look_ahead',
                heading: '14. Looking Ahead',
                content: "In the next chapter, we'll enter the world of Terminal Editing with the legendary `vim`."
            },
            {
                type: 'summary',
                id: 'summary',
                heading: '15. Chapter Summary',
                bullets: [
                    "**cat/less** — For viewing files.",
                    "**head/tail** — Peeking at data.",
                    "**Redirection (>, >>)** — Sending output to files.",
                    "**Pipes (|)** — Chaining tools.",
                    "**sort/uniq** — Cleaning results."
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
