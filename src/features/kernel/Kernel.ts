import { VFS } from '../vfs/vfs';
import { PCB, SyscallInterface, FileDescriptor } from './types';
import { useTerminalStore } from '../../stores/terminalStore';

/**
 * The Kernel class.
 * This isolates the VFS and global state from Userland.
 */
export class Kernel {
    private vfs: VFS;
    private processTable: Map<number, PCB> = new Map();
    private nextPid = 1000;

    constructor(vfs: VFS) {
        this.vfs = vfs;
        // PID 1 represents systemd/init
        this.processTable.set(1, {
            pid: 1,
            ppid: 0,
            uid: 'root',
            cwd: '/',
            fds: new Map(),
            status: 'sleeping'
        });
    }

    /**
     * Spawns a new process in the kernel.
     * In a full implementation, this would handle true fork semantics.
     */
    public spawnProcess(uid: string, cwd: string, stdoutCallback: (data: string) => void): PCB {
        const pid = this.nextPid++;
        const pcb: PCB = {
            pid,
            ppid: 1, // Parent is init for now
            uid,
            cwd,
            fds: new Map(),
            status: 'running'
        };

        // Setup standard FDs
        // 0 = stdin, 1 = stdout, 2 = stderr
        pcb.fds.set(1, {
            fd: 1,
            read: async () => { throw new Error('Cannot read from stdout'); },
            write: async (data: string) => {
                stdoutCallback(data); // Route stdout back to UI for the PoC
            }
        });

        this.processTable.set(pid, pcb);
        return pcb;
    }

    /**
     * Generates the Syscall interface for a specific process context.
     * Commands are injected with this object.
     */
    public createSyscallInterface(pid: number): SyscallInterface {
        const pcb = this.processTable.get(pid);
        if (!pcb) throw new Error(`Kernel Panic: Process ${pid} does not exist.`);

        return {
            sys_write: async (fd: number, data: string): Promise<number> => {
                const fileDescriptor = pcb.fds.get(fd);
                if (!fileDescriptor) return -1; // Bad file descriptor
                await fileDescriptor.write(data);
                return data.length;
            },
            sys_read: async (fd: number): Promise<string> => {
                const fileDescriptor = pcb.fds.get(fd);
                if (!fileDescriptor) return '';
                return await fileDescriptor.read();
            },
            sys_exit: async (code: number): Promise<void> => {
                pcb.status = 'zombie';
                // Trigger cleanup logic here
            },
            sys_getpid: (): number => {
                return pcb.pid;
            },
            sys_mkdir: async (path: string): Promise<number> => {
                // Here the Kernel validates permissions via VFS
                const result = await this.vfs.mkdir(path, pcb.uid, []);
                return result ? -1 : 0; // Simulated basic return code (0 = success)
            }
        };
    }
}
