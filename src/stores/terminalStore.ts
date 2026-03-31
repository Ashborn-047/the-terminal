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
    foregroundProcess: number | null;
    setProcesses: (processes: Process[]) => void;
    addProcess: (process: Process) => void;
    removeProcess: (pid: number) => void;
    resetProcesses: () => void;
    setForegroundProcess: (pid: number | null) => void;
    sendSignal: (pid: number, sig: Signal) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
    processes: [],
    foregroundProcess: null,
    setProcesses: (processes) => set({ processes }),
    addProcess: (process) => set((state) => ({ processes: [...state.processes, process] })),
    removeProcess: (pid) => set((state) => ({ processes: state.processes.filter((p) => p.pid !== pid) })),
    resetProcesses: () => set({ processes: [] }),
    setForegroundProcess: (pid) => set({ foregroundProcess: pid }),
    sendSignal: (pid, sig) => {
        // Implement signal emission logic in next commit
    },
}));
