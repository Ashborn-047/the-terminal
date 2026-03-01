import { CommandAction, CommandPipeline, RedirectionType } from './types';

export interface CompoundSegment {
    pipeline: CommandPipeline;
    operator: '&&' | '||' | ';' | 'end';
}

export class CommandParser {
    /**
     * Parse compound commands separated by ;, && or ||
     * Returns an array of segments, each with a pipeline and the operator that follows it.
     */
    public static parseCompound(input: string): CompoundSegment[] {
        const segments: CompoundSegment[] = [];
        let remaining = input.trim();

        while (remaining.length > 0) {
            // Find the next ;, && or ||  (not inside quotes)
            let splitIndex = -1;
            let operator: '&&' | '||' | ';' | 'end' = 'end';
            let opLen = 0;
            let inSingle = false;
            let inDouble = false;

            for (let i = 0; i < remaining.length; i++) {
                const c = remaining[i];
                if (c === "'" && !inDouble) { inSingle = !inSingle; continue; }
                if (c === '"' && !inSingle) { inDouble = !inDouble; continue; }
                if (inSingle || inDouble) continue;

                if (remaining[i] === '&' && remaining[i + 1] === '&') {
                    splitIndex = i; operator = '&&'; opLen = 2; break;
                }
                if (remaining[i] === '|' && remaining[i + 1] === '|') {
                    splitIndex = i; operator = '||'; opLen = 2; break;
                }
                if (remaining[i] === ';') {
                    splitIndex = i; operator = ';'; opLen = 1; break;
                }
            }

            if (splitIndex === -1) {
                // No more operators — last segment
                segments.push({ pipeline: this.parse(remaining), operator: 'end' });
                break;
            } else {
                const part = remaining.substring(0, splitIndex).trim();
                if (part) segments.push({ pipeline: this.parse(part), operator });
                remaining = remaining.substring(splitIndex + opLen).trim();
            }
        }

        return segments;
    }

    public static parse(input: string): CommandPipeline {
        const pipeline: CommandPipeline = { actions: [] };
        if (!input.trim()) return pipeline;

        // Split by pipes first (but not ||)
        const stages: string[] = [];
        let current = '';
        let inSingle = false;
        let inDouble = false;

        for (let i = 0; i < input.length; i++) {
            const c = input[i];
            if (c === "'" && !inDouble) { inSingle = !inSingle; current += c; continue; }
            if (c === '"' && !inSingle) { inDouble = !inDouble; current += c; continue; }
            if (inSingle || inDouble) { current += c; continue; }
            if (c === '|' && input[i + 1] !== '|') {
                stages.push(current);
                current = '';
                continue;
            }
            current += c;
        }
        if (current.trim()) stages.push(current);

        for (const stage of stages) {
            pipeline.actions.push(this.parseAction(stage.trim()));
        }

        return pipeline;
    }

    private static parseAction(stage: string): CommandAction {
        const action: CommandAction = {
            name: '',
            args: [],
            redirectionType: 'none',
        };

        let commandPart = stage;

        // Pattern matching for redirections (order is important: longest first)
        if (commandPart.includes('&>')) {
            const parts = commandPart.split('&>');
            commandPart = parts[0].trim();
            action.redirectionType = 'both';
            action.redirectionPath = parts[1].trim();
        } else if (commandPart.includes('2>')) {
            const parts = commandPart.split('2>');
            commandPart = parts[0].trim();
            action.redirectionType = 'stderr';
            action.redirectionPath = parts[1].trim();
        } else if (commandPart.includes('>>')) {
            const parts = commandPart.split('>>');
            commandPart = parts[0].trim();
            action.redirectionType = 'append';
            action.redirectionPath = parts[1].trim();
        } else if (commandPart.includes('>')) {
            const parts = commandPart.split('>');
            commandPart = parts[0].trim();
            action.redirectionType = 'overwrite';
            action.redirectionPath = parts[1].trim();
        }

        // Handle input redirection separately as it can coexist with output
        if (commandPart.includes('<')) {
            const parts = commandPart.split('<');
            commandPart = parts[0].trim();
            action.redirectionType = 'input';
            action.redirectionPath = parts[1].trim();
        }

        // Tokenize command and args
        const tokens = this.tokenize(commandPart);
        if (tokens.length > 0) {
            action.name = tokens[0];
            action.args = tokens.slice(1);
        }

        return action;
    }

    /**
     * Expand environment variables in tokens
     */
    public static expand(tokens: string[], env: Record<string, string>): string[] {
        return tokens.map(token => {
            // Very basic expansion: replace $VAR or ${VAR}
            return token.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => env[name] || '')
                .replace(/\${([a-zA-Z_][a-zA-Z0-9_]*)}/g, (_, name) => env[name] || '');
        });
    }

    private static tokenize(input: string): string[] {
        const regex = /\$\((?:[^)(]|\([^)(]*\))*\)|[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const tokens: string[] = [];
        let match;

        while ((match = regex.exec(input)) !== null) {
            tokens.push(match[1] || match[2] || match[0]);
        }

        return tokens;
    }
}
