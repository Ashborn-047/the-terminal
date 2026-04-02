import { CommandContext, CommandResult } from '../types';

export const printf = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', exitCode: 0 };

    const format = args[0];
    const params = args.slice(1);
    let output = '';
    let paramIndex = 0;

    // Helper to handle escape sequences
    const handleEscapes = (str: string): string => {
        return str
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\')
            .replace(/\\x([0-9a-fA-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    };

    // Very basic printf implementation for common specifiers
    output = format.replace(/%([sdb])/g, (match, specifier) => {
        const val = params[paramIndex++] || '';
        if (specifier === 's') return String(val);
        if (specifier === 'd') return String(parseInt(val as string, 10) || 0);
        if (specifier === 'b') return handleEscapes(String(val));
        return match;
    });

    // POSIX printf also handles escapes in the format string itself
    output = handleEscapes(output);

    return { output, exitCode: 0 };
};
