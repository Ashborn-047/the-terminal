import { ChapterContent } from '../../../../types/chapters';

export const t2ch04Content: ChapterContent = {
    chapterId: 'track2-ch04',
    title: 'Controlling Access to Files with ACLs',
    description: "Break through the limitations of standard UGO permissions with fine-grained Access Control Lists (ACLs) for users and groups.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Standard UGO permissions (owner/group/others) limit you to three roles. What if you need to give *two different groups* different access levels to the same file? Or allow a single user outside the group to read a report? Access Control Lists (ACLs) break through the UGO wall, giving you per‑user, per‑group control without changing the file's owner or group."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to view ACLs with `getfacl`.",
                "How to set ACLs with `setfacl`.",
                "How to work with default ACLs for directories (automatic inheritance).",
                "How to understand the ACL mask and effective permissions."
            ]
        },
        {
            type: 'text',
            id: 'acl_support',
            heading: 'Checking ACL Support',
            content: "Most modern filesystems (ext4, xfs) support ACLs by default. You can verify with `mount | grep acl`. On RHEL, ACL support is enabled out of the box."
        },
        {
            type: 'interactive',
            id: 'viewing_acls',
            heading: 'Viewing ACLs – getfacl',
            content: "`getfacl` shows the complete access control list of a file or directory:",
            terminal_blocks: [
                { command: "getfacl myfile.txt", showPrompt: true, output: "# file: myfile.txt\n# owner: alice\n# group: staff\nuser::rw-\nuser:bob:r--\ngroup::r--\nmask::r--\nother::---" }
            ],
            tips: [
                "Output includes standard UGO permissions, plus extra entries for specific users and groups."
            ]
        },
        {
            type: 'interactive',
            id: 'setting_acls',
            heading: 'Setting ACLs – setfacl',
            content: "Use `-m` (modify) to add or change ACL entries:",
            terminal_blocks: [
                { command: "setfacl -m u:bob:rw myfile.txt", showPrompt: true, output: "// Gives user 'bob' read/write access" },
                { command: "setfacl -m g:developers:r myfile.txt", showPrompt: true, output: "// Gives group 'developers' read access" },
                { command: "setfacl -m m::r myfile.txt", showPrompt: true, output: "// Sets the ACL mask to read-only" }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "If the mask is more restrictive than an ACL entry, the effective permission is what matters (shown as a comment by getfacl)." },
                { type: 'try_it', icon: '🧪', content: "Create a file, add an ACL for a different user, then verify with `getfacl`." }
            ]
        },
        {
            type: 'interactive',
            id: 'removing_acls',
            heading: 'Removing ACL Entries',
            content: "Remove specific entries or clear all extended ACLs:",
            terminal_blocks: [
                { command: "setfacl -x u:bob myfile.txt", showPrompt: true, output: "// Removes bob's specific entry" },
                { command: "setfacl -b myfile.txt", showPrompt: true, output: "// Removes all extended ACLs (resets to UGO)" }
            ]
        },
        {
            type: 'interactive',
            id: 'default_acls',
            heading: 'Default ACLs – Inheritance',
            content: "Default ACLs ensure all new files created inside a directory inherit specific permissions:",
            terminal_blocks: [
                { command: "setfacl -m d:g:developers:rwx /projects", showPrompt: true },
                { command: "getfacl /projects", showPrompt: true, output: "// Look for default:group:developers:rwx" }
            ],
            tips: [
                "Default ACLs only make sense on directories."
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a directory, set a default ACL, then create a file inside and check its permissions." }
            ]
        },
        {
            type: 'text',
            id: 'mask_logic',
            heading: 'Mask and Effective Permissions',
            content: "The **mask** entry limits the maximum permissions for all named users and groups. If you set a user ACL `u:bob:rwx` but the mask is `r-x`, bob effectively gets `r-x`. `getfacl` shows a comment `#effective:r-x` beside the entry. You can change the mask at any time to quickly lock down a file."
        },
        {
            type: 'interactive',
            id: 'copying_acls',
            heading: 'Copying ACLs',
            content: "Preserve complex ACL structures by piping between getfacl and setfacl:",
            terminal_blocks: [
                { command: "getfacl source.txt | setfacl --set-file=- target.txt", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting the mask** – Named users/groups are restricted by the mask regardless of their individual entry.",
                "**Using chmod after setfacl** – Standard `chmod` on group permissions also modifies the ACL mask.",
                "**Default ACLs on files** – These only work on directories for inheritance."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You now have fine‑grained access control. Next we tackle SELinux, the powerful mandatory access control system.",
            list: [
                "`getfacl` — view ACLs.",
                "`setfacl -m u:user:perms file` — add entry.",
                "`setfacl -x u:user file` — remove entry.",
                "`setfacl -m d:g:group:perms dir` — default ACL.",
                "`setfacl -b file` — remove all ACLs."
            ]
        }
    ]
};
