import { ChapterContent } from '../../../types/chapters';

export const ch06Content: ChapterContent = {
    chapterId: 'track1-ch06',
    title: 'Controlling Access to Files',
    description: 'Secure files using standard Linux permissions (UGO, rwx), special permissions (SUID/SGID), and umask.',
    sections: [
        {
            type: 'interactive',
            id: 'why_matters',
            heading: '1. Why This Matters',
            content: "On a multi-user system, not everyone should see everyone else's files. Linux has a simple but powerful permission system built around three roles: the **User** who owns the file, the **Group** associated with it, and **Others** (everyone else).\n\nCombined with read, write, and execute flags, this UGO/RWX system forms the backbone of Linux security. In this chapter, you'll learn to read, set, and troubleshoot permissions like a pro."
        },
        {
            type: 'interactive',
            id: 'what_learn',
            heading: "2. What You'll Learn",
            list: [
                "How to read file permissions with `ls -l`.",
                "How to change permissions with `chmod` (symbolic and octal).",
                "How to change ownership with `chown` and `chgrp`.",
                "How `umask` controls default permissions.",
                "Special bits: SUID, SGID, and the sticky bit."
            ]
        },
        {
            type: 'interactive',
            id: 'reading_perms',
            heading: '3. Reading Permissions – ls -l',
            content: "Run `ls -l` and you'll see a permission string like `-rw-r--r--`. Let's decode it:",
            terminal_blocks: [
                { command: "ls -l notes.txt", showPrompt: true }
            ],
            diagram: {
                type: 'ascii',
                content: "-   rw-   r--   r--\n│   │     │     │\n│   │     │     └── Others (everyone else)\n│   │     └──────── Group\n│   └────────────── User (owner)\n└────────────────── File type (- file, d directory, l symlink)"
            },
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `ls -l /etc/passwd`. Who owns it? What group? What can others do?" }
            ]
        },
        {
            type: 'interactive',
            id: 'rwx_meaning',
            heading: '4. What RWX Means: Files vs Directories',
            content: "The meaning of r, w, and x changes depending on whether you're looking at a file or a folder.",
            list: [
                "**r (read)** — File: View contents | Directory: List files (`ls`)",
                "**w (write)** — File: Edit/delete | Directory: Create/delete files inside",
                "**x (execute)** — File: Run as program | Directory: Enter directory (`cd`)"
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Notice: `r` on a directory lets you list files; `x` lets you enter it. You often need both." }
            ]
        },
        {
            type: 'interactive',
            id: 'chmod_symbolic',
            heading: '5. Changing Permissions – chmod (Symbolic)',
            content: "Symbolic mode uses letters: **u**ser, **g**roup, **o**thers, **a**ll. Operators: **+** add, **-** remove, **=** set exactly.",
            terminal_blocks: [
                { command: "chmod g+w notes.txt", showPrompt: true },
                { command: "chmod o-r notes.txt", showPrompt: true },
                { command: "chmod a+x script.sh", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a file, check its permissions, then use symbolic chmod to make it readable and writable only by the owner." }
            ]
        },
        {
            type: 'interactive',
            id: 'chmod_octal',
            heading: '6. Changing Permissions – chmod (Octal)',
            content: "Octal mode uses three digits (4=read, 2=write, 1=execute). Sum them for each role.",
            terminal_blocks: [
                { command: "chmod 755 script.sh", showPrompt: true },
                { command: "chmod 644 notes.txt", showPrompt: true },
                { command: "chmod 600 secret.key", showPrompt: true }
            ],
            list: [
                "**7** — rwx (4+2+1)",
                "**6** — rw- (4+2)",
                "**5** — r-x (4+1)",
                "**4** — r-- (4)"
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Never use `chmod 777` unless you truly want everyone to read, write, and execute. It's a security hole." }
            ]
        },
        {
            type: 'interactive',
            id: 'chown',
            heading: '7. Changing Ownership – chown',
            content: "Every file has an owner and a group. To change them:",
            terminal_blocks: [
                { command: "sudo chown alice file.txt", showPrompt: true },
                { command: "sudo chown alice:developers file.txt", showPrompt: true },
                { command: "sudo chown -R alice:developers /home/alice", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a file as your user. Then use `sudo chown root` to give it to root. Check with `ls -l`." }
            ]
        },
        {
            type: 'interactive',
            id: 'umask',
            heading: '8. The Default Mask – umask',
            content: "When you create a file or directory, it gets default permissions. `umask` controls what gets *subtracted* from the maximum (Files 666, Dirs 777).",
            terminal_blocks: [
                { command: "umask", showPrompt: true },
                { command: "umask 077", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Check your current umask. Create a file, check perms. Set umask to 077, create another file, compare." }
            ]
        },
        {
            type: 'interactive',
            id: 'suid',
            heading: '9. Special Bit: SUID (Set User ID)',
            content: "SUID makes a file run with the **owner's** permissions, not the runner's. It appears as an `s` in the owner's execute position.",
            terminal_blocks: [
                { command: "ls -l /usr/bin/passwd", showPrompt: false }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "SUID on the wrong program is a massive security risk. Only use it when you fully understand the implications." }
            ]
        },
        {
            type: 'interactive',
            id: 'sgid_sticky',
            heading: '10. SGID and Sticky Bit',
            content: "SGID on a directory forces group inheritance. Sticky bit prevents deleting files owned by others.",
            list: [
                "**SGID (2)** — `chmod g+s /shared`",
                "**Sticky (1)** — `chmod +t /shared`"
            ],
            terminal_blocks: [
                { command: "chmod 2775 shared/", showPrompt: true },
                { command: "chmod 1777 /tmp", showPrompt: true }
            ]
        },
        {
            type: 'pro_corner',
            id: 'mistakes',
            heading: '11. Common Mistakes',
            list: [
                "**chmod 777** — Over-permissioning files.",
                "**Missing Execute** — Forgetting that directories need `x` to be entered.",
                "**Ownership Rights** — Trying to use `chown` without root privileges.",
                "**Recursive Danger** — Using `-R` on critical system paths."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: '12. Summary & Looking Ahead',
            content: "You now control who sees what. Next, you'll learn to monitor and manage running processes — the heartbeat of your Linux system.",
            bullets: [
                "`ls -l` reveals the UGO/RWX permission string.",
                "`chmod` sets permissions using symbols or octal numbers.",
                "`chown` and `chgrp` manage ownership (usually requires root).",
                "`umask` defines the default security posture for new files.",
                "SUID, SGID, and Sticky bits handle specialized access cases."
            ]
        }
    ]
};
