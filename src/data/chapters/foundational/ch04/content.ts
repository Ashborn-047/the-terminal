import { ChapterContent } from '../../../../types/chapters';

export const ch04Content: ChapterContent = {
    chapterId: 'track1-ch04',
    title: 'Mastering Vim: The Text Editor That’s Everywhere',
    description: 'Master the legendary modal editor: navigation, editing, and survival skills.',
    sections: [
        {
            type: 'interactive',
            id: 'why_matters',
            heading: '1. Why This Matters',
            content: "So far you've viewed files and piped text around. But what happens when you actually need to **change** something — a config file, a script, a note? On almost every Linux system, the answer is `vim`. It's been there for decades, it's on every server you'll ever touch, and once you learn it, your fingers will move at the speed of thought.\n\nVim has a reputation for being hard. It's not. It's just *different*. Instead of typing freely and using a mouse, Vim uses **modes**. This chapter gives you the survival kit — enough to edit confidently and save the day when there's no GUI in sight."
        },
        {
            type: 'interactive',
            id: 'what_learn',
            heading: "2. What You'll Learn",
            list: [
                "Why Vim is modal and how Normal, Insert, and Visual modes work.",
                "How to open, edit, save, and quit files.",
                "How to navigate without arrow keys (`hjkl`).",
                "How to delete, copy, paste, and undo.",
                "How to search and replace text.",
                "The bare minimum to survive — and a few tricks to thrive."
            ]
        },
        {
            type: 'interactive',
            id: 'modes_intro',
            heading: '3. Modes: The Key to Vim',
            content: "Unlike a word processor, Vim has **modes**. When you open Vim, you're in **Normal mode**. You can't just type text — the keys do commands instead. Press `i` to enter **Insert mode** (where you type normally). Press `Esc` to go back to Normal mode.",
            list: [
                "**Normal mode** — the cockpit. Every key is a shortcut.",
                "**Insert mode** — the typewriter. You write text.",
                "**Visual mode** — the highlighter. You select text."
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "If you ever feel lost, press `Esc` a couple of times. It always brings you home to Normal mode." }
            ]
        },
        {
            type: 'interactive',
            id: 'open_quit',
            heading: '4. Opening, Saving, and Quitting',
            content: "Open a file (or create one) with `vim filename`. Once inside, you need to know how to get out.",
            terminal_blocks: [
                { command: "vim myfile.txt", showPrompt: true }
            ],
            list: [
                "**:w** — save (write)",
                "**:q** — quit",
                "**:wq** or **:x** — save and quit",
                "**:q!** — quit without saving (force quit)"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Open Vim, type `:q!` to exit. Then open it again, enter Insert mode (`i`), type your name, press `Esc`, then `:wq`." }
            ]
        },
        {
            type: 'interactive',
            id: 'insert_ways',
            heading: '5. Entering Insert Mode (Multiple Ways)',
            content: "The most common way to start typing is `i` (insert at cursor). But there are faster ways:",
            list: [
                "**i** — insert before the cursor",
                "**a** — insert after the cursor (append)",
                "**I** — insert at the beginning of the line",
                "**A** — insert at the end of the line",
                "**o** — open a new line below",
                "**O** — open a new line above"
            ],
            callouts: [
                { type: 'info', icon: 'ℹ️', content: "Notice how `a` and `A` save you one keystroke each time." }
            ]
        },
        {
            type: 'interactive',
            id: 'navigation_hjkl',
            heading: '6. Moving Around (hjkl)',
            content: "Vim veterans don't use arrow keys. They use the home row keys to move the cursor.",
            diagram_block: "ascii\n      k (up)\nh (left)   l (right)\n      j (down)\n",
            list: [
                "**w** — jump to start of next word",
                "**b** — jump back to start of previous word",
                "**0** — jump to start of line",
                "**$** — jump to end of line",
                "**gg** — go to top of file",
                "**G** — go to bottom of file"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Practice moving with `hjkl` for 2 minutes. Then try `w`, `b`, `0`, and `$`." }
            ]
        },
        {
            type: 'interactive',
            id: 'deleting_text',
            heading: '7. Deleting Text – The Power of d',
            content: "In Normal mode, `x` deletes a single character. But `d` is the real delete operator, combined with a motion: **operator + motion**.",
            list: [
                "**dw** — delete a word",
                "**dd** — delete the entire line",
                "**d$** — delete to end of line",
                "**d0** — delete to beginning of line",
                "**dG** — delete to end of file"
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Deleting also *cuts*. What you delete goes into a buffer. You can paste it back with `p`." }
            ]
        },
        {
            type: 'interactive',
            id: 'changing_text',
            heading: '8. Changing and Replacing',
            content: "The `c` operator deletes *and* puts you in Insert mode automatically. Useful for quick fixes.",
            list: [
                "**cw** — change a word",
                "**cc** — change the entire line",
                "**c$** — change to end of line",
                "**r** — replace one character without entering Insert mode",
                "**~** — toggle case of character under cursor"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Type a misspelled word. In Normal mode, put the cursor on it and press `cw` to fix it." }
            ]
        },
        {
            type: 'interactive',
            id: 'undo_redo',
            heading: '9. Undo and Redo',
            content: "Vim's undo is legendary. You can traverse a history of changes easily.",
            list: [
                "**u** — undo last change",
                "**Ctrl+r** — redo"
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Undo in Vim works across saves. You can undo changes from a previous session if the undo file exists." }
            ]
        },
        {
            type: 'interactive',
            id: 'yank_paste',
            heading: '10. Copy and Paste (Yank and Put)',
            content: "The copy command is `y` (yank). It works like delete, but keeps the original.",
            list: [
                "**yw** — yank a word",
                "**yy** — yank the entire line",
                "**y$** — yank to end of line",
                "**p** — paste after cursor",
                "**P** — paste before cursor"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Yank a line with `yy`, move somewhere else, press `p`. You just duplicated a line." }
            ]
        },
        {
            type: 'interactive',
            id: 'visual_mode',
            heading: '11. Visual Mode – Selecting Text',
            content: "Sometimes you want to select text visually before acting on it. Press `v` for character-wise selection, or `V` for line-wise.",
            list: [
                "**d** — delete the selection",
                "**y** — yank (copy) the selection",
                "**c** — change the selection"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Press `V`, use `j` to select a few lines, then press `y` to copy. Move and paste with `p`." }
            ]
        },
        {
            type: 'interactive',
            id: 'searching_text',
            heading: '12. Searching Text',
            content: "In Normal mode, press `/` followed by your search term and Enter. Use `n` to jump to the next match, `N` for previous.",
            terminal_blocks: [
                { command: "/error", showPrompt: false }
            ],
            callouts: [
                { type: 'info', icon: 'ℹ️', content: "Search backward with `?` instead of `/`." }
            ]
        },
        {
            type: 'interactive',
            id: 'search_replace',
            heading: '13. Search and Replace',
            content: "The substitute command works on ranges. The most common is the whole file `%`.",
            terminal_blocks: [
                { command: ":%s/old/new/g", showPrompt: false }
            ],
            list: [
                "**%** — the whole file",
                "**s** — substitute",
                "**g** — globally on each line",
                "**c** — confirmation prompt (e.g., `:%s/old/new/gc`)"
            ]
        },
        {
            type: 'pro_corner',
            id: 'survival_kit',
            heading: '14. Survival Cheat Sheet',
            list: [
                "**i** — Enter typing mode | **Esc** — Leave typing mode",
                "**:w** — Save | **:q!** — Force quit",
                "**u** — Undo | **Ctrl+r** — Redo",
                "**dd** — Delete line | **yy** — Yank line | **p** — Paste",
                "**/term** — Search | **:%s/old/new/g** — Replace all"
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: '15. Chapter Summary',
            bullets: [
                "Vim is modal: Normal (commands), Insert (typing), Visual (selecting).",
                "`i` to insert, `Esc` to return to Normal mode.",
                "`:w` save, `:q` quit, `:q!` force quit.",
                "Navigate with `hjkl`, `w`, `b`, `0`, `$`, `gg`, `G`.",
                "`d` delete, `y` yank, `p` paste, `u` undo.",
                "`/` to search, `:%s/old/new/g` to replace."
            ]
        }
    ]
};
