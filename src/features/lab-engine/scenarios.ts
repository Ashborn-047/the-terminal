import { VFS } from '../vfs/vfs';
import type { Logger } from '../../types/logger';

export type ScenarioInitializer = (vfs: VFS, logger: Logger) => Promise<void>;

/**
 * Apply a scenario or a composite of scenarios by ID.
 * Supports chaining multiple scenarios via the 'mastery_composite' pattern.
 */
export async function applyScenario(vfs: VFS, scenarioId: string, logger: Logger = console as any): Promise<void> {
    const initializer = ScenarioRegistry[scenarioId];
    if (!initializer) {
        logger.warn(`Scenario "${scenarioId}" not found in registry.`);
        return;
    }
    await initializer(vfs, logger);
}

export const ScenarioRegistry: Record<string, ScenarioInitializer> = {
    'permissions_nightmare': async (vfs, logger) => {
        const binaryPath = '/usr/bin/passwd';
        const shadowPath = '/etc/shadow';

        // MANDATORY: Use numeric octal literals for chmod
        // 0o755 removes SUID bit if it was 4755
        await vfs.chmod(binaryPath, 0o755); 
        // 0o644 makes shadow world-readable
        await vfs.chmod(shadowPath, 0o644); 
        
        logger.info('Scenario "Permissions Nightmare" applied: SUID removed from passwd, shadow made 644.');
    },

    'circular_link': async (vfs, logger) => {
        const userHome = '/home/user';
        const backupDir = `${userHome}/backup`;
        const archiveDir = `${backupDir}/archive`;

        // Create structure
        await vfs.mkdir('/home', 'user', 'root');
        await vfs.mkdir(userHome, 'backup', 'user');
        await vfs.mkdir(backupDir, 'archive', 'user');

        // MANDATORY: Use symlink(target, linkpath) signature
        // Creating a circular reference or just a link as requested
        await vfs.symlink('../', `${archiveDir}/latest`);

        logger.info('Scenario "Circular Link" applied: Symlink created at archive/latest pointing to ../');
    },

    'ghost_log': async (vfs, logger) => {
        // Prepare a scenario where a log file is "missing" but takes space
        await vfs.mkdir('/var', 'log', 'root');
        const logPath = '/var/log/apache2.log';
        await vfs.writeFile(logPath, 'A'.repeat(1024 * 1024), 'root'); // 1MB log
        
        // In a real system, we'd delete it while a process holds the handle.
        // For now, we just corrupt it.
        await vfs.chmod(logPath, 0o000); 
        logger.info('Scenario "Ghost Log" applied: Process log corrupted with 000 permissions.');
    },

    'suid_shell_leak': async (vfs, logger) => {
        // A common security lab: find and fix a world-writable SUID shell
        await vfs.mkdir('/usr', 'local/bin', 'root');
        const shellPath = '/usr/local/bin/backdoor';
        await vfs.writeFile(shellPath, '#!/bin/sh\nexec /bin/sh', 'root');
        await vfs.chmod(shellPath, 0o4777); // World-writable SUID!
        logger.info('Scenario "SUID Shell Leak" applied: Writable SUID backdoor created at /usr/local/bin/backdoor.');
    },

    'sticky_bit_missing': async (vfs, logger) => {
        // Sticky bit missing on /tmp
        await vfs.mkdir('/', 'tmp', 'root');
        await vfs.chmod('/tmp', 0o777); // Missing 1777!
        logger.info('Scenario "Sticky Bit Missing" applied: /tmp is now 777 (vulnerable).');
    },

    'corrupt_passwd_format': async (vfs, logger) => {
        // /etc/passwd missing a field
        const corruptPasswd = 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user::/bin/bash'; // broken home/shell
        await vfs.writeFile('/etc/passwd', corruptPasswd, 'root');
        logger.info('Scenario "Corrupt Passwd Format" applied: user entry in /etc/passwd is malformed.');
    },

    'broken_symlink_chain': async (vfs, logger) => {
        // a chain of 5 symlinks ending in a missing file
        await vfs.mkdir('/etc', 'config', 'root');
        await vfs.symlink('/etc/config/target', '/etc/config/link1');
        await vfs.symlink('/etc/config/link1', '/etc/config/link2');
        await vfs.symlink('/etc/config/link2', '/etc/config/link3');
        await vfs.symlink('/etc/config/link3', '/etc/config/link4');
        await vfs.symlink('/etc/config/link4', '/etc/config/final');
        // target is missing
        logger.info('Scenario "Broken Symlink Chain" applied: Chain at /etc/config/final pointing to missing target.');
    },

    'path_hijack': async (vfs, logger) => {
        // Hijack common command by putting a fake one in /usr/local/bin
        await vfs.mkdir('/usr/local', 'bin', 'root');
        const fakeLs = '/usr/local/bin/ls';
        await vfs.writeFile(fakeLs, '#!/bin/sh\necho "You have been pwned!"', 'root');
        await vfs.chmod(fakeLs, 0o755);
        logger.info('Scenario "Path Hijack" applied: Fake "ls" created in /usr/local/bin.');
    },

    'ssh_key_security': async (vfs, logger) => {
        // SSH private key with too broad permissions
        await vfs.mkdir('/home/user', '.ssh', 'user');
        const keyPath = '/home/user/.ssh/id_rsa';
        await vfs.writeFile(keyPath, '-----BEGIN RSA PRIVATE KEY-----\n...', 'user');
        await vfs.chmod(keyPath, 0o644); // Should be 600
        logger.info('Scenario "SSH Key Security" applied: SSH private key made world-readable.');
    },

    'too_many_logs': async (vfs, logger) => {
        // Simulation of log spam
        await vfs.mkdir('/var', 'log/huge', 'root');
        for (let i = 1; i <= 5; i++) {
            await vfs.writeFile(`/var/log/huge/spam.${i}.log`, 'ERROR '.repeat(5000), 'root');
        }
        logger.info('Scenario "Too Many Logs" applied: Created 5 large spam logs in /var/log/huge.');
    },

    'mastery_admin_challenge': async (vfs, logger) => {
        // Chaining multiple corruptions for an endgame mastery challenge
        await applyScenario(vfs, 'permissions_nightmare', logger);
        await applyScenario(vfs, 'path_hijack', logger);
        await applyScenario(vfs, 'ghost_log', logger);
        logger.info('Mastery Challenge "Admin Nightmare" applied: Composite of Permissions, Hijack, and Ghost Logs.');
    }
};
