export enum NodeType {
    COMMAND,
    PIPELINE,
    LOGICAL_AND,
    LOGICAL_OR,
    SEQUENCE, // ;
    IF,
    FOR,
    WHILE,
    SUBSHELL,
}

export type RedirectionType = 'overwrite' | 'append' | 'input' | 'stderr' | 'both';

export interface Redirection {
    type: RedirectionType;
    path: string;
}

export interface ASTNode {
    type: NodeType;
}

export interface CommandNode extends ASTNode {
    type: NodeType.COMMAND;
    name: string;
    args: string[];
    redirections: Redirection[];
    background: boolean;
}

export interface PipelineNode extends ASTNode {
    type: NodeType.PIPELINE;
    commands: CommandNode[];
}

export interface LogicalNode extends ASTNode {
    type: NodeType.LOGICAL_AND | NodeType.LOGICAL_OR;
    left: ASTNode;
    right: ASTNode;
}

export interface SequenceNode extends ASTNode {
    type: NodeType.SEQUENCE;
    nodes: ASTNode[];
}

export interface IfNode extends ASTNode {
    type: NodeType.IF;
    condition: ASTNode;
    thenBranch: ASTNode;
    elseBranch?: ASTNode;
}

export interface ForNode extends ASTNode {
    type: NodeType.FOR;
    variable: string;
    items: string[];
    body: ASTNode;
}

export interface WhileNode extends ASTNode {
    type: NodeType.WHILE;
    condition: ASTNode;
    body: ASTNode;
}

export interface SubshellNode extends ASTNode {
    type: NodeType.SUBSHELL;
    pipeline: ASTNode;
}
