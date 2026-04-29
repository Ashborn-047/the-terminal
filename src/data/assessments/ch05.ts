import { ChapterAssessment } from '../features/lab-engine/providers/QuestionProvider';

export const ch05Assessment: ChapterAssessment[] = [
    // --- Chapter 5: Managing Local Users and Groups ---
    {
        id: "ch05-e01",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command creates a new user?",
        options: ["useradd", "adduser", "newuser", "createuser"],
        correctAnswer: "useradd",
        hint: "useradd is the standard command to create a user account."
    },
    {
        id: "ch05-e02",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which file stores user account information?",
        options: ["/etc/shadow", "/etc/passwd", "/etc/users", "/etc/accounts"],
        correctAnswer: "/etc/passwd",
        hint: "/etc/passwd holds user account definitions."
    },
    {
        id: "ch05-e03",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you set or change a user's password?",
        options: ["password user", "passwd user", "setpass user", "pwd user"],
        correctAnswer: "passwd user",
        hint: "passwd sets or updates a user's password."
    },
    {
        id: "ch05-e04",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command deletes a user?",
        options: ["deluser", "userdel", "rmuser", "deleteuser"],
        correctAnswer: "userdel",
        hint: "userdel removes a user account."
    },
    {
        id: "ch05-e05",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'su - bob' do?",
        options: [
          "Switches to user bob with full login environment",
          "Gives bob superuser privileges",
          "Starts a new shell as root",
          "Locks bob's account"
        ],
        correctAnswer: "Switches to user bob with full login environment",
        hint: "su - switches user and loads their login environment."
    },
    {
        id: "ch05-e06",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which file stores encrypted passwords?",
        options: ["/etc/passwd", "/etc/shadow", "/etc/secret", "/etc/encrypt"],
        correctAnswer: "/etc/shadow",
        hint: "/etc/shadow stores password hashes securely."
    },
    {
        id: "ch05-e07",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which group typically grants sudo access on RHEL?",
        options: ["sudo", "wheel", "admin", "root"],
        correctAnswer: "wheel",
        hint: "The wheel group grants sudo privileges on RHEL-based systems."
    },
    {
        id: "ch05-e08",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you modify a user's properties?",
        options: ["usermod", "useradd", "moduser", "chuser"],
        correctAnswer: "usermod",
        hint: "usermod modifies existing user accounts."
    },
    {
        id: "ch05-e09",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command creates a new group?",
        options: ["groupadd", "addgroup", "newgroup", "creategroup"],
        correctAnswer: "groupadd",
        hint: "groupadd creates a new group."
    },
    {
        id: "ch05-e10",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'userdel -r bob' do?",
        options: [
          "Removes bob and their home directory",
          "Renames bob",
          "Locks bob's account",
          "Removes only bob's home directory"
        ],
        correctAnswer: "Removes bob and their home directory",
        hint: "-r removes the user's home directory and mail spool."
    },
    {
        id: "ch05-e11",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command shows group memberships for a user?",
        options: ["groups user", "id user", "whoami", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "Both groups and id display group memberships."
    },
    {
        id: "ch05-e12",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the UID of the root user?",
        options: ["0", "1", "1000", "999"],
        correctAnswer: "0",
        hint: "Root always has UID 0."
    },
    {
        id: "ch05-e13",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you add a user to a supplementary group without removing existing ones?",
        options: ["usermod -G group user", "usermod -aG group user", "usermod -g group user", "groupmod -a user group"],
        correctAnswer: "usermod -aG group user",
        hint: "-aG appends the user to the group."
    },
    {
        id: "ch05-e14",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which file defines group memberships?",
        options: ["/etc/group", "/etc/passwd", "/etc/groups", "/etc/shadow"],
        correctAnswer: "/etc/group",
        hint: "/etc/group contains group definitions and members."
    },
    {
        id: "ch05-e15",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'sudo' stand for?",
        options: ["Super User Do", "System User Domain", "Switch User Domain", "Secure User Do"],
        correctAnswer: "Super User Do",
        hint: "sudo = superuser do."
    },
    {
        id: "ch05-m01",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the difference between 'su' and 'su -'?",
        options: [
          "su - loads the target user's full environment; su keeps the current one",
          "No difference",
          "su - is for root only",
          "su changes the shell"
        ],
        correctAnswer: "su - loads the target user's full environment; su keeps the current one",
        hint: "The dash gives you the user's login environment (PATH, home, etc.)."
    },
    {
        id: "ch05-m02",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'usermod -L bob' do?",
        options: [
          "Locks bob's account by prefixing password with !",
          "Deletes bob",
          "Logs bob out",
          "Lists bob's details"
        ],
        correctAnswer: "Locks bob's account by prefixing password with !",
        hint: "-L locks the account; -U unlocks."
    },
    {
        id: "ch05-m03",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which command forces a password change on next login?",
        options: ["passwd -e user", "passwd -f user", "chage -d 0 user", "Both A and C"],
        correctAnswer: "Both A and C",
        hint: "Both expire the password immediately."
    },
    {
        id: "ch05-m04",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does the 'x' in the password field of /etc/passwd mean?",
        options: [
          "User has no password",
          "Password is stored in /etc/shadow",
          "Account is locked",
          "Password is expired"
        ],
        correctAnswer: "Password is stored in /etc/shadow",
        hint: "x indicates the encrypted password is in /etc/shadow."
    },
    {
        id: "ch05-m05",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you check which user you are currently logged in as?",
        options: ["whoami", "id", "who", "All of the above"],
        correctAnswer: "All of the above",
        hint: "All show the current user in different formats."
    },
    {
        id: "ch05-m06",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'gpasswd -a bob developers' do?",
        options: [
          "Adds bob to the developers group",
          "Changes bob's password",
          "Creates a group called developers",
          "Removes bob from developers"
        ],
        correctAnswer: "Adds bob to the developers group",
        hint: "gpasswd -a adds a user to a group."
    },
    {
        id: "ch05-m07",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the purpose of the /etc/skel directory?",
        options: [
          "Skeleton files copied to new users' home directories",
          "System kernel logs",
          "User skeleton processes",
          "Temporary files"
        ],
        correctAnswer: "Skeleton files copied to new users' home directories",
        hint: "/etc/skel contains default config files copied to ~ on creation."
    },
    {
        id: "ch05-m08",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you list all users currently logged in?",
        options: ["who", "w", "users", "All of the above"],
        correctAnswer: "All of the above",
        hint: "All three commands show logged-in users."
    },
    {
        id: "ch05-m09",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'useradd -s /sbin/nologin bob' do?",
        options: [
          "Creates bob without login shell access",
          "Creates bob with default shell",
          "Deletes bob's shell",
          "Changes bob's shell later"
        ],
        correctAnswer: "Creates bob without login shell access",
        hint: "Setting the shell to /sbin/nologin prevents interactive login."
    },
    {
        id: "ch05-m10",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "Which UID range do normal user accounts typically start from?",
        options: ["0", "500", "1000", "10000"],
        correctAnswer: "1000",
        hint: "Most distros assign UIDs starting at 1000; some (older RHEL) start at 500."
    },
    {
        id: "ch05-m11",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you remove a user from a group?",
        options: ["gpasswd -d user group", "usermod -r group user", "groupmod -r user group", "deluser group user"],
        correctAnswer: "gpasswd -d user group",
        hint: "gpasswd -d removes a user from a specific group."
    },
    {
        id: "ch05-m12",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What command edits the sudoers file safely?",
        options: ["visudo", "nano /etc/sudoers", "vim /etc/sudoers", "sudoedit"],
        correctAnswer: "visudo",
        hint: "visudo checks syntax before saving, preventing lockouts."
    },
    {
        id: "ch05-m13",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'chage -l bob' display?",
        options: [
          "Password aging information for bob",
          "Bob's login history",
          "Bob's group memberships",
          "Bob's file permissions"
        ],
        correctAnswer: "Password aging information for bob",
        hint: "chage -l lists password expiry and aging details."
    },
    {
        id: "ch05-m14",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the primary group vs supplementary groups?",
        options: [
          "Primary group is listed in /etc/passwd; supplementary in /etc/group",
          "They are the same",
          "Primary groups have more permissions",
          "Supplementary groups are for sudo only"
        ],
        correctAnswer: "Primary group is listed in /etc/passwd; supplementary in /etc/group",
        hint: "Each user has one primary GID and can belong to multiple supplementary groups."
    },
    {
        id: "ch05-m15",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you see all users in the system?",
        options: ["cat /etc/passwd", "getent passwd", "ls /home", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "Both cat and getent display user entries."
    },
    {
        id: "ch05-h01",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the correct way to give a user sudo access to only restart a specific service?",
        options: [
          "Add to wheel group",
          "Add a specific entry in /etc/sudoers via visudo",
          "Change the user's UID to 0",
          "Use 'sudo --limited' command"
        ],
        correctAnswer: "Add a specific entry in /etc/sudoers via visudo",
        hint: "sudoers can be configured to limit specific users to specific commands."
    },
    {
        id: "ch05-h02",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'useradd -u 1500 -g developers -G wheel,video -d /opt/bob -s /bin/zsh bob' do?",
        options: [
          "Creates bob with specific UID, primary group, supplementary groups, home, and shell",
          "Fails because too many options",
          "Creates a system user",
          "Modifies existing bob"
        ],
        correctAnswer: "Creates bob with specific UID, primary group, supplementary groups, home, and shell",
        hint: "All those options are valid and set the respective attributes."
    },
    {
        id: "ch05-h03",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the difference between locking an account with 'passwd -l' and 'usermod -L'?",
        options: [
          "No difference — both prefix password with !",
          "passwd -l also expires the account",
          "usermod -L deletes the password",
          "They use different lock files"
        ],
        correctAnswer: "No difference — both prefix password with !",
        hint: "Both do the same: add ! to the password hash in /etc/shadow."
    },
    {
        id: "ch05-h04",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How would you set a user's account to expire on a specific date?",
        options: ["chage -E YYYY-MM-DD user", "usermod -e YYYY-MM-DD user", "passwd -x user", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "Both chage -E and usermod -e set account expiration date."
    },
    {
        id: "ch05-h05",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the effect of setting a user's shell to /bin/false vs /sbin/nologin?",
        options: [
          "/bin/false exits immediately; /sbin/nologin prints a message and exits",
          "No difference",
          "/bin/false allows FTP access",
          "/sbin/nologin is only for system accounts"
        ],
        correctAnswer: "/bin/false exits immediately; /sbin/nologin prints a message and exits",
        hint: "nologin is friendlier, displaying a message; false just exits."
    },
    {
        id: "ch05-h06",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How does 'useradd -D' work?",
        options: [
          "Displays or changes default values for new users",
          "Deletes a user",
          "Disables a user",
          "Duplicates a user"
        ],
        correctAnswer: "Displays or changes default values for new users",
        hint: "useradd -D shows the default settings from /etc/default/useradd."
    },
    {
        id: "ch05-h07",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What happens if you delete a group that is a user's primary group?",
        options: [
          "The command fails because the user still references it",
          "The user is deleted too",
          "The group is deleted and the user gets UID as GID",
          "Nothing happens"
        ],
        correctAnswer: "The command fails because the user still references it",
        hint: "groupdel won't remove a group that is any user's primary group."
    },
    {
        id: "ch05-h08",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the purpose of the 'nobody' user?",
        options: [
          "An unprivileged account for running services with minimal rights",
          "A guest account",
          "The root backup account",
          "A debugging account"
        ],
        correctAnswer: "An unprivileged account for running services with minimal rights",
        hint: "nobody has very low privileges, used for unprivileged processes."
    },
    {
        id: "ch05-h09",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you list all members of a group, including primary group members?",
        options: [
          "grep group /etc/group",
          "getent group groupname",
          "lid -g groupname",
          "All require combining primary and supplementary lookups"
        ],
        correctAnswer: "All require combining primary and supplementary lookups",
        hint: "No single command shows both primary and supplementary members easily."
    },
    {
        id: "ch05-h10",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the 'sticky bit' on /tmp related to?",
        options: [
          "Prevents users from deleting files owned by others",
          "Makes files executable",
          "Anonymous access",
          "Memory management"
        ],
        correctAnswer: "Prevents users from deleting files owned by others",
        hint: "Sticky bit on /tmp only lets file owners delete their own files."
    },
    {
        id: "ch05-h11",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What does 'pwconv' do?",
        options: [
          "Converts passwords from /etc/passwd to /etc/shadow",
          "Converts user accounts to groups",
          "Synchronizes password files",
          "Creates password hashes"
        ],
        correctAnswer: "Converts passwords from /etc/passwd to /etc/shadow",
        hint: "pwconv moves passwords to shadow and updates passwd with x."
    },
    {
        id: "ch05-h12",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How would you temporarily disable a user account for 30 days?",
        options: [
          "chage -E $(date -d '+30 days' +%F) user",
          "passwd -l user; sleep 30d; passwd -u user",
          "usermod -e +30 user",
          "You cannot set temporary expirations"
        ],
        correctAnswer: "chage -E $(date -d '+30 days' +%F) user",
        hint: "Setting an expiry date effectively disables the account after that date."
    },
    {
        id: "ch05-h13",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the difference between a system user and a regular user?",
        options: [
          "System users typically have UID < 1000 and no login shell",
          "System users have more permissions",
          "Regular users can't run services",
          "No difference"
        ],
        correctAnswer: "System users typically have UID < 1000 and no login shell",
        hint: "System users run services and typically have restricted shells."
    },
    {
        id: "ch05-h14",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "How do you find which users have no password set?",
        options: [
          "awk -F: '($2 == \"\") {print $1}' /etc/shadow",
          "passwd -S -a | grep NP",
          "cat /etc/passwd | grep '::'",
          "Both A and B"
        ],
        correctAnswer: "awk -F: '($2 == \"\") {print $1}' /etc/shadow",
        hint: "Checking /etc/shadow for empty password fields reveals passwordless accounts."
    },
    {
        id: "ch05-h15",
        chapterId: "track1-ch05",
        type: "mcq",
        question: "What is the 'vipw' command used for?",
        options: [
          "Safely editing /etc/passwd or /etc/shadow with locking",
          "Viewing password files",
          "Validating user input",
          "Very important password warning"
        ],
        correctAnswer: "Safely editing /etc/passwd or /etc/shadow with locking",
        hint: "vipw locks the password files while editing, preventing corruption."
    }
];
