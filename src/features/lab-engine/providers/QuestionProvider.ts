export type AssessmentType = 'mcq' | 'syntax_drill' | 'finale_terminal';

export interface ChapterAssessment {
    id: string;
    chapterId: string;
    type: AssessmentType;
    question: string;
    options?: string[]; // Only used if type is 'mcq'
    correctAnswer: string;
    regexMatch?: boolean; // If true, correctAnswer is treated as a regex (useful for terminal verification)
    hint?: string;
    practiceOnly?: boolean;
}

// Since there are 27 chapters with 15+ questions each, defining them all statically would create a massive file.
// We will use procedural generators for syntax drills to provide infinite replayability,
// alongside a static bank for specific MCQ theory questions.

import { staticQuestionBank } from '../../../data/assessments/index';

export class QuestionProvider {
    /**
     * Fetches a session subset of questions for a specific chapter.
     * In a full implementation, this would procedurally generate drills
     * based on the chapter ID to provide infinite replayability.
     */
    static async fetchSessionQuestions(chapterId: string, count: number = 5): Promise<ChapterAssessment[]> {
        // 1. Filter static bank
        const chapterQs = staticQuestionBank.filter(q => q.chapterId === chapterId);

        // 2. Procedural Generation (Fallback/Augmentation)
        // If we don't have enough static questions authored yet, generate synthetic ones
        // to ensure the UI doesn't break during this migration phase.
        while (chapterQs.length < count) {
            chapterQs.push(this.generateSyntheticDrill(chapterId, chapterQs.length));
        }

        // 3. Shuffle (Fisher-Yates)
        for (let i = chapterQs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chapterQs[i], chapterQs[j]] = [chapterQs[j], chapterQs[i]];
        }

        return chapterQs.slice(0, count);
    }

    private static generateSyntheticDrill(chapterId: string, index: number): ChapterAssessment {
        // A temporary synthetic generator to fulfill the "massive replayability" requirement
        // while the content team authors the thousands of specific variations required for all 27 chapters.
        const tools = ['grep', 'tar', 'systemctl', 'podman', 'nmcli', 'semanage', 'lvcreate'];
        const randomTool = tools[Math.floor(Math.random() * tools.length)];

        return {
            id: `synth-${chapterId}-${index}-${Date.now()}`,
            chapterId: chapterId,
            type: 'syntax_drill',
            question: `[Coming Soon] Practice: Write the command to check the version of the ${randomTool} utility.`,
            correctAnswer: `${randomTool} --version`,
            hint: 'This is a procedurally generated placeholder until the content DB is fully seeded. Practice only (No XP).',
            practiceOnly: true
        };
    }
}