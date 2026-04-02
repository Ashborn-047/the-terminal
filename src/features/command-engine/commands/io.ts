import { CommandContext, CommandResult } from '../types';
import { CommandRegistry } from '../registry';
import { readStream } from '../utils';

export const tee = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    const append = args.includes('-a');
    const paths = args.filter(a => !a.startsWith('-'));
    const content = await readStream(input);

    for (const filePath of paths) {
        const fullPath = filePath.startsWith('/') ? filePath : (context.cwd === '/' ? '/' + filePath : context.cwd + '/' + filePath);
        const result = context.vfs.resolve(fullPath, context.userId, context.groups);
        
        if (typeof result !== 'string') {
            const existing = context.vfs.readFile(fullPath, context.userId, context.groups);
            const newContent = (append && typeof existing === 'string') ? existing + content : content;
            context.vfs.writeFile(fullPath, newContent, context.userId, context.groups);
        } else {
            // Auto-touch parent if needed (simple version)
            const parts = fullPath.split('/').filter(Boolean);
            const name = parts.pop() || '';
            const parentPath = '/' + parts.join('/');
            context.vfs.touch(parentPath || '/', name, context.userId, context.groups);
            context.vfs.writeFile(fullPath, content, context.userId, context.groups);
        }
    }
    return { output: content, exitCode: 0 };
};

export const xargs = async (args: string[], context: CommandContext, input: string | AsyncGenerator<string>): Promise<CommandResult> => {
    const pipedText = await readStream(input);
    const items = pipedText.split(/\s+/).filter(Boolean);
    const cmdName = args[0] || 'echo';
    const cmdArgs = args.slice(1);

    const cmd = CommandRegistry.get(cmdName);
    if (!cmd) return { output: '', error: `xargs: ${cmdName}: command not found`, exitCode: 127 };

    // Batch execution: in a real xargs, this would handle batching.
    // For the simulator, we'll run it once with all items.
    const result = await cmd([...cmdArgs, ...items], context, '');
    return result;
};
