import { create } from 'zustand';
import { Signal, Job, Process, JobStatus } from '../features/command-engine/types';

interface TerminalState {
    processes: Process[];
    jobs: Job[];
    foregroundProcess: number | null;
    setProcesses: (processes: Process[]) => void;
    addProcess: (process: Process) => void;
    removeProcess: (pid: number) => void;
    setJobs: (jobs: Job[]) => void;
    addJob: (job: Job) => void;
    updateJobStatus: (jid: number, status: JobStatus) => void;
    removeJob: (jid: number) => void;
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
    setProcesses: (processes: Process[]) => set({ processes }),
    addProcess: (process: Process) => set((state: TerminalState) => ({ processes: [...state.processes, process] })),
    removeProcess: (pid: number) => set((state: TerminalState) => ({ processes: state.processes.filter((p) => p.pid !== pid) })),
    setJobs: (jobs: Job[]) => set({ jobs }),
    addJob: (job: Job) => set((state: TerminalState) => ({ jobs: [...state.jobs, job] })),
    updateJobStatus: (jid: number, status: JobStatus) => set((state: TerminalState) => ({
        jobs: state.jobs.map(j => j.jid === jid ? { ...j, status } : j)
    })),
    removeJob: (jid: number) => set((state: TerminalState) => ({ jobs: state.jobs.filter(j => j.jid !== jid) })),
    resetProcesses: () => set({ processes: [], jobs: [] }),
    setForegroundProcess: (pid: number | null) => set({ foregroundProcess: pid }),
    sendSignal: (pid: number, sig: Signal) => {
        const handlers = signalHandlers.get(pid);
        if (handlers) {
            handlers.forEach((handler) => handler(sig));
        }
    },
    onSignal: (pid: number, handler: (sig: Signal) => void) => {
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
