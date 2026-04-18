import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { trackEvent } from '../../utils/analytics';
import { useNavigate } from 'react-router-dom';
import { tokens, Card, Button, Input } from '../ui/AshbornDesignSystem';

/**
 * OnboardingWalkthrough — per user_onboarding.md §3.2
 * Harmonized with Ashborn Design System.
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
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setInputValue('');
            // Track intermediate steps §8
            const stepEvent = `onboarding_step_${nextStep + 1}_complete` as any;
            trackEvent(stepEvent);
        } else {
            // Walkthrough complete — advance onboarding
            trackEvent('onboarding_completed');
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
        <div style={{
            position: "fixed",
            zIndex: tokens.z.modal,
            ...(isBottom 
                ? { bottom: 96, left: "50%", transform: "translateX(-50%)" } 
                : { top: "33%", right: 32 })
        }}>
            <Card style={{ 
                maxWidth: 380, width: "100%", padding: tokens.space[5],
                border: `1px solid ${tokens.color.lime.base}`,
                background: tokens.color.bg.overlay,
                animation: "al-slideUp 0.3s ease",
                position: "relative"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.space[2] }}>
                    <span style={{ 
                        fontFamily: tokens.font.sans, fontSize: 10, 
                        fontWeight: 800, textTransform: "uppercase", 
                        color: tokens.color.lime.base, letterSpacing: tokens.letterSpacing.wider
                    }}>
                        Step {currentStep + 1}/{WALKTHROUGH_STEPS.length}
                    </span>
                    <button
                        onClick={handleSkip}
                        style={{ 
                            background: "none", border: "none", cursor: "pointer",
                            fontFamily: tokens.font.sans, fontSize: 11, 
                            color: tokens.color.text.tertiary, transition: "color 0.15s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = tokens.color.text.primary}
                        onMouseLeave={(e) => e.currentTarget.style.color = tokens.color.text.tertiary}
                    >
                        Skip Tour
                    </button>
                </div>

                <h3 style={{ 
                    fontFamily: tokens.font.sans, fontSize: tokens.fontSize.lg, 
                    fontWeight: 800, textTransform: "uppercase", 
                    color: tokens.color.text.primary, marginBottom: tokens.space[2] 
                }}>{step.title}</h3>
                <p style={{ 
                    fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, 
                    color: tokens.color.text.secondary, marginBottom: tokens.space[4],
                    lineHeight: 1.5
                }}>{step.message}</p>

                {step.action && (
                    <div style={{ 
                        background: tokens.color.bg.input, 
                        border: `1px solid ${tokens.color.border.default}`,
                        padding: tokens.space[3], marginBottom: tokens.space[4]
                    }}>
                        <p style={{ 
                            fontFamily: tokens.font.sans, fontSize: 9, 
                            color: tokens.color.text.tertiary, textTransform: "uppercase",
                            letterSpacing: tokens.letterSpacing.widest,
                            fontWeight: 700, marginBottom: 4
                        }}>Interactive Prompt</p>
                        
                        {requiresAction ? (
                            <form onSubmit={handleTerminalSubmit} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.lime.base }}>$</span>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={step.action.match(/`([^`]+)`/)?.[1] || "type command..."}
                                    data-testid="walkthrough-input"
                                    style={{ 
                                        background: "transparent", border: "none", outline: "none",
                                        fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, 
                                        color: tokens.color.text.primary, width: "100%"
                                    }}
                                    autoFocus
                                />
                            </form>
                        ) : (
                            <p style={{ 
                                fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, 
                                color: tokens.color.lime.base
                            }}>→ {step.action}</p>
                        )}
                    </div>
                )}

                {requiresAction ? (
                    <p style={{ 
                        fontFamily: tokens.font.sans, fontSize: 10, 
                        color: tokens.color.text.tertiary, fontStyle: "italic", textAlign: "center" 
                    }}>
                        Type command and press Enter
                    </p>
                ) : (
                    <Button
                        variant="lime"
                        onClick={handleNext}
                        style={{ width: "100%" }}
                    >
                        {currentStep < WALKTHROUGH_STEPS.length - 1 ? 'Next →' : 'Start Learning!'}
                    </Button>
                )}

                {/* Arrow indicator */}
                <div style={{
                    position: "absolute",
                    width: 12, height: 12,
                    background: tokens.color.bg.overlay,
                    borderRight: `1px solid ${tokens.color.lime.base}`,
                    borderBottom: `1px solid ${tokens.color.lime.base}`,
                    transform: "rotate(45deg)",
                    ...(isBottom 
                        ? { bottom: -7, left: "50%", marginLeft: -6 } 
                        : { left: -7, top: 32, transform: "rotate(135deg)" })
                }} />
            </Card>
        </div>
    );
};
