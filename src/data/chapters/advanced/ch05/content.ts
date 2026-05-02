import { ChapterContent } from '../../../../types/chapters';

export const t2ch05Content: ChapterContent = {
    chapterId: 'track2-ch05',
    title: 'Managing SELinux Security',
    description: "Master Security-Enhanced Linux (SELinux) modes, contexts, booleans, and troubleshooting techniques to build hardened systems.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "SELinux (Security-Enhanced Linux) adds a mandatory access control layer that can stop zero‑day exploits, misconfigured services, and even malicious insiders. Instead of just \"who owns the file\", SELinux asks \"what context does the file have, and what process is trying to access it?\" It can feel intimidating, but once you understand contexts and booleans, you'll wonder how you lived without it."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to check SELinux modes: enforcing, permissive, disabled.",
                "How to view and interpret security contexts with `ls -Z` and `ps -Z`.",
                "How to change file contexts with `chcon` and `restorecon`.",
                "How to manage SELinux booleans with `getsebool` and `setsebool`.",
                "How to troubleshoot common SELinux denials with `sealert` and the audit log."
            ]
        },
        {
            type: 'interactive',
            id: 'selinux_modes',
            heading: 'SELinux Modes',
            content: "SELinux operates in one of three modes:",
            list: [
                "**Enforcing**: SELinux actively blocks policy violations.",
                "**Permissive**: SELinux logs violations but does not block (excellent for debugging).",
                "**Disabled**: SELinux is completely off (not recommended)."
            ],
            terminal_blocks: [
                { command: "getenforce", showPrompt: true, output: "// Returns current mode (Enforcing/Permissive/Disabled)" },
                { command: "sudo setenforce 0", showPrompt: true, output: "// Temporarily switch to permissive mode" }
            ],
            tips: [
                "Permanently set the mode by editing `/etc/selinux/config`."
            ]
        },
        {
            type: 'interactive',
            id: 'selinux_contexts',
            heading: 'SELinux Contexts',
            content: "Every process, file, and port has a security context. The context consists of User, Role, Type, and Level.",
            terminal_blocks: [
                { command: "ls -Z /var/www/html/index.html", showPrompt: true, output: "-rw-r--r--. root root unconfined_u:object_r:httpd_sys_content_t:s0 index.html" },
                { command: "ps -Z", showPrompt: true, output: "LABEL                               PID TTY          TIME CMD\nunconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 2032 pts/0 00:00:00 bash" }
            ],
            tips: [
                "The **Type** (e.g., `httpd_sys_content_t`) is the most important part for standard policy enforcement."
            ]
        },
        {
            type: 'interactive',
            id: 'chcon_usage',
            heading: 'Temporarily Changing Context – chcon',
            content: "Change the type of a file manually:",
            terminal_blocks: [
                { command: "sudo chcon -t httpd_sys_content_t /custom/webroot/index.html", showPrompt: true }
            ],
            tips: [
                "`chcon` changes are not persistent across filesystem relabeling or `restorecon`. Use it for temporary testing only."
            ]
        },
        {
            type: 'interactive',
            id: 'permanent_context',
            heading: 'Permanent Context – semanage fcontext',
            content: "Add a file context rule to the SELinux policy database:",
            terminal_blocks: [
                { command: "sudo semanage fcontext -a -t httpd_sys_content_t \"/web(/.*)?\"", showPrompt: true },
                { command: "sudo restorecon -Rv /web", showPrompt: true, output: "// Apply the new context recursively" }
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Always use `semanage fcontext` + `restorecon` for permanent rules. `chcon` will be lost if the system relabels files." }
            ]
        },
        {
            type: 'interactive',
            id: 'restorecon_usage',
            heading: 'Restore Default Context – restorecon',
            content: "Fix incorrect labels based on the current policy mapping:",
            terminal_blocks: [
                { command: "sudo restorecon -v /var/www/html/*", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'selinux_booleans',
            heading: 'SELinux Booleans',
            content: "Booleans are on/off switches that modify policy without writing new rules.",
            terminal_blocks: [
                { command: "getsebool -a | grep httpd", showPrompt: true },
                { command: "getsebool httpd_enable_homedirs", showPrompt: true },
                { command: "sudo setsebool -P httpd_enable_homedirs on", showPrompt: true, output: "// -P makes it persistent" }
            ],
            tips: [
                "Common booleans include `httpd_can_network_connect` and `ftpd_full_access`."
            ]
        },
        {
            type: 'interactive',
            id: 'troubleshooting',
            heading: 'Troubleshooting SELinux Denials',
            content: "When a service fails, check the audit logs for Access Vector Cache (AVC) messages.",
            terminal_blocks: [
                { command: "sudo ausearch -m avc -ts recent", showPrompt: true },
                { command: "sudo sealert -a /var/log/audit/audit.log", showPrompt: true, output: "// Provides human-readable analysis and fix suggestions" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Generate a denial by serving a file from a non‑standard directory with Apache, then use `ausearch` to see the AVC message." }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Disabling SELinux entirely** – The \"nuclear option\"; use permissive mode for debugging instead.",
                "**Using chcon for permanent changes** – These are lost after a relabel or `restorecon`.",
                "**Forgetting the -P flag** – Without `-P`, `setsebool` changes revert after reboot.",
                "**Ignoring the audit log** – Most denials can be resolved quickly using `sealert` suggestions."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You now have the keys to the SELinux kingdom. Next we'll manage basic disk storage.",
            list: [
                "`getenforce` / `setenforce` — view/change mode.",
                "`ls -Z` / `ps -Z` — view contexts.",
                "`chcon` is temporary; `semanage fcontext + restorecon` is permanent.",
                "`getsebool` / `setsebool -P` — manage policy switches.",
                "`ausearch` / `sealert` — troubleshoot and fix denials."
            ]
        }
    ]
};
