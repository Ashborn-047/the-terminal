import { VFS } from './src/features/vfs/vfs';

async function test() {
    const vfs = new VFS();
    console.log('Initial exists(/home/guest):', vfs.exists('/home/guest'));
    console.log('Initial exists(/home/nav_test):', vfs.exists('/home/nav_test'));

    vfs.ensureUserHome('nav_test');
    console.log('After ensureUserHome exists(/home/nav_test):', vfs.exists('/home/nav_test'));

    const res = vfs.mkdir('/home/nav_test', 'testdir', 'nav_test');
    console.log('mkdir testdir result:', typeof res === 'string' ? res : 'Success');
    console.log('exists(/home/nav_test/testdir):', vfs.exists('/home/nav_test/testdir'));

    const resolveRes = vfs.resolve('/home/nav_test/testdir', 'nav_test');
    console.log('resolve result type:', typeof resolveRes);
    if (typeof resolveRes !== 'string') {
        console.log('resolve result name:', resolveRes.name);
        console.log('resolve result owner:', resolveRes.ownerId);
    }
}

test().catch(console.error);
