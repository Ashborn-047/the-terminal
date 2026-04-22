import React, { useState } from 'react';
import { Lab, VFS } from '../../features/lab-engine/types';
import { VerificationEngine } from '../../features/lab-engine/verification';
import { useTerminalStore } from '../../stores/terminalStore';
import { Lock, CheckCircle, Play, HelpCircle, Award, ChevronRight, AlertTriangle } from 'lucide-react';
import { 
    tokens, 
    Card, 
    Badge, 
    Button, 
    ProgressBar,
    Divider,
    Display,
    Label,
    Mono
} from '../ui/AshbornDesignSystem';

// ======================================================================
//  LabCard 
// ======================================================================
interface LabCardProps {
    lab: Lab;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
    progress?: number;
    onStart: (labId: string) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, status, onStart }) => {
    return (
        <Card
            variant={status === 'in-progress' ? 'active' : status === 'locked' ? 'locked' : 'default'}
            data-testid={`lab-card-${lab.id}`}
            style={{ 
                opacity: status === 'locked' ? 0.4 : 1,
                cursor: status === 'locked' ? 'not-allowed' : 'default',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'border-color 0.2s ease',
                borderColor: status === 'completed' ? tokens.color.lime.base : tokens.color.border.default,
                padding: tokens.space[6] // STANDARD 24px PADDING
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.space[4] }}>
                <Display size="sm" style={{ maxWidth: '85%', color: tokens.color.text.primary }}>
                    {lab.title}
                </Display>
                <Badge variant={lab.type === 'guided' ? 'lime' : 'amber'}>
                    {lab.type.toUpperCase()}
                </Badge>
            </div>

            <p style={{ 
                fontFamily: tokens.font.sans,
                fontSize: tokens.fontSize.xs, 
                color: tokens.color.text.secondary, 
                marginBottom: tokens.space[6], 
                flex: 1,
                lineHeight: 1.5
            }}>
                {lab.description}
            </p>

            <Divider style={{ margin: '0 0 16px 0', opacity: 0.15 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Label uppercase size="2xs" color={tokens.color.text.tertiary} style={{ marginBottom: 4, letterSpacing: '.06em' }}>
                        Reward
                    </Label>
                    <Mono size="sm" color={tokens.color.amber.base} weight={800}>
                        {lab.xpReward} XP
                    </Mono>
                </div>

                {status === 'completed' && (
                    <Badge variant="lime">
                        <CheckCircle size={10} style={{ marginRight: 4 }} /> COMPLETED
                    </Badge>
                )}

                {status === 'in-progress' && (
                    <Button
                        variant="amber"
                        size="sm"
                        onClick={() => onStart(lab.id)}
                        icon={<Play size={10} />}
                    >
                        CONTINUE
                    </Button>
                )}

                {status === 'available' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStart(lab.id)}
                    >
                        START LAB
                    </Button>
                )}

                {status === 'locked' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: tokens.color.text.tertiary, fontSize: 10, fontFamily: tokens.font.mono, fontWeight: 700, textTransform: 'uppercase' }}>
                        <Lock size={12} /> LOCKED
                    </div>
                )}
            </div>
        </Card>
    );
};

// ======================================================================
//  GuidedLabInstructions
// ======================================================================
import { useGamificationStore } from '../../stores/gamificationStore';
import { useLabStore } from '../../stores/labStore';
import { HINT_PENALTIES, SOLUTION_COST_HARD_MODE } from '../../config/progression';

interface GuidedLabProps {
    lab: Lab;
    currentStepIndex: number;
    onHintUsed?: (stepIndex: number, hintLevel: number) => void;
    onRevealSolution?: () => void;
    solutionRevealed?: boolean;
}

export const GuidedLabInstructions: React.FC<GuidedLabProps> = ({ lab, currentStepIndex, onHintUsed, onRevealSolution, solutionRevealed }) => {
    const isComplete = !lab.steps || currentStepIndex >= lab.steps.length;
    const difficultyMode = useGamificationStore((s) => s.difficultyMode);
    const xpBalance = useGamificationStore((s) => s.xp);
    const hintsUsedRecord = useLabStore((s) => s.progress[lab.id]?.hintsUsed) || {};
    const usedHintsForStep = hintsUsedRecord[currentStepIndex] || [];

    // Calculate how many hints are available
    const stepHints = lab.steps?.[currentStepIndex]?.hints || [];
    const nextHintLevel = usedHintsForStep.length;
    const hasMoreHints = nextHintLevel < stepHints.length;

    const [showCostWarning, setShowCostWarning] = useState(false);

    if (isComplete) {
        return (
            <Card variant="default" style={{ background: tokens.color.lime.base, color: tokens.color.bg.base, padding: tokens.space[6] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[2] }}>
                    <Award size={24} />
                    <Display size="sm" color={tokens.color.bg.base}>Lab Complete!</Display>
                </div>
                <Label size="sm" color={tokens.color.bg.base}>{lab.completionMessage}</Label>
            </Card>
        );
    }

    const step = lab.steps[currentStepIndex];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: tokens.color.text.primary }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.space[6], paddingBottom: tokens.space[2], borderBottom: `1px solid ${tokens.color.border.default}` }}>
                <Display size="sm" color={tokens.color.lime.base}>
                    Step {currentStepIndex + 1} <span style={{ color: tokens.color.text.tertiary, fontSize: tokens.fontSize.xs, fontWeight: 500 }}>/ {lab.steps.length}</span>
                </Display>
                <Badge variant="lime">GUIDED LAB</Badge>
            </div>

            <Label size="md" style={{ 
                marginBottom: tokens.space[8], 
                paddingLeft: tokens.space[4],
                borderLeft: `2px solid ${tokens.color.lime.base}`,
                fontFamily: difficultyMode === 'HARD' ? tokens.font.display : undefined,
            }}>
                {difficultyMode === 'HARD'
                    ? (step.actionText || 'OPERATIONAL OBJECTIVE: Complete the current task.')
                    : step.instruction}
            </Label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {usedHintsForStep.map(level => (
                    <div key={level} style={{
                        background: 'rgba(245,166,35,0.05)',
                        border: `2px solid ${tokens.color.amber.base}`,
                        boxShadow: `4px 4px 0px ${tokens.color.amber.base}`,
                        padding: '8px 12px',
                        fontSize: 11,
                        color: tokens.color.amber.base,
                        fontFamily: tokens.font.mono,
                        marginBottom: 8
                    }}>
                        💡 <strong>[LEVEL {level + 1} HINT]:</strong> {stepHints[level]}
                    </div>
                ))}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    {hasMoreHints && (
                        <button
                            onClick={() => {
                                onHintUsed?.(currentStepIndex, nextHintLevel);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: tokens.color.amber.base,
                                background: 'none',
                                border: 'none',
                                borderBottom: `1px solid ${tokens.color.amber.base}`,
                                padding: '2px 0',
                                cursor: 'pointer',
                                fontFamily: tokens.font.mono
                            }}
                        >
                            <HelpCircle size={10} /> [GET_HINT_L{nextHintLevel + 1}] (-{HINT_PENALTIES[nextHintLevel]} REWARD XP)
                        </button>
                    )}

                    {!solutionRevealed && step.solution && (
                        <button
                            onClick={() => {
                                if (difficultyMode === 'HARD') {
                                    if (xpBalance < SOLUTION_COST_HARD_MODE) {
                                        alert(`Insufficient XP. Protocol bypass requires ${SOLUTION_COST_HARD_MODE} XP. Your balance: ${xpBalance} XP.`);
                                        return;
                                    }
                                    if (window.confirm(`Revealing the solution in SYSTEM OPERATIONAL mode will cost ${SOLUTION_COST_HARD_MODE} XP from your global balance. Proceed?`)) {
                                        useGamificationStore.getState().spendXp(SOLUTION_COST_HARD_MODE);
                                        onRevealSolution?.();
                                    }
                                } else {
                                    if (window.confirm("Revealing the solution will heavily penalize your XP reward for this lab. Continue?")) {
                                        onRevealSolution?.();
                                    }
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? tokens.color.text.tertiary : "rgb(239, 68, 68)",
                                background: 'none',
                                border: 'none',
                                borderBottom: `1px solid ${difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? tokens.color.text.tertiary : "rgb(239, 68, 68)"}`,
                                padding: '2px 0',
                                cursor: difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? 'not-allowed' : 'pointer',
                                fontFamily: tokens.font.mono
                            }}
                            title={difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? "Insufficient XP to bypass protocol" : undefined}
                        >
                            <AlertTriangle size={10} /> {difficultyMode === 'HARD' ? `[BYPASS_PROTOCOL (-${SOLUTION_COST_HARD_MODE} XP)]` : '[SHOW_SOLUTION]'}
                        </button>
                    )}
                </div>

                {solutionRevealed && step.solution && (
                    <div style={{ 
                        background: 'rgba(239, 68, 68, 0.05)', 
                        border: "1px solid rgb(239, 68, 68)", 
                        padding: '12px', 
                        fontSize: 11, 
                        color: "rgb(239, 68, 68)",
                        fontFamily: tokens.font.mono 
                    }}>
                        <span style={{ textTransform: 'uppercase', fontSize: 9, fontWeight: 700, display: 'block', marginBottom: 4, opacity: 0.7 }}>Solution:</span>
                        {step.solution}
                    </div>
                )}
            </div>

            {/* Step progress dots - replaced with atomic progress bar or multi-dots */}
            <div style={{ marginTop: 'auto', paddingTop: tokens.space[8], display: 'flex', gap: 6, width: '100%' }}>
                {lab.steps.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: 4,
                            backgroundColor: i < currentStepIndex ? tokens.color.lime.base : i === currentStepIndex ? tokens.color.amber.base : "rgba(255,255,255,0.05)",
                            boxShadow: i === currentStepIndex ? `0 0 8px ${tokens.color.amber.alpha[48]}` : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// ======================================================================
//  DIYLabInstructions
// ======================================================================
interface DIYLabProps {
    lab: Lab;
    vfs: VFS;
    userId: string;
    onComplete: () => void;
    onHintUsed?: (hintIndex: number) => void;
    onRevealSolution?: () => void;
    solutionRevealed?: boolean;
}

export const DIYLabInstructions: React.FC<DIYLabProps> = ({ lab, vfs, userId, onComplete, onHintUsed }) => {
    const { processes } = useTerminalStore();
    const [failedMessages, setFailedMessages] = useState<string[]>([]);
    const [verified, setVerified] = useState(false);
    const [hintIndex, setHintIndex] = useState(-1);

    const handleVerify = () => {
        const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, processes);
        if (result.success) {
            setVerified(true);
            setFailedMessages([]);
            onComplete();
        } else {
            setFailedMessages(result.failedMessages);
        }
    };

    if (verified) {
        return (
            <Card variant="default" style={{ background: tokens.color.lime.base, color: tokens.color.bg.base, padding: tokens.space[6] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[2] }}>
                    <Award size={24} />
                    <Display size="sm" color={tokens.color.bg.base}>Lab Complete!</Display>
                </div>
                <Label size="sm" color={tokens.color.bg.base}>{lab.completionMessage}</Label>
                <Mono size="11px" weight={700} color={tokens.color.bg.base} style={{ marginTop: 12 }}>
                    +{lab.xpReward} XP earned!
                </Mono>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: tokens.color.text.primary }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: tokens.space[6], paddingBottom: tokens.space[2], borderBottom: `1px solid ${tokens.color.border.default}`, justifyContent: 'space-between' }}>
                <Display size="sm" color={tokens.color.amber.base}>Objective</Display>
                <Badge variant="amber">DIY LAB</Badge>
            </div>

            <Label size="md" style={{ marginBottom: tokens.space[8] }}>
                {lab.description}
            </Label>

            {lab.verification && (
                <div style={{ marginBottom: tokens.space[4] }}>
                    <Label size="xs" weight={700} color={tokens.color.text.secondary} style={{ marginBottom: 12 }}>Requirements:</Label>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {lab.verification.conditions.map((cond, i) => (
                            <li
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <ChevronRight size={10} color={tokens.color.text.tertiary} />
                                <Mono size="11px" color={failedMessages.includes(cond.message) ? "rgb(239, 68, 68)" : tokens.color.text.tertiary}>
                                    {cond.message}
                                </Mono>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: tokens.space[6] }}>
                <Button
                    variant="lime"
                    size="md"
                    onClick={handleVerify}
                    style={{ width: '100%' }}
                >
                    VERIFY LAB
                </Button>

                {failedMessages.length > 0 && (
                    <p style={{ marginTop: 8, textAlign: 'center', fontSize: 10, color: "rgb(239, 68, 68)", fontFamily: tokens.font.mono }}>
                        {failedMessages.length} requirement{failedMessages.length > 1 ? 's' : ''} not met yet.
                    </p>
                )}

                {/* Hints & Solutions */}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {usedHints.map(level => (
                        <div key={level} style={{
                            background: 'rgba(245,166,35,0.05)',
                            border: `2px solid ${tokens.color.amber.base}`,
                            boxShadow: `4px 4px 0px ${tokens.color.amber.base}`,
                            padding: '12px',
                            fontSize: 12,
                            color: tokens.color.amber.base,
                            fontFamily: tokens.font.mono
                        }}>
                            💡 <strong>[LEVEL {level + 1} HINT]:</strong> {labHints[level]}
                        </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        {hasMoreHints && (
                            <button
                                onClick={() => {
                                    onHintUsed?.(0, nextHintLevel);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: tokens.color.amber.base,
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: `1px solid ${tokens.color.amber.base}`,
                                    padding: '2px 0',
                                    cursor: 'pointer',
                                    fontFamily: tokens.font.mono
                                }}
                            >
                                <HelpCircle size={10} /> [GET_HINT_L{nextHintLevel + 1}] (-{HINT_PENALTIES[nextHintLevel]} REWARD XP)
                            </button>
                        )}

                        {!solutionRevealed && lab.solution && (
                            <button
                                onClick={() => {
                                    if (difficultyMode === 'HARD') {
                                        if (xpBalance < SOLUTION_COST_HARD_MODE) {
                                            alert(`Insufficient XP. Protocol bypass requires ${SOLUTION_COST_HARD_MODE} XP. Your balance: ${xpBalance} XP.`);
                                            return;
                                        }
                                        if (window.confirm(`Revealing the solution in SYSTEM OPERATIONAL mode will cost ${SOLUTION_COST_HARD_MODE} XP from your global balance. Proceed?`)) {
                                            useGamificationStore.getState().spendXp(SOLUTION_COST_HARD_MODE);
                                            onRevealSolution?.();
                                        }
                                    } else {
                                        if (window.confirm("Revealing the solution will heavily penalize your XP reward for this lab. Continue?")) {
                                            onRevealSolution?.();
                                        }
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? tokens.color.text.tertiary : "rgb(239, 68, 68)",
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: `1px solid ${difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? tokens.color.text.tertiary : "rgb(239, 68, 68)"}`,
                                    padding: '2px 0',
                                    cursor: difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? 'not-allowed' : 'pointer',
                                    fontFamily: tokens.font.mono,
                                    marginLeft: 'auto'
                                }}
                                title={difficultyMode === 'HARD' && xpBalance < SOLUTION_COST_HARD_MODE ? "Insufficient XP to bypass protocol" : undefined}
                            >
                                <AlertTriangle size={10} /> {difficultyMode === 'HARD' ? `[BYPASS_PROTOCOL (-${SOLUTION_COST_HARD_MODE} XP)]` : '[SHOW_SOLUTION]'}
                            </button>
                        )}
                    </div>

                    {solutionRevealed && lab.solution && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: "2px solid rgb(239, 68, 68)",
                            boxShadow: `4px 4px 0px rgb(239, 68, 68)`,
                            padding: '12px',
                            fontSize: 11,
                            color: "rgb(239, 68, 68)",
                            fontFamily: tokens.font.mono
                        }}>
                            <div style={{ fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <AlertTriangle size={12} /> SOLUTION PROTOCOL OVERRIDE:
                            </div>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {lab.solution}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
