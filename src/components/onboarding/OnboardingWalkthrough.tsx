import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { trackEvent } from '../../utils/analytics';
import { useNavigate } from 'react-router-dom';
import { tokens, Display, Mono, Label, Input, Button } from '../ui/AshbornDesignSystem';

/**
 * OnboardingWalkthrough — Based on TourOverlay from redesign_v2.tsx
 * Centered modal overlay that guides the user after registration.
 */
const WALKTHROUGH_STEPS = [
    { 
        title: "The Command Line", 
        body: "This is your terminal. You type commands here and the system responds. Let's try your first command!", 
        prompt: "pwd" 
    },
    { 
        title: "Your First Output", 
        body: "Great! The terminal showed your current directory. Every command produces output — learn to read it.", 
        prompt: "ls -la" 
    },
    { 
        title: "Systematic Chapters", 
        body: "New: Explore our structured curriculum in the Chapters section. Each chapter includes theory, practice, and assessments.", 
        prompt: null 
    },
    { 
        title: "The Challenge Arena", 
        body: "Once you reach Level 10, the Arena unlocks. It contains high-stakes scenarios and broken systems for true Linux masters.", 
        prompt: null 
    },
    { 
        title: "You're Ready", 
        body: "That's the foundation. Your labs will guide you through the rest. Good luck, agent.", 
        prompt: null 
    },
];

export const OnboardingWalkthrough: React.FC = () => {
    const { onboardingStep, setOnboardingStep, tourStep, setTourStep } = useUIStore();
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    // Only show walkthrough during step 1 (immediately after username submit)
    if (onboardingStep !== 1) return null;

    const cur = WALKTHROUGH_STEPS[tourStep];
    if (!cur) return null;

    const handleNext = () => {
        if (tourStep < WALKTHROUGH_STEPS.length - 1) {
            const nextStep = tourStep + 1;
            setTourStep(nextStep);
            setInputValue('');
            trackEvent(`tour_step_${nextStep}_complete` as any);
        } else {
            // Tour complete — advance to first lab
            trackEvent('tour_completed');
            setOnboardingStep(3); // Level 3 means "In first lab"
            setTourStep(0); // Reset for future use if needed
            navigate('/lab/lab-1-1');
        }
    };

    const handleSkip = () => {
        trackEvent('tour_skipped');
        setOnboardingStep(3);
        setTourStep(0);
        navigate('/lab/lab-1-1');
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cur.prompt || inputValue.trim().toLowerCase() === cur.prompt.toLowerCase()) {
            handleNext();
        } else {
            setInputValue('');
        }
    };

    return (
        <div style={{ 
            position: "fixed", inset: 0, 
            background: "rgba(10,10,12,0.85)", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            zIndex: tokens.z.modal, 
            backdropFilter: "blur(4px)" 
        }}>
            <div style={{
                width: "100%", maxWidth: 440,
                background: tokens.color.bg.surface,
                border: `1px solid ${tokens.color.lime.alpha[30]}`,
                animation: `al-slideUp ${tokens.motion.duration.normal}`,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
            }}>
                {/* STEP HEADER */}
                <div style={{ 
                    display: "flex", alignItems: "center", justifyContent: "space-between", 
                    padding: "12px 16px", 
                    borderBottom: `1px solid ${tokens.color.border.subtle}`, 
                    background: tokens.color.lime.alpha[6] 
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                            {WALKTHROUGH_STEPS.map((_, i) => (
                                <div key={i} style={{ 
                                    width: i === tourStep ? 20 : 8, 
                                    height: 3, 
                                    background: i <= tourStep ? tokens.color.lime.base : "rgba(255,255,255,0.15)", 
                                    transition: "all .3s" 
                                }} />
                            ))}
                        </div>
                        <Mono size="xs" color={tokens.color.lime.base} style={{ marginLeft: 4 }}>
                            {tourStep + 1}/{WALKTHROUGH_STEPS.length}
                        </Mono>
                    </div>
                    <button 
                        onClick={handleSkip} 
                        style={{ 
                            background: "none", border: "none", cursor: "pointer", 
                            fontFamily: tokens.font.sans, fontSize: "10px", 
                            color: tokens.color.text.tertiary, letterSpacing: ".06em", 
                            textTransform: "uppercase", fontWeight: 700 
                        }}
                    >
                        Skip Tour
                    </button>
                </div>

                {/* BODY */}
                <div style={{ padding: "32px 24px 24px" }}>
                    <Display as="h2" size="sm" style={{ marginBottom: 12 }} data-testid="walkthrough-title">{cur.title}</Display>
                    <p style={{ 
                        fontFamily: tokens.font.sans, fontSize: "13px", 
                        color: tokens.color.text.secondary, lineHeight: 1.7, 
                        marginBottom: cur.prompt ? 24 : 32 
                    }}>
                        {cur.body}
                    </p>

                    {cur.prompt && (
                        <div style={{ marginBottom: 24 }}>
                            <Label style={{ marginBottom: 8, display: "block" }}>Interactive Prompt</Label>
                            <form onSubmit={handleTerminalSubmit}>
                                <Input 
                                    prefix="$" 
                                    placeholder={cur.prompt} 
                                    value={inputValue} 
                                    onChange={(e) => setInputValue(e.target.value)} 
                                    data-testid="walkthrough-input"
                                    mono 
                                    autoFocus
                                    style={{ marginBottom: 8 }} 
                                />
                            </form>
                            <Mono size="xs" color={tokens.color.text.tertiary}>
                                Type command and press Enter
                            </Mono>
                        </div>
                    )}

                    <Button 
                        variant="lime" 
                        size="lg" 
                        full 
                        onClick={handleNext}
                    >
                        {tourStep < WALKTHROUGH_STEPS.length - 1 ? "Next Step →" : "Enter Terminal"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
