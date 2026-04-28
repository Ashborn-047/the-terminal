import { Kernel } from './Kernel';
import { VFS } from '../vfs/vfs';
import { echo_kernel, mkdir_kernel } from './poc_command';

/**
 * A proof-of-concept shell executor to demonstrate the kernel boundary.
 */
export async function runPoC() {
    const vfs = new VFS(); // The raw, isolated VFS
    const kernel = new Kernel(vfs); // The bouncer

    let outputBuffer = "";

    // 1. The Shell asks the Kernel to spawn a process for the 'guest' user
    const pcb = kernel.spawnProcess('guest', '/', (data) => {
        outputBuffer += data;
    });

    // 2. The Kernel provides the execution context (Syscalls)
    const syscalls = kernel.createSyscallInterface(pcb.pid);

    console.log(`[Shell] Executing 'echo' via Kernel... Process PID: ${pcb.pid}`);

    // 3. The Userland command executes, isolated from the VFS
    await echo_kernel(["Hello", "from", "Userland!"], syscalls);

    console.log(`[Shell] Process exited. Stdout Buffer: ${outputBuffer.trim()}`);
}
