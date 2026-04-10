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
            return `${(p.uid || 'root').padEnd(8)} ${p.pid.toString().padStart(5)}  ${cpu}  0.1  2356   1400 pts/0    ${p.status || 'S'}    12:00   ${timeStr} ${p.name}`;
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
        return { cpu, row: `${p.pid.toString().padStart(5)} ${(p.uid || 'root').padEnd(8)} 20   0    2356   1400    800 ${p.status || 'S'}  ${cpu.toFixed(1).padStart(4)}   0.0   ${timeStr.padStart(7)} ${p.name}` };
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
    const targets = args.filter(a => !a.startsWith('-'));

    if (signalArg) {
        const sigStr = signalArg.slice(1).toUpperCase();
        if (sigStr === '9' || sigStr === 'KILL') signalToEmit = Signal.SIGKILL;
        else if (sigStr === '15' || sigStr === 'TERM') signalToEmit = Signal.SIGTERM;
        else if (sigStr === '2' || sigStr === 'INT') signalToEmit = Signal.SIGINT;
        else if (sigStr === '19' || sigStr === 'STOP') signalToEmit = Signal.SIGSTOP;
        else if (sigStr === '18' || sigStr === 'CONT') signalToEmit = Signal.SIGCONT;
    }

    const terminalStore = useTerminalStore.getState();
    let found = false;
    let output = '';

    for (const target of targets) {
        let pid = parseInt(target, 10);
        
        // Support %JID
        if (target.startsWith('%')) {
            const job = context.jobManager.getJobBySpec(target);
            if (job) pid = job.pgid;
        }

        if (isNaN(pid)) {
            output += `kill: ${target}: invalid PID or job ID\n`;
            continue;
        }

        const proc = context.processes.find(p => p.pid === pid) || context.jobManager.getJob(pid);
        if (proc) {
            terminalStore.sendSignal(pid, signalToEmit);
            found = true;
            
            // Realism: Terminating a job updates the job table
            if (signalToEmit === Signal.SIGKILL || signalToEmit === Signal.SIGTERM) {
                const spec = target.startsWith('%') ? target : `%${pid}`;
                const job = context.jobManager.getJobBySpec(spec);
                if (job) {
                    context.jobManager.terminateJob(job.id, signalToEmit);
                }
            }
        } else {
            output += `kill: (${target}) - No such process\n`;
        }
    }

    return { output, exitCode: found ? 0 : 1 };
};

