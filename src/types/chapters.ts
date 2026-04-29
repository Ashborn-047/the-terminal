export type SectionType = 'text' | 'hands_on_examples' | 'common_mistakes' | 'pro_corner' | 'looking_ahead' | 'summary' | 'interactive';

export interface Callout {
    type: 'pro_tip' | 'caution' | 'info' | 'try_it';
    text?: string;
    icon?: string;
    content?: string;
}

export interface TerminalBlock {
    command?: string;
    output?: string;
    showPrompt?: boolean;
}

export interface Subsection {
    heading: string;
    content: string;
    callouts?: Callout[];
    diagram?: {
        type: string;
        tree?: string[];
        caption?: string;
    };
}

export interface Exercise {
    title: string;
    command?: string;
    commands?: string[];
    expected_output?: string;
    explanation?: string;
    try_it_yourself: string;
    callouts?: Callout[];
    caution?: string;
}

export interface ChapterSection {
    type: SectionType;
    id: string;
    heading: string;
    content?: string;
    list?: string[];
    subsections?: Subsection[];
    intro?: string;
    exercises?: Exercise[];
    items?: string[];
    tips?: string[];
    bullets?: string[];
    terminal_blocks?: TerminalBlock[];
    terminal_blocks_after?: TerminalBlock[];
    terminal_blocks_extra?: TerminalBlock[];
    diagram_block?: string;
    reveal?: {
        summary: string;
        content: string;
    };
    callouts?: Callout[];
    // Legacy compatibility fields
    title?: string;
}

export interface ChapterContent {
    chapterId: string;
    title: string;
    description: string;
    sections: ChapterSection[];
}
