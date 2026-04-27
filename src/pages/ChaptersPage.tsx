import React, { useState, useEffect } from 'react';
import { useGamificationStore } from '../stores/gamificationStore';
import { ChapterMetadata, sysadmin1Chapters, sysadmin2Chapters } from '../data/chapters/curriculum_metadata';
import { ChapterAssessment, QuestionProvider } from '../features/lab-engine/providers/QuestionProvider';
import { TerminalComponent } from '../components/terminal/Terminal';
import { useTerminal } from '../hooks/useTerminal';
import { toastEmitter } from '../components/ToastNotification';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';

export const ChaptersPage: React.FC = () => {
    const { level, awardXP } = useGamificationStore();
    const [selectedChapter, setSelectedChapter] = useState<ChapterMetadata | null>(null);
    const [sessionQuestions, setSessionQuestions] = useState<ChapterAssessment[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    // Simplistic tracking for demo, could be stored in gamificationStore
    const [completedChapterIds, setCompletedChapterIds] = useState<Set<string>>(new Set());

    const terminalState = useTerminal();

    const handleStartChapter = async (chapter: ChapterMetadata) => {
        if (level < chapter.requiredLevel) return;

        setSelectedChapter(chapter);

        // Dynamically fetch random questions for this chapter
        // We pull 5 questions to make it a quick drill session
        const questions = await QuestionProvider.fetchSessionQuestions(chapter.id, 5);
        setSessionQuestions(questions);

        setCurrentStepIndex(0);
        setIsCompleted(false);
        setInputValue('');
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

    const handleStepAdvance = () => {
        if (!selectedChapter || sessionQuestions.length === 0) return;
        if (currentStepIndex < sessionQuestions.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setInputValue('');
        } else {
            handleChapterComplete(selectedChapter);
        }
    };

    const handleChapterComplete = (chapter: ChapterMetadata) => {
        setIsCompleted(true);
        if (!completedChapterIds.has(chapter.id)) {
            awardXP(chapter.xpReward);
            setCompletedChapterIds(prev => new Set(prev).add(chapter.id));

            // Log chapter completion via spacetime (stubbed)
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
            toastEmitter.emit({
                type: 'info',
                title: 'Chapter Replayed',
                message: 'Practice makes perfect.',
                icon: '🔄'
            });
        }
    };

    // Terminal completion check logic for finale
    useEffect(() => {
        if (!selectedChapter || sessionQuestions.length === 0 || isCompleted) return;
        const currentAssessment = sessionQuestions[currentStepIndex];

        if (currentAssessment.type === 'finale_terminal') {
            // Check command history
            const lastCommand = terminalState.history[terminalState.history.length - 1];
            if (!lastCommand) return;

            let isMet = false;
            if (currentAssessment.regexMatch) {
                isMet = new RegExp(currentAssessment.correctAnswer).test(lastCommand.command);
            } else {
                isMet = lastCommand.command.trim() === currentAssessment.correctAnswer.trim();
            }

            if (isMet) {
                handleStepAdvance();
            }
        }
    }, [terminalState.history, sessionQuestions, currentStepIndex, isCompleted]);

    if (selectedChapter && sessionQuestions.length > 0) {
        const assessment = sessionQuestions[currentStepIndex];

        if (isCompleted) {
             return (
                 <div className="h-full flex flex-col items-center justify-center bg-black p-8 text-center">
                     <CheckCircle className="w-24 h-24 text-lime-500 mb-6" />
                     <h2 className="text-4xl text-white uppercase font-heading mb-4" style={{ fontFamily: 'Russo One' }}>Chapter Complete</h2>
                     <p className="text-gray-400 mb-8 max-w-lg">{selectedChapter.description}</p>
                     <button
                        onClick={() => setSelectedChapter(null)}
                        className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-black font-bold uppercase tracking-wider transition-colors"
                     >
                         Return to Curriculum
                     </button>
                 </div>
             );
        }

        return (
            <div className="h-full flex flex-col bg-gray-950">
                <div className="flex-none p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl text-lime-400 font-heading tracking-wider uppercase mb-1" style={{ fontFamily: 'Russo One' }}>
                            {selectedChapter.title}
                        </h2>
                        <div className="text-gray-500 text-sm font-mono tracking-widest uppercase">
                            Objective: {selectedChapter.objectiveCode} | Step {currentStepIndex + 1} of {sessionQuestions.length}
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedChapter(null)}
                        className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors uppercase text-xs font-bold"
                    >
                        Abort
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex justify-center items-center">
                    <div className="max-w-2xl w-full bg-gray-900 border-2 border-gray-800 p-8 shadow-2xl relative">
                        <h3 className="text-xl text-white mb-6 font-mono leading-relaxed">
                            {assessment.question}
                        </h3>

                        {assessment.type === 'mcq' && (
                            <div className="flex flex-col gap-3">
                                {assessment.options?.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInputValue(opt)}
                                        className={`p-4 text-left border-2 transition-colors font-sans ${inputValue === opt ? 'border-lime-500 bg-lime-500/10 text-lime-400' : 'border-gray-700 hover:border-gray-500 text-gray-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                                <button
                                    onClick={handleAnswerSubmit}
                                    disabled={!inputValue}
                                    className="mt-6 p-3 bg-white text-black font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        )}

                        {assessment.type === 'syntax_drill' && (
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                                    className="w-full bg-black border border-gray-700 p-4 text-lime-500 font-mono text-lg focus:outline-none focus:border-lime-500"
                                    placeholder="Type command..."
                                    autoFocus
                                />
                                <button
                                    onClick={handleAnswerSubmit}
                                    className="p-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors"
                                >
                                    Execute Drill
                                </button>
                            </div>
                        )}

                        {assessment.type === 'finale_terminal' && (
                            <div className="mt-4 border border-gray-700 h-96">
                                <TerminalComponent />
                            </div>
                        )}

                        {assessment.hint && (
                            <div className="mt-6 text-sm text-gray-500 italic">
                                Hint: {assessment.hint}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-black p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b-2 border-gray-800 pb-6">
                    <h1 className="text-5xl font-heading text-white uppercase tracking-tighter" style={{ fontFamily: 'Russo One, sans-serif' }}>
                        Enterprise Linux Curriculum
                    </h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm tracking-widest uppercase">
                        Mastery through rigorous, repeatable execution.
                    </p>
                </header>

                <h2 className="text-2xl text-lime-400 font-heading tracking-wider uppercase mb-6 mt-8 border-b border-gray-800 pb-2" style={{ fontFamily: 'Russo One' }}>
                    Track 1: System Administration I
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {sysadmin1Chapters.map((chapter, idx) => {
                        const locked = level < chapter.requiredLevel;
                        const completed = completedChapterIds.has(chapter.id);

                        return (
                            <motion.div
                                key={chapter.id}
                                whileHover={locked ? {} : { scale: 1.02, borderColor: 'var(--color-lime-base)' }}
                                onClick={() => handleStartChapter(chapter)}
                                className={`relative p-6 border-4 flex flex-col justify-between transition-colors duration-300 ${locked ? 'border-gray-800 bg-gray-900/50 opacity-75' : 'border-gray-700 bg-gray-900/80 cursor-pointer'}`}
                            >
                                <div>
                                    <div className="text-lime-500 font-mono text-sm mb-2 uppercase tracking-widest">Chapter {idx + 1} | {chapter.objectiveCode}</div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-heading text-2xl uppercase tracking-wider text-white" style={{ fontFamily: 'Russo One, sans-serif' }}>{chapter.title}</h3>
                                        {completed && !locked && <CheckCircle className="text-lime-500 w-6 h-6" />}
                                        {locked && <Lock className="text-gray-500 w-6 h-6" />}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">{chapter.description}</p>
                                </div>

                                {locked ? (
                                    <div className="w-full py-3 bg-gray-800/80 border border-gray-700 flex items-center justify-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                        <Lock size={16} /> Requires Level {chapter.requiredLevel}
                                    </div>
                                ) : (
                                    <div className="w-full py-3 bg-gray-800 border border-gray-700 flex items-center justify-center gap-2 text-white font-bold uppercase tracking-widest hover:bg-gray-700 transition-colors">
                                        <BookOpen size={16} /> {completed ? 'Review Chapter' : 'Begin Chapter'}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <h2 className="text-2xl text-lime-400 font-heading tracking-wider uppercase mb-6 mt-8 border-b border-gray-800 pb-2" style={{ fontFamily: 'Russo One' }}>
                    Track 2: System Administration II
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {sysadmin2Chapters.map((chapter, idx) => {
                        const locked = level < chapter.requiredLevel;
                        const completed = completedChapterIds.has(chapter.id);

                        return (
                            <motion.div
                                key={chapter.id}
                                whileHover={locked ? {} : { scale: 1.02, borderColor: 'var(--color-lime-base)' }}
                                onClick={() => handleStartChapter(chapter)}
                                className={`relative p-6 border-4 flex flex-col justify-between transition-colors duration-300 ${locked ? 'border-gray-800 bg-gray-900/50 opacity-75' : 'border-gray-700 bg-gray-900/80 cursor-pointer'}`}
                            >
                                <div>
                                    <div className="text-lime-500 font-mono text-sm mb-2 uppercase tracking-widest">Chapter {idx + 1} | {chapter.objectiveCode}</div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-heading text-2xl uppercase tracking-wider text-white" style={{ fontFamily: 'Russo One, sans-serif' }}>{chapter.title}</h3>
                                        {completed && !locked && <CheckCircle className="text-lime-500 w-6 h-6" />}
                                        {locked && <Lock className="text-gray-500 w-6 h-6" />}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">{chapter.description}</p>
                                </div>

                                {locked ? (
                                    <div className="w-full py-3 bg-gray-800/80 border border-gray-700 flex items-center justify-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                        <Lock size={16} /> Requires Level {chapter.requiredLevel}
                                    </div>
                                ) : (
                                    <div className="w-full py-3 bg-gray-800 border border-gray-700 flex items-center justify-center gap-2 text-white font-bold uppercase tracking-widest hover:bg-gray-700 transition-colors">
                                        <BookOpen size={16} /> {completed ? 'Review Chapter' : 'Begin Chapter'}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
