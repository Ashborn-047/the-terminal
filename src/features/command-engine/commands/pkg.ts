import { CommandContext, CommandResult } from '../types';

const handlePkgManager = (cmd: string, args: string[], context: CommandContext) => {
    if (args.length === 0) return { output: `${cmd}: missing command\n`, exitCode: 1 };
    if (context.userId !== 'root') {
        return { output: '', error: `Error: This command has to be run with superuser privileges (use sudo).`, exitCode: 1 };
    }

    const action = args[0];
    const pkg = args[1] || '';

    if (action === 'install' || action === 'update') {
        return {
            output: `Dependencies Resolved\n\nPackage                     Arch   Version                     Repository   Size\n================================================================================\n Installing:\n ${pkg || 'package'}           x86_64 1.2.3-1.el9                 appstream    42 k\n\nTransaction Summary\n================================================================================\nInstall  1 Package\n\nTotal download size: 42 k\nInstalled size: 108 k\nIs this ok [y/N]: y\nDownloading Packages:\nRunning transaction check\nTransaction check succeeded.\nRunning transaction test\nTransaction test succeeded.\nRunning transaction\n  Installing : ${pkg || 'package'}-1.2.3-1.el9.x86_64                                1/1 \n  Verifying  : ${pkg || 'package'}-1.2.3-1.el9.x86_64                                1/1 \n\nInstalled:\n  ${pkg || 'package'}-1.2.3-1.el9.x86_64\n\nComplete!\n`,
            exitCode: 0
        };
    }

    return { output: `${cmd}: ${action} ${pkg} (simulated)\n`, exitCode: 0 };
};

export const yum = async (args: string[], context: CommandContext): Promise<CommandResult> => handlePkgManager('yum', args, context);
export const dnf = async (args: string[], context: CommandContext): Promise<CommandResult> => handlePkgManager('dnf', args, context);
