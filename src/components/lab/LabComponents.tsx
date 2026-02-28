import React, { useState } from 'react';
import { Lab, LabProgress, LabStep } from '../../features/lab-engine/types';
import { useLabStore } from '../../stores/labStore';
import { useGamificationStore } from '../../stores/gamificationStore';
import { VerificationEngine } from '../../features/lab-engine/verification';
import { VFS } from '../../features/vfs/vfs';
import { Lock, CheckCircle, Play, HelpCircle, Award, ChevronRight } from 'lucide-react';

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
        <div className={`border-3 border-brutal-black p-4 bg-brutal-white text-brutal-black shadow-brutal mb-4
            ${status === 'locked' ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-heading uppercase text-lg">{lab.title}</h3>
                <span className={`px-2 py-1 text-xs font-heading uppercase border-2 border-brutal-black
                    ${lab.type === 'guided' ? 'bg-brutal-yellow' : 'bg-brutal-blue text-brutal-white'}`}>
                    {lab.type}
                </span>
            </div>
            <p className="text-sm mb-3">{lab.description}</p>

            <div className="flex justify-between items-center">
                <span className="font-heading text-sm text-brutal-green">+{lab.xpReward} XP</span>

                {status === 'completed' && (
                    <span className="flex items-center gap-1 bg-brutal-green text-brutal-black px-3 py-1 font-heading uppercase text-xs border-2 border-brutal-black">
                        <CheckCircle size={14} /> COMPLETED
                    </span>
                )}

                {status === 'in-progress' && (
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-3 border-2 border-brutal-black bg-brutal-dark p-[1px]">
                            <div className="h-full bg-brutal-green" style={{ width: `${progress || 0}%` }} />
                        </div>
                        <button
                            onClick={() => onStart(lab.id)}
                            className="px-3 py-1 font-heading uppercase text-xs border-2 border-brutal-black bg-brutal-yellow hover:bg-brutal-green transition-colors"
                        >
                            CONTINUE
                        </button>
                    </div>
                )}

                {status === 'available' && (
                    <button
                        onClick={() => onStart(lab.id)}
                        className="flex items-center gap-1 px-3 py-1 font-heading uppercase text-xs border-2 border-brutal-black bg-brutal-white hover:bg-brutal-green transition-colors"
                    >
                        <Play size={14} /> START
                    </button>
                )}

                {status === 'locked' && (
                    <span className="flex items-center gap-1 text-brutal-gray font-heading uppercase text-xs">
                        <Lock size={14} /> LOCKED
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
}

export const GuidedLabInstructions: React.FC<GuidedLabProps> = ({ lab, currentStepIndex }) => {
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

    return (
        <div className="border-3 border-brutal-black p-4 bg-brutal-dark text-brutal-white shadow-brutal">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-heading uppercase">
                    Step {currentStepIndex + 1}/{lab.steps.length}
                </h4>
                <span className="text-xs text-brutal-gray font-heading">GUIDED LAB</span>
            </div>

            <p className="text-sm mb-4 border-l-4 border-brutal-yellow pl-3">{step.instruction}</p>

            {step.hint && (
                <div className="mt-3">
                    {!showHint ? (
                        <button
                            onClick={() => setShowHint(true)}
                            className="flex items-center gap-1 text-xs text-brutal-yellow hover:underline"
                        >
                            <HelpCircle size={14} /> Need a hint?
                        </button>
                    ) : (
                        <div className="bg-brutal-black border-2 border-brutal-yellow p-2 text-xs text-brutal-yellow">
                            💡 {step.hint}
                        </div>
                    )}
                </div>
            )}

            {/* Step progress dots */}
            <div className="flex gap-1 mt-4">
                {lab.steps.map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 border border-brutal-white
                            ${i < currentStepIndex ? 'bg-brutal-green' : i === currentStepIndex ? 'bg-brutal-yellow' : 'bg-brutal-dark'}`}
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
}

export const DIYLabInstructions: React.FC<DIYLabProps> = ({ lab, vfs, userId, onComplete }) => {
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
        <div className="border-3 border-brutal-black p-4 bg-brutal-dark text-brutal-white shadow-brutal">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-heading uppercase">Objective</h4>
                <span className="text-xs text-brutal-gray font-heading">DIY LAB</span>
            </div>

            <p className="text-sm mb-4">{lab.description}</p>

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

            <button
                onClick={handleVerify}
                className="w-full py-2 font-heading uppercase text-sm border-3 border-brutal-green text-brutal-green hover:bg-brutal-green hover:text-brutal-black transition-colors"
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
                            onClick={() => setHintIndex(0)}
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
                                    onClick={() => setHintIndex(hintIndex + 1)}
                                    className="text-xs text-brutal-yellow underline"
                                >
                                    More help
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
