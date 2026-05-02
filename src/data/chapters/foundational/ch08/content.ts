import { ChapterContent } from '../../../types/chapters';

export const ch08Content: ChapterContent = {
    chapterId: 'track1-ch08',
    title: 'Controlling Services and Daemons',
    description: "Master the systemd ecosystem. Learn to control background services, manage system targets, and troubleshoot daemons like a pro.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Web servers, databases, SSH — these aren't one‑off commands. They're **services** that run in the background, start at boot, and need to be controlled. On modern Linux, `systemd` is the manager that handles them all.\n\nIn this chapter you'll learn to start, stop, enable, and troubleshoot services. You'll understand units, targets, and how to make your own programs behave like well‑behaved system citizens."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to check service status with `systemctl status`.",
                "How to start, stop, restart, and reload services.",
                "How to enable and disable services at boot.",
                "How to mask services to prevent them from running.",
                "How to work with systemd units, targets, and logs."
            ]
        },
        {
            type: 'text',
            id: 'systemd_intro',
            heading: 'systemd – The Init System',
            content: "`systemd` is the first process (PID 1) on most modern Linux distributions. It manages **units** — a generic term for services, mounts, sockets, timers, and more.\n\nAlmost every interaction goes through `systemctl`, the control command."
        },
        {
            type: 'interactive',
            id: 'service_status',
            heading: 'Service Status and Info',
            content: "Check a service's state:",
            terminal_blocks: [
                { command: "systemctl status sshd", showPrompt: true }
            ],
            tips: [
                "You'll see: loaded (unit file location), active (running/inactive), enabled/disabled at boot, and recent log lines."
            ],
            terminal_blocks_after: [
                { command: "systemctl is-enabled sshd", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `systemctl status sshd`. Is it active? Is it enabled?" }
            ]
        },
        {
            type: 'interactive',
            id: 'start_stop',
            heading: 'Starting and Stopping Services',
            terminal_blocks: [
                { command: "sudo systemctl start sshd", showPrompt: true },
                { command: "sudo systemctl stop sshd", showPrompt: true },
                { command: "sudo systemctl restart sshd", showPrompt: true },
                { command: "sudo systemctl reload sshd", showPrompt: true, output: "// reloads config without restart" }
            ],
            callouts: [
                { type: 'info', content: "Not all services support reload. If not, use restart." },
                { type: 'try_it', icon: '🧪', content: "Stop the SSH service, check the status, then start it again. Make sure you have another way in if you're connected via SSH!" }
            ]
        },
        {
            type: 'interactive',
            id: 'enable_disable',
            heading: 'Enabling and Disabling at Boot',
            terminal_blocks: [
                { command: "sudo systemctl enable sshd", showPrompt: true },
                { command: "sudo systemctl disable sshd", showPrompt: true }
            ],
            callouts: [
                { type: 'info', content: "Enabling creates a symlink in the appropriate target directory so systemd starts the service at boot." }
            ]
        },
        {
            type: 'interactive',
            id: 'masking',
            heading: 'Masking – Blocking a Service',
            content: "Masking prevents a service from being started at all — even manually:",
            terminal_blocks: [
                { command: "sudo systemctl mask firewalld", showPrompt: true },
                { command: "sudo systemctl unmask firewalld", showPrompt: true }
            ],
            callouts: [
                { type: 'info', content: "Masking symlinks the unit file to `/dev/null`, making it impossible to start." }
            ]
        },
        {
            type: 'interactive',
            id: 'listing_units',
            heading: 'Listing Units',
            content: "See all active units:",
            terminal_blocks: [
                { command: "systemctl list-units", showPrompt: true }
            ],
            terminal_blocks_after: [
                { command: "systemctl list-unit-files", showPrompt: true },
                { command: "systemctl list-units --type=service", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'targets',
            heading: 'Targets – System States',
            content: "Targets are unit groups that represent system states, like old runlevels:",
            list: [
                "`multi-user.target` — normal CLI system (runlevel 3)",
                "`graphical.target` — GUI mode (runlevel 5)",
                "`rescue.target` — single‑user mode",
                "`emergency.target` — minimal recovery shell"
            ],
            terminal_blocks: [
                { command: "sudo systemctl isolate multi-user.target", showPrompt: true },
                { command: "sudo systemctl set-default graphical.target", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Find your current default target: `systemctl get-default`. Is it multi-user or graphical?" }
            ]
        },
        {
            type: 'interactive',
            id: 'unit_files',
            heading: 'Unit Files – The Blueprint',
            content: "Unit files live in `/usr/lib/systemd/system/` (system) and `/etc/systemd/system/` (admin overrides).",
            terminal_blocks: [
                { command: "systemctl cat sshd", showPrompt: true }
            ],
            tips: [
                "After editing a unit file, reload systemd using `sudo systemctl daemon-reload`."
            ]
        },
        {
            type: 'interactive',
            id: 'journal_logs',
            heading: 'Journal – Service Logs',
            content: "systemd collects logs in the journal. Access them with `journalctl`:",
            terminal_blocks: [
                { command: "journalctl -u sshd", showPrompt: true },
                { command: "journalctl -u sshd -f", showPrompt: true, output: "// follow" },
                { command: "journalctl -u sshd --since today", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting `sudo`** — most systemctl commands need root.",
                "**Restarting vs Reloading** — not all services support reload; restart if unsure.",
                "**Enabling without starting** — enable sets boot start; start runs it now. Use `--now` to do both: `systemctl enable --now sshd`.",
                "**Deleting unit files instead of masking** — they'll come back on updates."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Services are the heartbeat of a Linux server. Next we'll secure the most important one: SSH.",
            list: [
                "`systemctl status/start/stop/restart/reload` — control services.",
                "`enable/disable` — boot startup.",
                "`mask/unmask` — block completely.",
                "`list-units`, `list-unit-files` — explore.",
                "`isolate` and `set-default` — manage targets."
            ]
        }
    ]
};
