import { Lab } from '../../features/lab-engine/types';

export const arenaLabs: Lab[] = [
    // ---------------------------------------------------------
    // NOVICE TIER (Level 1-10 expected)
    // ---------------------------------------------------------
    {
        id: 'arena-novice-1',
        module: 99,
        title: 'Ghost Process',
        description: 'A rogue background process is consuming resources. Find its PID and terminate it.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 100,
        prerequisites: [],
        scenarioId: 'arena_ghost_process',
        verification: {
            conditions: [
                {
                    type: 'process_not_running',
                    path: 'rogue_daemon',
                    message: 'The rogue_daemon process must be terminated.'
                }
            ]
        },
        completionMessage: 'Process neutralized. Good job keeping the system clean!',
        tags: ['processes', 'arena', 'novice']
    },
    {
        id: 'arena-novice-2',
        module: 99,
        title: 'Hidden Secrets',
        description: 'Find the hidden file containing the launch codes in the /home/user directory and copy it to /root.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 100,
        prerequisites: [],
        scenarioId: 'arena_hidden_secrets',
        verification: {
            conditions: [
                {
                    type: 'file_exists',
                    path: '/root/.launch_codes',
                    message: 'The .launch_codes file must be copied to /root.'
                }
            ]
        },
        completionMessage: 'Codes secured. They are safe in the root directory.',
        tags: ['filesystem', 'arena', 'novice']
    },
    {
        id: 'arena-novice-3',
        module: 99,
        title: 'Permission Cascade',
        description: 'The /var/www directory is inaccessible. Restore 755 permissions to it and its contents.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 120,
        prerequisites: [],
        scenarioId: 'arena_permission_cascade',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/var/www',
                    mode: 0o755,
                    message: 'The /var/www directory must have 755 permissions.'
                },
                {
                    type: 'permission_equals',
                    path: '/var/www/index.html',
                    mode: 0o755,
                    message: 'The /var/www/index.html file must have 755 permissions.'
                }
            ]
        },
        completionMessage: 'Web server access restored!',
        tags: ['permissions', 'arena', 'novice']
    },
    {
        id: 'arena-novice-4',
        module: 99,
        title: 'Log Truncator',
        description: '/var/log/syslog has grown out of control. Clear its contents without deleting the file.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 80,
        prerequisites: [],
        scenarioId: 'arena_log_truncator',
        verification: {
            conditions: [
                {
                    type: 'file_matches_regex',
                    path: '/var/log/syslog',
                    content: '^$',
                    message: 'The /var/log/syslog must be empty.'
                }
            ]
        },
        completionMessage: 'Space recovered. Always rotate your logs!',
        tags: ['filesystem', 'arena', 'novice']
    },
    {
        id: 'arena-novice-5',
        module: 99,
        title: 'Orphaned Symlink',
        description: 'Remove the broken symlink /etc/localtime which points to a non-existent timezone.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 100,
        prerequisites: [],
        scenarioId: 'arena_orphaned_symlink',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/etc/localtime',
                    message: 'The broken symlink must be removed.'
                }
            ]
        },
        completionMessage: 'Timezone link removed.',
        tags: ['symlinks', 'arena', 'novice']
    },
    {
        id: 'arena-novice-6',
        module: 99,
        title: 'Locked Out',
        description: 'You cannot read the MOTD at /etc/motd. Change its ownership to root:users.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 110,
        prerequisites: [],
        scenarioId: 'arena_locked_out',
        verification: {
            conditions: [
                {
                    type: 'owner_equals',
                    path: '/etc/motd',
                    owner: 'root:users',
                    message: '/etc/motd must belong to root:users'
                }
            ]
        },
        completionMessage: 'Users can now read the Message of the Day.',
        tags: ['ownership', 'arena', 'novice']
    },
    {
        id: 'arena-novice-7',
        module: 99,
        title: 'Network Hijack',
        description: 'The hosts file points localhost to a malicious IP. Restore it to 127.0.0.1.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 150,
        prerequisites: [],
        scenarioId: 'arena_network_hijack',
        verification: {
            conditions: [
                {
                    type: 'file_contains',
                    path: '/etc/hosts',
                    content: '127.0.0.1 localhost',
                    message: '/etc/hosts must map localhost to 127.0.0.1'
                }
            ]
        },
        completionMessage: 'DNS routing secured.',
        tags: ['networking', 'arena', 'novice']
    },
    {
        id: 'arena-novice-8',
        module: 99,
        title: 'Lost Keys',
        description: 'Generate an ssh key layout by creating the /root/.ssh directory and a dummy id_rsa inside it.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 130,
        prerequisites: [],
        scenarioId: 'arena_empty',
        verification: {
            conditions: [
                {
                    type: 'file_exists',
                    path: '/root/.ssh/id_rsa',
                    message: '/root/.ssh/id_rsa must exist.'
                }
            ]
        },
        completionMessage: 'SSH directory structure created.',
        tags: ['filesystem', 'arena', 'novice']
    },
    {
        id: 'arena-novice-9',
        module: 99,
        title: 'Archive Extractor',
        description: 'A critical patch is simulated as a tar file. Create a directory called /opt/patch and move the patch there.',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 120,
        prerequisites: [],
        scenarioId: 'arena_archive',
        verification: {
            conditions: [
                {
                    type: 'file_exists',
                    path: '/opt/patch/update.tar',
                    message: '/opt/patch/update.tar must exist.'
                }
            ]
        },
        completionMessage: 'Patch staged for extraction.',
        tags: ['filesystem', 'arena', 'novice']
    },
    {
        id: 'arena-novice-10',
        module: 99,
        title: 'Profile Fix',
        description: 'A syntax error in /etc/profile is breaking logins. Replace it with a safe default: "export PATH=/bin:/usr/bin".',
        type: 'diy',
        difficulty: 'NOVICE',
        xpReward: 140,
        prerequisites: [],
        scenarioId: 'arena_profile_fix',
        verification: {
            conditions: [
                {
                    type: 'file_contains',
                    path: '/etc/profile',
                    content: 'export PATH=/bin:/usr/bin',
                    message: '/etc/profile must be corrected.'
                }
            ]
        },
        completionMessage: 'Profile repaired. Logins restored.',
        tags: ['system', 'arena', 'novice']
    },

    // ---------------------------------------------------------
    // ADEPT TIER (Level 10-20 expected)
    // ---------------------------------------------------------
    {
        id: 'arena-adept-1',
        module: 99,
        title: 'Corrupted Filesystem',
        description: 'A key library /lib/libc.so was deleted. Recreate it as a symlink to /lib/libc.so.6 to restore the system.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 250,
        prerequisites: [],
        scenarioId: 'arena_corrupt_fs',
        verification: {
            conditions: [
                {
                    type: 'symlink_target_equals',
                    path: '/lib/libc.so',
                    content: '/lib/libc.so.6',
                    message: '/lib/libc.so must point to /lib/libc.so.6'
                }
            ]
        },
        completionMessage: 'C library linked correctly. Binaries will now run.',
        tags: ['filesystem', 'arena', 'adept']
    },
    {
        id: 'arena-adept-2',
        module: 99,
        title: 'Sticky Situation',
        description: '/tmp has lost its sticky bit, allowing users to delete each others files. Apply mode 1777 to /tmp.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 200,
        prerequisites: [],
        scenarioId: 'arena_sticky_missing',
        verification: {
            conditions: [
                {
                    type: 'file_permissions_bitwise',
                    path: '/tmp',
                    mode: 0o1777,
                    message: '/tmp must have the sticky bit set (1777).'
                }
            ]
        },
        completionMessage: '/tmp is secure again.',
        tags: ['permissions', 'arena', 'adept']
    },
    {
        id: 'arena-adept-3',
        module: 99,
        title: 'Rogue SUID',
        description: 'An attacker left a backdoor SUID binary at /usr/share/nmap. Remove it to secure the server.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 280,
        prerequisites: [],
        scenarioId: 'arena_rogue_suid',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/usr/share/nmap',
                    message: 'The rogue SUID binary must be removed.'
                }
            ]
        },
        completionMessage: 'Backdoor removed. System secured.',
        tags: ['security', 'arena', 'adept']
    },
    {
        id: 'arena-adept-4',
        module: 99,
        title: 'Hidden Miners',
        description: 'Find and delete the hidden cryptominer script located somewhere in /var/tmp.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 240,
        prerequisites: [],
        scenarioId: 'arena_hidden_miners',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/var/tmp/.miner.sh',
                    message: 'The miner script must be removed.'
                }
            ]
        },
        completionMessage: 'Miner eliminated. CPU usage returning to normal.',
        tags: ['security', 'arena', 'adept']
    },
    {
        id: 'arena-adept-5',
        module: 99,
        title: 'Immutable Config',
        description: 'Make /etc/resolv.conf read-only (444) to prevent the DHCP client from overwriting your custom DNS servers.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 210,
        prerequisites: [],
        scenarioId: 'arena_immutable_config',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/etc/resolv.conf',
                    mode: 0o444,
                    message: '/etc/resolv.conf must be 444.'
                }
            ]
        },
        completionMessage: 'DNS config locked.',
        tags: ['permissions', 'arena', 'adept']
    },
    {
        id: 'arena-adept-6',
        module: 99,
        title: 'Group Collaboration',
        description: 'Create a shared directory /opt/dev and ensure the group ownership is set to "developers".',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 220,
        prerequisites: [],
        scenarioId: 'arena_group_collab',
        verification: {
            conditions: [
                {
                    type: 'owner_equals',
                    path: '/opt/dev',
                    owner: 'root:developers',
                    message: '/opt/dev must belong to root:developers'
                }
            ]
        },
        completionMessage: 'Collaboration space ready.',
        tags: ['permissions', 'arena', 'adept']
    },
    {
        id: 'arena-adept-7',
        module: 99,
        title: 'Passwd Recovery',
        description: '/usr/bin/passwd lost its SUID bit. Restore it (4755) so users can change passwords.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 260,
        prerequisites: [],
        scenarioId: 'arena_passwd_recovery',
        verification: {
            conditions: [
                {
                    type: 'file_permissions_bitwise',
                    path: '/usr/bin/passwd',
                    mode: 0o4755,
                    message: '/usr/bin/passwd must be 4755.'
                }
            ]
        },
        completionMessage: 'Users can change passwords again.',
        tags: ['permissions', 'suid', 'arena', 'adept']
    },
    {
        id: 'arena-adept-8',
        module: 99,
        title: 'Zombie Cleanup',
        description: 'Kill the rogue bash process that is hanging the terminal simulation.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 200,
        prerequisites: [],
        scenarioId: 'arena_zombie_cleanup',
        verification: {
            conditions: [
                {
                    type: 'process_not_running',
                    path: 'rogue_bash',
                    message: 'rogue_bash process must be killed.'
                }
            ]
        },
        completionMessage: 'Zombie purged.',
        tags: ['processes', 'arena', 'adept']
    },
    {
        id: 'arena-adept-9',
        module: 99,
        title: 'Safe Execution',
        description: 'A suspicious script downloaded to /home/user/payload.sh is executable. Remove its execute permissions (0644).',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 230,
        prerequisites: [],
        scenarioId: 'arena_safe_exec',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/home/user/payload.sh',
                    mode: 0o644,
                    message: 'payload.sh must lose execute permissions.'
                }
            ]
        },
        completionMessage: 'Execution prevented.',
        tags: ['security', 'arena', 'adept']
    },
    {
        id: 'arena-adept-10',
        module: 99,
        title: 'Broken Bootloader',
        description: 'The kernel image link at /boot/vmlinuz is pointing to a missing file. Remap it to /boot/vmlinuz-5.15.0-generic.',
        type: 'diy',
        difficulty: 'ADEPT',
        xpReward: 290,
        prerequisites: [],
        scenarioId: 'arena_broken_bootloader',
        verification: {
            conditions: [
                {
                    type: 'symlink_target_equals',
                    path: '/boot/vmlinuz',
                    content: '/boot/vmlinuz-5.15.0-generic',
                    message: '/boot/vmlinuz must point to the correct kernel.'
                }
            ]
        },
        completionMessage: 'Bootloader configured. System will boot correctly.',
        tags: ['kernel', 'arena', 'adept']
    },

    // ---------------------------------------------------------
    // EXPERT TIER (Level 20-30 expected)
    // ---------------------------------------------------------
    {
        id: 'arena-expert-1',
        module: 99,
        title: 'Kernel Panic Fix',
        description: 'An invalid modprobe configuration in /etc/modprobe.d/blacklist.conf is causing panics. Delete the file.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 400,
        prerequisites: [],
        scenarioId: 'arena_kernel_panic',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/etc/modprobe.d/blacklist.conf',
                    message: 'The bad blacklist config must be removed.'
                }
            ]
        },
        completionMessage: 'Panic averted. Kernel modules load smoothly.',
        tags: ['kernel', 'arena', 'expert']
    },
    {
        id: 'arena-expert-2',
        module: 99,
        title: 'Path Hijack Defender',
        description: 'A malicious script named "sudo" was placed in /usr/local/bin. Remove it to prevent privilege escalation.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 420,
        prerequisites: [],
        scenarioId: 'arena_path_hijack',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/usr/local/bin/sudo',
                    message: 'The fake sudo binary must be removed.'
                }
            ]
        },
        completionMessage: 'Path injection prevented.',
        tags: ['security', 'arena', 'expert']
    },
    {
        id: 'arena-expert-3',
        module: 99,
        title: 'Deep Recursion',
        description: 'A loop in /var/lib/data/link has created an infinite filesystem recursion. Delete the symlink.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 380,
        prerequisites: [],
        scenarioId: 'arena_deep_recursion',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/var/lib/data/link',
                    message: 'The recursive symlink must be removed.'
                }
            ]
        },
        completionMessage: 'Filesystem loop resolved.',
        tags: ['filesystem', 'arena', 'expert']
    },
    {
        id: 'arena-expert-4',
        module: 99,
        title: 'Shadow Exfiltration',
        description: 'Someone copied /etc/shadow to /tmp/shadow.backup. Delete the backup before it gets exfiltrated.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 450,
        prerequisites: [],
        scenarioId: 'arena_shadow_exfil',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/tmp/shadow.backup',
                    message: 'The exposed shadow file must be removed.'
                }
            ]
        },
        completionMessage: 'Hashes secured.',
        tags: ['security', 'arena', 'expert']
    },
    {
        id: 'arena-expert-5',
        module: 99,
        title: 'Process Starvation',
        description: 'Two CPU hog processes named "hog1" and "hog2" are killing performance. Terminate both.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 400,
        prerequisites: [],
        scenarioId: 'arena_process_starvation',
        verification: {
            conditions: [
                {
                    type: 'process_not_running',
                    path: 'hog1',
                    message: 'hog1 must be killed.'
                },
                {
                    type: 'process_not_running',
                    path: 'hog2',
                    message: 'hog2 must be killed.'
                }
            ]
        },
        completionMessage: 'System load average returning to normal.',
        tags: ['processes', 'arena', 'expert']
    },
    {
        id: 'arena-expert-6',
        module: 99,
        title: 'SSH Hardening',
        description: 'Change /etc/ssh/sshd_config permissions to 600, and ensure root ownership.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 410,
        prerequisites: [],
        scenarioId: 'arena_ssh_hardening',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/etc/ssh/sshd_config',
                    mode: 0o600,
                    message: 'sshd_config must be 600.'
                },
                {
                    type: 'owner_equals',
                    path: '/etc/ssh/sshd_config',
                    owner: 'root:root',
                    message: 'sshd_config must be owned by root.'
                }
            ]
        },
        completionMessage: 'SSH daemon secured.',
        tags: ['security', 'arena', 'expert']
    },
    {
        id: 'arena-expert-7',
        module: 99,
        title: 'Environment Pollution',
        description: 'A malicious alias was planted in /root/.bashrc. Clear the file to restore normal behavior.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 390,
        prerequisites: [],
        scenarioId: 'arena_env_pollution',
        verification: {
            conditions: [
                {
                    type: 'file_matches_regex',
                    path: '/root/.bashrc',
                    content: '^$',
                    message: '.bashrc must be cleared.'
                }
            ]
        },
        completionMessage: 'Shell environment sanitized.',
        tags: ['system', 'arena', 'expert']
    },
    {
        id: 'arena-expert-8',
        module: 99,
        title: 'Cron Escapade',
        description: 'Remove the unauthorized reverse shell cron job at /etc/cron.d/reverse_shell.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 460,
        prerequisites: [],
        scenarioId: 'arena_cron_escapade',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/etc/cron.d/reverse_shell',
                    message: 'The malicious cron file must be removed.'
                }
            ]
        },
        completionMessage: 'Persistence mechanism destroyed.',
        tags: ['security', 'arena', 'expert']
    },
    {
        id: 'arena-expert-9',
        module: 99,
        title: 'Lost Binaries',
        description: 'The /bin directory was accidentally moved to /tmp/bin. Move it back to /bin.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 430,
        prerequisites: [],
        scenarioId: 'arena_lost_binaries',
        verification: {
            conditions: [
                {
                    type: 'directory_exists',
                    path: '/bin',
                    message: '/bin directory must be restored.'
                },
                {
                    type: 'file_not_exists',
                    path: '/tmp/bin',
                    message: '/tmp/bin must be moved.'
                }
            ]
        },
        completionMessage: 'Core utilities restored.',
        tags: ['filesystem', 'arena', 'expert']
    },
    {
        id: 'arena-expert-10',
        module: 99,
        title: 'Network Interface Down',
        description: 'The network interface config /etc/network/interfaces is empty. Write "auto eth0" into it.',
        type: 'diy',
        difficulty: 'EXPERT',
        xpReward: 350,
        prerequisites: [],
        scenarioId: 'arena_empty',
        verification: {
            conditions: [
                {
                    type: 'file_contains',
                    path: '/etc/network/interfaces',
                    content: 'auto eth0',
                    message: 'Interfaces file must configure eth0.'
                }
            ]
        },
        completionMessage: 'Network interface activated.',
        tags: ['networking', 'arena', 'expert']
    },

    // ---------------------------------------------------------
    // MASTER TIER (Level 30+ expected)
    // ---------------------------------------------------------
    {
        id: 'arena-master-1',
        module: 99,
        title: 'System Admin Mastery',
        description: 'A multi-vector attack: 1) SUID backdoor at /usr/bin/hack 2) Shadow file is 666 3) Rogue process "miner" running. Fix all three.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 1000,
        prerequisites: [],
        scenarioId: 'arena_master_sysadmin',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/usr/bin/hack',
                    message: 'Backdoor must be removed.'
                },
                {
                    type: 'permission_equals',
                    path: '/etc/shadow',
                    mode: 0o640,
                    message: 'Shadow file must be secured to 640.'
                },
                {
                    type: 'process_not_running',
                    path: 'miner',
                    message: 'Miner must be killed.'
                }
            ]
        },
        completionMessage: 'You are a true Linux System Administrator.',
        tags: ['mastery', 'arena', 'master']
    },
    {
        id: 'arena-master-2',
        module: 99,
        title: 'Zero Day Mitigation',
        description: 'A zero day in "curl" is being exploited. Remove the executable permission (0644) from /usr/bin/curl as a temporary mitigation.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 800,
        prerequisites: [],
        scenarioId: 'arena_zero_day',
        verification: {
            conditions: [
                {
                    type: 'permission_equals',
                    path: '/usr/bin/curl',
                    mode: 0o644,
                    message: '/usr/bin/curl must be non-executable.'
                }
            ]
        },
        completionMessage: 'Mitigation applied globally.',
        tags: ['security', 'arena', 'master']
    },
    {
        id: 'arena-master-3',
        module: 99,
        title: 'Init System Corruption',
        description: 'Systemd is failing because /etc/systemd/system/default.target is missing. Create it as a symlink to graphical.target.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 850,
        prerequisites: [],
        scenarioId: 'arena_empty_systemd',
        verification: {
            conditions: [
                {
                    type: 'symlink_target_equals',
                    path: '/etc/systemd/system/default.target',
                    content: 'graphical.target',
                    message: 'default.target must link to graphical.target.'
                }
            ]
        },
        completionMessage: 'Init system repaired.',
        tags: ['system', 'arena', 'master']
    },
    {
        id: 'arena-master-4',
        module: 99,
        title: 'Chroot Jail Escape',
        description: 'You are trapped in a chroot. Create a device node? Just kidding. Break the jail by finding the hidden flag file at /jail/flag.txt and moving it to /root.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 900,
        prerequisites: [],
        scenarioId: 'arena_chroot_escape',
        verification: {
            conditions: [
                {
                    type: 'file_exists',
                    path: '/root/flag.txt',
                    message: 'Flag must be captured and moved to /root.'
                }
            ]
        },
        completionMessage: 'Jailbreak successful.',
        tags: ['security', 'arena', 'master']
    },
    {
        id: 'arena-master-5',
        module: 99,
        title: 'APT Repository Poisoning',
        description: 'The sources.list at /etc/apt/sources.list contains a poisoned repo "http://evil.com/ubuntu". Truncate the file to clear it.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 750,
        prerequisites: [],
        scenarioId: 'arena_apt_poison',
        verification: {
            conditions: [
                {
                    type: 'file_matches_regex',
                    path: '/etc/apt/sources.list',
                    content: '^$',
                    message: 'sources.list must be cleared.'
                }
            ]
        },
        completionMessage: 'Package manager secured.',
        tags: ['system', 'arena', 'master']
    },
    {
        id: 'arena-master-6',
        module: 99,
        title: 'Total Filesystem Wipe',
        description: 'Simulate a secure wipe by removing all contents of /data.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 700,
        prerequisites: [],
        scenarioId: 'arena_fs_wipe',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/data/secret1',
                    message: 'secret1 must be removed.'
                },
                {
                    type: 'file_not_exists',
                    path: '/data/secret2',
                    message: 'secret2 must be removed.'
                }
            ]
        },
        completionMessage: 'Data eradicated.',
        tags: ['filesystem', 'arena', 'master']
    },
    {
        id: 'arena-master-7',
        module: 99,
        title: 'DNS Sinkhole',
        description: 'Route all traffic to badactor.com to localhost by adding "127.0.0.1 badactor.com" to /etc/hosts.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 820,
        prerequisites: [],
        scenarioId: 'arena_empty_hosts',
        verification: {
            conditions: [
                {
                    type: 'file_contains',
                    path: '/etc/hosts',
                    content: '127.0.0.1 badactor.com',
                    message: 'Sinkhole must be active in /etc/hosts.'
                }
            ]
        },
        completionMessage: 'Malicious domain sinkholed.',
        tags: ['networking', 'arena', 'master']
    },
    {
        id: 'arena-master-8',
        module: 99,
        title: 'Firewall Lockout',
        description: 'UFW rules at /etc/ufw/rules are denying port 22. Delete the rules file to restore SSH access.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 780,
        prerequisites: [],
        scenarioId: 'arena_firewall_lockout',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/etc/ufw/rules',
                    message: 'Rules file must be deleted.'
                }
            ]
        },
        completionMessage: 'SSH port unblocked.',
        tags: ['networking', 'arena', 'master']
    },
    {
        id: 'arena-master-9',
        module: 99,
        title: 'The Fork Bomb',
        description: 'A fork bomb script is located at /tmp/bomb.sh. Delete it before someone executes it.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 850,
        prerequisites: [],
        scenarioId: 'arena_fork_bomb',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/tmp/bomb.sh',
                    message: 'Fork bomb must be removed.'
                }
            ]
        },
        completionMessage: 'Catastrophe averted.',
        tags: ['security', 'arena', 'master']
    },
    {
        id: 'arena-master-10',
        module: 99,
        title: 'Rootkit Hunter',
        description: 'A kernel module rootkit is hiding in /lib/modules/evil.ko. Remove it.',
        type: 'diy',
        difficulty: 'MASTER',
        xpReward: 950,
        prerequisites: [],
        scenarioId: 'arena_rootkit',
        verification: {
            conditions: [
                {
                    type: 'file_not_exists',
                    path: '/lib/modules/evil.ko',
                    message: 'Rootkit must be eradicated.'
                }
            ]
        },
        completionMessage: 'Rootkit successfully eliminated from modules.',
        tags: ['kernel', 'arena', 'master']
    }
];
