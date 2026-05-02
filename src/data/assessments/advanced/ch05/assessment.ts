import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch05Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c05_e01',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'Which command shows the current SELinux mode?',
        options: ['getenforce', 'selinux', 'sestatus', 'getsebool'],
        correctAnswer: 'getenforce',
        explanation: 'getenforce returns Enforcing, Permissive, or Disabled.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e02',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'setenforce 0' do?",
        options: [
            "Switches SELinux to permissive mode",
            "Enables SELinux",
            "Disables SELinux permanently",
            "Nothing"
        ],
        correctAnswer: "Switches SELinux to permissive mode",
        explanation: "0 = Permissive; 1 = Enforcing.",
        difficulty: 'easy'
    },
    {
        id: 't2c05_e03',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How do you view the SELinux context of a file?',
        options: ['ls -Z', 'ls -l', 'stat', 'ps -Z'],
        correctAnswer: 'ls -Z',
        explanation: 'ls -Z shows the security context.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e04',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'Which command changes the SELinux type of a file temporarily?',
        options: ['chcon', 'restorecon', 'semanage', 'setsebool'],
        correctAnswer: 'chcon',
        explanation: 'chcon changes context but may not persist.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e05',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What is the purpose of \'restorecon\'?',
        options: [
            "Restores default SELinux file contexts",
            "Changes file owner",
            "Restores files from backup",
            "Enables SELinux"
        ],
        correctAnswer: "Restores default SELinux file contexts",
        explanation: "restorecon resets contexts according to policy.",
        difficulty: 'easy'
    },
    {
        id: 't2c05_e06',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How do you list all SELinux booleans?',
        options: ['getsebool -a', 'setsebool -l', 'sebool list', 'semanage boolean'],
        correctAnswer: 'getsebool -a',
        explanation: 'getsebool -a lists all booleans.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e07',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'Which flag makes a boolean change persistent?',
        options: ['-P', '-p', '-s', '-r'],
        correctAnswer: '-P',
        explanation: 'setsebool -P makes the change survive reboots.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e08',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What is the main part of an SELinux context that governs access?',
        options: ['Type', 'User', 'Role', 'Level'],
        correctAnswer: 'Type',
        explanation: 'The type (e.g., httpd_sys_content_t) is used in allow rules.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e09',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'Which file defines the SELinux mode at boot?',
        options: ['/etc/selinux/config', '/etc/selinux/enforce', '/etc/sysconfig/selinux', '/etc/selinux/mode'],
        correctAnswer: '/etc/selinux/config',
        explanation: 'The config file sets SELINUX=enforcing/permissive/disabled.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e10',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'ausearch -m avc' show?",
        options: ["SELinux denial (AVC) messages", "Audit logins", "File changes", "Network traffic"],
        correctAnswer: "SELinux denial (AVC) messages",
        explanation: "AVC = Access Vector Cache (SELinux denials).",
        difficulty: 'easy'
    },
    {
        id: 't2c05_e11',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How do you temporarily set SELinux to permissive?',
        options: ['setenforce 0', 'setenforce Permissive', 'echo 0 > /selinux/enforce', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'Both setenforce 0 and setenforce Permissive work.',
        difficulty: 'easy'
    },
    {
        id: 't2c05_e12',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'Which command adds a permanent file context rule?',
        options: [
            "semanage fcontext -a -t type '/path(/.*)?'",
            "chcon -t type /path",
            "setsebool -P",
            "restorecon -a"
        ],
        correctAnswer: "semanage fcontext -a -t type '/path(/.*)?'",
        explanation: "semanage fcontext makes the mapping permanent.",
        difficulty: 'easy'
    },
    {
        id: 't2c05_e13',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'semanage port -l' display?",
        options: ["SELinux port type assignments", "Open ports", "Firewall rules", "Network traffic"],
        correctAnswer: "SELinux port type assignments",
        explanation: "It shows which ports are assigned to which SELinux types.",
        difficulty: 'easy'
    },
    {
        id: 't2c05_e14',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does the 'unconfined_u' context typically mean?",
        options: [
            "A user not restricted by SELinux (unconfined)",
            "A process restricted",
            "A file with no context",
            "Root user"
        ],
        correctAnswer: "A user not restricted by SELinux (unconfined)",
        explanation: "Unconfined domains are not restricted by SELinux policy.",
        difficulty: 'easy'
    },
    {
        id: 't2c05_e15',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How do you see SELinux status in detail?',
        options: ['sestatus', 'getenforce', 'selinux-status', 'ls -Z /'],
        correctAnswer: 'sestatus',
        explanation: 'sestatus shows mode, policy, MLS status, etc.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c05_m01',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What is the difference between 'chcon' and 'semanage fcontext'?",
        options: [
            "chcon changes context on disk immediately; semanage changes the policy and requires restorecon",
            "No difference",
            "semanage is temporary",
            "chcon works only on directories"
        ],
        correctAnswer: "chcon changes context on disk immediately; semanage changes the policy and requires restorecon",
        explanation: "chcon is not policy‑based; semanage updates the default file context database.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m02',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How do you apply a new file context policy to existing files?',
        options: ["restorecon -Rv /path", "chcon -R", "setsebool -P", "semanage apply"],
        correctAnswer: "restorecon -Rv /path",
        explanation: "restorecon reads the policy and fixes labels.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m03',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'semanage boolean -l' do?",
        options: ["Lists all SELinux booleans with descriptions", "Sets a boolean", "Deletes a boolean", "Logs boolean changes"],
        correctAnswer: "Lists all SELinux booleans with descriptions",
        explanation: "It provides detailed info about each boolean.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m04',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you see which booleans are currently enabled?',
        options: ["getsebool -a | grep ' on'", "setsebool -l", "semanage boolean -l", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "All methods show enabled booleans.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m05',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'httpd_can_network_connect' boolean control?",
        options: [
            "Whether Apache can make outbound network connections (e.g., to a database)",
            "If Apache listens on port 80",
            "If Apache can read files",
            "If Apache runs as root"
        ],
        correctAnswer: "Whether Apache can make outbound network connections (e.g., to a database)",
        explanation: "It grants network connect privilege to the httpd domain.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m06',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'If SELinux is preventing a service from starting, what is the first step?',
        options: [
            "Check the audit log (ausearch or sealert) for AVC denials",
            "Disable SELinux",
            "Reboot",
            "Reinstall the service"
        ],
        correctAnswer: "Check the audit log (ausearch or sealert) for AVC denials",
        explanation: "The audit log tells you exactly what was blocked.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m07',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you generate a custom SELinux policy module to permit a specific action?',
        options: [
            "Use audit2allow to create a .pp module",
            "Edit /etc/selinux/policy",
            "Add allow rule to /etc/selinux/booleans",
            "Not possible"
        ],
        correctAnswer: "Use audit2allow to create a .pp module",
        explanation: "audit2allow can build a loadable module from AVC denials.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m08',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'semanage login -l' show?",
        options: [
            "Mapping of Linux users to SELinux users",
            "Logins blocked by SELinux",
            "SSH logins",
            "Sudo users"
        ],
        correctAnswer: "Mapping of Linux users to SELinux users",
        explanation: "It lists the SELinux user mapping for Linux accounts.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m09',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "Why might you use 'semanage port -a -t http_port_t -p tcp 8080'?",
        options: [
            "To allow Apache to listen on port 8080",
            "To block port 8080",
            "To open the firewall",
            "To change the SSH port"
        ],
        correctAnswer: "To allow Apache to listen on port 8080",
        explanation: "Without a port label, SELinux would block Apache from binding to 8080.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m10',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'restorecon -n' do?",
        options: [
            "Shows what changes would be made without actually applying them",
            "Removes SELinux context",
            "No operation",
            "Resets network"
        ],
        correctAnswer: "Shows what changes would be made without actually applying them",
        explanation: "-n is dry-run.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m11',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How do you change the SELinux user of a file?',
        options: ["chcon -u system_u file", "chcon -t user_u file", "semanage user -a", "restorecon -u"],
        correctAnswer: "chcon -u system_u file",
        explanation: "chcon -u changes the user part of the context.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m12',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What is the default SELinux user for most system processes?',
        options: ["system_u", "unconfined_u", "root", "user_u"],
        correctAnswer: "system_u",
        explanation: "System services run under system_u.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m13',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What happens if you delete the /etc/selinux/config file?',
        options: [
            "SELinux defaults to enforcing on next boot",
            "SELinux is disabled",
            "System won't boot",
            "Nothing"
        ],
        correctAnswer: "SELinux defaults to enforcing on next boot",
        explanation: "Without config, SELinux defaults to enforcing.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m14',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you permanently set the enforcing mode?',
        options: [
            "Edit /etc/selinux/config and set SELINUX=enforcing",
            "setenforce 1",
            "semanage mode -e",
            "tune2fs -S enforcing"
        ],
        correctAnswer: "Edit /etc/selinux/config and set SELINUX=enforcing",
        explanation: "The config file controls boot-time mode.",
        difficulty: 'medium'
    },
    {
        id: 't2c05_m15',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What is the purpose of 'fixfiles relabel'?",
        options: [
            "Relabels the entire filesystem according to policy (often done on first boot after enabling SELinux)",
            "Fixes file permissions",
            "Restores contexts incrementally",
            "Deletes SELinux labels"
        ],
        correctAnswer: "Relabels the entire filesystem according to policy (often done on first boot after enabling SELinux)",
        explanation: "Used to initialize or reset file contexts.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c05_h01',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How does SELinux decide whether to allow an access?',
        options: [
            "It checks the policy rules (allow source_type target_type:class permission)",
            "By asking the user",
            "Based on file permissions",
            "Randomly"
        ],
        correctAnswer: "It checks the policy rules (allow source_type target_type:class permission)",
        explanation: "The policy engine evaluates allow rules for type enforcement.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h02',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What is the difference between targeted policy and strict policy?',
        options: [
            "Targeted confines only specific processes; strict confines everything",
            "No difference",
            "Strict is for networking",
            "Targeted is for files only"
        ],
        correctAnswer: "Targeted confines only specific processes; strict confines everything",
        explanation: "RHEL uses the targeted policy by default.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h03',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you generate a human-readable report from AVC denials?',
        options: ["sealert -a /var/log/audit/audit.log", "audit2allow -w", "ausearch -m avc -ts recent | audit2why", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "Several tools can analyze AVCs.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h04',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'semanage fcontext -d' do?",
        options: ["Deletes a file context rule", "Lists deleted contexts", "Disables a context", "Resets context"],
        correctAnswer: "Deletes a file context rule",
        explanation: "-d removes a file context specification.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h05',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you view the SELinux policy module responsible for a denial?',
        options: [
            "Use 'audit2allow -a -m mypol' to generate a module",
            "Not possible",
            "cat /etc/selinux/policy",
            "semanage policy"
        ],
        correctAnswer: "Use 'audit2allow -a -m mypol' to generate a module",
        explanation: "audit2allow creates a policy module from AVCs.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h06',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What is a file context equivalence rule?',
        options: [
            "semanage fcontext -a -e /orig /alias makes /alias have the same context as /orig",
            "Allows two files to share ACLs",
            "Mirrors contexts",
            "Copies contexts"
        ],
        correctAnswer: "semanage fcontext -a -e /orig /alias makes /alias have the same context as /orig",
        explanation: "Equivalence maps one directory's contexts to another.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h07',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How does the MLS (Multi-Level Security) extension work?',
        options: [
            "Adds sensitivity levels (s0, s1) and categories to contexts",
            "It's the default SELinux mode",
            "It replaces type enforcement",
            "It's only for US Government"
        ],
        correctAnswer: "Adds sensitivity levels (s0, s1) and categories to contexts",
        explanation: "MLS is optional and adds hierarchical security levels.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h08',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'semanage permissive -a httpd_t' do?",
        options: [
            "Puts only the httpd_t domain into permissive mode while everything else stays enforcing",
            "Disables SELinux for httpd",
            "Makes httpd run as root",
            "Nothing"
        ],
        correctAnswer: "Puts only the httpd_t domain into permissive mode while everything else stays enforcing",
        explanation: "semanage permissive allows per-domain permissive mode.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h09',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you fully disable SELinux permanently?',
        options: [
            "Set SELINUX=disabled in /etc/selinux/config and reboot",
            "setenforce 0",
            "rm /etc/selinux",
            "systemctl disable selinux"
        ],
        correctAnswer: "Set SELINUX=disabled in /etc/selinux/config and reboot",
        explanation: "Only a config change and reboot fully disable SELinux.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h10',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'semanage boolean -m --on' do?",
        options: ["Modifies a boolean to on permanently", "Turns on all booleans", "Creates a boolean", "Deletes a boolean"],
        correctAnswer: "Modifies a boolean to on permanently",
        explanation: "-m modifies a boolean value.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h11',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'What is an SELinux role?',
        options: [
            "Part of the context that specifies which types a user can have",
            "A job function",
            "A file permission",
            "A user group"
        ],
        correctAnswer: "Part of the context that specifies which types a user can have",
        explanation: "Roles define allowed types for a user.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h12',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you see the SELinux context of a running process?',
        options: ["ps -Z", "ls -Z /proc/PID", "ps --context", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "ps -Z and ps --context show process contexts.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h13',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What does 'matchpathcon' do?",
        options: [
            "Shows the default SELinux context for a given file path",
            "Matches file permissions",
            "Matches path to file",
            "Validates file contexts"
        ],
        correctAnswer: "Shows the default SELinux context for a given file path",
        explanation: "It checks what context a file should have according to policy.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h14',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: 'How can you allow Apache to send email via SELinux?',
        options: [
            "setsebool -P httpd_can_sendmail on",
            "chcon -t mail_t httpd",
            "semanage mail -a httpd",
            "Not possible"
        ],
        correctAnswer: "setsebool -P httpd_can_sendmail on",
        explanation: "The httpd_can_sendmail boolean controls that access.",
        difficulty: 'hard'
    },
    {
        id: 't2c05_h15',
        chapterId: 'track2-ch05',
        type: 'mcq',
        question: "What is the difference between 'targeted' and 'strict' policy in terms of unconfined domains?",
        options: [
            "Targeted leaves most user processes unconfined; strict confines everything",
            "No difference",
            "Strict is more relaxed",
            "Targeted only confines networking"
        ],
        correctAnswer: "Targeted leaves most user processes unconfined; strict confines everything",
        explanation: "Targeted is the default on RHEL for usability.",
        difficulty: 'hard'
    }
];
