import { CommandContext, CommandResult } from '../types';
import { COMMAND_DOCS } from '../../../data/commandDocs';

/**
 * man — per project_documentation.md §4.4:
 * Interactive Command Reference integrated with commandDocs.ts
 */
export const man = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) {
        return {
            output: 'What manual page do you want?\nFor example, try \'man ls\'.\n',
            exitCode: 0,
        };
    }

    const name = args[0].toLowerCase();
    const doc = COMMAND_DOCS[name];

    if (!doc) {
        return {
            output: '',
            error: `No manual entry for ${name}`,
            exitCode: 1,
        };
    }

    const lines: string[] = [
        `${doc.name.toUpperCase()}(1)`,
        '',
        'NAME',
        `       ${doc.name} — ${doc.description.split('.')[0]}`,
        '',
        'SYNOPSIS',
        `       ${doc.synopsis}`,
        '',
        'DESCRIPTION',
        `       ${doc.description}`,
    ];

    if (doc.options.length > 0) {
        lines.push('', 'OPTIONS');
        for (const opt of doc.options) {
            lines.push(`       ${opt.flag.padEnd(16)} ${opt.desc}`);
        }
    }

    if (doc.examples.length > 0) {
        lines.push('', 'EXAMPLES');
        for (const ex of doc.examples) {
            lines.push(`       $ ${ex}`);
        }
    }

    if (doc.seeAlso.length > 0) {
        lines.push('', 'SEE ALSO');
        lines.push(`       ${doc.seeAlso.map(s => `${s}(1)`).join(', ')}`);
    }

    return { output: lines.join('\n') + '\n', exitCode: 0 };
};
