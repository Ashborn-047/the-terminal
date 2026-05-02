import { ChapterContent } from '../../../../types/chapters';

export const t2ch01Content: ChapterContent = {
    chapterId: 'track2-ch01',
    title: 'Improving Command Line Productivity',
    description: "Master loops, conditionals, variables, and regular expressions to turn repetitive tasks into powerful one-liners.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "You've mastered the basic commands. Now it's time to think in Bash. Loops, conditionals, variables, and regular expressions aren't just for hardcore sysadmins — they're everyday tools that turn repetitive tasks into one-liners. Once you learn them, you'll save hours every week."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to write loops (`for`, `while`) to automate repeated commands.",
                "How to make decisions in scripts with `if`, `test`, and `case`.",
                "How to use **regular expressions** with `grep` and `awk`.",
                "How to create simple shell scripts and make them executable.",
                "How to handle variables, arrays, and command substitution."
            ]
        },
        {
            type: 'interactive',
            id: 'hello_bash',
            heading: 'Hello Bash: Your First Script',
            content: "A Bash script is just a text file with commands. Create one:",
            terminal_blocks: [
                { command: "cat > hello.sh <<EOF\n#!/bin/bash\necho \"Hello, $USER!\"\nEOF", showPrompt: true },
                { command: "chmod +x hello.sh\n./hello.sh", showPrompt: true, output: "Hello, username!" }
            ],
            tips: [
                "The `#!/bin/bash` line tells the system which interpreter to use."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Write a script that prints your name and the current date. Run it." }
            ]
        },
        {
            type: 'interactive',
            id: 'variables',
            heading: 'Variables and Command Substitution',
            content: "Variables store data. You access them with `$`. To run a command and use its output, use `$()`:",
            terminal_blocks: [
                { command: "name=\"Ashborn\"\necho \"Hi $name\"", showPrompt: true },
                { command: "now=$(date)\necho \"Current time: $now\"", showPrompt: true }
            ],
            tips: [
                "Use curly braces for clarity: `${variable}`."
            ]
        },
        {
            type: 'interactive',
            id: 'for_loops',
            heading: 'Loops – The for Loop',
            content: "The simplest loop: iterate over a list of words or files:",
            terminal_blocks: [
                { command: "for fruit in apple banana cherry; do\n  echo \"I like $fruit\"\ndone", showPrompt: true },
                { command: "for file in *.txt; do\n  echo \"Processing $file\"\n  wc -l \"$file\"\ndone", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create several .txt files, then use a loop to count lines in each." }
            ]
        },
        {
            type: 'interactive',
            id: 'while_loops',
            heading: 'The while Loop',
            content: "Loop while a condition is true:",
            terminal_blocks: [
                { command: "count=1\nwhile [ $count -le 5 ]; do\n  echo \"Count: $count\"\n  ((count++))\ndone", showPrompt: true }
            ],
            tips: [
                "Use `(( ))` for arithmetic; square brackets `[ ]` for traditional tests."
            ]
        },
        {
            type: 'text',
            id: 'if_decisions',
            heading: 'Making Decisions – if',
            content: "The classic `if/then/else`:",
            terminal_blocks: [
                { command: "if [ \"$USER\" == \"root\" ]; then\n  echo \"You are root.\"\nelse\n  echo \"You are a regular user.\"\nfi", showPrompt: false }
            ],
            list: [
                "**-f**: file exists and is a regular file",
                "**-d**: directory exists",
                "**-z**: string is empty",
                "**-eq**: equal (numeric)"
            ]
        },
        {
            type: 'interactive',
            id: 'case_statement',
            heading: 'The case Statement',
            content: "A cleaner way to match patterns:",
            terminal_blocks: [
                { command: "read -p \"Enter yes/no: \" answer\ncase $answer in\n  yes|y) echo \"You confirmed!\" ;;\n  no|n)  echo \"You declined.\" ;;\n  *)      echo \"Invalid input.\" ;;\nesac", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'regex_grep',
            heading: 'Regular Expressions (Regex) in grep',
            content: "Regex is a pattern language for matching text. `grep` uses it:",
            terminal_blocks: [
                { command: "grep '^[A-Z]' file.txt", showPrompt: true, output: "// lines starting with uppercase" },
                { command: "grep '\\.com$' urls.txt", showPrompt: true, output: "// lines ending in .com" },
                { command: "grep 'colou?r' file.txt", showPrompt: true, output: "// color or colour" },
                { command: "grep -E '[0-9]{3}-[0-9]{2}-[0-9]{4}'", showPrompt: true, output: "// SSN pattern" }
            ],
            list: [
                "`^` start, `$` end, `.` any char, `*` zero or more, `+` one or more, `?` optional."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Use `grep -E` to find all email addresses in a file with a simple pattern." }
            ]
        },
        {
            type: 'interactive',
            id: 'awk_sed',
            heading: 'awk and sed (Quick Intro)',
            content: "`awk` is a mini‑programming language for column processing. `sed` (stream editor) does find/replace on the fly:",
            terminal_blocks: [
                { command: "awk '{print $1, $3}' data.txt", showPrompt: true },
                { command: "sed 's/old/new/g' file.txt", showPrompt: true }
            ],
            tips: [
                "We'll explore them more later. For now, know they exist."
            ]
        },
        {
            type: 'text',
            id: 'best_practices',
            heading: 'Script Best Practices',
            list: [
                "Always start with `#!/bin/bash`.",
                "Quote variables: `\"$var\"` prevents word splitting.",
                "Use `set -euo pipefail` to catch errors early.",
                "Comment liberally."
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Spaces around = in variable assignment** — `name = \"bob\"` fails; must be `name=\"bob\"`.",
                "**Missing quote around filenames with spaces** — a classic loop breaker.",
                "**Overcomplicating with grep when awk or sed would be simpler**."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You can now write loops and conditionals. Next we'll schedule these scripts to run automatically.",
            list: [
                "`#!/bin/bash` and `chmod +x`.",
                "Variables: `name=\"value\"`, command substitution: `$(cmd)`. Surrounding quotes preserve spaces.",
                "Loops: `for var in list; do ... done`, `while [ condition ]; do ... done`.",
                "Conditionals: `if [ ... ]; then ... fi`, `case`.",
                "Regex with `grep -E`."
            ]
        }
    ]
};
