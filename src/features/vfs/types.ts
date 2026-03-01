export type FileType = 'file' | 'directory' | 'symlink';

export interface VFSPermissions {
    read: boolean;
    write: boolean;
    execute: boolean;
}

export interface InodePermissions {
    owner: VFSPermissions;
    group: VFSPermissions;
    others: VFSPermissions;
    sticky?: boolean;
    setuid?: boolean;
    setgid?: boolean;
}

export interface Inode {
    id: string;
    type: FileType;
    name: string;
    permissions: InodePermissions;
    ownerId: string;
    groupId: string;
    size: number;
    createdAt: number;
    modifiedAt: number;
    content?: string; // For files
    children?: string[]; // For directories (array of Inode IDs)
    target?: string; // For symlinks (path)
}

export interface VFSSnapshot {
    rootId: string;
    inodes: Record<string, Inode>;
}
