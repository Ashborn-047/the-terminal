import { describe, it, expect } from 'vitest';
import { Lexer } from '../features/command-engine/shell/lexer';
import { Parser } from '../features/command-engine/shell/parser';
import { NodeType } from '../features/command-engine/shell/ast';

describe('Lexer/Parser Debug', () => {
    it('should parse a simple command', () => {
        const lexer = new Lexer('echo hello');
        const tokens = lexer.tokenize();
        expect(tokens.length).toBeGreaterThan(0);
        
        const parser = new Parser(tokens);
        const ast = parser.parse();
        expect(ast.type).toBe(NodeType.COMMAND);
    });
});
