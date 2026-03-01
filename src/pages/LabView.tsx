import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TerminalComponent } from '../components/terminal/Terminal';
import { useLabStore } from '../stores/labStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { GuidedLabInstructions, DIYLabInstructions } from '../components/lab/LabComponents';
import { CelebrationModal } from '../components/onboarding/CelebrationModal';
import { ArrowLeft, RotateCcw } from 'lucide-react';

/**
 * LabView — Terminal + Lab instructions side by side.
 * Only renders when a lab is active. Accessed via /lab/:labId.
 */
const LabView: React.FC = () => {
    const { labId } = useParams<{ labId: string }>();
    const navigate = useNavigate();
    const { labs, progress, startLab, resetLab, exitLab, completeLab } = useLabStore();
    const { awardXP, updateStreak, hintPenalty, incrementCounter, checkAchievements } = useGamificationStore();

    const [startTime] = React.useState<number>(Date.now());
    const [hintsUsedThisSession, setHintsUsedThisSession] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const [xpAwarded, setXpAwarded] = React.useState(0);
    const [leveledUp, setLeveledUp] = React.useState<number | undefined>(undefined);

    const lab = labId ? labs[labId] : null;
    const labProgress = labId ? progress[labId] : null;

    // Auto-start lab if not already in progress
    useEffect(() => {
        if (labId && lab && (!labProgress || labProgress.status === 'available')) {
            startLab(labId);
        }
    }, [labId, lab, labProgress, startLab]);

    // Check for guided lab completion
    useEffect(() => {
        if (lab?.type === 'guided' && labProgress && lab.steps && labProgress.currentStepIndex >= lab.steps.length && labProgress.status !== 'completed') {
            handleComplete();
        }
    }, [labProgress?.currentStepIndex]);

    if (!lab) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="border-3 border-brutal-red bg-brutal-black p-8 text-center">
                    <p className="font-heading text-xl uppercase text-brutal-red mb-4">Lab Not Found</p>
                    <button
                        onClick={() => navigate('/labs')}
                        className="border-2 border-brutal-white text-brutal-white px-4 py-2 font-heading uppercase text-xs hover:bg-brutal-white hover:text-brutal-black transition-colors"
                    >
                        ← Back to Curriculum
                    </button>
                </div>
            </div>
        );
    }

    const handleComplete = () => {
        if (labProgress?.status === 'completed') return;

        const duration = Math.floor((Date.now() - startTime) / 1000);
        completeLab(lab.id);

        // Base XP
        awardXP(lab.xpReward);

        // Speed Bonus
        if (lab.parTime && duration <= lab.parTime) {
            const bonus = lab.parXpBonus || 50;
            awardXP(bonus);
            incrementCounter('speed-bonus-count');
            // Toast is handled by awardXP, but we could add a specific title
        }

        // Stats & Achievements
        updateStreak();
        const prevLabsCompleted = useGamificationStore.getState().labsCompleted;
        const newLabsCompleted = prevLabsCompleted + 1;
        const currentLevel = useGamificationStore.getState().level;

        useGamificationStore.setState((s) => ({ labsCompleted: newLabsCompleted }));

        if (hintsUsedThisSession === 0) {
            incrementCounter('perfect-lab-count');
        }

        checkAchievements();

        // If first lab, show celebration
        if (newLabsCompleted === 1) {
            setXpAwarded(lab.xpReward + (lab.parTime && duration <= lab.parTime ? (lab.parXpBonus || 50) : 0));
            // Check if they leveled up during this award
            const finalLevel = useGamificationStore.getState().level;
            if (finalLevel > currentLevel) {
                setLeveledUp(finalLevel);
            }
            setShowCelebration(true);
        } else {
            navigate('/labs');
        }
    };

    const handleHintUsed = () => {
        setHintsUsedThisSession(prev => prev + 1);
        hintPenalty();
        incrementCounter('hints-total');
    };

    const handleReset = () => {
        if (labId) resetLab(labId);
    };

    const handleExit = () => {
        exitLab();
        navigate('/labs');
    };

    return (
        <div className="h-full flex flex-col">
            {/* Lab Header Bar */}
            <div className="flex items-center justify-between border-b-3 border-brutal-green bg-brutal-black p-3 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExit}
                        className="border-2 border-brutal-white text-brutal-white p-1.5 hover:bg-brutal-white hover:text-brutal-black transition-colors"
                        title="Exit Lab"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h2 className="font-heading uppercase text-sm text-brutal-white">{lab.title}</h2>
                        <span className="text-[10px] text-brutal-gray">+{lab.xpReward} XP • Module {lab.module}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 border text-[10px] font-heading uppercase ${lab.type === 'guided'
                        ? 'border-brutal-green text-brutal-green'
                        : 'border-brutal-yellow text-brutal-yellow'
                        }`}>
                        {lab.type}
                    </span>
                    <button
                        onClick={handleReset}
                        className="border-2 border-brutal-yellow text-brutal-yellow p-1.5 hover:bg-brutal-yellow hover:text-brutal-black transition-colors"
                        title="Reset Lab"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal + Instructions Split */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-0">
                {/* Terminal — 60% */}
                <div className="lg:col-span-3 h-full min-h-0">
                    <ErrorBoundary section="Terminal">
                        <TerminalComponent />
                    </ErrorBoundary>
                </div>

                {/* Lab Instructions — 40% */}
                <div className="lg:col-span-2 h-full overflow-y-auto border-l-3 border-brutal-green bg-brutal-black p-4">
                    <ErrorBoundary section="Lab Instructions">
                        {lab.type === 'guided' && labProgress ? (
                            <GuidedLabInstructions
                                lab={lab}
                                currentStepIndex={labProgress.currentStepIndex}
                                onHintUsed={handleHintUsed}
                            />
                        ) : (
                            <DIYLabInstructions
                                lab={lab}
                                vfs={null as any}
                                userId="guest"
                                onComplete={handleComplete}
                                onHintUsed={handleHintUsed}
                            />
                        )}
                    </ErrorBoundary>
                </div>
            </div>

            {showCelebration && (
                <CelebrationModal
                    title="First Lab Complete!"
                    message={`You've successfully completed "${lab.title}". This is just the beginning of your Linux journey!`}
                    xpEarned={xpAwarded}
                    levelUp={leveledUp}
                    onContinue={() => navigate('/labs')}
                    onDashboard={() => navigate('/')}
                />
            )}
        </div>
    );
};

export default LabView;
