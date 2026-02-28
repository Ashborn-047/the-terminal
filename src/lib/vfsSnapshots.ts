/**
 * VFS Snapshot Creator — per command_engine_vfs.md §2.3 & lab_engine_documentation.md
 * Creates named VFS snapshots for different lab environments.
 * Each lab can reference a snapshot name via Lab.initialVFS.
 */
import { VFS } from '../features/vfs/vfs';
import { VFSSnapshot } from '../features/vfs/types';

/** Create a fresh default VFS snapshot */
function createDefaultSnapshot(): VFSSnapshot {
    const vfs = new VFS();
    return vfs.getSnapshot();
}

/** Create an HPC-themed VFS for Module 3+ labs */
function createHPCSnapshot(): VFSSnapshot {
    const vfs = new VFS();
    // Add HPC-specific directories
    vfs.mkdir('/opt', 'root');
    vfs.mkdir('/opt/tools', 'root');
    vfs.mkdir('/data', 'root');
    vfs.mkdir('/data/datasets', 'root');
    vfs.mkdir('/data/output', 'root');
    // Add sample data files
    vfs.touch('/data/datasets/sample.csv', 'root');
    vfs.writeFile('/data/datasets/sample.csv', 'id,name,value\n1,alpha,100\n2,beta,200\n3,gamma,300\n4,delta,400\n5,epsilon,500');
    vfs.touch('/opt/tools/analyzer.sh', 'root');
    vfs.writeFile('/opt/tools/analyzer.sh', '#!/bin/bash\necho "Analyzing data..."');
    vfs.chmod('/opt/tools/analyzer.sh', '755');
    return vfs.getSnapshot();
}

/** Create a permissions-focused VFS for Module 4 labs */
function createPermissionsSnapshot(): VFSSnapshot {
    const vfs = new VFS();
    // Add files with various permissions
    vfs.mkdir('/home/guest/secure', 'guest');
    vfs.touch('/home/guest/secure/secret.txt', 'root');
    vfs.writeFile('/home/guest/secure/secret.txt', 'TOP SECRET: The cake is a lie');
    vfs.chmod('/home/guest/secure/secret.txt', '600');
    vfs.touch('/home/guest/public.txt', 'guest');
    vfs.writeFile('/home/guest/public.txt', 'This file is readable by everyone.');
    vfs.chmod('/home/guest/public.txt', '644');
    vfs.touch('/home/guest/runme.sh', 'guest');
    vfs.writeFile('/home/guest/runme.sh', '#!/bin/bash\necho "Hello from the script!"');
    vfs.chmod('/home/guest/runme.sh', '644'); // Not executable yet — user must chmod
    return vfs.getSnapshot();
}

/** Named snapshot registry */
const SNAPSHOT_REGISTRY: Record<string, () => VFSSnapshot> = {
    'default': createDefaultSnapshot,
    'hpc-base': createHPCSnapshot,
    'permissions-lab': createPermissionsSnapshot,
};

/**
 * Get a VFS snapshot by name. Falls back to 'default' if not found.
 * Always returns a fresh snapshot (not a shared reference).
 */
export function getVFSSnapshot(name?: string): VFSSnapshot {
    const factory = SNAPSHOT_REGISTRY[name || 'default'] || SNAPSHOT_REGISTRY['default'];
    return factory();
}

/** Register a custom snapshot (for testing or dynamic labs) */
export function registerSnapshot(name: string, factory: () => VFSSnapshot) {
    SNAPSHOT_REGISTRY[name] = factory;
}
