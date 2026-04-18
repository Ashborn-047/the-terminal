
import { VFS } from '../src/features/vfs/vfs';
import { CommandExecutor } from '../src/features/command-engine/executor';
import { CommandParser } from '../src/features/command-engine/parser';
import { terminalStore } from '../src/features/terminal/terminalStore';

async function debug() {
    console.log('--- STARTING SUID DEBUG ---');
    const vfs = new VFS();
    const executor = new CommandExecutor(vfs);
    
    console.log('1. Setting up SUID tool...');
    await vfs.writeFile('/bin/suid_tool', 'echo UID: $(id -u)', 'root');
    await vfs.chmod('/bin/suid_tool', '4755', 'root');

    const context = {
        userId: 'guest',
        cwd: '/home/guest',
        env: { HOME: '/home/guest', PATH: '/bin:/usr/bin' },
        groups: ['guest'],
        processes: [],
        updateProcesses: () => {},
        updateJobs: () => {},
        jobManager: {
            getJob: () => null,
            addJob: () => ({ id: 1, pgid: 1234, state: 'RUNNING' }),
            removeJob: () => {},
            listJobs: () => []
        }
    };

    console.log('2. Parsing /bin/suid_tool...');
    const pipeline = CommandParser.parse('/bin/suid_tool');
    
    console.log('3. Executing...');
    const result = await executor.execute(pipeline, context as any);
    
    console.log('4. Verification:');
    console.log('Result Output:', JSON.stringify(result.output));
    console.log('Result Error:', JSON.stringify(result.error));
    console.log('Exit Code:', result.exitCode);

    if (result.output.includes('UID: 0')) {
        console.log('SUCCESS: Captured UID: 0');
    } else {
        console.log('FAILURE: Output missing expected string.');
    }
}

debug().catch(console.error);
