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
    setProcesses: (processes: Process[]) => void;
    setJobs: (jobs: any[]) => void;
    addProcess: (process: Process) => void;
    removeProcess: (pid: number) => void;
    resetProcesses: () => void;
    setForegroundProcess: (pid: number | null) => void;
    sendSignal: (pid: number, sig: Signal) => void;
    onSignal: (pid: number, handler: (sig: Signal) => void) => () => void;
}

const signalHandlers = new Map<number, Set<(sig: Signal) => void>>();

export const useTerminalStore = create<TerminalState>((set) => ({
    processes: [],
    jobs: [],
    foregroundProcess: null,
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
}));
