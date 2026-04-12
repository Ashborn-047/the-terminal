import { create } from 'zustand';
import { Signal } from '../features/command-engine/types';


interface Process {
    pid: number;
    name: string;
    user: string;
    startTime: number;
    status?: string;
}

interface TerminalState {
    processes: Process[];
    jobs: any[];
    foregroundProcess: number | null;
    nextPid: number; // For deterministic process IDs
    engineStatus: 'booting' | 'ready' | 'busy';
    setProcesses: (processes: Process[]) => void;
    setJobs: (jobs: any[]) => void;
    addProcess: (process: Process) => void;
    removeProcess: (pid: number) => void;
    resetProcesses: () => void;
    setForegroundProcess: (pid: number | null) => void;
    sendSignal: (pid: number, sig: Signal) => void;
    onSignal: (pid: number, handler: (sig: Signal) => void) => () => void;
    updateJobStatus: (jid: number, status: string) => void;
    getNextPid: () => number;
    setEngineStatus: (status: 'booting' | 'ready' | 'busy') => void;
}

const signalHandlers = new Map<number, Set<(sig: Signal) => void>>();

export const useTerminalStore = create<TerminalState>((set, get) => ({
    processes: [],
    jobs: [],
    foregroundProcess: null,
    nextPid: 1000,
    engineStatus: 'booting',
    setProcesses: (processes) => set({ processes }),
    setJobs: (jobs) => set({ jobs }),
    addProcess: (process) => set((state) => ({ processes: [...state.processes, process] })),
    removeProcess: (pid) => set((state) => ({ processes: state.processes.filter((p) => p.pid !== pid) })),
    resetProcesses: () => set({ processes: [] }),
    setForegroundProcess: (pid) => set({ foregroundProcess: pid }),
    sendSignal: (pid, sig) => {
        const handlers = signalHandlers.get(pid);
        if (handlers) {
            handlers.forEach((handler) => handler(sig));
        }
        // Immediately remove from process table if it's a kill signal to sync UI state
        if (sig === Signal.SIGKILL || sig === Signal.SIGTERM) {
            set((state) => ({ processes: state.processes.filter((p) => p.pid !== pid) }));
        }
    },
    updateJobStatus: (jid, status) => {
        set((state) => ({
            jobs: state.jobs.map(j => j.jid === jid ? { ...j, status } : j)
        }));
    },
    onSignal: (pid, handler) => {
        if (!signalHandlers.has(pid)) {
            signalHandlers.set(pid, new Set());
        }
        signalHandlers.get(pid)!.add(handler);
        return () => {
            const handlers = signalHandlers.get(pid);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    signalHandlers.delete(pid);
                }
            }
        };
    },
    getNextPid: () => {
        const pid = get().nextPid;
        set({ nextPid: pid + 1 });
        return pid;
    },
    setEngineStatus: (status) => set({ engineStatus: status }),
}));
