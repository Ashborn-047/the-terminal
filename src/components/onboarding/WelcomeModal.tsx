import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';
import { tokens, Card, Input, Button, Display } from '../ui/AshbornDesignSystem';

/**
 * WelcomeModal — per user_onboarding.md §5.1
 * Harmonized with Ashborn Design System.
 */
interface WelcomeModalProps {
    onComplete: (username: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        trackEvent('onboarding_started');
    }, []);

    const handleSubmit = () => {
        const trimmed = username.trim();
        if (trimmed.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        if (trimmed.length > 20) {
            setError('Username must be 20 characters or less');
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
            setError('Only letters, numbers, and underscores allowed');
            return;
        }
        setError('');
        setIsVerifying(true);

        // Simulate backend verification delay §3.1
        setTimeout(() => {
            setIsVerifying(false);
            trackEvent('onboarding_step_1_complete', { username: trimmed });
            onComplete(trimmed);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div 
            className="al-grid"
            style={{
                position: "fixed", inset: 0,
                background: tokens.color.bg.base,
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                backgroundSize: '24px 24px',
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: tokens.z.modal,
                padding: tokens.space[4]
            }}
        >
            <div style={{
                position: "fixed", inset: 0,
                background: "radial-gradient(circle at 50% 50%, rgba(20,20,25,0) 0%, rgba(10,10,12,0.8) 100%)",
                pointerEvents: "none"
            }} />

            <Card style={{ maxWidth: 480, width: "100%", padding: tokens.space[8], position: "relative", zIndex: 1 }}>
                {/* ASCII Art Logo */}
                <pre style={{ 
                    fontFamily: tokens.font.mono, fontSize: 10, 
                    color: tokens.color.lime.base, marginBottom: tokens.space[6], 
                    lineHeight: 1.2, opacity: 0.8 
                }}>
                    {`  _____ _            _____                   _             _ 
 |_   _| |__   ___  |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
   | | | '_ \\ / _ \\   | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
   | | | | | |  __/   | |  __/ |  | | | | | | | | | | (_| | |
   |_| |_| |_|\\___|   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|`}
                </pre>

                <Display size="lg" style={{ marginBottom: 16 }} data-testid="welcome-title">
                    Welcome, Learner
                </Display>
                
                <p style={{ 
                    fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, 
                    color: tokens.color.text.secondary, marginBottom: tokens.space[6] 
                }}>
                    You're about to begin your journey to Linux mastery. Choose a name to get started.
                </p>

                <div style={{ marginBottom: tokens.space[6] }}>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="enter_username"
                        data-testid="welcome-input"
                        mono
                    />
                    {error && (
                        <div style={{ marginTop: tokens.space[2], color: "rgb(239, 68, 68)", fontSize: 10, fontFamily: tokens.font.mono, textTransform: 'uppercase', fontWeight: 700 }}>
                             [ERROR]: {error}
                        </div>
                    )}
                </div>

                <Button
                    variant="lime"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!username.trim() || isVerifying}
                    loading={isVerifying}
                    style={{ width: "100%" }}
                >
                    Initialize Session →
                </Button>

                <p style={{ 
                    marginTop: tokens.space[4], textAlign: "center",
                    fontFamily: tokens.font.mono, fontSize: tokens.fontSize["2xs"], 
                    color: tokens.color.text.tertiary, textTransform: "uppercase",
                    letterSpacing: tokens.letterSpacing.widest
                }}>
                    Progress saved to local subsystem. No auth required.
                </p>
            </Card>
        </div>
    );
};
