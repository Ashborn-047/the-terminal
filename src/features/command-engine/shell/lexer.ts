export enum TokenType {
    WORD,
    PIPE,          // |
    AND_IF,        // &&
    OR_IF,         // ||
    SEMI,          // ;
    AMPERSAND,     // &
    LPAREN,        // (
    RPAREN,        // )
    LESS,          // <
    GREATER,       // >
    DGREATER,      // >>
    ERR_GREATER,   // 2>
    BOTH_GREATER,  // &>
    IF,            // if
    THEN,          // then
    ELSE,          // else
    FI,            // fi
    FOR,           // for
    IN,            // in
    WHILE,         // while
    DO,            // do
    DONE,          // done
    EOF,
}

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    col: number;
}

export class Lexer {
    private input: string;
    private pos: number = 0;
    private line: number = 1;
    private col: number = 1;

    constructor(input: string) {
        this.input = input;
    }

    private peek(): string {
        return this.input[this.pos] || '';
    }

    private advance(): string {
        const char = this.peek();
        this.pos++;
        if (char === '\n') {
            this.line++;
            this.col = 1;
        } else {
            this.col++;
        }
        return char;
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];
        while (this.pos < this.input.length) {
            const char = this.peek();

            if (/\s/.test(char)) {
                this.advance();
                continue;
            }

            const startLine = this.line;
            const startCol = this.col;

            if (char === '|') {
                this.advance();
                if (this.peek() === '|') {
                    this.advance();
                    tokens.push({ type: TokenType.OR_IF, value: '||', line: startLine, col: startCol });
                } else {
                    tokens.push({ type: TokenType.PIPE, value: '|', line: startLine, col: startCol });
                }
            } else if (char === '&') {
                this.advance();
                if (this.peek() === '&') {
                    this.advance();
                    tokens.push({ type: TokenType.AND_IF, value: '&&', line: startLine, col: startCol });
                } else if (this.peek() === '>') {
                    this.advance();
                    tokens.push({ type: TokenType.BOTH_GREATER, value: '&>', line: startLine, col: startCol });
                } else {
                    tokens.push({ type: TokenType.AMPERSAND, value: '&', line: startLine, col: startCol });
                }
            } else if (char === ';') {
                this.advance();
                tokens.push({ type: TokenType.SEMI, value: ';', line: startLine, col: startCol });
            } else if (char === '(') {
                this.advance();
                tokens.push({ type: TokenType.LPAREN, value: '(', line: startLine, col: startCol });
            } else if (char === ')') {
                this.advance();
                tokens.push({ type: TokenType.RPAREN, value: ')', line: startLine, col: startCol });
            } else if (char === '<') {
                this.advance();
                tokens.push({ type: TokenType.LESS, value: '<', line: startLine, col: startCol });
            } else if (char === '>') {
                this.advance();
                if (this.peek() === '>') {
                    this.advance();
                    tokens.push({ type: TokenType.DGREATER, value: '>>', line: startLine, col: startCol });
                } else {
                    tokens.push({ type: TokenType.GREATER, value: '>', line: startLine, col: startCol });
                }
            } else if (char === '2' && this.input[this.pos + 1] === '>') {
                this.advance();
                this.advance();
                tokens.push({ type: TokenType.ERR_GREATER, value: '2>', line: startLine, col: startCol });
            } else {
                const word = this.readWord();
                const reserved: Record<string, TokenType> = {
                    'if': TokenType.IF,
                    'then': TokenType.THEN,
                    'else': TokenType.ELSE,
                    'fi': TokenType.FI,
                    'for': TokenType.FOR,
                    'in': TokenType.IN,
                    'while': TokenType.WHILE,
                    'do': TokenType.DO,
                    'done': TokenType.DONE,
                };
                if (reserved[word.value] !== undefined) {
                    word.type = reserved[word.value];
                }
                tokens.push(word);
            }
        }
        tokens.push({ type: TokenType.EOF, value: '', line: this.line, col: this.col });
        return tokens;
    }

    private readWord(): Token {
        const startLine = this.line;
        const startCol = this.col;
        let value = '';
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let parenLevel = 0;

        while (this.pos < this.input.length) {
            const char = this.peek();

            if (!inSingleQuote && !inDoubleQuote) {
                if (char === '(' && value.endsWith('$')) {
                    parenLevel++;
                } else if (char === ')' && parenLevel > 0) {
                    parenLevel--;
                } else if (parenLevel === 0 && (/\s/.test(char) || '|&;()<>'.includes(char))) {
                    // Check if it's 2>
                    if (char === '2' && this.input[this.pos + 1] === '>') {
                        break;
                    }
                    if (!'|&;()<>'.includes(char) || value.length > 0) {
                        break;
                    }
                }
            }

            if (char === "'" && !inDoubleQuote) {
                inSingleQuote = !inSingleQuote;
                this.advance();
                continue;
            }

            if (char === '"' && !inSingleQuote) {
                inDoubleQuote = !inDoubleQuote;
                this.advance();
                continue;
            }

            if (char === '\\' && !inSingleQuote) {
                this.advance(); // consume \
                value += this.advance();
                continue;
            }

            value += this.advance();
        }

        return { type: TokenType.WORD, value, line: startLine, col: startCol };
    }
}
