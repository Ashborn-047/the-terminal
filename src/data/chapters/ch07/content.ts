import { ChapterContent } from '../../../types/chapters';

export const ch07Content: ChapterContent = {
    chapterId: 'track1-ch07',
    title: 'Monitoring and Managing Linux Processes',
    description: 'Master the lifecycle of a process. Learn to monitor system resources, send signals, and manage background jobs like a seasoned sysadmin.',
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Your Linux system is alive. At any moment, hundreds of processes are running — shells, services, background tasks, even the terminal itself. When things go wrong (a stuck program, a memory hog, a runaway script), you need to see into this hidden world and take control.\n\nThis chapter teaches you to list, filter, kill, and manage processes. You'll learn the tools that turn you from a passive observer into the system's conductor. No GUI task manager required."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to list processes with `ps`, `top`, `htop`.",
                "How to understand process states, PIDs, and parent‑child relationships.",
                "How to send signals with `kill`, `pkill`, `killall`.",
                "How to run processes in the background and bring them to the foreground.",
                "How to monitor system resources with `uptime`, `free`, `df`."
            ]
        },
        {
            type: 'text',
            id: 'what_is_process',
            heading: 'What Is a Process?',
            content: "A process is a running program. Every process gets a unique **PID** (Process ID). The first process, `init` (or `systemd`), has PID 1. All other processes are its children. The **PPID** is the Parent Process ID.\n\nEach process has a **state**: running, sleeping, stopped, or zombie. The kernel slices CPU time between them thousands of times per second."
        },
        {
            type: 'interactive',
            id: 'ps_listing',
            heading: 'Listing Processes – ps',
            content: "`ps` (process status) shows a snapshot of current processes.",
            terminal_blocks: [
                { command: "ps", showPrompt: true }
            ],
            subsections: [
                {
                    heading: 'Common and powerful combinations',
                    content: "`ps aux` (all processes, BSD format), `ps -ef` (all processes, Unix format), `ps -u alice` (processes of a specific user)."
                }
            ],
            terminal_blocks_after: [
                { command: "ps aux | head -10", showPrompt: true }
            ],
            callouts: [
                { type: 'info', content: "Meaning of the columns: USER, PID, %CPU, %MEM, VSZ, RSS, TTY, STAT, START, TIME, COMMAND." },
                { type: 'try_it', icon: '🧪', content: "Run `ps aux | head -10`. Identify the process with the highest CPU usage." }
            ]
        },
        {
            type: 'interactive',
            id: 'pstree_view',
            heading: 'Process Tree – pstree',
            content: "Visualize parent‑child relationships with `pstree`:",
            terminal_blocks: [
                { command: "pstree -p", showPrompt: true }
            ],
            callouts: [
                { type: 'info', content: "Shows the hierarchy, often with PIDs. You'll see `systemd───sshd───bash───pstree`." }
            ]
        },
        {
            type: 'interactive',
            id: 'monitoring_top',
            heading: 'Real‑Time Monitoring – top and htop',
            content: "`top` gives a live, auto‑refreshing list of processes:",
            terminal_blocks: [
                { command: "top", showPrompt: true }
            ],
            tips: [
                "Inside top, useful keys: `k` (kill), `r` (renice), `q` (quit), `1` (show all CPUs).",
                "`htop` is a prettier, mouse‑friendly alternative (install it if you want: `sudo dnf install htop`)."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Open `top`. Press `M` to sort by memory, `P` to sort by CPU. Watch for a minute." }
            ]
        },
        {
            type: 'interactive',
            id: 'job_control',
            heading: 'Background & Foreground Jobs',
            content: "Run a command and push it to the background immediately with `&`:",
            terminal_blocks: [
                { command: "sleep 300 &", showPrompt: true }
            ],
            subsections: [
                {
                    heading: 'Suspension and Resumption',
                    content: "If a job is already running, press `Ctrl+Z` to suspend it, then use `bg` or `fg`."
                }
            ],
            terminal_blocks_after: [
                { command: "jobs", showPrompt: true },
                { command: "bg", showPrompt: true },
                { command: "fg", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Start `sleep 120`, press Ctrl+Z, then run `bg`, then `jobs`, then `fg` to bring it back." }
            ]
        },
        {
            type: 'interactive',
            id: 'signals_kill',
            heading: 'Sending Signals – kill',
            content: "`kill` sends a signal to a process. The most common:",
            list: [
                "**SIGTERM (15)** — polite, \"please shut down\". Default.",
                "**SIGKILL (9)** — immediate, the nuclear option. Can't be ignored.",
                "**SIGHUP (1)** — hangup, often used to reload configs.",
                "**SIGSTOP (19)** — pause the process.",
                "**SIGCONT (18)** — resume a paused process."
            ],
            terminal_blocks: [
                { command: "kill 1234", showPrompt: true, output: "// sends SIGTERM to PID 1234" },
                { command: "kill -9 1234", showPrompt: true, output: "// SIGKILL" },
                { command: "kill -HUP 1234", showPrompt: true, output: "// SIGHUP" }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "SIGKILL doesn't let the process clean up. Always try SIGTERM first." }
            ]
        },
        {
            type: 'interactive',
            id: 'kill_by_name',
            heading: 'Killing by Name – pkill and killall',
            content: "Instead of finding the PID, kill by name:",
            terminal_blocks: [
                { command: "pkill firefox", showPrompt: true },
                { command: "killall firefox", showPrompt: true }
            ],
            callouts: [
                { type: 'info', content: "`pkill` matches patterns; `killall` matches exact names." },
                { type: 'try_it', icon: '🧪', content: "Run `sleep 500 &`, find its PID with `ps`, then kill it with `kill`. Check with `ps` again." }
            ]
        },
        {
            type: 'interactive',
            id: 'health_checks',
            heading: 'System Resource Quick Checks',
            content: "Three simple commands to see system health:",
            terminal_blocks: [
                { command: "uptime", showPrompt: true, output: "// load average" },
                { command: "free -h", showPrompt: true, output: "// memory usage" },
                { command: "df -h", showPrompt: true, output: "// disk space" }
            ],
            callouts: [
                { type: 'info', content: "Load average shows the average number of processes waiting for CPU over 1, 5, 15 minutes." }
            ]
        },
        {
            type: 'text',
            id: 'niceness',
            heading: 'Nice and Priority (intro)',
            content: "Every process has a **niceness** value from -20 (highest priority) to 19 (lowest). Normal users can only increase niceness (lower priority). We'll explore tuning later, but you can start a process with lower priority: `nice -n 10 command`."
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Using kill -9 immediately** — try SIGTERM first; SIGKILL can leave temp files.",
                "**Forgetting the &** — the terminal locks up until the command finishes.",
                "**Killing the wrong PID** — always double‑check with ps before kill.",
                "**Confusing pkill and killall** — pkill matches substrings; killall matches exact names."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You can now see, monitor, and control every process on your system. Next, we tackle services and daemons — the long‑running background processes managed by systemd.",
            list: [
                "`ps aux` — full process list; `top` — live view.",
                "`bg` / `fg` / `jobs` — background management.",
                "`kill` — send signals; SIGTERM (15) first, SIGKILL (9) last resort.",
                "`pkill` / `killall` — kill by name.",
                "`uptime`, `free`, `df` — quick system health."
            ]
        }
    ]
};
