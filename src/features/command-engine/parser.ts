import { CommandAction, CommandPipeline, RedirectionType } from './types';

export class CommandParser {
    public static parse(input: string): CommandPipeline {
        const pipeline: CommandPipeline = { actions: [] };
        if (!input.trim()) return pipeline;

        // Split by pipes first
        const stages = input.split('|');

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

        // Handle redirections
        let commandPart = stage;
        if (stage.includes('>>')) {
            const parts = stage.split('>>');
            commandPart = parts[0].trim();
            action.redirectionType = 'append';
            action.redirectionPath = parts[1].trim();
        } else if (stage.includes('>')) {
            const parts = stage.split('>');
            commandPart = parts[0].trim();
            action.redirectionType = 'overwrite';
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

    private static tokenize(input: string): string[] {
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        const tokens: string[] = [];
        let match;

        while ((match = regex.exec(input)) !== null) {
            tokens.push(match[1] || match[2] || match[0]);
        }

        return tokens;
    }
}
