import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLabStore } from '../../stores/labStore';
import { useNavigate } from 'react-router-dom';

/**
 * OnboardingWalkthrough — per user_onboarding.md §3.2
 * A guided terminal introduction that teaches basic navigation.
 * Appears after the WelcomeModal, overlays as a tooltip-style guide.
 */
const WALKTHROUGH_STEPS = [
    {
        id: 1,
        title: 'The Command Line',
        message: 'This is your terminal. You type commands here and the system responds. Let\'s try your first command!',
        targetArea: 'terminal',
        action: 'Type `pwd` and press Enter to see where you are.',
    },
    {
        id: 2,
        title: 'Your Location',
        message: 'The `pwd` command shows your current directory -- your location in the filesystem. You\'re in your home folder!',
        targetArea: 'terminal',
        action: 'Now type `ls` to see what files and folders are here.',
    },
    {
        id: 3,
        title: 'Directory Contents',
        message: 'The `ls` command lists everything in your current directory. Directories, files, and more!',
        targetArea: 'sidebar',
        action: 'Check out the sidebar -- you can navigate to Curriculum to find labs.',
    },
    {
        id: 4,
        title: 'The Curriculum',
        message: 'Head to the Curriculum page to start your first lab. Labs are guided exercises that teach you commands step by step.',
        targetArea: 'sidebar',
        action: null, // Final step
    },
];

export const OnboardingWalkthrough: React.FC = () => {
    const { onboardingStep, setOnboardingStep } = useUIStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    // Only show walkthrough during step 2 (after welcome modal, before completion)
    if (onboardingStep !== 2) return null;

    const step = WALKTHROUGH_STEPS[currentStep];
    if (!step) return null;

    const requiresAction = currentStep === 0 || currentStep === 1;
    const expectedCommand = currentStep === 0 ? 'pwd' : 'ls';

    const handleNext = () => {
        if (currentStep < WALKTHROUGH_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            setInputValue('');
        } else {
            // Walkthrough complete — advance onboarding
            setOnboardingStep(3); // Move to "first lab" phase
            navigate('/lab/lab-1-1'); // Auto-redirect to first lab
        }
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim().toLowerCase() === expectedCommand) {
            handleNext();
        } else {
            setInputValue('');
        }
    };

    const handleSkip = () => {
        setOnboardingStep(3);
        navigate('/labs');
    };

    const isBottom = step.targetArea === 'terminal';

    return (
        <div className={`fixed z-[150] ${isBottom ? 'bottom-24 left-1/2 -translate-x-1/2' : 'top-1/3 right-8'}`}>
            <div className="bg-brutal-dark border-3 border-brutal-green p-5 max-w-sm shadow-brutal animate-slide-in">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-heading uppercase text-[10px] text-brutal-green">
                        Step {currentStep + 1}/{WALKTHROUGH_STEPS.length}
                    </span>
                    <button
                        onClick={handleSkip}
                        className="text-brutal-gray text-xs hover:text-brutal-white transition-colors"
                    >
                        Skip Tour
                    </button>
                </div>

                <h3 className="font-heading text-lg uppercase text-brutal-white mb-2">{step.title}</h3>
                <p className="text-sm text-brutal-gray mb-3">{step.message}</p>

                {step.action && (
                    <div className="bg-brutal-black border border-brutal-green p-3 mb-3">
                        <p className="text-[10px] text-brutal-gray uppercase mb-1">Interactive Prompt</p>
                        {requiresAction ? (
                            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                                <span className="text-brutal-green font-mono text-xs">$</span>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={step.action.match(/`([^`]+)`/)?.[1] || "type command..."}
                                    className="bg-transparent text-brutal-white font-mono text-xs w-full focus:outline-none"
                                    autoFocus
                                />
                            </form>
                        ) : (
                            <p className="text-xs text-brutal-green font-mono">→ {step.action}</p>
                        )}
                    </div>
                )}

                {requiresAction ? (
                    <p className="text-[10px] text-brutal-gray italic text-center mb-1">
                        Type the command above and press Enter to continue
                    </p>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full border-2 border-brutal-green text-brutal-green py-2 font-heading uppercase text-sm hover:bg-brutal-green hover:text-brutal-black transition-colors"
                    >
                        {currentStep < WALKTHROUGH_STEPS.length - 1 ? 'Next →' : 'Start Learning!'}
                    </button>
                )}

                {/* Pointer arrow */}
                <div className={`absolute w-4 h-4 bg-brutal-dark border-brutal-green rotate-45 ${isBottom ? '-bottom-2 left-1/2 -translate-x-1/2 border-b-3 border-r-3' : '-left-2 top-8 border-l-3 border-b-3'
                    }`} />
            </div>
        </div>
    );
};
