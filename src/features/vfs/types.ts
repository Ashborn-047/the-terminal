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

/**
 * POSIX Inode: Represents the literal metadata and data storage of a file object.
 * Does NOT contain a name; multiple Dentries can point to one Inode.
 */
export interface Inode {
    id: string;
    type: FileType;
    permissions: InodePermissions;
    ownerId: string; // User ID of the owner
    groupId: string; // Group ID of the owner
    nlink: number; // Link count (number of dentries pointing here)
    size: number;
    atime: number; // Access time
    mtime: number; // Modification time
    ctime: number; // Change time
    content?: string; // Data for files
    target?: string;  // Destination for symlinks
    isVirtual?: boolean; 
    handler?: (userId: string) => string; 
}

/**
 * Directory Entry (Dentry): Represents the hierarchical name link in the VFS tree.
 */
export interface Dentry {
    id: string;      // Unique ID for the directory entry
    name: string;    // Name of the file/dir in this context
    inodeId: string; // The inode this entry points to
    parentId: string | null; // ID of the parent Dentry
    children?: string[]; // IDs of child dentries
}

export interface VFSSnapshot {
    rootDentryId: string;
    dentries: Record<string, Dentry>;
    inodeTable: Record<string, Inode>;
}
