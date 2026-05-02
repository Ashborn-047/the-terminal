import { ChapterContent } from '../../../../../types/chapters';

export const ch01Content: ChapterContent = {
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
            type: 'summary',
            id: 'summary',
            heading: 'Summary',
            content: "You've learned to navigate the filesystem, create and manage files and folders, and handle common terminal operations. These are the fundamental building blocks for everything else you'll do in Linux.",
            list: [
                "**pwd**: Print Working Directory",
                "**ls**: List files and directories",
                "**cd**: Change Directory",
                "**mkdir**: Make Directory",
                "**touch**: Create empty file",
                "**cp**: Copy files/directories",
                "**mv**: Move or rename files/directories",
                "**rm**: Remove files/directories"
            ]
        }
    ]
};
