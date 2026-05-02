import { ChapterContent } from '../../../types/chapters';

export const ch15Content: ChapterContent = {
    chapterId: 'track1-ch15',
    title: 'Analyzing Servers and Getting Support',
    description: "Learn to monitor system health, interpret performance metrics, and generate comprehensive SOS reports for troubleshooting.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "When a server behaves oddly, you need a systematic way to gather evidence. Memory? CPU? Disk? Configuration? Logs? The `sosreport` tool collects it all into a single bundle that you can analyze or hand to support engineers. In this final foundational chapter, you'll learn to take the system's pulse and package a forensic snapshot."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to check system health with `uptime`, `free`, `top`.",
                "How to collect a comprehensive SOS report with `sos report`.",
                "How to use `iostat`, `vmstat`, and `sar` for performance metrics.",
                "How to interpret load averages and memory pressure.",
                "How to strip sensitive data from debug bundles."
            ]
        },
        {
            type: 'interactive',
            id: 'health_checks',
            heading: 'First-Line Health Checks',
            content: "When you suspect trouble, start with these quick commands:",
            terminal_blocks: [
                { command: "uptime", showPrompt: true, output: "// System uptime and load average" },
                { command: "free -h", showPrompt: true, output: "// Memory usage in readable format" },
                { command: "df -h", showPrompt: true, output: "// Disk space availability" },
                { command: "top -n1 | head -5", showPrompt: true, output: "// Snapshot of busiest processes" }
            ],
            tips: [
                "`uptime` shows how long the system has been up and the **load average**.",
                "`free` checks memory, `df` disk space, `top` the busiest processes."
            ]
        },
        {
            type: 'text',
            id: 'load_average',
            heading: 'Understanding Load Average',
            content: "The three numbers are the average number of processes waiting for CPU over the last 1, 5, and 15 minutes. A load of 1.0 on a single‑core system means the CPU was fully busy. If load exceeds the number of CPU cores consistently, the system is overloaded.",
            tips: [
                "Check number of CPUs: `nproc` or `lscpu`."
            ]
        },
        {
            type: 'interactive',
            id: 'performance_monitoring',
            heading: 'Performance Monitoring – iostat, vmstat, sar',
            content: "`iostat` (from the `sysstat` package) shows disk and CPU stats:",
            terminal_blocks: [
                { command: "iostat -x 1 3", showPrompt: true, output: "// Extended disk I/O statistics" },
                { command: "vmstat 1 5", showPrompt: true, output: "// Virtual memory and paging info" },
                { command: "sar -u -f /var/log/sa/sa15", showPrompt: true, output: "// Historical CPU usage" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Install sysstat (`dnf install sysstat`) and run `iostat`. What does \"await\" mean?" }
            ]
        },
        {
            type: 'interactive',
            id: 'sos_report',
            heading: 'Generating an SOS Report',
            content: "The `sos` tool creates a compressed archive of logs, configs, and system info. Install it:",
            terminal_blocks: [
                { command: "sudo dnf install sos", showPrompt: true },
                { command: "sudo sos report", showPrompt: true, output: "// Generates a standard report archive" },
                { command: "sudo sos report --batch --all-logs", showPrompt: true, output: "// Non-interactive full collection" }
            ],
            tips: [
                "The output is a `.tar.xz` file in `/var/tmp/`.",
                "Use `--batch` to suppress interactive prompts."
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Use `--clean` to obfuscate IPs, hostnames, and passwords in the report before sharing." },
                { type: 'try_it', icon: '🧪', content: "Generate a quick sos report with `--batch`. Look inside the archive to see the structure." }
            ]
        },
        {
            type: 'text',
            id: 'report_structure',
            heading: 'Exploring the Report',
            content: "The sos report contains directories like:",
            terminal_blocks: [
                {
                    command: "sosreport-<host>-<date>-<id>/\n├── etc/           (copies of configuration files)\n├── var/log/       (log files)\n├── proc/          (kernel parameters)\n├── sys/           (sysfs data)\n├── sos_commands/  (output of many diagnostic commands)\n└── sos_reports/   (summary files)",
                    showPrompt: false
                }
            ],
            tips: [
                "This is invaluable when you need to understand exactly what went wrong."
            ]
        },
        {
            type: 'interactive',
            id: 'cleaning_data',
            heading: 'Cleaning Sensitive Data',
            content: "To share a report without exposing IPs and passwords:",
            terminal_blocks: [
                { command: "sudo sos clean report.tar.xz", showPrompt: true }
            ],
            tips: [
                "This produces a cleaned version.",
                "You can also run report with `--clean` to generate an already sanitized report."
            ]
        },
        {
            type: 'text',
            id: 'when_to_use',
            heading: 'When to Use sosreport',
            content: "When performance is degraded, a service won't start, or you need to open a support ticket with your Linux vendor, the first question they'll ask is \"Please run sosreport.\"",
            tips: [
                "It's the universal diagnostic data collector for RHEL-based systems."
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Running sosreport without enough disk space** — the report can be hundreds of MB. Check `/var/tmp` space.",
                "**Forgetting to clean sensitive data** — exposing IPs, MACs, and passwords.",
                "**Ignoring load average context** — a high load on a 32‑core system is different from a single‑core VPS."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "This ends the foundational track. You've gone from navigating directories to generating enterprise diagnostic reports. Next, you'll move into advanced territory — scripting, scheduling, storage, security, and containers.",
            list: [
                "`uptime`, `free`, `df`, `top` — quick health checks.",
                "`iostat`, `vmstat`, `sar` — deeper performance analysis.",
                "`sos report` — comprehensive system snapshot.",
                "`sos clean` — sanitize reports for sharing."
            ]
        }
    ]
};
