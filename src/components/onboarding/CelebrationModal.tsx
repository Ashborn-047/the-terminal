import React from 'react';
import { Button, Card, tokens } from '../ui/AshbornDesignSystem';

/**
 * CelebrationModal — per user_onboarding.md §3.4
 * Shown when user completes their first lab (or any significant milestone).
 */
interface CelebrationModalProps {
    title: string;
    message: string;
    xpEarned: number;
    levelUp?: number;
    onContinue: () => void;
    onDashboard: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
    title, message, xpEarned, levelUp, onContinue, onDashboard
}) => {
    return (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: tokens.z.modal,
            padding: tokens.space[4],
            backdropFilter: 'blur(4px)'
          }}
          data-testid="celebration-modal"
        >
            <Card 
              variant="raised"
              style={{
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
                padding: tokens.space[8],
                border: `1px solid ${tokens.color.lime.base}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: tokens.space[4]
              }}
            >
                <div style={{ fontSize: 48, marginBottom: tokens.space[2] }}>🎉</div>
                
                <h2 style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize['2xl'], 
                    fontWeight: 800, 
                    color: tokens.color.lime.base, 
                    textTransform: 'uppercase',
                    margin: 0
                }}>
                    {title}
                </h2>
                
                <p style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize.sm, 
                    color: tokens.color.text.secondary,
                    lineHeight: 1.6,
                    margin: 0
                }}>
                    {message}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[3], margin: `${tokens.space[4]} 0` }}>
                    <div style={{ 
                        background: tokens.color.lime.alpha[12], 
                        color: tokens.color.lime.base, 
                        padding: '10px 20px', 
                        border: `1px solid ${tokens.color.lime.alpha[24]}`,
                        fontFamily: tokens.font.mono,
                        fontWeight: 700,
                        fontSize: tokens.fontSize.lg
                    }}>
                        +{xpEarned} XP
                    </div>

                    {levelUp && (
                        <div style={{ 
                            background: tokens.color.amber.alpha[12], 
                            color: tokens.color.amber.base, 
                            padding: '6px 12px', 
                            border: `1px solid ${tokens.color.amber.alpha[24]}`,
                            fontFamily: tokens.font.sans,
                            fontWeight: 800,
                            fontSize: tokens.fontSize.xs,
                            textTransform: 'uppercase'
                        }}>
                            Leveled Up to {levelUp}!
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[3], width: '100%' }}>
                    <Button
                        variant="lime"
                        onClick={onContinue}
                        size="lg"
                        style={{ width: '100%' }}
                    >
                        Continue Learning →
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onDashboard}
                        size="lg"
                        style={{ width: '100%' }}
                    >
                        View Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
};
