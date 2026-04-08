import { Lexer, Token, TokenType } from './lexer';
import { 
    ASTNode, 
    NodeType, 
    CommandNode, 
    PipelineNode, 
    LogicalNode, 
    SequenceNode, 
    IfNode, 
    ForNode, 
    WhileNode, 
    SubshellNode,
    Redirection,
    RedirectionType
} from './ast';

export class Parser {
    private tokens: Token[];
    private pos: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private peek(): Token {
        return this.tokens[this.pos];
    }

    private advance(): Token {
        return this.tokens[this.pos++];
    }

    private match(type: TokenType): boolean {
        if (this.peek()?.type === type) {
            this.advance();
            return true;
        }
        return false;
    }

    public parse(stopTokens: TokenType[] = []): ASTNode {
        const nodes: ASTNode[] = [];
        while (this.peek().type !== TokenType.EOF && !stopTokens.includes(this.peek().type)) {
            const startPos = this.pos;
            nodes.push(this.parseLogical());
            if (this.match(TokenType.SEMI) || this.match(TokenType.AMPERSAND)) {
                // Background/Sequence handled here
            }
            if (this.pos === startPos) {
                // Safety: advance if no progress made
                this.advance();
            }
        }
        if (nodes.length === 0) return { type: NodeType.COMMAND, name: '', args: [], redirections: [], background: false } as CommandNode;
        return nodes.length === 1 ? nodes[0] : { type: NodeType.SEQUENCE, nodes } as SequenceNode;
    }

    private parseLogical(): ASTNode {
        let node = this.parsePipeline();

        while (true) {
            if (this.match(TokenType.AND_IF)) {
                node = {
                    type: NodeType.LOGICAL_AND,
                    left: node,
                    right: this.parsePipeline()
                } as LogicalNode;
            } else if (this.match(TokenType.OR_IF)) {
                node = {
                    type: NodeType.LOGICAL_OR,
                    left: node,
                    right: this.parsePipeline()
                } as LogicalNode;
            } else {
                break;
            }
        }

        return node;
    }

    private parsePipeline(): ASTNode {
        const commands: CommandNode[] = [];
        commands.push(this.parseCommand());

        while (this.match(TokenType.PIPE)) {
            commands.push(this.parseCommand());
        }

        if (commands.length === 1) return commands[0];
        return { type: NodeType.PIPELINE, commands } as PipelineNode;
    }

    private parseCommand(): CommandNode {
        const token = this.peek();
        switch (token.type) {
            case TokenType.IF: return this.parseIf() as any;
            case TokenType.FOR: return this.parseFor() as any;
            case TokenType.WHILE: return this.parseWhile() as any;
            case TokenType.LPAREN: return this.parseSubshell() as any;
            default: return this.parseSimpleCommand();
        }
    }

    private parseSimpleCommand(): CommandNode {
        const node: CommandNode = {
            type: NodeType.COMMAND,
            name: '',
            args: [],
            redirections: [],
            background: false
        };

        while (this.peek().type === TokenType.WORD || this.isRedirection(this.peek().type)) {
            const t = this.peek();
            if (this.isRedirection(t.type)) {
                node.redirections.push(this.parseRedirection());
            } else {
                if (!node.name) {
                    node.name = t.value;
                } else {
                    node.args.push(t.value);
                }
                this.advance();
            }
        }

        return node;
    }

    private isRedirection(type: TokenType): boolean {
        return [
            TokenType.LESS, 
            TokenType.GREATER, 
            TokenType.DGREATER, 
            TokenType.ERR_GREATER, 
            TokenType.BOTH_GREATER
        ].includes(type);
    }

    private parseRedirection(): Redirection {
        const token = this.advance();
        const typeMap: Record<number, RedirectionType> = {
            [TokenType.LESS]: 'input',
            [TokenType.GREATER]: 'overwrite',
            [TokenType.DGREATER]: 'append',
            [TokenType.ERR_GREATER]: 'stderr',
            [TokenType.BOTH_GREATER]: 'both',
        };
        
        const pathToken = this.match(TokenType.WORD) ? this.tokens[this.pos - 1] : null;
        if (!pathToken) throw new Error(`Expected path after redirection operator ${token.value}`);

        return {
            type: typeMap[token.type],
            path: pathToken.value
        };
    }

    private parseIf(): IfNode {
        this.advance(); // skip 'if'
        const condition = this.parse([TokenType.THEN]);
        
        if (!this.match(TokenType.THEN)) throw new Error("Expected 'then' after if condition");
        const thenBranch = this.parse([TokenType.ELSE, TokenType.FI]);
        
        let elseBranch: ASTNode | undefined;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.parse([TokenType.FI]);
        }
        
        if (!this.match(TokenType.FI)) throw new Error("Expected 'fi' to close if statement");
        return { type: NodeType.IF, condition, thenBranch, elseBranch };
    }

    private parseFor(): ForNode {
        this.advance(); // skip 'for'
        const varToken = this.advance();
        if (varToken.type !== TokenType.WORD) throw new Error("Expected variable name after 'for'");
        
        if (!this.match(TokenType.IN)) throw new Error("Expected 'in' after for variable");
        
        const items: string[] = [];
        while (this.peek().type === TokenType.WORD) {
            items.push(this.advance().value);
        }
        
        if (!this.match(TokenType.DO)) throw new Error("Expected 'do' before for body");
        const body = this.parse([TokenType.DONE]);
        
        if (!this.match(TokenType.DONE)) throw new Error("Expected 'done' to close for loop");
        return { type: NodeType.FOR, variable: varToken.value, items, body };
    }

    private parseWhile(): WhileNode {
        this.advance(); // skip 'while'
        const condition = this.parse([TokenType.DO]);
        
        if (!this.match(TokenType.DO)) throw new Error("Expected 'do' after while condition");
        const body = this.parse([TokenType.DONE]);
        
        if (!this.match(TokenType.DONE)) throw new Error("Expected 'done' to close while loop");
        return { type: NodeType.WHILE, condition, body };
    }

    private parseSubshell(): SubshellNode {
        this.advance(); // skip '('
        const pipeline = this.parse([TokenType.RPAREN]);
        if (!this.match(TokenType.RPAREN)) throw new Error("Expected ')' to close subshell");
        return { type: NodeType.SUBSHELL, pipeline };
    }
}
