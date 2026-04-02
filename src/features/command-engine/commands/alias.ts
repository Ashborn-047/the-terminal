import { CommandContext, CommandResult } from '../types';

export const alias = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) {
        const lines = Object.entries(context.aliases).map(([name, value]) => `alias ${name}='${value}'`);
        return { output: lines.join('\n') + (lines.length > 0 ? '\n' : ''), exitCode: 0 };
    }

    for (const arg of args) {
        if (arg.includes('=')) {
            const [name, ...valueParts] = arg.split('=');
            let value = valueParts.join('=');
            // Remove surrounding quotes if any
            if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.substring(1, value.length - 1);
            }
            const updatedAliases = { ...context.aliases, [name]: value };
            context.updateAliases(updatedAliases);
        } else {
            const value = context.aliases[arg];
            if (value) {
                return { output: `alias ${arg}='${value}'\n`, exitCode: 0 };
            } else {
                return { output: '', error: `alias: ${arg}: not found`, exitCode: 1 };
            }
        }
    }

    return { output: '', exitCode: 0 };
};

export const unalias = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) return { output: '', error: 'unalias: usage: unalias name [name ...]', exitCode: 1 };

    const updatedAliases = { ...context.aliases };
    let foundAll = true;

    for (const name of args) {
        if (updatedAliases[name]) {
            delete updatedAliases[name];
        } else {
            foundAll = false;
        }
    }

    context.updateAliases(updatedAliases);
    return { output: '', exitCode: foundAll ? 0 : 1 };
};
