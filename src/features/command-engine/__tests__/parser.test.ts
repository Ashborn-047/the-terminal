import { describe, it, expect } from 'vitest';
import { CommandParser } from '../parser';

describe('Command Parser', () => {
    it('should tokenize basic commands', () => {
        const pipeline = CommandParser.parse('ls -la /home');
        expect(pipeline.actions).toHaveLength(1);
        expect(pipeline.actions[0].name).toBe('ls');
        expect(pipeline.actions[0].args).toEqual(['-la', '/home']);
    });

    it('should respect quotes in tokenization', () => {
        const pipeline = CommandParser.parse('echo "hello world" \'single quotes\'');
        expect(pipeline.actions[0].args).toEqual(['hello world', 'single quotes']);
    });

    it('should handle pipes', () => {
        const pipeline = CommandParser.parse('cat file.txt | grep "pattern" | wc -l');
        expect(pipeline.actions).toHaveLength(3);
        expect(pipeline.actions[0].name).toBe('cat');
        expect(pipeline.actions[1].name).toBe('grep');
        expect(pipeline.actions[2].name).toBe('wc');
    });

    it('should handle redirections', () => {
        const pipeline = CommandParser.parse('echo "hello" > output.txt');
        expect(pipeline.actions[0].redirectionType).toBe('overwrite');
        expect(pipeline.actions[0].redirectionPath).toBe('output.txt');
    });

    it('should handle stderr redirection', () => {
        const pipeline = CommandParser.parse('ls non_existent 2> error.log');
        expect(pipeline.actions[0].redirectionType).toBe('stderr');
        expect(pipeline.actions[0].redirectionPath).toBe('error.log');
    });

    it('should handle combined redirection', () => {
        const pipeline = CommandParser.parse('cmd &> all.log');
        expect(pipeline.actions[0].redirectionType).toBe('both');
        expect(pipeline.actions[0].redirectionPath).toBe('all.log');
    });

    it('should handle compound commands (&&, ||, ;)', () => {
        const segments = CommandParser.parseCompound('ls && echo "success" || echo "fail"; pwd');
        expect(segments).toHaveLength(4);
        expect(segments[0].operator).toBe('&&');
        expect(segments[1].operator).toBe('||');
        expect(segments[2].operator).toBe(';');
        expect(segments[3].operator).toBe('end');
    });

    it('should expand environment variables', () => {
        const env = { USER: 'guest', PATH: '/bin' };
        const tokens = CommandParser.expand(['echo', '$USER', '${PATH}'], env);
        expect(tokens).toEqual(['echo', 'guest', '/bin']);
    });
});
