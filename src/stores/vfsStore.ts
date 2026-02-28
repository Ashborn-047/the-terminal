import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VFSSnapshot } from '../features/vfs/types';
import { VFS } from '../features/vfs/vfs';

interface VFSState {
    snapshot: VFSSnapshot | null;
    setSnapshot: (snapshot: VFSSnapshot) => void;
    resetVFS: () => void;
}

export const useVFSStore = create<VFSState>()(
    persist(
        (set) => ({
            snapshot: null,
            setSnapshot: (snapshot) => set({ snapshot }),
            resetVFS: () => set({ snapshot: null }),
        }),
        {
            name: 'the-terminal-vfs',
        }
    )
);
