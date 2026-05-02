import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch04Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c04_e01',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Which command shows the ACL of a file?',
        options: ['getfacl', 'ls -l', 'aclshow', 'acl-get'],
        correctAnswer: 'getfacl',
        explanation: 'getfacl displays file ACLs.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e02',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "How do you add an ACL entry for user 'bob' with read and write?",
        options: ['setfacl -m u:bob:rw file', 'setfacl -a u:bob:rw file', 'setfacl -u bob:rw file', 'acladd bob:rw'],
        correctAnswer: 'setfacl -m u:bob:rw file',
        explanation: '-m modifies the ACL.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e03',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What does 'setfacl -x u:bob file' do?",
        options: ['Removes the ACL entry for bob', 'Excludes bob from the file', 'Denies bob', 'Deletes the file'],
        correctAnswer: 'Removes the ACL entry for bob',
        explanation: '-x removes an entry.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e04',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you remove all ACL entries from a file?',
        options: ['setfacl -b file', 'setfacl -d file', 'setfacl -r file', 'aclclear file'],
        correctAnswer: 'setfacl -b file',
        explanation: '-b removes all extended ACLs.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e05',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What is a default ACL?',
        options: [
            "An ACL directory that is inherited by new files and subdirectories",
            "The root ACL",
            "A hidden ACL",
            "The system ACL"
        ],
        correctAnswer: "An ACL directory that is inherited by new files and subdirectories",
        explanation: "Default ACLs on directories propagate to children.",
        difficulty: 'easy'
    },
    {
        id: 't2c04_e06',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Which flag to setfacl adds a default ACL entry?',
        options: ['d:', 'default:', '-d', '-D'],
        correctAnswer: 'd:',
        explanation: 'setfacl -m d:g:group:perms dir.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e07',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What does the ACL mask do?',
        options: [
            "Limits the maximum permissions for named users and groups",
            "Hides the ACL",
            "Encrypts permissions",
            "Sets the owner"
        ],
        correctAnswer: "Limits the maximum permissions for named users and groups",
        explanation: "The mask restricts effective permissions.",
        difficulty: 'easy'
    },
    {
        id: 't2c04_e08',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How do you view effective permissions in getfacl?',
        options: [
            "Look for a comment like #effective:r-x",
            "Effective are always shown",
            "Use getfacl -e",
            "Not possible"
        ],
        correctAnswer: "Look for a comment like #effective:r-x",
        explanation: "getfacl shows effective permissions when they differ from the entry.",
        difficulty: 'easy'
    },
    {
        id: 't2c04_e09',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Which file systems support ACLs on RHEL?',
        options: ['ext4 and xfs', 'ntfs only', 'vfat', 'none'],
        correctAnswer: 'ext4 and xfs',
        explanation: 'Both ext4 and xfs support POSIX ACLs.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e10',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How do you list the ACL of a directory using getfacl?',
        options: ['getfacl /path', 'ls -l /path', 'getfacl -d /path', 'getfacl --dir /path'],
        correctAnswer: 'getfacl /path',
        explanation: 'getfacl works on both files and directories.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e11',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What does 'setfacl -m m::rx file' do?",
        options: ['Sets the ACL mask to r-x', 'Sets the owner to rx', 'Adds a mask named \'m\'', 'Deletes the ACL'],
        correctAnswer: 'Sets the ACL mask to r-x',
        explanation: 'm:: specifies the mask.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e12',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What happens if you run 'chmod g-w' on a file with ACLs?",
        options: [
            "The group permission and the ACL mask both change",
            "Only the mask changes",
            "The ACL is deleted",
            "Nothing"
        ],
        correctAnswer: "The group permission and the ACL mask both change",
        explanation: "chmod on the group permission modifies the ACL mask.",
        difficulty: 'easy'
    },
    {
        id: 't2c04_e13',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Can you set ACLs on a file without changing ownership?',
        options: ['Yes, ACLs are independent of ownership', 'No, you must change owner', 'Only root can', 'Only on directories'],
        correctAnswer: 'Yes, ACLs are independent of ownership',
        explanation: 'ACLs add permissions without altering owner/group.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e14',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How do you apply ACLs recursively to all files in a directory?',
        options: ['setfacl -R -m u:bob:rw dir/', 'setfacl -r u:bob:rw dir/', 'getfacl -R | setfacl', 'find dir -exec setfacl'],
        correctAnswer: 'setfacl -R -m u:bob:rw dir/',
        explanation: '-R applies recursively.',
        difficulty: 'easy'
    },
    {
        id: 't2c04_e15',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What is the difference between 'u:bob:rw' and 'g:staff:rw'?",
        options: ['One is for a user, the other for a group', 'No difference', 'u is for owner', 'g is for guest'],
        correctAnswer: 'One is for a user, the other for a group',
        explanation: 'u: specifies a user; g: a group.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c04_m01',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "Why might 'ls -l' show a '+' sign after the standard permissions?",
        options: [
            "There are extended ACLs on the file",
            "The file is executable",
            "It's a directory",
            "The file is linked"
        ],
        correctAnswer: "There are extended ACLs on the file",
        explanation: "A + indicates that additional ACL entries exist.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m02',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you copy the ACLs from file1 to file2?',
        options: [
            "getfacl file1 | setfacl --set-file=- file2",
            "cp --acl file1 file2",
            "setfacl --copy file1 file2",
            "aclcopy file1 file2"
        ],
        correctAnswer: "getfacl file1 | setfacl --set-file=- file2",
        explanation: "The pipeline with --set-file=- works.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m03',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What does 'setfacl -m d:u:bob:rx' do on a directory?",
        options: [
            "Creates a default user entry for bob, which will be inherited by new files",
            "Gives bob rx on the directory only",
            "Denies bob",
            "Sets a mask"
        ],
        correctAnswer: "Creates a default user entry for bob, which will be inherited by new files",
        explanation: "Default entries are inherited.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m04',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "If a file has 'u:bob:rwx' but the mask is 'r--', what effective permissions does bob get?",
        options: ["r--", "rwx", "---", "r-x"],
        correctAnswer: "r--",
        explanation: "Effective permissions are the intersection of entry and mask.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m05',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How do you prevent default ACLs from being applied to a specific file?',
        options: [
            "Remove default ACLs before creation, or create the file then use setfacl -x",
            "Not possible",
            "Use chmod",
            "Set ACL on /"
        ],
        correctAnswer: "Remove default ACLs before creation, or create the file then use setfacl -x",
        explanation: "Default ACLs are applied at creation time; you can modify afterwards.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m06',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Which command shows only the effective permissions of an ACL entry?',
        options: [
            "getfacl file | grep effective",
            "setfacl --effective",
            "lsfacl",
            "Not possible"
        ],
        correctAnswer: "getfacl file | grep effective",
        explanation: "getfacl comments contain #effective:... when different.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m07',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "How do you change the ACL of a file to exactly match a file's base permissions?",
        options: [
            "setfacl --remove-all file",
            "setfacl -b file; then setfacl -m u::rw,g::r,o::r file",
            "chmod 644 file",
            "Both B and C"
        ],
        correctAnswer: "Both B and C",
        explanation: "Both removing ACLs and setting the base entries work.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m08',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What happens if you try to apply an ACL that the file system doesn\'t support?',
        options: [
            "Operation not supported error",
            "Silent ignore",
            "The file becomes read-only",
            "System crash"
        ],
        correctAnswer: "Operation not supported error",
        explanation: "An explicit error is returned.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m09',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How do you give a user write permission on a file without changing the group permission mask?',
        options: [
            "setfacl -m u:user:w file",
            "chown user file",
            "chmod g+w file",
            "Not possible because mask will change"
        ],
        correctAnswer: "setfacl -m u:user:w file",
        explanation: "Adding a named user entry sets it; mask may need adjustment.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m10',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you view the full ACL of a directory recursively?',
        options: [
            "getfacl -R dir",
            "getfacl -r dir",
            "ls -R | getfacl",
            "find dir -exec getfacl {} \\;"
        ],
        correctAnswer: "getfacl -R dir",
        explanation: "getfacl -R works recursively.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m11',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What is the purpose of the 'mask' in ACLs?",
        options: [
            "It restricts the maximum permissions for all named users and groups if set",
            "It sets file attributes",
            "It encrypts the ACL",
            "It logs accesses"
        ],
        correctAnswer: "It restricts the maximum permissions for all named users and groups if set",
        explanation: "Mask limits effective permissions.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m12',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What is the default ACL mask?',
        options: ["Same as the group permissions", "Always rwx", "None", "Same as owner"],
        correctAnswer: "Same as the group permissions",
        explanation: "The mask is initialized from the group permissions when ACLs are first set.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m13',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you restore standard permissions after removing ACLs?',
        options: ["setfacl -b file", "chmod 644 file", "Both A and B", "Only chown"],
        correctAnswer: "Both A and B",
        explanation: "setfacl -b removes ACLs; chmod sets base permissions.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m14',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Which command sets a default ACL for a group with execute permission?',
        options: ["setfacl -m d:g:devs:rx /dir", "setfacl -m g:devs:rx /dir", "setfacl -d g:devs:rx /dir", "acldefault g:devs:rx /dir"],
        correctAnswer: "setfacl -m d:g:devs:rx /dir",
        explanation: "The d: prefix indicates default.",
        difficulty: 'medium'
    },
    {
        id: 't2c04_m15',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How do you apply ACLs recursively and also set default ACLs?',
        options: [
            "setfacl -R -m u:bob:rw dir/ and setfacl -R -m d:u:bob:rw dir/",
            "Only one command needed",
            "Not possible",
            "Use setfacl -B"
        ],
        correctAnswer: "setfacl -R -m u:bob:rw dir/ and setfacl -R -m d:u:bob:rw dir/",
        explanation: "Run two commands: one for existing entries, one for default.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c04_h01',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "How does the ACL mask interact with the group permission in 'ls -l'?",
        options: [
            "changing the group permission via chmod also changes the ACL mask",
            "They are independent",
            "The mask replaces the group permission",
            "The mask is a second group"
        ],
        correctAnswer: "changing the group permission via chmod also changes the ACL mask",
        explanation: "The group class permissions and the mask are linked.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h02',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you set an ACL that denies a specific user even if they belong to a group with access?',
        options: [
            "setfacl -m u:user:--- file",
            "add a deny ACL (not standard POSIX but a mask trick)",
            "Use 'nfs4_setfacl' for NFSv4",
            "Both A and C"
        ],
        correctAnswer: "setfacl -m u:user:--- file",
        explanation: "Setting an explicit user::--- entry will override group permissions for that user.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h03',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What is the difference between POSIX ACLs and NFSv4 ACLs?',
        options: [
            "POSIX ACLs are simpler (user/group/mask); NFSv4 is more granular with allow/deny",
            "No difference",
            "NFSv4 is Windows only",
            "POSIX ACLs don't support deny"
        ],
        correctAnswer: "POSIX ACLs are simpler (user/group/mask); NFSv4 is more granular with allow/deny",
        explanation: "NFSv4 ACLs are richer and support explicit deny entries.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h04',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you efficiently back up ACLs for an entire directory tree?',
        options: [
            "getfacl -R /path > acl_backup.txt",
            "tar --acls",
            "setfacl -R --save",
            "Both A and B"
        ],
        correctAnswer: "Both A and B",
        explanation: "getfacl -R captures ACLs; tar --acls also preserves them.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h05',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How does the default ACL mask get set?',
        options: [
            "It is set to the same as the directory's mask at creation time",
            "It is always rwx",
            "From the umask",
            "System default"
        ],
        correctAnswer: "It is set to the same as the directory's mask at creation time",
        explanation: "The default mask mirrors the directory mask unless explicitly changed.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h06',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What happens if you set a default ACL on a file?',
        options: [
            "Error: default ACLs can only be set on directories",
            "It applies to the file",
            "It silently does nothing",
            "It becomes a regular ACL"
        ],
        correctAnswer: "Error: default ACLs can only be set on directories",
        explanation: "Default ACLs are specifically for directories.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h07',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you add an ACL that grants read permission to all members of a group except one?',
        options: [
            "Set group ACL, then add a specific user ACL with --- for that user (since POSIX ACLs don't support explicit deny)",
            "Use NFSv4 ACLs",
            "Not possible",
            "Use deny:u:user"
        ],
        correctAnswer: "Set group ACL, then add a specific user ACL with --- for that user (since POSIX ACLs don't support explicit deny)",
        explanation: "You work around by giving the group, then denying the specific user via explicit entry.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h08',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How does the kernel enforce the ACL mask?',
        options: [
            "It ANDs the mask with the entry permission bits",
            "It replaces the entry",
            "It acts after the group check",
            "It's just advisory"
        ],
        correctAnswer: "It ANDs the mask with the entry permission bits",
        explanation: "Effective permissions = entry & mask.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h09',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Can you have both an ACL user entry and a group entry for the same entity?',
        options: [
            "Yes, but only one takes effect depending on the process's credentials",
            "No, only one",
            "Yes, both are summed",
            "Only for root"
        ],
        correctAnswer: "Yes, but only one takes effect depending on the process's credentials",
        explanation: "User-specific ACLs override group ACLs for that user.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h10',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What tool can restore ACLs from a backup file generated by getfacl -R?',
        options: ["setfacl --restore=file", "getfacl --restore", "aclrestore", "setfacl -R --from-file"],
        correctAnswer: "setfacl --restore=file",
        explanation: "setfacl --restore reads the backup.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h11',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "How do you set a file's ACL to be exactly the same as another file without copying the content?",
        options: [
            "getfacl source | setfacl --set-file=- target",
            "cp --preserve=acl source target",
            "Both A and B",
            "Only chmod"
        ],
        correctAnswer: "Both A and B",
        explanation: "Both methods work.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h12',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'What is the maximum number of ACL entries?',
        options: [
            "Limited by filesystem and kernel, typically up to 32 or more",
            "Unlimited",
            "Exactly 10",
            "16"
        ],
        correctAnswer: "Limited by filesystem and kernel, typically up to 32 or more",
        explanation: "There is a practical limit, but it's generous.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h13',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'How can you find all files with ACLs on the system?',
        options: [
            "find / -type f -exec ls -l {} \\; 2>/dev/null | grep '+'",
            "getfacl -R /",
            "aclfind",
            "ls -R / | grep acl"
        ],
        correctAnswer: "find / -type f -exec ls -l {} \\; 2>/dev/null | grep '+'",
        explanation: "Looking for the + symbol is a common trick.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h14',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: "What does 'setfacl --remove-default' do?",
        options: ["Removes the default ACLs from a directory", "Removes all ACLs", "Sets default ACL", "Nothing"],
        correctAnswer: "Removes the default ACLs from a directory",
        explanation: "Only removes default entries.",
        difficulty: 'hard'
    },
    {
        id: 't2c04_h15',
        chapterId: 'track2-ch04',
        type: 'mcq',
        question: 'Why might ACLs be preferred over creating multiple groups?',
        options: [
            "ACLs are more granular without needing admin-created groups",
            "Groups are deprecated",
            "ACLs are faster",
            "ACLs use less memory"
        ],
        correctAnswer: "ACLs are more granular without needing admin-created groups",
        explanation: "ACLs allow per-user/per-group control without system-wide group changes.",
        difficulty: 'hard'
    }
];
