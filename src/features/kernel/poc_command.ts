import { SyscallInterface } from './types';

/**
 * A proof-of-concept Userland command.
 * Notice how it only interacts with the system via `syscalls`.
 * It does not know about the VFS, React, or the browser.
 */
export const echo_kernel = async (args: string[], syscalls: SyscallInterface): Promise<void> => {
    const output = args.join(' ') + '\n';

    // Write to standard output (FD 1)
    await syscalls.sys_write(1, output);

    // Gracefully exit
    await syscalls.sys_exit(0);
};

export const mkdir_kernel = async (args: string[], syscalls: SyscallInterface): Promise<void> => {
    if (args.length === 0) {
        await syscalls.sys_write(2, 'mkdir: missing operand\n');
        await syscalls.sys_exit(1);
        return;
    }

    let hasError = false;
    for (const dir of args) {
        const result = await syscalls.sys_mkdir(dir);
        if (result < 0) {
            await syscalls.sys_write(2, `mkdir: cannot create directory '${dir}': Permission denied\n`);
            hasError = true;
        }
    }

    await syscalls.sys_exit(hasError ? 1 : 0);
};
