import { VFS } from '../vfs/vfs';
import { Process as StoreProcess } from '../../stores/terminalStore';

/**
 * File Descriptor representation.
 * In a true streaming model, this would wrap Web Streams or EventEmitters.
 * For the PoC, we will simulate synchronous buffer writing.
 */
export interface FileDescriptor {
    fd: number;
    read: () => Promise<string>;
    write: (data: string) => Promise<void>;
}

/**
 * Process Control Block (PCB)
 * The Kernel's internal representation of a running process.
 */
export interface PCB {
    pid: number;
    ppid: number;
    uid: string;
    cwd: string;
    fds: Map<number, FileDescriptor>;
    status: 'running' | 'sleeping' | 'stopped' | 'zombie';
}

/**
 * The interface passed to Userland commands.
 * Commands ONLY know about these functions.
 */
export interface SyscallInterface {
    sys_write(fd: number, data: string): Promise<number>;
    sys_read(fd: number): Promise<string>;
    sys_exit(code: number): Promise<void>;
    sys_getpid(): number;
    sys_mkdir(path: string): Promise<number>; // returns 0 on success, <0 on error
}
