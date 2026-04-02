import { CommandContext, CommandResult, Signal } from '../types';
import { useTerminalStore } from '../../../stores/terminalStore';

export const ps = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const showAll = args.includes('-a') || args.includes('aux') || args.includes('-e');
    const header = showAll ? 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND' : '  PID TTY          TIME CMD';
    const lines = context.processes.map(p => {
        const elapsed = Math.floor((Date.now() - p.startTime) / 1000), mins = Math.floor(elapsed / 60), secs = elapsed % 60;
        const timeStr = `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (showAll) {
            const cpu = p.name === 'cryptominer' ? '99.9' : '0.0';
            return `${p.user.padEnd(8)} ${p.pid.toString().padStart(5)}  ${cpu}  0.1  2356   1400 pts/0    ${p.status || 'S'}    12:00   ${timeStr} ${p.name}`;
        }
        return `${p.pid.toString().padStart(5)} pts/0    ${timeStr} ${p.name}`;
    });
    return { output: `${header}\n${lines.join('\n')}`, exitCode: 0 };
};

export const top = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const hasRogue = context.processes.some(p => p.name === 'cryptominer');
    const cpuLine = hasRogue ? '%Cpu(s): 99.9 us,  0.1 sy,  0.0 ni,  0.0 id,  0.0 wa' : '%Cpu(s):  2.3 us,  1.0 sy,  0.0 ni, 96.5 id,  0.2 wa';
    const rows = context.processes.map(p => {
        const elapsed = Math.floor((Date.now() - p.startTime) / 1000), timeStr = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}.00`;
        const cpu = p.name === 'cryptominer' ? 99.9 : 0.0;
        return { cpu, row: `${p.pid.toString().padStart(5)} ${p.user.padEnd(8)} 20   0    2356   1400    800 ${p.status || 'S'}  ${cpu.toFixed(1).padStart(4)}   0.0   ${timeStr.padStart(7)} ${p.name}` };
    }).sort((a, b) => b.cpu - a.cpu);

    const output = [
        `top - ${new Date().toLocaleTimeString()}, up 1 day, 3:27, 1 user, load average: 0.15, 0.12, 0.10`,
        `Tasks: ${context.processes.length} total, 1 running, ${context.processes.length - 1} sleeping`,
        cpuLine,
        'MiB Mem :   7966 total,   3726 free,   2291 used,   1949 buff/cache',
        '',
        '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        ...rows.map(r => r.row)
    ];
    return { output: output.join('\n'), exitCode: 0 };
};

export const kill = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'kill: missing operand', exitCode: 1 };
    
    let signalToEmit = Signal.SIGTERM;
    const signalArg = args.find(a => a.startsWith('-'));
    if (signalArg) {
        const sigNum = parseInt(signalArg.slice(1), 10);
        if (sigNum === 9) signalToEmit = Signal.SIGKILL;
        else if (sigNum === 15) signalToEmit = Signal.SIGTERM;
        else if (sigNum === 2) signalToEmit = Signal.SIGINT;
    }

    const pids = args.filter(a => !a.startsWith('-')).map(Number);
    if (pids.some(isNaN)) return { output: '', error: 'kill: invalid PID', exitCode: 1 };
    
    const terminalStore = useTerminalStore.getState();
    let found = false;
    for (const pid of pids) {
        const proc = context.processes.find(p => p.pid === pid);
        if (proc) {
            terminalStore.sendSignal(pid, signalToEmit);
            found = true;
            if (signalToEmit === Signal.SIGKILL || signalToEmit === Signal.SIGTERM) {
                const nextProcesses = context.processes.filter(p => p.pid !== pid);
                context.updateProcesses(nextProcesses);
            }
        }
    }

    if (!found) return { output: '', error: `kill: (${pids.join(' ')}) - No such process`, exitCode: 1 };
    return { output: '', exitCode: 0 };
};
