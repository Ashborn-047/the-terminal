import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TerminalComponent } from '../components/terminal/Terminal';
import { useLabStore } from '../stores/labStore';
import { getVFSSnapshot } from '../lib/vfsSnapshots';
import { useGamificationStore } from '../stores/gamificationStore';
import { useUIStore } from '../stores/uiStore';
import { useVFSStore } from '../stores/vfsStore';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { GuidedLabInstructions, DIYLabInstructions } from '../components/lab/LabComponents';
import { VFS } from '../features/vfs/vfs';
import { CelebrationModal } from '../components/onboarding/CelebrationModal';
import { SuccessAnimation } from '../components/ui/SuccessAnimation';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { 
    tokens, 
    Badge, 
    Button, 
    Card,
    Display,
    Label,
    Mono
} from '../components/ui/AshbornDesignSystem';

/**
 * LabView — Terminal + Lab instructions side by side.
 */
const LabView: React.FC = () => {
    const { labId } = useParams<{ labId: string }>();
    const navigate = useNavigate();
    const { labs, progress, startLab, resetLab, exitLab, completeLab, recordHintUsage, revealSolution } = useLabStore();
    const { processLabCompletion } = useGamificationStore();
    const { username } = useUIStore();
    const { snapshot } = useVFSStore();

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

    const { setSnapshot } = useVFSStore();

    useEffect(() => {
        if (!labId || !lab) return;
        if (labProgress?.status === 'locked' && !lab.prerequisites.every(p => progress[p]?.status === 'completed')) {
            navigate('/labs');
            return;
        }
        if (!labProgress || labProgress.status === 'available') {
            if (lab.initialVFS) {
                setSnapshot(getVFSSnapshot(lab.initialVFS));
            }
            startLab(labId);
        }
    }, [labId, lab, labProgress, startLab, setSnapshot, navigate, progress]);

    useEffect(() => {
        if (lab?.type === 'guided' && labProgress && lab.steps && labProgress.currentStepIndex >= lab.steps.length && labProgress.status !== 'completed') {
            handleComplete();
        }
    }, [labProgress?.currentStepIndex]);

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
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.color.bg.base }}>
                <Card style={{ padding: 32, textAlign: 'center', border: `1px solid ${tokens.color.amber.base}` }}>
                    <Display size="sm" color={tokens.color.amber.base} style={{ marginBottom: 16 }}>Lab Not Found</Display>
                    <Button variant="outline" onClick={() => navigate('/labs')}>← BACK TO CURRICULUM</Button>
                </Card>
            </div>
        );
    }

    const handleComplete = () => {
        if (labProgress?.status === 'completed') return;
        const currentLevel = useGamificationStore.getState().level;
        const prevLabsCompleted = useGamificationStore.getState().labsCompleted;
        completeLab(lab.id);
        const finalProgress = useLabStore.getState().progress[lab.id];
        if (vfsForVerification) {
            processLabCompletion(lab.id, lab, vfsForVerification);
        }
        const newLabsCompleted = prevLabsCompleted + 1;
        if (newLabsCompleted === 1) {
            setXpAwarded(lab.xpReward);
            const finalLevel = useGamificationStore.getState().level;
            if (finalLevel > currentLevel) {
                setLeveledUp(finalLevel);
            }
            setShowCelebration(true);
        } else {
            setIsSuccessActive(true);
            setTimeout(() => {
                navigate('/labs');
            }, 3000);
        }
    };

    const handleRevealSolution = () => {
        if (labId) revealSolution(labId);
    };

    const handleHintUsed = (stepIndex: number) => {
        if (labId) recordHintUsage(labId, stepIndex);
    };

    const handleReset = () => {
        if (labId && window.confirm("Reset the lab environment? All current terminal work will be lost.")) {
            resetLab(labId);
        }
    };

    const handleExit = () => {
        exitLab();
        navigate('/labs');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: tokens.color.bg.base }}>
            {/* Lab Header Strip */}
            <header style={{ 
                height: 44, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '0 12px', 
                background: tokens.color.bg.surface, 
                borderBottom: `1px solid ${tokens.color.border.default}`,
                flexShrink: 0 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={handleExit}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            padding: 4, 
                            cursor: 'pointer', 
                            color: tokens.color.text.tertiary,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = tokens.color.text.primary}
                        onMouseOut={(e) => e.currentTarget.style.color = tokens.color.text.tertiary}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Label size="xs" weight={800} color={tokens.color.amber.base} style={{ letterSpacing: tokens.letterSpacing.wide }}>
                            {lab.title}
                        </Label>
                        <Badge variant={lab.type === 'guided' ? 'lime' : 'amber'}>
                            {lab.type.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Time Tracker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }} className="hidden sm:flex">
                        <Label uppercase size="xs" color={tokens.color.text.tertiary}>Session Time</Label>
                        <Mono size="11px" weight={600} color={tokens.color.lime.base}>
                            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                        </Mono>
                    </div>

                    <div style={{ width: 1, height: 16, background: tokens.color.border.default }} />

                    {/* Progress Indicator */}
                    {lab.type === 'guided' && labProgress && lab.steps && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Label uppercase size="xs" color={tokens.color.text.tertiary}>Progress</Label>
                            <Mono size="10px" weight={800} color={tokens.color.text.primary}>
                                {Math.min(labProgress.currentStepIndex + 1, lab.steps.length)}
                            </Mono>
                            <Mono size="10px" color={tokens.color.text.tertiary}>/ {lab.steps.length}</Mono>
                        </div>
                    )}

                    <button
                        onClick={handleReset}
                        style={{
                            padding: 4,
                            background: 'none',
                            border: `1px solid ${tokens.color.amber.alpha[24]}`,
                            color: tokens.color.amber.base,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.15s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = tokens.color.amber.alpha[8];
                            e.currentTarget.style.borderColor = tokens.color.amber.base;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = tokens.color.amber.alpha[24];
                        }}
                        title="Reset Lab Environment"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </header>

            {/* Terminal + Instructions Split */}
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }} className="flex-col lg:flex-row">
                {/* Terminal Area */}
                <div style={{ 
                    flex: 3, 
                    minHeight: 0, 
                    borderRight: `1px solid ${tokens.color.border.default}`,
                    backgroundColor: tokens.color.bg.base 
                }}>
                    <ErrorBoundary section="Terminal">
                        <TerminalComponent />
                    </ErrorBoundary>
                </div>

                {/* Instructions Area */}
                <div style={{ 
                    flex: 2, 
                    minHeight: 0, 
                    overflowY: 'auto', 
                    padding: tokens.space[6],
                    backgroundColor: tokens.color.bg.surface 
                }}>
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
