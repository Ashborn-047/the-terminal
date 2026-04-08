// src/data/dailyChallengesData.ts
import { OutcomeCheck } from '../features/lab-engine/types';

export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    verification: OutcomeCheck[];
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
    {
        id: 'dc-01',
        title: 'File Cleaner',
        description: 'Remove all files in /tmp directory.',
        xpReward: 100,
        verification: [
            { type: 'file_not_exists', path: '/tmp/test_file', message: 'Clear /tmp/test_file' }
        ]
    },
    {
        id: 'dc-02',
        title: 'Empty Trash',
        description: 'Remove the directory /home/user/trash.',
        xpReward: 100,
        verification: [
            { type: 'file_not_exists', path: '/home/user/trash', message: 'Remove the trash folder' }
        ]
    },
    {
        id: 'dc-03',
        title: 'Touch the Sky',
        description: 'Create a file named "sky" in the root directory.',
        xpReward: 100,
        verification: [
            { type: 'file_exists', path: '/sky', message: 'Create /sky' }
        ]
    },
    {
        id: 'dc-04',
        title: 'Permission Guard',
        description: 'Set /etc/shadow to 600 permissions.',
        xpReward: 150,
        verification: [
            { type: 'permission_equals', path: '/etc/shadow', mode: 0o600, message: 'Restrict /etc/shadow permissions' }
        ]
    },
    {
        id: 'dc-05',
        title: 'Secret Agent',
        description: 'Create a hidden file .secret in /home/user.',
        xpReward: 100,
        verification: [
            { type: 'file_exists', path: '/home/user/.secret', message: 'Create ~/.secret' }
        ]
    },
    {
        id: 'dc-06',
        title: 'Bin Master',
        description: 'Create a symlink /bin/sh pointing to /bin/bash.',
        xpReward: 150,
        verification: [
            { type: 'symlink_target_equals', path: '/bin/sh', content: '/bin/bash', message: 'Fix the shell symlink' }
        ]
    },
    {
        id: 'dc-07',
        title: 'Log Rotation',
        description: 'Truncate /var/log/syslog to be empty.',
        xpReward: 100,
        verification: [
            { type: 'file_contains', path: '/var/log/syslog', content: '', message: 'Clear the syslog' }
        ]
    },
    {
        id: 'dc-08',
        title: 'Group effort',
        description: 'Change the group of /home/user/shared to "developers".',
        xpReward: 100,
        verification: [
            { type: 'owner_equals', path: '/home/user/shared', owner: 'root:developers', message: 'Set group to developers' }
        ]
    },
    {
        id: 'dc-09',
        title: 'Root Explorer',
        description: 'Create a directory /root/hidden.',
        xpReward: 150,
        verification: [
            { type: 'directory_exists', path: '/root/hidden', message: 'Create /root/hidden' }
        ]
    },
    {
        id: 'dc-10',
        title: 'Safety First',
        description: 'Make /usr/bin/sudo immutable (simulated by 444 permissions).',
        xpReward: 200,
        verification: [
            { type: 'permission_equals', path: '/usr/bin/sudo', mode: 0o444, message: 'Set sudo to read-only' }
        ]
    }
];
