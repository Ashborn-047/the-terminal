import { ChapterContent } from '../../../../types/chapters';

export const ch02Content: ChapterContent = {
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
            heading: '15. Summary',
            list: [
                "**man [command]**: Full manual page",
                "**man [section] [topic]**: Access specific manual sections (1-8)",
                "**apropos [keyword]**: Search all manuals for keywords",
                "**[command] --help**: Quick usage summary",
                "**help [built-in]**: Help for shell commands like `cd`",
                "**info [command]**: Advanced, hyperlinked documentation",
                "**/usr/share/doc**: Detailed package documentation",
                "**whatis [command]**: One-line command summary"
            ]
        }
    ]
};
