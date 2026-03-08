import React, { useState } from 'react';
import { Lab, LabProgress, LabStep } from '../../features/lab-engine/types';
import { useLabStore } from '../../stores/labStore';
import { useGamificationStore } from '../../stores/gamificationStore';
import { VerificationEngine } from '../../features/lab-engine/verification';
import { VFS } from '../../features/vfs/vfs';
import { Lock, CheckCircle, Play, HelpCircle, Award, ChevronRight, AlertTriangle } from 'lucide-react';

// ======================================================================
//  LabCard — per lab_engine_documentation.md §7.1
// ======================================================================
interface LabCardProps {
    lab: Lab;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
    progress?: number;
    onStart: (labId: string) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, status, progress, onStart }) => {
    return (
        <div
            className={`border-2 border-brutal-white/20 p-6 bg-brutal-black text-brutal-white transition-all relative flex flex-col h-full
            ${status === 'locked' ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-brutal-white'} 
            ${status === 'completed' ? 'border-brutal-green' : ''}`}
            role="article"
            aria-labelledby={`lab-title-${lab.id}`}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 id={`lab-title-${lab.id}`} className="font-heading uppercase text-xl max-w-[80%]">{lab.title}</h3>
                <span
                    className={`px-2 py-0.5 text-[10px] tracking-widest font-heading uppercase border
                    ${lab.type === 'guided' ? 'text-brutal-green border-brutal-green' : 'text-brutal-yellow border-brutal-yellow'}`}
                    aria-label={`Lab type: ${lab.type}`}
                >
                    {lab.type}
                </span>
            </div>

            <p className="text-sm mb-6 font-body text-brutal-gray flex-1 leading-relaxed line-clamp-3">{lab.description}</p>

            <div className="flex justify-between items-end mt-auto pt-4 border-t border-brutal-white/10">
                <div className="flex flex-col">
                    <span className="text-[10px] text-brutal-gray font-mono uppercase tracking-widest mb-1">Reward</span>
                    <span className="font-heading text-lg text-brutal-yellow leading-none" aria-label="Reward">
                        {lab.xpReward} XP
                    </span>
                </div>

                {status === 'completed' && (
                    <span
                        className="flex items-center gap-1 text-brutal-green font-heading uppercase text-xs"
                        aria-label="Status: Completed"
                    >
                        <CheckCircle size={16} aria-hidden="true" /> COMPLETED
                    </span>
                )}

                {status === 'in-progress' && (
                    <button
                        onClick={() => onStart(lab.id)}
                        aria-label="Continue Lab"
                        className="px-6 py-2 font-heading uppercase text-sm border-2 border-brutal-yellow bg-brutal-yellow text-brutal-black hover:bg-transparent hover:text-brutal-yellow transition-colors"
                    >
                        CONTINUE
                    </button>
                )}

                {status === 'available' && (
                    <button
                        onClick={() => onStart(lab.id)}
                        aria-label="Start Lab"
                        className="px-6 py-2 font-heading tracking-widest uppercase text-sm border-2 border-brutal-white bg-brutal-white text-brutal-black hover:bg-transparent hover:text-brutal-white transition-colors"
                    >
                        START
                    </button>
                )}

                {status === 'locked' && (
                    <span
                        className="flex items-center gap-1 text-brutal-gray font-heading uppercase text-xs"
                        aria-label="Status: Locked"
                    >
                        <Lock size={16} aria-hidden="true" /> LOCKED
                    </span>
                )}
            </div>
        </div>
    );
};

// ======================================================================
//  GuidedLabInstructions — per lab_engine_documentation.md §7.2
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

    if (!lab.steps || currentStepIndex >= lab.steps.length) {
        return (
            <div className="border-3 border-brutal-black p-4 bg-brutal-green text-brutal-black shadow-brutal">
                <div className="flex items-center gap-2 mb-2">
                    <Award size={20} />
                    <h4 className="font-heading uppercase text-lg">Lab Complete!</h4>
                </div>
                <p>{lab.completionMessage}</p>
            </div>
        );
    }

    const step = lab.steps[currentStepIndex];

    if (!step) {
        return (
            <div className="border-3 border-brutal-black p-4 bg-brutal-green text-brutal-black shadow-brutal">
                <div className="flex items-center gap-2 mb-2">
                    <Award size={20} />
                    <h4 className="font-heading uppercase text-lg">Lab Complete!</h4>
                </div>
                <p>{lab.completionMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-brutal-dark text-brutal-white">
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-brutal-white/20">
                <h4 className="font-heading uppercase text-xl text-brutal-yellow">
                    Step {currentStepIndex + 1} <span className="text-brutal-gray text-sm">/ {lab.steps.length}</span>
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brutal-black bg-brutal-green px-1.5 py-0.5 font-heading tracking-widest uppercase">GUIDED LAB</span>
                </div>
            </div>

            <p className="text-base mb-8 border-l-4 border-brutal-green pl-4 leading-relaxed font-body text-brutal-white/90">
                {step.instruction}
            </p>

            <div className="flex flex-col gap-2">
                {step.hint && (
                    <div className="flex items-center justify-between gap-4">
                        {!showHint ? (
                            <button
                                onClick={() => {
                                    setShowHint(true);
                                    onHintUsed?.(currentStepIndex);
                                }}
                                className="flex items-center gap-1 text-[10px] text-brutal-yellow hover:text-brutal-green font-bold uppercase border-b-2 border-brutal-yellow transition-all"
                            >
                                <HelpCircle size={10} /> [GET_HINT]
                            </button>
                        ) : (
                            <div className="bg-brutal-black border border-brutal-yellow p-1.5 text-[10px] text-brutal-yellow flex-1">
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
                                className="flex items-center gap-1 text-[10px] text-brutal-red hover:text-brutal-white font-bold uppercase border-b-2 border-brutal-red transition-all"
                            >
                                <AlertTriangle size={10} /> [SHOW_SOLUTION]
                            </button>
                        )}
                    </div>
                )}

                {solutionRevealed && step.solution && (
                    <div className="bg-brutal-red/10 border-2 border-brutal-red p-2 text-xs text-brutal-red font-mono">
                        <span className="uppercase text-[8px] font-heading block mb-1 opacity-70">Solution:</span>
                        {step.solution}
                    </div>
                )}
            </div>

            {/* Step progress dots - moved to bottom */}
            <div className="mt-auto pt-8 flex gap-2 w-full">
                {lab.steps.map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 h-1.5 
                            ${i < currentStepIndex ? 'bg-brutal-green'
                                : i === currentStepIndex ? 'bg-brutal-yellow border-t border-b border-brutal-yellow/50 shadow-[0_0_10px_rgba(250,255,0,0.3)]'
                                    : 'bg-brutal-black border border-brutal-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// ======================================================================
//  DIYLabInstructions — per lab_engine_documentation.md §7.3
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
    const [failedMessages, setFailedMessages] = useState<string[]>([]);
    const [verified, setVerified] = useState(false);
    const [hintIndex, setHintIndex] = useState(-1);

    const handleVerify = () => {
        const result = VerificationEngine.verifyDIYLab(lab, vfs, userId);
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
            <div className="border-3 border-brutal-black p-4 bg-brutal-green text-brutal-black shadow-brutal">
                <div className="flex items-center gap-2 mb-2">
                    <Award size={20} />
                    <h4 className="font-heading uppercase text-lg">Lab Complete!</h4>
                </div>
                <p>{lab.completionMessage}</p>
                <p className="mt-2 font-heading text-sm">+{lab.xpReward} XP earned!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-brutal-dark text-brutal-white">
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-brutal-white/20">
                <h4 className="font-heading uppercase text-xl text-brutal-yellow tracking-tight">Objective</h4>
                <span className="text-[10px] text-brutal-black bg-brutal-yellow px-1.5 py-0.5 font-heading tracking-widest uppercase">DIY LAB</span>
            </div>

            <p className="text-base mb-8 leading-relaxed font-body text-brutal-white/90">
                {lab.description}
            </p>

            {lab.verification && (
                <>
                    <h5 className="font-heading text-sm uppercase mb-2">Requirements:</h5>
                    <ul className="space-y-1 mb-4">
                        {lab.verification.conditions.map((cond, i) => (
                            <li
                                key={i}
                                className={`text-sm flex items-center gap-2 ${failedMessages.includes(cond.message) ? 'text-brutal-red' : 'text-brutal-gray'
                                    }`}
                            >
                                <ChevronRight size={12} />
                                {cond.message}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <div className="mt-auto pt-6">
                <button
                    onClick={handleVerify}
                    className="w-full py-4 font-heading uppercase tracking-widest text-sm bg-brutal-green text-brutal-black border-2 border-brutal-black hover:bg-brutal-yellow hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                >
                    VERIFY LAB
                </button>

                {failedMessages.length > 0 && (
                    <p className="mt-2 text-xs text-brutal-red">
                        {failedMessages.length} requirement{failedMessages.length > 1 ? 's' : ''} not met yet.
                    </p>
                )}

                {/* Hints */}
                {lab.hints && lab.hints.length > 0 && (
                    <div className="mt-4">
                        {hintIndex < 0 ? (
                            <button
                                onClick={() => {
                                    setHintIndex(0);
                                    onHintUsed?.(0);
                                }}
                                className="flex items-center gap-1 text-xs text-brutal-yellow hover:underline"
                            >
                                <HelpCircle size={14} /> Need a hint?
                            </button>
                        ) : (
                            <div className="space-y-2">
                                {lab.hints.slice(0, hintIndex + 1).map((hint, i) => (
                                    <div key={i} className="bg-brutal-black border-2 border-brutal-yellow p-2 text-xs text-brutal-yellow">
                                        💡 Hint {i + 1}: {hint}
                                    </div>
                                ))}
                                {hintIndex < lab.hints.length - 1 && (
                                    <button
                                        onClick={() => {
                                            setHintIndex(hintIndex + 1);
                                            onHintUsed?.(hintIndex + 1);
                                        }}
                                        className="font-heading tracking-widest uppercase text-xs text-brutal-black bg-brutal-yellow px-4 py-2 hover:bg-brutal-white transition-colors border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                    >
                                        MORE HELP
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
