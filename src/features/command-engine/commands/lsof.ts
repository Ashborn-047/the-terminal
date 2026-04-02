import { CommandContext, CommandResult } from '../types';

/**
 * lsof — list open files
 */
export const lsof = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const header = 'COMMAND     PID   USER   FD      TYPE     DEVICE SIZE/OFF       NODE NAME';
    const lines = [header];

    // Mock output for shell itself
    lines.push('bash        1001 guest  cwd       DIR      253,0     4096          2 /home/guest');
    lines.push('bash        1001 guest  rtd       DIR      253,0     4096          2 /');
    lines.push('bash        1001 guest  txt       REG      253,0  1234568    1234567 /bin/bash');
    lines.push('bash        1001 guest    0u      CHR        1,3      0t0       1025 /dev/pts/0');
    lines.push('bash        1001 guest    1u      CHR        1,3      0t0       1025 /dev/pts/0');
    lines.push('bash        1001 guest    2u      CHR        1,3      0t0       1025 /dev/pts/0');

    // Dynamic output for running processes
    for (const p of context.processes) {
        const pid = p.pid.toString().padStart(5);
        const user = (p.uid || 'root').padEnd(8);
        const name = p.name.padEnd(10);
        lines.push(`${name} ${pid} ${user}  cwd       DIR      253,0     4096          2 ${context.cwd}`);
        lines.push(`${name} ${pid} ${user}  txt       REG      253,0    45678    4567890 /usr/bin/${p.name}`);
        lines.push(`${name} ${pid} ${user}    0u      CHR        1,3      0t0       1025 /dev/pts/0`);
        lines.push(`${name} ${pid} ${user}    1u      CHR        1,3      0t0       1025 /dev/pts/0`);
        lines.push(`${name} ${pid} ${user}    2u      CHR        1,3      0t0       1025 /dev/pts/0`);
    }

    return { output: lines.join('\n') + '\n', exitCode: 0 };
};
