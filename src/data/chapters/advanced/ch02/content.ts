import { ChapterContent } from '../../../../types/chapters';

export const t2ch02Content: ChapterContent = {
    chapterId: 'track2-ch02',
    title: 'Scheduling Future Tasks',
    description: "Automate backups, updates, and reports using at, cron, and modern systemd timers.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Sysadmins rarely click \"run\" manually for backups, updates, or reports. They schedule tasks to run automatically at the right time — every night, every Sunday, or at a specific minute. Linux gives you three tools for this job: `at` for one‑off tasks, `cron` for repeated ones, and `systemd timers` for the most modern control."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to schedule a one‑time job with `at`.",
                "How to create and manage user `crontab` files.",
                "How to read and write cron time syntax.",
                "How to replace cron with **systemd timers**.",
                "How to troubleshoot missed jobs."
            ]
        },
        {
            type: 'interactive',
            id: 'at_one_shot',
            heading: 'One‑shot with at',
            content: "Run a command at a specific time. Enter the commands and press Ctrl+D:",
            terminal_blocks: [
                { command: "at 2:30pm tomorrow", showPrompt: true },
                { command: "atq", showPrompt: true, output: "// List pending jobs" },
                { command: "atrm 1", showPrompt: true, output: "// Remove job number 1" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Schedule a task to create a file in /tmp at a specific time. Verify with `atq`." }
            ]
        },
        {
            type: 'interactive',
            id: 'cron_repeating',
            heading: 'Cron – The Repeating Scheduler',
            content: "`cron` runs commands based on fields: minute, hour, day of month, month, day of week. Edit your personal crontab:",
            terminal_blocks: [
                { command: "crontab -e", showPrompt: true },
                { command: "30 2 * * 0 /path/to/backup.sh", showPrompt: false, output: "// Runs every Sunday at 2:30 AM" }
            ]
        },
        {
            type: 'text',
            id: 'cron_syntax',
            heading: 'Cron Syntax Deep Dive',
            content: "The five fields in a crontab entry:",
            list: [
                "**minute**: 0‑59",
                "**hour**: 0‑23",
                "**day of month**: 1‑31",
                "**month**: 1‑12",
                "**day of week**: 0‑7 (0 or 7 = Sunday)"
            ],
            tips: [
                "Special strings: `@reboot`, `@daily`, `@weekly`, `@yearly`."
            ],
            terminal_blocks: [
                { command: "@daily /usr/bin/updatedb", showPrompt: false }
            ]
        },
        {
            type: 'text',
            id: 'crontab_mgmt',
            heading: 'Crontab Management',
            content: "Commands to manage your crontab:",
            terminal_blocks: [
                { command: "crontab -l", showPrompt: true, output: "// List your crontab" },
                { command: "crontab -r", showPrompt: true, output: "// Remove all entries" }
            ],
            list: [
                "System‑wide crontabs live in `/etc/crontab`, `/etc/cron.d/`, and `/etc/cron.hourly/` (etc).",
                "You can restrict cron access with `/etc/cron.allow` and `/etc/cron.deny`."
            ]
        },
        {
            type: 'interactive',
            id: 'systemd_timers',
            heading: 'Systemd Timers',
            content: "A timer unit fires a corresponding service unit on a schedule. Create a timer file `/etc/systemd/system/mytask.timer`:",
            terminal_blocks: [
                {
                    command: "[Unit]\nDescription=Run my backup script daily\n\n[Timer]\nOnCalendar=daily\nPersistent=true\n\n[Install]\nWantedBy=timers.target",
                    showPrompt: false
                },
                { command: "sudo systemctl enable --now mytask.timer", showPrompt: true },
                { command: "systemctl list-timers", showPrompt: true }
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Timers can be calendar events, monotonic (relative to boot), or reactive." }
            ]
        },
        {
            type: 'text',
            id: 'oncalendar_syntax',
            heading: 'OnCalendar Syntax (timers)',
            content: "Similar to cron, but more readable:",
            list: [
                "`OnCalendar=daily` — every day at midnight",
                "`OnCalendar=*-*-* 02:30:00` — every day at 2:30",
                "`OnCalendar=Mon..Fri 07:00` — weekdays",
                "`OnCalendar=Sat *-*-1..7 08:00` — first Saturday of month"
            ]
        },
        {
            type: 'text',
            id: 'troubleshooting',
            heading: 'Troubleshooting Jobs',
            content: "If a job didn't run, check these locations:",
            list: [
                "**Cron logs**: `journalctl -u crond` (or `/var/log/cron`).",
                "**Timer status**: `systemctl status mytask.timer`.",
                "**Service logs**: `journalctl -u mytask.service`."
            ],
            tips: [
                "Always ensure your script has the correct PATH set, and redirect output to a log file."
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting that cron uses a minimal environment** — scripts may fail without full PATH.",
                "**Messing up cron timing syntax** — a missing * can break things.",
                "**Using cron for frequent tasks (every minute)** — systemd timers are more robust.",
                "**Not redirecting stderr** — error messages go nowhere."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Your tasks now run automatically. Next we'll optimize performance.",
            list: [
                "`at` — one‑time scheduling.",
                "`crontab -e` — repeating jobs with five‑field syntax.",
                "`@reboot`, `@daily` — shortcuts.",
                "`systemd timer` + `service` — modern scheduling."
            ]
        }
    ]
};
