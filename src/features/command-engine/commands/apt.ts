import { CommandRegistry } from '../registry';
import { logger } from '../../../utils/logger';

/**
 * apt / apt-get — simulated package manager
 * per roadmap Phase 6: High-Fidelity Kernel
 */

const APT_PACKAGES: Record<string, { version: string; description: string; size: string }> = {
    'vim': { version: '2:9.0.1000-4', description: 'Vi IMproved - enhanced vi editor', size: '1.2 MB' },
    'htop': { version: '3.2.1-1', description: 'interactive process viewer', size: '150 KB' },
    'tree': { version: '2.1.0-1', description: 'displays directory tree as a graphic', size: '45 KB' },
    'git': { version: '1:2.39.2-1', description: 'distributed revision control system', size: '5.6 MB' },
    'neofetch': { version: '7.1.0-2', description: 'Fast, highly customizable system info script', size: '85 KB' },
    'docker.io': { version: '20.10.24+dfsg1-1', description: 'Linux container runtime', size: '42 MB' },
    'nginx': { version: '1.22.1-9', description: 'small, powerful, scalable web/proxy server', size: '512 KB' },
    'python3': { version: '3.11.2-1', description: 'interactive high-level object-oriented language', size: '32 KB' },
};

async function handleApt(args: string[], context: any) {
    if (args.length === 0) {
        return { output: 'apt 2.6.0 (amd64)\nUsage: apt [options] command', exitCode: 0 };
    }

    const command = args[0];
    const pkgName = args[1];

    switch (command) {
        case 'update':
            if (context.userId !== 'root') return { output: '', error: 'E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)', exitCode: 100 };
            return {
                output: 'Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]\n' +
                        'Get:2 http://deb.debian.org/debian bookworm-updates InRelease [52.1 kB]\n' +
                        'Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]\n' +
                        'Reading package lists... Done\n' +
                        'Building dependency tree... Done\n' +
                        'All packages are up to date.',
                exitCode: 0
            };

        case 'install':
            if (!pkgName) return { output: '', error: 'E: You must give at least one package to install', exitCode: 1 };
            if (context.userId !== 'root') return { output: '', error: 'E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)', exitCode: 100 };
            
            const pkg = APT_PACKAGES[pkgName];
            if (!pkg) return { output: '', error: `E: Unable to locate package ${pkgName}`, exitCode: 1 };

            return {
                output: `Reading package lists... Done\n` +
                        `Building dependency tree... Done\n` +
                        `The following NEW packages will be installed:\n` +
                        `  ${pkgName}\n` +
                        `0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.\n` +
                        `Need to get ${pkg.size} of archives.\n` +
                        `After this operation, ${pkg.size} of additional disk space will be used.\n` +
                        `Get:1 http://deb.debian.org/debian bookworm/main amd64 ${pkgName} ${pkg.version} [${pkg.size}]\n` +
                        `Fetched ${pkg.size} in 0s (0 B/s)\n` +
                        `Selecting previously unselected package ${pkgName}.\n` +
                        `(Reading database ... 24567 files and directories currently installed.)\n` +
                        `Preparing to unpack .../${pkgName}_${pkg.version}_amd64.deb ...\n` +
                        `Unpacking ${pkgName} (${pkg.version}) ...\n` +
                        `Setting up ${pkgName} (${pkg.version}) ...`,
                exitCode: 0
            };

        case 'search':
            if (!pkgName) return { output: 'Sorting... Done\nFull Text Search... Done', exitCode: 0 };
            const results = Object.entries(APT_PACKAGES)
                .filter(([name]) => name.includes(pkgName))
                .map(([name, data]) => `${name}/${name} ${data.version} amd64\n  ${data.description}`);
            
            return {
                output: `Sorting... Done\nFull Text Search... Done\n${results.join('\n')}`,
                exitCode: 0
            };

        case 'list':
            const allPkgs = Object.entries(APT_PACKAGES)
                .map(([name, data]) => `${name}/${name} ${data.version} amd64 [installed]`);
            return {
                output: `Listing... Done\n${allPkgs.join('\n')}`,
                exitCode: 0
            };

        default:
            return { output: `E: Invalid operation ${command}`, exitCode: 1 };
    }
}

CommandRegistry.register('apt', async (args, context, input) => handleApt(args, context));
CommandRegistry.register('apt-get', async (args, context, input) => handleApt(args, context));
