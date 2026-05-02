import { ChapterContent } from '../../../../types/chapters';

export const ch05Content: ChapterContent = {
    chapterId: 'track1-ch05',
    title: 'Managing Local Users and Groups',
    description: 'Understand the Linux multi-user environment. Create and manage accounts, groups, and sudo privileges.',
    sections: [
        {
            type: 'interactive',
            id: 'why_matters',
            heading: '1. Why This Matters',
            content: "Linux is a multi-user system at its core. Even your personal laptop has dozens of system users running services behind the scenes. Understanding how to create, modify, and secure user accounts isn't just admin work — it's how you control who can do what on your machine.\n\nIn this chapter, you'll learn to create users, set passwords, manage groups, and understand the files that make it all tick. By the end, you'll be the gatekeeper of your system."
        },
        {
            type: 'interactive',
            id: 'what_learn',
            heading: "2. What You'll Learn",
            list: [
                "How to create, modify, and delete user accounts with `useradd`, `usermod`, `userdel`.",
                "How to set and manage passwords with `passwd`.",
                "How to create and manage groups with `groupadd`, `groupmod`.",
                "How to grant superuser privileges with `sudo`.",
                "How to switch users with `su`.",
                "The critical user files: `/etc/passwd`, `/etc/shadow`, `/etc/group`."
            ]
        },
        {
            type: 'interactive',
            id: 'passwd_file',
            heading: '3. The User Database – /etc/passwd',
            content: "Every user account is defined in `/etc/passwd`. Let's peek at it:",
            terminal_blocks: [
                { command: "cat /etc/passwd | head -3", showPrompt: true }
            ],
            list: [
                "**Username** — the unique login name",
                "**x** — password placeholder (indicates shadow file use)",
                "**UID** — User ID (0 for root, 1000+ for regular users)",
                "**GID** — Primary Group ID",
                "**GECOS** — Comment field (usually full name)",
                "**Home** — path to user's home directory",
                "**Shell** — default login shell"
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "The UID 0 is reserved for root. System accounts typically have UIDs below 1000; regular users start at 1000." }
            ]
        },
        {
            type: 'interactive',
            id: 'shadow_file',
            heading: '4. The Shadow File – /etc/shadow',
            content: "Actual password hashes live in `/etc/shadow`, readable only by root:",
            terminal_blocks: [
                { command: "sudo cat /etc/shadow | grep alice", showPrompt: true }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Never edit /etc/shadow by hand. Use `passwd` and `chage` instead." }
            ]
        },
        {
            type: 'interactive',
            id: 'group_file',
            heading: '5. The Group File – /etc/group',
            content: "Groups are defined in `/etc/group`:",
            terminal_blocks: [
                { command: "cat /etc/group | grep wheel", showPrompt: true }
            ],
            list: [
                "**Format** — `groupname:password:GID:member_list`",
                "**Wheel** — (or `sudo` on Debian) grants sudo privileges."
            ]
        },
        {
            type: 'interactive',
            id: 'useradd',
            heading: '6. Creating a User – useradd',
            content: "The simplest way to create a user:",
            terminal_blocks: [
                { command: "sudo useradd bob", showPrompt: true },
                { command: "sudo useradd -m -s /bin/bash -G wheel -c \"Bob Smith\" bob", showPrompt: true }
            ],
            list: [
                "**-m** — create home directory",
                "**-s** — set login shell",
                "**-G** — add to supplementary groups",
                "**-c** — add a comment / full name"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "As root (or with sudo), create a user called `testuser` with a home directory and bash shell. Check /etc/passwd to see the result." }
            ]
        },
        {
            type: 'interactive',
            id: 'passwords',
            heading: '7. Setting and Managing Passwords',
            content: "Set a password immediately after creating a user:",
            terminal_blocks: [
                { command: "sudo passwd bob", showPrompt: true },
                { command: "sudo passwd -e bob", showPrompt: true }
            ],
            list: [
                "**-e** — force password change on next login",
                "**-l** — lock the account",
                "**-u** — unlock the account"
            ]
        },
        {
            type: 'interactive',
            id: 'usermod',
            heading: '8. Modifying Users – usermod',
            content: "Change a user's details after creation:",
            list: [
                "**-l** — rename user (`usermod -l new old`) ",
                "**-d -m** — move home directory",
                "**-aG** — append to a group (CRITICAL: always use -a)",
                "**-s** — change shell"
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Always use `-a` (append) with `-G`, or you'll remove the user from all other supplementary groups!" },
                { type: 'try_it', icon: '🧪', content: "Change testuser's shell to /bin/sh, then add them to the wheel group. Verify with `groups testuser`." }
            ]
        },
        {
            type: 'interactive',
            id: 'userdel',
            heading: '9. Deleting Users – userdel',
            content: "Remove a user:",
            terminal_blocks: [
                { command: "sudo userdel bob", showPrompt: true },
                { command: "sudo userdel -r bob", showPrompt: true }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "`userdel -r` deletes home directories permanently. Proceed with caution." }
            ]
        },
        {
            type: 'interactive',
            id: 'group_mgmt',
            heading: '10. Managing Groups',
            content: "Create and manage groups:",
            terminal_blocks: [
                { command: "sudo groupadd developers", showPrompt: true },
                { command: "sudo groupmod -n devs developers", showPrompt: true },
                { command: "sudo groupdel devs", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a group named `editors`, add testuser to it, and verify membership." }
            ]
        },
        {
            type: 'interactive',
            id: 'sudo',
            heading: '11. Sudo – Borrowing Superpowers',
            content: "The `sudo` command lets authorized users run commands as root:",
            terminal_blocks: [
                { command: "sudo useradd charlie", showPrompt: true }
            ],
            list: [
                "**visudo** — always use this to edit `/etc/sudoers`",
                "**sudo -i** — get a full root login shell"
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Prefer `sudo` over logging in as root directly. It creates an audit trail." }
            ]
        },
        {
            type: 'interactive',
            id: 'su',
            heading: '12. Switching Users – su',
            content: "Switch to another user:",
            terminal_blocks: [
                { command: "su - bob", showPrompt: true }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "`su` requires the target user's password; `sudo` requires YOUR password." }
            ]
        },
        {
            type: 'interactive',
            id: 'aging',
            heading: '13. Password Aging',
            content: "Use `chage` to enforce password policies:",
            terminal_blocks: [
                { command: "sudo chage -l bob", showPrompt: true },
                { command: "sudo chage -M 90 bob", showPrompt: true }
            ],
            list: [
                "**-l** — list aging info",
                "**-M** — set max password age",
                "**-E** — set account expiry date"
            ]
        },
        {
            type: 'pro_corner',
            id: 'mistakes',
            heading: '14. Common Mistakes',
            list: [
                "**Forgetting -a in `usermod -aG`**: This wipes out all other supplementary groups.",
                "**Manually editing /etc/passwd**: A single typo can lock you out of the system.",
                "**Using `su` without `-`**: Forgets to load the environment of the target user."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: '15. Chapter Summary',
            bullets: [
                "Users live in `/etc/passwd`, passwords in `/etc/shadow`, groups in `/etc/group`.",
                "`useradd`, `usermod`, `userdel` are the user management trifecta.",
                "`passwd` and `chage` manage credentials and policies.",
                "Groups allow logical organization and shared permissions.",
                "`sudo` provides secure, audited root access."
            ]
        }
    ]
};
