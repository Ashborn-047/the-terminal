import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TerminalComponent } from '../components/terminal/Terminal';
import { useLabStore } from '../stores/labStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { useUIStore } from '../stores/uiStore';
import { useVFSStore } from '../stores/vfsStore';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { GuidedLabInstructions, DIYLabInstructions } from '../components/lab/LabComponents';
import { VFS } from '../features/vfs/vfs';
import { CelebrationModal } from '../components/onboarding/CelebrationModal';
import { SuccessAnimation } from '../components/ui/SuccessAnimation';
import { ArrowLeft, RotateCcw } from 'lucide-react';

/**
 * LabView — Terminal + Lab instructions side by side.
 * Only renders when a lab is active. Accessed via /lab/:labId.
 */
const LabView: React.FC = () => {
    const { labId } = useParams<{ labId: string }>();
    const navigate = useNavigate();
    const { labs, progress, startLab, resetLab, exitLab, completeLab, recordHintUsage, revealSolution } = useLabStore();
    const { processLabCompletion } = useGamificationStore();
    const { username } = useUIStore();
    const { snapshot } = useVFSStore();

    // Create a live VFS instance from the persisted snapshot for DIY verification
    const vfsForVerification = React.useMemo(() => {
        if (!snapshot) return null;
        return new VFS(snapshot);
    }, [snapshot]);

    const [showCelebration, setShowCelebration] = React.useState(false);
    const [xpAwarded, setXpAwarded] = React.useState(0);
    const [leveledUp, setLeveledUp] = React.useState<number | undefined>(undefined);
    const [seconds, setSeconds] = React.useState(0);
    const [isSuccessActive, setIsSuccessActive] = React.useState(false);

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
            console.log('LAB_DEBUG: Conditions met, triggering handleComplete()', {
                currentStepIndex: labProgress.currentStepIndex,
                totalSteps: lab.steps.length,
                status: labProgress.status
            });
            handleComplete();
        }
    }, [labProgress?.currentStepIndex]);

    // Timer for UI display
    useEffect(() => {
        if (labProgress?.status !== 'in-progress') return;
        const interval = setInterval(() => {
            const now = Date.now();
            const sessionTime = labProgress.startTime ? Math.floor((now - labProgress.startTime) / 1000) : 0;
            setSeconds((labProgress.totalTimeSpent || 0) + sessionTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [labProgress?.status, labProgress?.startTime, labProgress?.totalTimeSpent]);

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

        const currentLevel = useGamificationStore.getState().level;
        const prevLabsCompleted = useGamificationStore.getState().labsCompleted;

        // Finalize store state (computes final totalTimeSpent)
        completeLab(lab.id);

        // Re-fetch latest progress state for processing rewards
        const finalProgress = useLabStore.getState().progress[lab.id];

        // Process rewards and achievements
        processLabCompletion(lab, finalProgress);

        const newLabsCompleted = prevLabsCompleted + 1;
        console.log('LAB_DEBUG: handleComplete', { prevLabsCompleted, newLabsCompleted, labId: lab.id });

        // If first lab, show celebration
        if (newLabsCompleted === 1) {
            setXpAwarded(lab.xpReward); // Approximate for summary
            const finalLevel = useGamificationStore.getState().level;
            if (finalLevel > currentLevel) {
                setLeveledUp(finalLevel);
            }
            setShowCelebration(true);
        } else {
            setIsSuccessActive(true);
            setTimeout(() => {
                navigate('/labs');
            }, 3000); // Wait for animation
        }
    };

    const handleRevealSolution = () => {
        if (labId) revealSolution(labId);
    };

    const handleHintUsed = (stepIndex: number) => {
        if (labId) recordHintUsage(labId, stepIndex);
    };

    const handleReset = () => {
        if (labId) resetLab(labId);
    };

    const handleExit = () => {
        exitLab();
        navigate('/labs');
    };

    return (
        <div className="flex flex-col h-full w-full bg-brutal-black">
            {/* Lab Header Strip */}
            <div className="flex items-center justify-between p-3 border-b-2 border-brutal-white/20 shrink-0 bg-brutal-dark">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExit}
                        className="text-brutal-gray hover:text-brutal-white transition-colors"
                        title="Back to Curriculum"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="font-heading uppercase text-brutal-yellow font-bold text-sm tracking-wider">
                            {lab.title}
                        </span>
                        <span className="font-mono text-[10px] text-brutal-green border border-brutal-green/50 px-1.5 py-0.5 uppercase tracking-widest hidden sm:inline-block">
                            {lab.type}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Time Tracker */}
                    <div className="flex items-center gap-2 mr-4 text-brutal-gray font-mono text-[10px] hidden sm:flex">
                        <span className="uppercase">Time</span>
                        <span className="text-brutal-white text-xs">
                            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                        </span>
                    </div>

                    {/* Progress Indicator */}
                    {lab.type === 'guided' && labProgress && lab.steps && (
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-brutal-white">
                            <span>Step</span>
                            <span className="text-brutal-yellow">
                                {Math.min(labProgress.currentStepIndex + 1, lab.steps.length)}
                            </span>
                            <span className="text-brutal-gray">/ {lab.steps.length}</span>
                        </div>
                    )}

                    <button
                        onClick={handleReset}
                        className="p-1 border border-brutal-yellow/50 text-brutal-yellow hover:bg-brutal-yellow hover:text-brutal-black transition-colors rounded-sm"
                        title="Reset Lab Environment"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal + Instructions Split - Exact layout matching Stitch mock */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-brutal-black">
                {/* Terminal — Left Side (or Top on small screens) */}
                <div className="flex-[3] min-h-0 border-b-2 lg:border-b-0 lg:border-r-3 border-brutal-white/20">
                    <ErrorBoundary section="Terminal">
                        <TerminalComponent />
                    </ErrorBoundary>
                </div>

                {/* Lab Instructions — Right Side (or Bottom) */}
                <div className="flex-[2] min-h-0 overflow-y-auto bg-brutal-dark">
                    <ErrorBoundary section="Lab Instructions">
                        {lab.type === 'guided' && labProgress ? (
                            <GuidedLabInstructions
                                lab={lab}
                                currentStepIndex={labProgress.currentStepIndex}
                                onHintUsed={handleHintUsed}
                                onRevealSolution={handleRevealSolution}
                                solutionRevealed={labProgress.solutionRevealed}
                            />
                        ) : (
                            <DIYLabInstructions
                                lab={lab}
                                vfs={vfsForVerification as any}
                                userId={username || 'guest'}
                                onComplete={handleComplete}
                                onHintUsed={handleHintUsed}
                                onRevealSolution={handleRevealSolution}
                                solutionRevealed={labProgress?.solutionRevealed}
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
            <SuccessAnimation active={isSuccessActive} />
        </div>
    );
};

export default LabView;
