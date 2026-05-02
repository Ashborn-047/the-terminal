import { ChapterContent } from '../../../../types/chapters';

export const t2ch03Content: ChapterContent = {
    chapterId: 'track2-ch03',
    title: 'Tuning System Performance',
    description: "Master process priority with nice/renice and optimize system-wide performance using tuned profiles.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Not all processes are equal. A database should have higher CPU priority than a cron job. If the system is under heavy load, you need to give the important tasks a boost and tame the less critical ones. This chapter introduces `nice`, `renice`, and the automated tuning daemon `tuned` so your server always puts performance where it matters."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to launch a process with a custom priority using `nice`.",
                "How to change a running process's priority with `renice`.",
                "How to apply system‑wide tuning profiles with `tuned-adm`.",
                "How to interpret the **niceness** value and understand its effect.",
                "How to use `top` and `ps` to verify scheduling priority."
            ]
        },
        {
            type: 'text',
            id: 'priority_basics',
            heading: 'Process Priority Basics',
            content: "The kernel schedules processes using a priority value called **nice value**. It ranges from **-20** (highest priority) to **19** (lowest). A high nice value means the process is \"nicer\" to others, giving up CPU time. Regular users can only set positive values (0 to 19). Root can set negative values for super-high priority."
        },
        {
            type: 'interactive',
            id: 'launching_nice',
            heading: 'Launching with nice',
            content: "Start a command with lower than normal priority (nice value 10):",
            terminal_blocks: [
                { command: "nice -n 10 tar -czf backup.tar.gz /data", showPrompt: true },
                { command: "nice -n -5 /important/process", showPrompt: true, output: "// Starts with higher priority (root only)" }
            ],
            tips: [
                "If no value is given, the default `nice` increment is 10."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run a `sleep 1000 &` process with nice 15, then check its priority using `ps -l`." }
            ]
        },
        {
            type: 'interactive',
            id: 'renice_running',
            heading: 'Adjusting a Running Process with renice',
            content: "Change the priority of an existing process (PID 1234):",
            terminal_blocks: [
                { command: "renice +5 1234", showPrompt: true },
                { command: "renice -n 5 -p 1234 5678", showPrompt: true, output: "// Adjusts multiple PIDs" }
            ],
            tips: [
                "Regular users can only increase niceness (lower priority). Root can decrease it."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Start a process, then use `renice` to make it less urgent. Verify the change in `top`." }
            ]
        },
        {
            type: 'interactive',
            id: 'viewing_priority',
            heading: 'Viewing Priority and Nice Values',
            content: "`top` shows the NI column (niceness) and PR (actual scheduling priority).",
            terminal_blocks: [
                { command: "top", showPrompt: true },
                { command: "ps -o pid,comm,nice,pri", showPrompt: true, output: "// Custom columns for priority viewing" }
            ],
            tips: [
                "You can re‑nice a process directly inside `top` by pressing `r` and entering the PID and value."
            ]
        },
        {
            type: 'interactive',
            id: 'tuned_service',
            heading: 'System‑Wide Tuning with tuned',
            content: "`tuned` is a service that adjusts kernel parameters, power management, and I/O schedulers based on a profile.",
            terminal_blocks: [
                { command: "sudo dnf install tuned", showPrompt: true },
                { command: "sudo systemctl enable --now tuned", showPrompt: true },
                { command: "tuned-adm list", showPrompt: true, output: "// List available profiles" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "See which profile is active: `tuned-adm active`. Then switch to `throughput-performance`." }
            ]
        },
        {
            type: 'interactive',
            id: 'tuned_profiles',
            heading: 'Activating a tuned Profile',
            content: "Set a specific profile based on your workload:",
            terminal_blocks: [
                { command: "sudo tuned-adm profile throughput-performance", showPrompt: true },
                { command: "tuned-adm active", showPrompt: true },
                { command: "sudo tuned-adm recommend", showPrompt: true, output: "// Suggests a profile based on analysis" }
            ]
        },
        {
            type: 'text',
            id: 'profile_types',
            heading: 'When to Use Which Profile',
            list: [
                "**balanced** – good general purpose, power saving.",
                "**throughput-performance** – max CPU/disk/network, ignores power usage.",
                "**virtual-guest** – efficiency inside a VM.",
                "**latency-performance** – for low-latency networking."
            ]
        },
        {
            type: 'text',
            id: 'scenario',
            heading: 'Real‑World Scenario',
            content: "Your database is suffering during nightly backups. The backup script runs with `nice 10` and a `tuned` profile is set to `throughput-performance`. This ensures the backup doesn't starve the database of CPU, yet the system overall is tuned for high I/O throughput."
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Setting nice values too aggressively** – potentially starving a critical process.",
                "**Forgetting that renice only affects CPU scheduling** – use `ionice` for disk I/O priority.",
                "**Not enabling the tuned service** – profiles won't apply until the service is started.",
                "**Assuming one profile fits all** – test your workload before applying globally."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Process priority is set. Next we'll dive deeper into access control with ACLs.",
            list: [
                "**Niceness**: -20 (high) to 19 (low). Regular users 0-19.",
                "`nice` launches; `renice` adjusts running processes.",
                "`tuned-adm` manages system-wide tuning profiles.",
                "Always verify with `top`, `ps`, or `tuned-adm active`."
            ]
        }
    ]
};
