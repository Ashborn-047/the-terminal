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
    Divider
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
                borderColor: status === 'completed' ? tokens.color.lime.base : tokens.color.border.default
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.space[4] }}>
                <h3 style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize.lg, 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    color: tokens.color.text.primary,
                    margin: 0,
                    maxWidth: '75%'
                }}>
                    {lab.title}
                </h3>
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

            <Divider style={{ margin: '0 0 16px 0', opacity: 0.3 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ 
                        fontFamily: tokens.font.mono, 
                        fontSize: 8, 
                        color: tokens.color.text.tertiary, 
                        textTransform: 'uppercase', 
                        letterSpacing: tokens.letterSpacing.widest,
                        marginBottom: 4
                    }}>
                        Reward
                    </span>
                    <span style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.md, 
                        fontWeight: 700, 
                        color: tokens.color.amber.base 
                    }}>
                        {lab.xpReward} XP
                    </span>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: tokens.color.text.tertiary, fontSize: 10, fontFamily: tokens.font.sans, fontWeight: 700, textTransform: 'uppercase' }}>
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
interface GuidedLabProps {
    lab: Lab;
    currentStepIndex: number;
    onHintUsed?: (stepIndex: number) => void;
    onRevealSolution?: () => void;
    solutionRevealed?: boolean;
}

export const GuidedLabInstructions: React.FC<GuidedLabProps> = ({ lab, currentStepIndex, onHintUsed, onRevealSolution, solutionRevealed }) => {
    const [showHint, setShowHint] = useState(false);

    const isComplete = !lab.steps || currentStepIndex >= lab.steps.length;

    if (isComplete) {
        return (
            <Card variant="default" style={{ background: tokens.color.lime.base, color: tokens.color.bg.base, padding: tokens.space[6] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: tokens.space[2] }}>
                    <Award size={24} />
                    <h4 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.lg, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Lab Complete!</h4>
                </div>
                <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, fontWeight: 500, margin: 0 }}>{lab.completionMessage}</p>
            </Card>
        );
    }

    const step = lab.steps[currentStepIndex];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: tokens.color.text.primary }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.space[6], paddingBottom: tokens.space[2], borderBottom: `1px solid ${tokens.color.border.default}` }}>
                <h4 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, fontWeight: 800, textTransform: 'uppercase', color: tokens.color.lime.base, margin: 0 }}>
                    Step {currentStepIndex + 1} <span style={{ color: tokens.color.text.tertiary, fontSize: tokens.fontSize.xs, fontWeight: 500 }}>/ {lab.steps.length}</span>
                </h4>
                <Badge variant="lime">GUIDED LAB</Badge>
            </div>

            <p style={{ 
                fontFamily: tokens.font.sans, 
                fontSize: tokens.fontSize.md, 
                marginBottom: tokens.space[8], 
                paddingLeft: tokens.space[4],
                borderLeft: `2px solid ${tokens.color.lime.base}`,
                lineHeight: 1.6,
                color: tokens.color.text.primary
            }}>
                {step.instruction}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {step.hint && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        {!showHint ? (
                            <button
                                onClick={() => {
                                    setShowHint(true);
                                    onHintUsed?.(currentStepIndex);
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
                                <HelpCircle size={10} /> [GET_HINT]
                            </button>
                        ) : (
                            <div style={{ 
                                background: 'rgba(245,166,35,0.05)', 
                                border: `1px solid ${tokens.color.amber.base}`, 
                                padding: '8px 12px', 
                                fontSize: 11, 
                                color: tokens.color.amber.base,
                                flex: 1,
                                fontFamily: tokens.font.mono
                            }}>
                                💡 {step.hint}
                            </div>
                        )}

                        {!solutionRevealed && step.solution && (
                            <button
                                onClick={() => {
                                    if (window.confirm("Revealing the solution will reduce your XP reward for this lab by 75%. Continue?")) {
                                        onRevealSolution?.();
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: "rgb(239, 68, 68)",
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: "1px solid rgb(239, 68, 68)",
                                    padding: '2px 0',
                                    cursor: 'pointer',
                                    fontFamily: tokens.font.mono
                                }}
                            >
                                <AlertTriangle size={10} /> [SHOW_SOLUTION]
                            </button>
                        )}
                    </div>
                )}

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
                    <h4 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.lg, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Lab Complete!</h4>
                </div>
                <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, fontWeight: 500, margin: 0 }}>{lab.completionMessage}</p>
                <div style={{ marginTop: 12, fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                    +{lab.xpReward} XP earned!
                </div>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: tokens.color.text.primary }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: tokens.space[6], paddingBottom: tokens.space[2], borderBottom: `1px solid ${tokens.color.border.default}`, justifyContent: 'space-between' }}>
                <h4 style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.md, fontWeight: 800, textTransform: 'uppercase', color: tokens.color.amber.base, margin: 0 }}>Objective</h4>
                <Badge variant="amber">DIY LAB</Badge>
            </div>

            <p style={{ 
                fontFamily: tokens.font.sans, 
                fontSize: tokens.fontSize.md, 
                marginBottom: tokens.space[8], 
                lineHeight: 1.6,
                color: tokens.color.text.primary
            }}>
                {lab.description}
            </p>

            {lab.verification && (
                <div style={{ marginBottom: tokens.space[4] }}>
                    <h5 style={{ fontFamily: tokens.font.sans, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, color: tokens.color.text.secondary }}>Requirements:</h5>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {lab.verification.conditions.map((cond, i) => (
                            <li
                                key={i}
                                style={{
                                    fontFamily: tokens.font.mono,
                                    fontSize: 11,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    color: failedMessages.includes(cond.message) ? "rgb(239, 68, 68)" : tokens.color.text.tertiary
                                }}
                            >
                                <ChevronRight size={10} />
                                {cond.message}
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

                {/* Hints */}
                {lab.hints && lab.hints.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        {hintIndex < 0 ? (
                            <button
                                onClick={() => {
                                    setHintIndex(0);
                                    onHintUsed?.(0);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: 11,
                                    color: tokens.color.amber.base,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: tokens.font.sans,
                                    fontWeight: 500
                                }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                                <HelpCircle size={14} /> Need a hint?
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {lab.hints.slice(0, hintIndex + 1).map((hint, i) => (
                                    <div key={i} style={{ 
                                        background: 'rgba(245,166,35,0.05)', 
                                        border: `1px solid ${tokens.color.amber.base}`, 
                                        padding: '8px 12px', 
                                        fontSize: 11, 
                                        color: tokens.color.amber.base,
                                        fontFamily: tokens.font.mono
                                    }}>
                                        💡 Hint {i + 1}: {hint}
                                    </div>
                                ))}
                                {hintIndex < lab.hints.length - 1 && (
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => {
                                            setHintIndex(hintIndex + 1);
                                            onHintUsed?.(hintIndex + 1);
                                        }}
                                        style={{ alignSelf: 'flex-start' }}
                                    >
                                        MORE HELP
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
