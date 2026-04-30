import { ChapterContent } from '../../../types/chapters';

export const ch13Content: ChapterContent = {
    chapterId: 'track1-ch13',
    title: 'Installing and Updating Software Packages',
    description: "Linux isn't a frozen operating system. Learn to find, install, update, and remove software using DNF and RPM.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Linux isn't a frozen operating system. New features, security patches, and entirely new applications arrive constantly. The package manager is your gateway to this living ecosystem. On RHEL‑based systems, that manager is `dnf` (and its predecessor `yum`).\n\nIn this chapter, you'll learn to find, install, update, and remove software. You'll also peek under the hood at `rpm`, the low‑level package tool that keeps everything honest."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to search for packages and display package info.",
                "How to install, update, and remove software with `dnf`.",
                "How to manage repositories and enable extra software sources.",
                "How to use `rpm` for direct package queries and verification.",
                "How to roll back transactions with `dnf history`."
            ]
        },
        {
            type: 'text',
            id: 'package_ecosystem',
            heading: 'The Package Ecosystem',
            content: "Software on RHEL/Alma/Rocky comes as **RPM packages** (.rpm files). The **dnf** (Dandified YUM) tool resolves dependencies, downloads packages from **repositories**, and installs them cleanly.\n\nThink of dnf as an app store that also does automatic updates."
        },
        {
            type: 'interactive',
            id: 'search_info',
            heading: 'Searching and Info',
            content: "Find a package by name or description:",
            terminal_blocks: [
                { command: "dnf search nginx", showPrompt: true },
                { command: "dnf info nginx", showPrompt: true, output: "// Show package details" },
                { command: "dnf list installed", showPrompt: true, output: "// List all installed packages" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Search for a package called 'htop'. Is it installed? What does it do?" }
            ]
        },
        {
            type: 'interactive',
            id: 'install_remove',
            heading: 'Installing and Removing',
            content: "Install or remove packages (requires root):",
            terminal_blocks: [
                { command: "sudo dnf install htop", showPrompt: true },
                { command: "sudo dnf remove htop", showPrompt: true },
                { command: "sudo dnf localinstall somepackage.rpm", showPrompt: true, output: "// Install local file with repo dependencies" }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Removing a package also removes unused dependencies if they're not needed elsewhere. Always read the removal summary." }
            ]
        },
        {
            type: 'interactive',
            id: 'updating',
            heading: 'Updating Everything',
            content: "Keep your system secure by applying updates:",
            terminal_blocks: [
                { command: "dnf check-update", showPrompt: true, output: "// List available updates" },
                { command: "sudo dnf update", showPrompt: true, output: "// Apply all updates" },
                { command: "sudo dnf update nginx", showPrompt: true, output: "// Update single package" },
                { command: "sudo dnf update --security", showPrompt: true, output: "// Security-only updates" }
            ]
        },
        {
            type: 'interactive',
            id: 'repositories',
            heading: 'Managing Repositories',
            content: "List enabled repositories and add new sources:",
            terminal_blocks: [
                { command: "dnf repolist", showPrompt: true },
                { command: "sudo dnf install epel-release", showPrompt: true, output: "// Add EPEL repo" }
            ],
            tips: [
                "Repository definitions live in `/etc/yum.repos.d/` as .repo files.",
                "Use `dnf config-manager` to enable or disable them."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `dnf repolist -v` to see detailed repo information. Count how many packages each repository provides." }
            ]
        },
        {
            type: 'interactive',
            id: 'groups',
            heading: 'Working with Groups',
            content: "Some tasks need a collection of packages (e.g., 'Development Tools'). List or install groups:",
            terminal_blocks: [
                { command: "dnf group list", showPrompt: true },
                { command: "sudo dnf group install \"Development Tools\"", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'history',
            heading: 'Transaction History',
            content: "Every install/remove/update is recorded. Use history as a time machine:",
            terminal_blocks: [
                { command: "dnf history", showPrompt: true, output: "// View recent transactions" },
                { command: "sudo dnf history undo 42", showPrompt: true, output: "// Revert transaction ID 42" },
                { command: "sudo dnf history rollback 41", showPrompt: true, output: "// Roll back to state at ID 41" }
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "If an update breaks something, history undo is your time machine." }
            ]
        },
        {
            type: 'interactive',
            id: 'rpm_tool',
            heading: 'The Low‑Level Tool: rpm',
            content: "`rpm` works directly with package files and the local database:",
            terminal_blocks: [
                { command: "rpm -qa", showPrompt: true, output: "// List all installed packages" },
                { command: "rpm -qi bash", showPrompt: true, output: "// Info about bash" },
                { command: "rpm -qc httpd", showPrompt: true, output: "// Config files of httpd" },
                { command: "rpm -V httpd", showPrompt: true, output: "// Verify package integrity" },
                { command: "rpm -ql httpd", showPrompt: true, output: "// List all files in package" }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Using rpm -Uvh with a local file while ignoring dependencies** — prefer dnf for dependency resolution.",
                "**Forgetting to update** — security patches pile up.",
                "**Enabling too many third‑party repositories** — conflicts and instability.",
                "**Removing packages without checking what depends on them** — can break services."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You now control the software lifecycle. Next we'll mount and manage filesystems — the physical storage underneath everything.",
            list: [
                "`dnf search/info/install/remove/update` — package management.",
                "`dnf repolist` — manage repositories.",
                "`dnf history` — undo and rollback.",
                "`rpm -qa -qi -qc -V -ql` — direct package queries."
            ]
        }
    ]
};
