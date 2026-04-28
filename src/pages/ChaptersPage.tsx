import React, { useState, useEffect, useCallback } from 'react';
import { useGamificationStore } from '../stores/gamificationStore';
import { ChapterMetadata, sysadmin1Chapters, sysadmin2Chapters } from '../data/chapters/curriculum_metadata';
import { chapterContents, ChapterContent } from '../data/chapters/chapter_content_data';
import { ChapterAssessment, QuestionProvider } from '../features/lab-engine/providers/QuestionProvider';
import { TerminalComponent } from '../components/terminal/Terminal';
import { useTerminal } from '../hooks/useTerminal';
import { toastEmitter } from '../components/ToastNotification';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, Lock, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { 
    tokens, 
    Card, 
    Button, 
    Display, 
    Label, 
    Mono, 
    Badge 
} from '../components/ui/AshbornDesignSystem';

type ViewMode = 'list' | 'reading' | 'assessment';

const TrackSection = ({ title, chapters, level, completedChapterIds, onStartChapter }: any) => (
    <div style={{ marginBottom: tokens.space[12] }}>
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            marginBottom: tokens.space[6],
            borderBottom: `1px solid ${tokens.color.border.default}`,
            paddingBottom: tokens.space[3]
        }}>
            <Display size="sm" color={tokens.color.lime.base}>{title}</Display>
        </div>
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
            gap: tokens.space[6] 
        }}>
            {chapters.map((chapter: any, idx: number) => {
                const completed = completedChapterIds.includes(chapter.id);

                return (
                    <Card
                        key={chapter.id}
                        variant="interactive"
                        onClick={() => onStartChapter(chapter)}
                        style={{ 
                            padding: tokens.space[6], 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            border: `1px solid ${completed ? tokens.color.lime.base : tokens.color.border.default}`,
                            background: tokens.color.bg.surface,
                            minHeight: 200
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <Mono size="2xs" color={tokens.color.lime.base}>
                                    CHAPTER {idx + 1} | {chapter.objectiveCode}
                                </Mono>
                                {completed && <CheckCircle size={16} style={{ color: tokens.color.lime.base }} />}
                            </div>

                            <Display size="xs" style={{ marginBottom: 12 }}>{chapter.title}</Display>
                            
                            <p style={{ 
                                fontFamily: tokens.font.sans, 
                                fontSize: tokens.fontSize.xs, 
                                color: tokens.color.text.secondary,
                                lineHeight: 1.5,
                                marginBottom: 20,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {chapter.description}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <Button 
                                variant={completed ? "ghost" : "lime"} 
                                size="sm" 
                                style={{ flex: 1 }}
                            >
                                <BookOpen size={14} /> {completed ? 'Review Chapter' : 'Begin Chapter'}
                            </Button>
                            {chapter.requiredLevel > level && (
                                <Badge variant="warning" style={{ fontSize: 9 }}>
                                    LVL {chapter.requiredLevel}+ REC.
                                </Badge>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    </div>
);

export const ChaptersPage: React.FC = () => {
    const { level, awardXP, completedChapterIds, markChapterCompleted } = useGamificationStore();
    const [selectedChapter, setSelectedChapter] = useState<ChapterMetadata | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [readingSectionIndex, setReadingSectionIndex] = useState(0);
    const [sessionQuestions, setSessionQuestions] = useState<ChapterAssessment[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const terminalState = useTerminal();

    const handleStartChapter = (chapter: ChapterMetadata) => {
        setSelectedChapter(chapter);
        setReadingSectionIndex(0);
        setViewMode('reading');
        setIsCompleted(false);
    };

    const handleStartAssessment = async () => {
        if (!selectedChapter) return;
        try {
            const questions = await QuestionProvider.fetchSessionQuestions(selectedChapter.id, 5);
            setSessionQuestions(questions);
            setCurrentStepIndex(0);
            setInputValue('');
            setViewMode('assessment');
        } catch (error) {
            console.error('Failed to start assessment:', error);
            toastEmitter.emit({ type: 'error', title: 'Error', message: 'Failed to load chapter content.', duration: 3000 });
        }
    };

    const handleAnswerSubmit = () => {
        if (!selectedChapter || sessionQuestions.length === 0) return;
        const currentAssessment = sessionQuestions[currentStepIndex];
        let isCorrect = false;
        if (currentAssessment.type === 'mcq') {
            isCorrect = inputValue === currentAssessment.correctAnswer;
        } else if (currentAssessment.type === 'syntax_drill') {
            isCorrect = inputValue.trim() === currentAssessment.correctAnswer;
        }
        if (isCorrect) {
            handleStepAdvance();
        } else {
            toastEmitter.emit({ type: 'error', title: 'Incorrect', message: 'Try again.', duration: 2000 });
        }
    };

    const handleStepAdvance = useCallback(() => {
        if (!selectedChapter || sessionQuestions.length === 0) return;
        if (currentStepIndex < sessionQuestions.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setInputValue('');
        } else {
            handleChapterComplete(selectedChapter);
        }
    }, [selectedChapter, sessionQuestions, currentStepIndex]);

    const handleChapterComplete = (chapter: ChapterMetadata) => {
        setIsCompleted(true);
        const hasPracticeOnly = sessionQuestions.some(q => q.practiceOnly);
        if (!completedChapterIds.includes(chapter.id)) {
            if (!hasPracticeOnly) {
                awardXP(chapter.xpReward);
                markChapterCompleted(chapter.id);
                import('../lib/spacetime/index').then(({ spacetime }) => {
                    (spacetime as any).completeChapter?.(chapter.id);
                }).catch(e => console.error(e));
                toastEmitter.emit({
                    type: 'achievement',
                    title: 'Chapter Completed!',
                    message: `Earned ${chapter.xpReward} XP`,
                    icon: '📚'
                });
            } else {
                toastEmitter.emit({ type: 'info', title: 'Practice Completed', message: 'Authoring in progress. No XP awarded.', icon: '🛠️' });
            }
        } else {
            toastEmitter.emit({ type: 'info', title: 'Chapter Replayed', message: 'Practice makes perfect.', icon: '🔄' });
        }
    };

    useEffect(() => {
        if (!selectedChapter || sessionQuestions.length === 0 || isCompleted || viewMode !== 'assessment') return;
        const currentAssessment = sessionQuestions[currentStepIndex];
        if (currentAssessment.type === 'finale_terminal') {
            const lastCommand = terminalState.history[terminalState.history.length - 1];
            if (!lastCommand) return;
            let isMet = false;
            if (currentAssessment.regexMatch) {
                try {
                    isMet = new RegExp(currentAssessment.correctAnswer).test(lastCommand.command);
                } catch (e) { console.error('Invalid regex:', currentAssessment.correctAnswer); }
            } else {
                isMet = lastCommand.command.trim() === currentAssessment.correctAnswer.trim();
            }
            if (isMet) handleStepAdvance();
        }
    }, [terminalState.history, sessionQuestions, currentStepIndex, isCompleted, handleStepAdvance, selectedChapter, viewMode]);

    // Render logic for Reading Mode
    if (selectedChapter && viewMode === 'reading') {
        const content = chapterContents[selectedChapter.id];
        const sections = content?.sections || [
            { title: 'Placeholder', content: 'Detailed educational content for this chapter is being synchronized with the central repository. Please check back shortly for the full text.' }
        ];
        const currentSection = sections[readingSectionIndex];

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: tokens.color.bg.base }}>
                <div style={{ 
                    padding: tokens.space[6], 
                    borderBottom: `1px solid ${tokens.color.border.default}`, 
                    background: tokens.color.bg.surface, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div>
                        <Display size="sm" color={tokens.color.lime.base} style={{ marginBottom: 4 }}>
                            {selectedChapter.title}
                        </Display>
                        <Mono size="2xs" color={tokens.color.text.tertiary}>MODULE: {selectedChapter.objectiveCode} | READING PHASE</Mono>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
                        Exit
                    </Button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: tokens.space[8], display: 'flex', justifyContent: 'center' }}>
                    <div style={{ maxWidth: 800, width: '100%' }}>
                        <div style={{ marginBottom: 40, display: 'flex', gap: 8 }}>
                            {sections.map((_, i) => (
                                <div key={i} style={{ 
                                    flex: 1, 
                                    height: 4, 
                                    background: i <= readingSectionIndex ? tokens.color.lime.base : tokens.color.bg.surface,
                                    borderRadius: 2,
                                    transition: 'all 0.3s'
                                }} />
                            ))}
                        </div>

                        <motion.div
                            key={readingSectionIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Display size="lg" style={{ marginBottom: 24, lineHeight: 1.2 }}>{currentSection.title}</Display>
                            
                            <div style={{ 
                                fontFamily: tokens.font.sans, 
                                fontSize: tokens.fontSize.md, 
                                color: tokens.color.text.primary, 
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap'
                            }}>
                                {currentSection.content}
                            </div>
                        </motion.div>

                        <div style={{ 
                            marginTop: 64, 
                            paddingTop: 32, 
                            borderTop: `1px solid ${tokens.color.border.subtle}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Button 
                                variant="ghost" 
                                onClick={() => setReadingSectionIndex(prev => Math.max(0, prev - 1))}
                                disabled={readingSectionIndex === 0}
                            >
                                <ChevronLeft size={18} /> Previous
                            </Button>

                            {readingSectionIndex < sections.length - 1 ? (
                                <Button 
                                    variant="lime" 
                                    onClick={() => setReadingSectionIndex(prev => prev + 1)}
                                >
                                    Next Section <ChevronRight size={18} />
                                </Button>
                            ) : (
                                <Button 
                                    variant="lime" 
                                    size="lg"
                                    onClick={handleStartAssessment}
                                    style={{ padding: '16px 32px' }}
                                >
                                    Start Assessment <ArrowRight size={18} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render logic for Assessment Mode
    if (selectedChapter && viewMode === 'assessment') {
        const assessment = sessionQuestions[currentStepIndex];
        
        if (isCompleted) {
             return (
                 <div style={{ 
                     height: '100%', 
                     display: 'flex', 
                     flexDirection: 'column', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     background: tokens.color.bg.base, 
                     padding: tokens.space[8], 
                     textAlign: 'center' 
                 }}>
                     <CheckCircle size={80} style={{ color: tokens.color.lime.base, marginBottom: 24 }} />
                     <Display size="lg" style={{ marginBottom: 16 }}>Chapter Complete</Display>
                     <p style={{ color: tokens.color.text.secondary, marginBottom: 32, maxWidth: 480, fontFamily: tokens.font.sans }}>
                        You have successfully mastered the fundamentals of {selectedChapter.title}.
                     </p>
                     <Button variant="lime" size="lg" onClick={() => setViewMode('list')}>
                         Return to Curriculum
                     </Button>
                 </div>
             );
        }

        if (!assessment) return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Display size="sm">Loading Assessment...</Display></div>;

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: tokens.color.bg.base }}>
                <div style={{ 
                    padding: tokens.space[6], 
                    borderBottom: `1px solid ${tokens.color.border.default}`, 
                    background: tokens.color.bg.surface, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div>
                        <Display size="sm" color={tokens.color.lime.base} style={{ marginBottom: 4 }}>
                            {selectedChapter.title}
                        </Display>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Mono size="2xs" color={tokens.color.text.tertiary}>OBJECTIVE: {selectedChapter.objectiveCode}</Mono>
                            <Mono size="2xs" color={tokens.color.text.tertiary}>STEP {currentStepIndex + 1} OF {sessionQuestions.length}</Mono>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
                        Abort
                    </Button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: tokens.space[8], display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card style={{ maxWidth: 700, width: '100%', padding: tokens.space[8], border: `1px solid ${tokens.color.border.strong}` }}>
                        <Display size="xs" style={{ marginBottom: 32, lineHeight: 1.4, fontFamily: tokens.font.mono }}>
                            {assessment.question}
                        </Display>

                        {assessment.type === 'mcq' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {assessment.options?.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInputValue(opt)}
                                        style={{
                                            padding: tokens.space[4],
                                            textAlign: 'left',
                                            border: `1px solid ${inputValue === opt ? tokens.color.lime.base : tokens.color.border.default}`,
                                            background: inputValue === opt ? tokens.color.lime.alpha[8] : tokens.color.bg.overlay,
                                            color: inputValue === opt ? tokens.color.lime.base : tokens.color.text.primary,
                                            fontFamily: tokens.font.sans,
                                            fontSize: tokens.fontSize.sm,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                                <Button
                                    variant="lime"
                                    onClick={handleAnswerSubmit}
                                    disabled={!inputValue}
                                    style={{ marginTop: 24 }}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}

                        {assessment.type === 'syntax_drill' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                                    style={{
                                        width: '100%',
                                        background: tokens.color.bg.base,
                                        border: `1px solid ${tokens.color.border.strong}`,
                                        padding: tokens.space[4],
                                        color: tokens.color.lime.base,
                                        fontFamily: tokens.font.mono,
                                        fontSize: tokens.fontSize.md,
                                        outline: 'none'
                                    }}
                                    placeholder="Type command..."
                                    autoFocus
                                />
                                <Button variant="lime" onClick={handleAnswerSubmit}>
                                    Execute Drill
                                </Button>
                            </div>
                        )}

                        {assessment.type === 'finale_terminal' && (
                            <div style={{ marginTop: 16, border: `1px solid ${tokens.color.border.strong}`, height: 400 }}>
                                <TerminalComponent />
                            </div>
                        )}

                        {assessment.hint && (
                            <div style={{ marginTop: 24 }}>
                                <Label size="2xs" color={tokens.color.text.tertiary} italic>
                                    Hint: {assessment.hint}
                                </Label>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', width: '100%', overflowY: 'auto', background: tokens.color.bg.base, padding: "clamp(12px, 4vw, 32px)" }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <header style={{ 
                    marginBottom: tokens.space[10], 
                    borderBottom: `2px solid ${tokens.color.border.default}`, 
                    paddingBottom: tokens.space[6],
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                }}>
                    <Display size="2xl" color={tokens.color.lime.base}>Linux Mastery Track</Display>
                    <Label size="sm" color={tokens.color.text.secondary} uppercase letterSpacing={tokens.letterSpacing.widest} weight="bold">
                        The definitive path from foundation to professional system administration.
                    </Label>
                    <div style={{ 
                        height: 2, 
                        width: 60, 
                        background: tokens.color.lime.base,
                        marginTop: 8
                    }} />
                </header>

                <TrackSection 
                    title="Track 1: System Administration I"
                    chapters={sysadmin1Chapters}
                    level={level}
                    completedChapterIds={completedChapterIds}
                    onStartChapter={handleStartChapter}
                />

                <TrackSection 
                    title="Track 2: System Administration II"
                    chapters={sysadmin2Chapters}
                    level={level}
                    completedChapterIds={completedChapterIds}
                    onStartChapter={handleStartChapter}
                />
            </div>
        </div>
    );
};

export default ChaptersPage;
