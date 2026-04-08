export type CreateFileArgs = {
    path: string;
    content: string;
    isSymlink?: boolean;
};

export type WriteFileArgs = {
    path: string;
    content: string;
    append: boolean;
};

export type DeleteFileArgs = {
    path: string;
};

export type MoveFileArgs = {
    src: string;
    dst: string;
};

export type ChmodArgs = {
    path: string;
    mode: string;
};
