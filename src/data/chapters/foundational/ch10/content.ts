import { ChapterContent } from '../../../types/chapters';

export const ch10Content: ChapterContent = {
    chapterId: 'track1-ch10',
    title: 'Analyzing and Storing Logs',
    description: "When something goes wrong, the logs know why. Learn to query the systemd journal, work with traditional syslog files, and set up log rotation.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "When something goes wrong, the logs know why. Linux systems generate a constant stream of messages from the kernel, services, and applications. If you can read and manage these logs, you can diagnose almost any problem without guesswork.\n\nIn this chapter you’ll learn to query the systemd journal, work with traditional syslog files, and set up log rotation so your disks don’t fill up with forgotten warnings."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to use `journalctl` to view and filter the systemd journal.",
                "How to make the journal persistent across reboots.",
                "How classic syslog files (`/var/log/messages`, `/var/log/secure`) work.",
                "How to watch logs in real time with `tail -f`.",
                "How to configure **logrotate** to keep logs manageable."
            ]
        },
        {
            type: 'interactive',
            id: 'systemd_journal',
            heading: 'The systemd Journal',
            content: "Modern Linux distributions use **systemd-journald** to collect logs from the kernel, services, and even early boot. The `journalctl` command is your primary interface.",
            terminal_blocks: [
                { command: "journalctl", showPrompt: true }
            ],
            tips: [
                "This shows the entire journal from the current boot. Use arrow keys or `q` to quit."
            ]
        },
        {
            type: 'interactive',
            id: 'filtering',
            heading: 'Filtering the Journal',
            content: "Show logs for a specific service:",
            terminal_blocks: [
                { command: "journalctl -u sshd", showPrompt: true }
            ],
            terminal_blocks_after: [
                { command: "journalctl --since \"2025-12-01 10:00:00\"\njournalctl --since today", showPrompt: true, output: "// Filter by time" },
                { command: "journalctl -n 50", showPrompt: true, output: "// Last 50 lines" },
                { command: "journalctl -f", showPrompt: true, output: "// Follow live" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `journalctl -u sshd --since yesterday`. Do you see any failed login attempts?" }
            ]
        },
        {
            type: 'interactive',
            id: 'persistence',
            heading: 'Persistent Journal',
            content: "By default, the journal lives in `/run/log/journal` (volatile memory) and is lost on reboot. To keep it permanently, create `/var/log/journal` and restart the service:",
            terminal_blocks: [
                { command: "sudo mkdir -p /var/log/journal\nsudo systemctl restart systemd-journald", showPrompt: true }
            ],
            tips: [
                "Now logs survive reboots. You can also configure `/etc/systemd/journald.conf` to set limits."
            ]
        },
        {
            type: 'interactive',
            id: 'syslog',
            heading: 'Traditional Syslog Files',
            content: "Even with the journal, many systems still write text logs via **rsyslog** or **syslog-ng**. These live in `/var/log/`:",
            diagram_block: `/var/log/
├── messages          (general system messages)
├── secure            (authentication events)
├── cron              (scheduled task logs)
├── boot.log          (boot messages)
├── dnf.log           (package manager logs)
└── audit/            (SELinux audit logs)`,
            tips: [
                "View with `cat`, `less`, or `tail -f`."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `tail -f /var/log/messages` in one terminal, then in another do `sudo systemctl restart sshd`. Watch the logs appear." }
            ]
        },
        {
            type: 'interactive',
            id: 'tail_f',
            heading: 'Tail‑Following Multiple Files',
            content: "`tail -f` is the classic real‑time log viewer:",
            terminal_blocks: [
                { command: "tail -f /var/log/messages", showPrompt: true }
            ],
            tips: [
                "Use `tail -F` (capital F) to stay attached even if the file is rotated."
            ],
            terminal_blocks_after: [
                { command: "tail -f /var/log/messages /var/log/secure", showPrompt: true, output: "// Watch multiple files" }
            ]
        },
        {
            type: 'interactive',
            id: 'logrotate',
            heading: 'Log Rotation with logrotate',
            content: "Logs grow fast. **logrotate** automatically compresses, rotates, and deletes old logs. Configuration lives in `/etc/logrotate.conf` and `/etc/logrotate.d/`.",
            tips: [
                "Example entry for a custom log:"
            ],
            terminal_blocks: [
                {
                    command: "/var/log/myapp.log {\n  weekly\n  rotate 4\n  compress\n  missingok\n  notifempty\n}",
                    showPrompt: false
                }
            ],
            list: [
                "**weekly** — rotate once a week.",
                "**rotate 4** — keep 4 old copies.",
                "**compress** — use gzip on old logs.",
                "**notifempty** — don't rotate if empty."
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Run `logrotate -d /etc/logrotate.conf` for a dry run to see what would happen." }
            ]
        },
        {
            type: 'interactive',
            id: 'forwarding',
            heading: 'Central Logging (Syslog Forwarding)',
            content: "In enterprise environments, logs are often sent to a central server. **rsyslog** can forward logs via TCP or UDP. This is configured in `/etc/rsyslog.conf`.",
            terminal_blocks: [
                { command: "*.* @@central-log.example.com:514", showPrompt: false, output: "// Forward all via TCP" }
            ],
            tips: [
                "The `@@` means TCP; one `@` means UDP."
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting to make the journal persistent** — lose logs after each reboot.",
                "**Running `journalctl` with no filter on a busy system** — long, slow output.",
                "**Not setting log rotation** — fills up `/var` and crashes services.",
                "**Confusing `tail -f` and `tail -F`** — `-f` stops working after rotation; `-F` reopens."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You can now see your system's story. Next we’ll dive into networking — how your system connects to the world.",
            list: [
                "`journalctl` — query the systemd journal; `-u`, `--since`, `-f`.",
                "`mkdir -p /var/log/journal` — make journal persistent.",
                "`/var/log/messages`, `secure`, `cron` — classic syslog files.",
                "`tail -f` / `tail -F` — live log watching.",
                "`logrotate` — keep logs from eating your disk."
            ]
        }
    ]
};
