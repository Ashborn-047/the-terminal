import { CommandContext, CommandResult } from '../types';

export const tar = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const flags = args[0] || '';

    if (flags.includes('c')) {
        const archiveName = args.find(a => a.endsWith('.tar') || a.endsWith('.tar.gz') || a.endsWith('.tgz')) || 'archive.tar';
        return { output: `tar: created archive '${archiveName}' (simulated)\n`, exitCode: 0 };
    } else if (flags.includes('x')) {
        return { output: 'tar: extracted archive (simulated)\n', exitCode: 0 };
    } else if (flags.includes('t')) {
        return { output: 'tar: listing archive contents (simulated)\n', exitCode: 0 };
    }

    return { output: '', error: 'tar: You must specify one of -c, -x, or -t', exitCode: 1 };
};

export const gzip = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'gzip: missing operand', exitCode: 1 };
    return { output: `gzip: compressed '${args[0]}' (simulated)\n`, exitCode: 0 };
};

export const gunzip = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'gunzip: missing operand', exitCode: 1 };
    return { output: `gunzip: decompressed '${args[0]}' (simulated)\n`, exitCode: 0 };
};
