import { ChapterContent } from '../../../types/chapters';

export const ch03Content: ChapterContent = {
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
};
