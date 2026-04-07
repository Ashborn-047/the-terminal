import { VFS } from '../../vfs/vfs';
import { CommandRegistry } from '../registry';
import { ShellEnvironment } from './environment';

export class TabCompleter {
    private vfs: VFS;

    constructor(vfs: VFS) {
        this.vfs = vfs;
    }

    public complete(input: string, env: ShellEnvironment, userId: string): string[] {
        const trimmed = input.trimEnd();
        const parts = input.split(/\s+/);
        const lastPart = input.endsWith(' ') ? '' : parts[parts.length - 1];

        // 1. Variable Completion
        if (lastPart.startsWith('$')) {
            const varName = lastPart.substring(1);
            const envVars = env.exportToRecord();
            return Object.keys(envVars)
                .filter(k => k.startsWith(varName))
                .map(k => `$${k}`);
        }

        // 2. Command Completion (if it's the first word)
        if (parts.length === 1 && !input.endsWith(' ')) {
            const cmds = CommandRegistry.list();
            return cmds.filter(c => c.startsWith(lastPart));
        }

        // 3. File Path Completion
        return this.completePath(lastPart, env.get('PWD'), userId);
    }

    private completePath(partialPath: string, cwd: string, userId: string): string[] {
        const lastSlash = partialPath.lastIndexOf('/');
        let dirPath = lastSlash === -1 ? '.' : partialPath.substring(0, lastSlash) || '/';
        let search = lastSlash === -1 ? partialPath : partialPath.substring(lastSlash + 1);

        const absoluteDirPath = dirPath === '.' ? cwd : (dirPath.startsWith('/') ? dirPath : cwd + '/' + dirPath);
        const children = this.vfs.listChildren(absoluteDirPath, userId);

        if (Array.isArray(children)) {
            return children
                .filter(c => c.name.startsWith(search))
                .map(c => {
                    const prefix = partialPath.substring(0, lastSlash + 1);
                    return prefix + c.name + (c.type === 'directory' ? '/' : '');
                });
        }

        return [];
    }
}
