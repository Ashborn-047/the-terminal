import { ChapterAssessment } from '../features/lab-engine/providers/QuestionProvider';

export const ch06Assessment: ChapterAssessment[] = [
    // --- Chapter 6: Controlling Access to Files ---
    {
        id: "ch06-e01",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'ls -l' display in its first column?",
        options: ["File size", "File permissions and type", "Owner name", "Modification date"],
        correctAnswer: "File permissions and type",
        hint: "The first column shows permissions like -rw-r--r--."
    },
    {
        id: "ch06-e02",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "In 'rw-r--r--', what can the owner do?",
        options: ["Read and write", "Only read", "Read, write, and execute", "Nothing"],
        correctAnswer: "Read and write",
        hint: "rw- means read and write, but not execute."
    },
    {
        id: "ch06-e03",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Which command changes file permissions?",
        options: ["chown", "chmod", "chgrp", "ls"],
        correctAnswer: "chmod",
        hint: "chmod modifies file permissions."
    },
    {
        id: "ch06-e04",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod 755 file' do?",
        options: [
          "rwxr-xr-x",
          "rw-r--r--",
          "rwxrwxrwx",
          "r--r--r--"
        ],
        correctAnswer: "rwxr-xr-x",
        hint: "7=rwx for owner, 5=r-x for group and others."
    },
    {
        id: "ch06-e05",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Which command changes file ownership?",
        options: ["chmod", "chown", "chgrp", "own"],
        correctAnswer: "chown",
        hint: "chown changes the user and/or group owner."
    },
    {
        id: "ch06-e06",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'r' mean on a file?",
        options: ["Remove", "Read", "Run", "Root"],
        correctAnswer: "Read",
        hint: "r grants read access."
    },
    {
        id: "ch06-e07",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'x' mean on a directory?",
        options: [
          "Delete the directory",
          "Enter the directory (cd)",
          "List files in the directory",
          "Nothing"
        ],
        correctAnswer: "Enter the directory (cd)",
        hint: "Execute on a directory allows you to cd into it."
    },
    {
        id: "ch06-e08",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the numeric value for rwx?",
        options: ["6", "7", "5", "4"],
        correctAnswer: "7",
        hint: "4(r)+2(w)+1(x) = 7."
    },
    {
        id: "ch06-e09",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod g-w file' do?",
        options: [
          "Removes write permission for group",
          "Adds write for group",
          "Removes group ownership",
          "Writes to the file"
        ],
        correctAnswer: "Removes write permission for group",
        hint: "g-w removes write permission from the group."
    },
    {
        id: "ch06-e10",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is umask?",
        options: [
          "Default permission mask for new files",
          "Maximum permissions",
          "A user mask",
          "A file type"
        ],
        correctAnswer: "Default permission mask for new files",
        hint: "umask subtracts from default maximum permissions."
    },
    {
        id: "ch06-e11",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chown alice file' do?",
        options: [
          "Changes file owner to alice",
          "Changes file group to alice",
          "Creates user alice",
          "Deletes user alice"
        ],
        correctAnswer: "Changes file owner to alice",
        hint: "chown sets the owner of the file."
    },
    {
        id: "ch06-e12",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Which command changes group ownership?",
        options: ["chown", "chmod", "chgrp", "groupmod"],
        correctAnswer: "chgrp",
        hint: "chgrp changes group ownership; chown can also do it with :group."
    },
    {
        id: "ch06-e13",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What permission does '6' in octal represent?",
        options: ["rwx", "rw-", "r-x", "r--"],
        correctAnswer: "rw-",
        hint: "6 = 4(r) + 2(w) = rw-."
    },
    {
        id: "ch06-e14",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does the first character 'd' mean in 'drwxr-xr-x'?",
        options: ["Device", "Directory", "Deleted", "Data"],
        correctAnswer: "Directory",
        hint: "d indicates a directory."
    },
    {
        id: "ch06-e15",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod a+x script' do?",
        options: [
          "Makes script executable for everyone",
          "Archives the script",
          "Removes execute permissions",
          "Appends to the script"
        ],
        correctAnswer: "Makes script executable for everyone",
        hint: "a+x adds execute permission for all (user, group, others)."
    },
    {
        id: "ch06-m01",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the result of 'chmod 640 file'?",
        options: ["rw-r-----", "rw-r--r--", "rwxr-----", "r--------"],
        correctAnswer: "rw-r-----",
        hint: "Owner rw- (6), group r-- (4), others --- (0)."
    },
    {
        id: "ch06-m02",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How do you add execute for the owner using symbolic notation?",
        options: ["chmod u+x file", "chmod o+x file", "chmod g+x file", "chmod +x file"],
        correctAnswer: "chmod u+x file",
        hint: "u+x targets the user (owner) specifically."
    },
    {
        id: "ch06-m03",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chown :developers file' do?",
        options: [
          "Changes group to developers, leaves owner unchanged",
          "Changes owner to developers",
          "Creates group developers",
          "Deletes group developers"
        ],
        correctAnswer: "Changes group to developers, leaves owner unchanged",
        hint: "The colon-prefix syntax changes only the group."
    },
    {
        id: "ch06-m04",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "With umask 022, what permissions do new files get?",
        options: ["644", "755", "600", "777"],
        correctAnswer: "644",
        hint: "666 - 022 = 644 (rw-r--r--)."
    },
    {
        id: "ch06-m05",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the sticky bit used for?",
        options: [
          "Prevents users from deleting files they don't own in shared directories",
          "Makes files sticky",
          "Locks files",
          "Encrypts files"
        ],
        correctAnswer: "Prevents users from deleting files they don't own in shared directories",
        hint: "Sticky bit on /tmp prevents deletion of others' files."
    },
    {
        id: "ch06-m06",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does SUID on an executable do?",
        options: [
          "Runs the program with the owner's effective UID",
          "Runs the program with the root's UID",
          "Deletes the program after execution",
          "Makes it setuid root only"
        ],
        correctAnswer: "Runs the program with the owner's effective UID",
        hint: "SUID makes the program run as the file owner, not the caller."
    },
    {
        id: "ch06-m07",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How is SGID represented in octal with the extra leading digit?",
        options: ["4", "2", "1", "0"],
        correctAnswer: "2",
        hint: "4=SUID, 2=SGID, 1=Sticky."
    },
    {
        id: "ch06-m08",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod u=rwx,go=r file' set?",
        options: ["rwxr--r--", "rwxr-xr-x", "rwxrwxrwx", "r--------"],
        correctAnswer: "rwxr--r--",
        hint: "Owner gets rwx, group and others get only r."
    },
    {
        id: "ch06-m09",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Why does 'chmod -R 777 /' destroy a system?",
        options: [
          "It makes everything world-writable and removes security restrictions",
          "It deletes all files",
          "It only changes directory permissions",
          "It's a harmless command"
        ],
        correctAnswer: "It makes everything world-writable and removes security restrictions",
        hint: "Recursive 777 opens all files to everyone, breaking security everywhere."
    },
    {
        id: "ch06-m10",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Who can change file ownership?",
        options: ["Only root", "The file owner", "Any user", "Anyone in the same group"],
        correctAnswer: "Only root",
        hint: "Only root can use chown. This prevents users from hiding files by giving them away."
    },
    {
        id: "ch06-m11",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the numeric value for permissions 'r-x'?",
        options: ["5", "6", "4", "7"],
        correctAnswer: "5",
        hint: "4(r)+1(x) = 5."
    },
    {
        id: "ch06-m12",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod -R g+w dir/' do?",
        options: [
          "Adds group write recursively to all files and subdirectories",
          "Removes group write",
          "Changes group ownership",
          "Deletes the directory"
        ],
        correctAnswer: "Adds group write recursively to all files and subdirectories",
        hint: "-R makes the change recursive."
    },
    {
        id: "ch06-m13",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "If a directory has permissions 'drwx------', what can others do?",
        options: ["Nothing", "List files", "Enter it", "Delete it"],
        correctAnswer: "Nothing",
        hint: "Others have no permissions at all."
    },
    {
        id: "ch06-m14",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the difference between 'chmod 755' and 'chmod 0755'?",
        options: [
          "Identical — leading zero is optional",
          "0755 is sticky",
          "755 is invalid",
          "0755 clears special bits"
        ],
        correctAnswer: "0755 clears special bits",
        hint: "Leading 0 explicitly clears SUID/SGID/Sticky bits."
    },
    {
        id: "ch06-m15",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How do you copy permissions from one file to another?",
        options: [
          "chmod --reference=source target",
          "cp --permissions",
          "chmod --copy",
          "getfacl source | setfacl --restore"
        ],
        correctAnswer: "chmod --reference=source target",
        hint: "--reference copies the permission bits."
    },
    {
        id: "ch06-h01",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'find / -perm -4000' do?",
        options: [
          "Finds all SUID files",
          "Finds files with 4000 permissions",
          "Finds directories",
          "Finds files larger than 4000 bytes"
        ],
        correctAnswer: "Finds all SUID files",
        hint: "-perm -4000 matches files with SUID bit set."
    },
    {
        id: "ch06-h02",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the security risk of a SUID shell script?",
        options: [
          "Race conditions and environment manipulation can escalate privileges",
          "No risk",
          "Shell scripts can't be SUID",
          "It can only be run by root"
        ],
        correctAnswer: "Race conditions and environment manipulation can escalate privileges",
        hint: "SUID scripts are dangerous due to TOCTOU and environment attacks."
    },
    {
        id: "ch06-h03",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod 4755 program' do?",
        options: [
          "Sets SUID + rwxr-xr-x",
          "Makes it world-readable",
          "Deletes the program",
          "Locks the program"
        ],
        correctAnswer: "Sets SUID + rwxr-xr-x",
        hint: "The leading 4 sets SUID; 755 is rwxr-xr-x."
    },
    {
        id: "ch06-h04",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How would you make a directory where only the file owner can delete their own files?",
        options: ["chmod +t dir", "chmod 777 dir", "chown root dir", "chmod 755 dir"],
        correctAnswer: "chmod +t dir",
        hint: "The sticky bit (+t or 1 in leading octal) enables this."
    },
    {
        id: "ch06-h05",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does the 't' at the end of permissions like 'rwxrwxrwt' mean?",
        options: [
          "Sticky bit is set and others have execute",
          "The file is temporary",
          "The file is truncated",
          "Text file"
        ],
        correctAnswer: "Sticky bit is set and others have execute",
        hint: "Lowercase t means sticky bit + execute; capital T means sticky without execute."
    },
    {
        id: "ch06-h06",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the effect of setting the SGID bit on a directory?",
        options: [
          "New files inside inherit the directory's group",
          "New files are executable",
          "The directory is deleted after use",
          "Nothing"
        ],
        correctAnswer: "New files inside inherit the directory's group",
        hint: "SGID on a directory forces group inheritance."
    },
    {
        id: "ch06-h07",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How do you find world-writable files?",
        options: [
          "find / -perm -2 -type f",
          "find / -perm 777",
          "find / -writable",
          "ls -lR | grep 'w'"
        ],
        correctAnswer: "find / -perm -2 -type f",
        hint: "-perm -2 matches the 'write for others' bit."
    },
    {
        id: "ch06-h08",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does 'chmod u+s,g+s,o+t dir' do?",
        options: [
          "Sets SUID, SGID, and sticky on dir",
          "Makes dir world-writable",
          "Deletes dir",
          "Changes owner"
        ],
        correctAnswer: "Sets SUID, SGID, and sticky on dir",
        hint: "All three special bits are set."
    },
    {
        id: "ch06-h09",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "Why might 'chmod 600 ~/.ssh/id_rsa' be necessary?",
        options: [
          "SSH refuses to use private keys with group/other permissions",
          "It makes the key faster",
          "It encrypts the key",
          "It's just a convention"
        ],
        correctAnswer: "SSH refuses to use private keys with group/other permissions",
        hint: "SSH requires private keys to be readable only by the owner."
    },
    {
        id: "ch06-h10",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What happens if you remove execute permission from /bin/ls?",
        options: [
          "Normal users can't run ls anymore",
          "Only root can run ls",
          "Nothing",
          "ls becomes a text file"
        ],
        correctAnswer: "Normal users can't run ls anymore",
        hint: "Without execute, the file can't be run as a program."
    },
    {
        id: "ch06-h11",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the purpose of the 'setfacl' command?",
        options: [
          "Sets Access Control Lists for finer-grained permissions",
          "Sets file attributes",
          "Changes file ownership",
          "Formats disks"
        ],
        correctAnswer: "Sets Access Control Lists for finer-grained permissions",
        hint: "ACLs allow more than just owner/group/others permissions."
    },
    {
        id: "ch06-h12",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How would you prevent users from listing each other's home directories while still allowing access?",
        options: [
          "chmod 711 /home/*",
          "chmod 700 /home/*",
          "chmod 755 /home/*",
          "chmod 777 /home/*"
        ],
        correctAnswer: "chmod 711 /home/*",
        hint: "711 gives rwx--x--x: you can enter and access files if you know the name, but can't list."
    },
    {
        id: "ch06-h13",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What does the 'S' (capital S) in SUID position mean?",
        options: [
          "SUID is set but execute is not set for the owner",
          "SUID is disabled",
          "The file is special",
          "Sticky bit"
        ],
        correctAnswer: "SUID is set but execute is not set for the owner",
        hint: "Capital S means SUID without execute — unusual and usually a mistake."
    },
    {
        id: "ch06-h14",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "How does umask 007 differ from umask 077?",
        options: [
          "077 blocks all group/other access; 007 blocks only other access",
          "No difference",
          "007 is more restrictive",
          "077 blocks only group"
        ],
        correctAnswer: "077 blocks all group/other access; 007 blocks only other access",
        hint: "The digits are owner/group/others; 007 removes nothing from owner, nothing from group, everything from others."
    },
    {
        id: "ch06-h15",
        chapterId: "track1-ch06",
        type: "mcq",
        question: "What is the purpose of 'chattr +i file'?",
        options: [
          "Makes the file immutable — cannot be modified, deleted, or renamed",
          "Inherits permissions",
          "Interactively edits",
          "Increases inode count"
        ],
        correctAnswer: "Makes the file immutable — cannot be modified, deleted, or renamed",
        hint: "The immutable attribute protects critical files from accidental modification."
    }
];
