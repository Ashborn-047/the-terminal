import { Lab } from '../../features/lab-engine/types';

export const brokenSystemLabs: Lab[] = [
    {
        id: 'bs-01',
        module: 1,
        title: 'The Broken Passwd',
        description: 'The "passwd" command is failing for normal users. Investigate the binary permissions and restore its functionality.',
        type: 'diy',
        xpReward: 150,
        prerequisites: [],
        scenarioId: 'permissions_nightmare',
        verification: {
            conditions: [
                {
                    type: 'file_permissions_bitwise',
                    path: '/usr/bin/passwd',
                    mustHaveSuid: true,
                    mode: 0o755,
                    message: 'The passwd binary must have the SUID bit set and be executable (e.g., 4755).'
                }
            ]
        },
        completionMessage: 'Great job! You restored the SUID bit, allowing passwd to modify /etc/shadow on behalf of users.',
        tags: ['permissions', 'suid']
    },
    {
        id: 'bs-02',
        module: 1,
        title: 'Secrets Exposed',
        description: 'An intern made /etc/shadow world-readable! This is a massive security risk. Fix it immediately.',
        type: 'diy',
        xpReward: 100,
        prerequisites: ['bs-01'],
        scenarioId: 'permissions_nightmare',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/etc/shadow',
                    mode: '640',
                    message: 'The shadow file should be 640 (rw-r-----) or stricter.'
                }
            ]
        },
        completionMessage: 'Security restored. sensitive password hashes are now protected.',
        tags: ['security', 'permissions']
    },
    {
        id: 'bs-03',
        module: 1,
        title: 'Circular Backup',
        description: 'The backup system is looping infinitely. Find the circular symlink in the user home and remove it.',
        type: 'diy',
        xpReward: 200,
        prerequisites: [],
        scenarioId: 'circular_link',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/home/user/backup/archive/latest',
                    message: 'The circular symlink "latest" should be removed.'
                }
            ]
        },
        completionMessage: 'Infinite loop averted! Always be careful with relative symlinks pointing upwards.',
        tags: ['symlinks', 'troubleshooting']
    },
    {
        id: 'bs-04',
        module: 2,
        title: 'The Ghost Log',
        description: 'A process log at /var/log/apache2.log was "corrupted" with 000 permissions. Restore access so the web server can start.',
        type: 'diy',
        xpReward: 120,
        prerequisites: [],
        scenarioId: 'ghost_log',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/var/log/apache2.log',
                    mode: '644',
                    message: 'The log file should be 644 (rw-r--r--).'
                }
            ]
        },
        completionMessage: 'Access restored. The web server can now write to its logs.',
        tags: ['permissions', 'logs']
    },
    {
        id: 'bs-05',
        module: 2,
        title: 'SUID Backdoor',
        description: 'A security audit flagged an unusual SUID binary in /usr/local/bin. Find it and remove the SUID bit or delete the file.',
        type: 'diy',
        xpReward: 250,
        prerequisites: ['bs-02'],
        scenarioId: 'suid_shell_leak',
        verification: {
            conditions: [
                {
                    type: 'file_permissions_bitwise',
                    path: '/usr/local/bin/backdoor',
                    mustHaveSuid: false,
                    message: 'The backdoor binary must not have the SUID bit.'
                }
            ]
        },
        completionMessage: 'Backdoor neutralized. Finding unauthorized SUID binaries is a key system admin skill.',
        tags: ['security', 'suid']
    },
    {
        id: 'bs-06',
        module: 1,
        title: 'Open Sandbox',
        description: 'The /tmp directory is currently insecure. Users can delete each others files! Fix the permissions.',
        type: 'diy',
        xpReward: 150,
        prerequisites: [],
        scenarioId: 'sticky_bit_missing',
        verification: {
            conditions: [
                {
                    type: 'file_permissions_bitwise',
                    path: '/tmp',
                    mode: 0o1777,
                    message: 'The /tmp directory must have the sticky bit (1777) set.'
                }
            ]
        },
        completionMessage: 'Sticky bit set! Now only file owners can delete their own files in /tmp.',
        tags: ['permissions', 'sticky-bit']
    },
    {
        id: 'bs-07',
        module: 2,
        title: 'Corrupt Account',
        description: 'The "user" account is missing its home directory field in /etc/passwd. Repair the file format.',
        type: 'diy',
        xpReward: 180,
        prerequisites: [],
        scenarioId: 'corrupt_passwd_format',
        verification: {
            conditions: [
                {
                    type: 'file_contains',
                    path: '/etc/passwd',
                    content: 'user:x:1000:1000:user:/home/user:/bin/bash',
                    message: 'The user entry in /etc/passwd must be correctly formatted.'
                }
            ]
        },
        completionMessage: 'Account repaired. The user can now log in correctly.',
        tags: ['etc-passwd', 'troubleshooting']
    },
    {
        id: 'bs-08',
        module: 1,
        title: 'Dead End',
        description: 'A critical config link at /etc/config/final is broken. Trace the chain and fix the missing target.',
        type: 'diy',
        xpReward: 220,
        prerequisites: ['bs-03'],
        scenarioId: 'broken_symlink_chain',
        verification: {
            conditions: [
                {
                    type: 'file_exists',
                    path: '/etc/config/target',
                    message: 'The target file at /etc/config/target must exist to satisfy the symlink chain.'
                }
            ]
        },
        completionMessage: 'Chain restored! "Broken pipe" or "No such file" errors often hide deep symlink trails.',
        tags: ['symlinks', 'paths']
    },
    {
        id: 'bs-09',
        module: 2,
        title: 'Path Hijack',
        description: 'Someone put a malicious "ls" command in /usr/local/bin. It is being executed instead of the real one. Fix the path priority or remove the fake.',
        type: 'diy',
        xpReward: 200,
        prerequisites: [],
        scenarioId: 'path_hijack',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/usr/local/bin/ls',
                    message: 'The hijacked "ls" binary should be removed from /usr/local/bin.'
                }
            ]
        },
        completionMessage: 'System cleaned. Always check your $PATH order for security.',
        tags: ['security', 'path']
    },
    {
        id: 'bs-10',
        module: 2,
        title: 'SSH Privacy',
        description: 'Your private SSH key has permissions that are too open (644). Secure it correctly so it can be used.',
        type: 'diy',
        xpReward: 150,
        prerequisites: [],
        scenarioId: 'ssh_key_security',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/home/user/.ssh/id_rsa',
                    mode: '600',
                    message: 'SSH private keys must be 600 (rw-------).'
                }
            ]
        },
        completionMessage: 'Key secured. SSH will no longer complain about insecure permissions.',
        tags: ['security', 'ssh']
    }
];
