import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { tokens, Label, Mono } from './AshbornDesignSystem';
import { calculateXPProgress } from '../../stores/gamificationStore';

interface SuccessAnimationProps {
    active: boolean;
    xpData?: {
        oldXp: number;
        newXp: number;
        gain: number;
    };
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
    active, 
    xpData 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [displayXp, setDisplayXp] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (active) {
            setIsVisible(true);
            setHasAnimated(false);
            setDisplayXp(xpData?.oldXp || 0);
            
            const timer = setTimeout(() => {
                if (xpData) {
                    setDisplayXp(xpData.newXp);
                    setHasAnimated(true);
                }
            }, 800);
            
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [active, xpData]);

    if (!active && !isVisible) return null;

    const progress = calculateXPProgress(displayXp);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            transition: 'opacity 0.5s ease-out',
            opacity: isVisible ? 1 : 0,
            pointerEvents: active ? 'auto' : 'none'
        }}>
            {/* Confetti Effect */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {active && [...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            left: `${Math.random() * 100}%`,
                            width: '8px',
                            height: '8px',
                            backgroundColor: [tokens.color.lime.base, tokens.color.amber.base, '#009DFF', '#FFFFFF'][Math.floor(Math.random() * 4)],
                            borderRadius: '50%',
                            opacity: 0.6,
                            animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Modal Card */}
            <div style={{
                background: tokens.color.bg.surface,
                border: `4px solid ${tokens.color.border.strong}`,
                padding: '40px',
                boxShadow: tokens.shadow.glow,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '450px',
                width: '100%',
                position: 'relative',
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-24px',
                    right: '-24px',
                    background: tokens.color.amber.base,
                    color: tokens.color.bg.base,
                    padding: '8px 16px',
                    fontWeight: 900,
                    fontSize: '24px',
                    fontStyle: 'italic',
                    border: `3px solid ${tokens.color.border.strong}`,
                    boxShadow: tokens.shadow.md,
                    transform: 'rotate(12deg)',
                    animation: hasAnimated ? 'bounce 1s infinite' : 'none'
                }}>
                    +{xpData?.gain || 0} XP
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <Zap size={80} color={tokens.color.lime.base} style={{ filter: `drop-shadow(0 0 10px ${tokens.color.lime.base})` }} />
                </div>

                <h1 style={{
                    fontFamily: tokens.font.display,
                    fontSize: '48px',
                    color: tokens.color.text.primary,
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                    letterSpacing: '-2px',
                    marginBottom: '8px',
                    textAlign: 'center',
                    lineHeight: 1
                }}>
                    Mission Success
                </h1>
                
                <Mono size="sm" color={tokens.color.lime.base} style={{ marginBottom: '32px', fontWeight: 'bold' }}>
                    LINUX_OBJECTIVE_SECURED.SYS
                </Mono>

                <div style={{ width: '100%', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <Mono size="xs" color={tokens.color.text.secondary}>LEVEL {progress.level}</Mono>
                        <Mono size="sm" color={tokens.color.text.primary} weight="black">
                            {Math.floor(progress.current)} <span style={{ opacity: 0.3 }}>/</span> {progress.needed} XP
                        </Mono>
                    </div>

                    <div style={{ 
                        height: '16px', 
                        background: tokens.color.bg.base, 
                        border: `2px solid ${tokens.color.border.default}`,
                        padding: '2px',
                        position: 'relative'
                    }}>
                        <div style={{ 
                            height: '100%', 
                            width: `${progress.percent}%`, 
                            background: tokens.color.lime.base,
                            transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                animation: 'shimmer 2s infinite',
                                width: '200%'
                            }} />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <TrendingUp size={20} color={tokens.color.text.tertiary} />
                    <Label size="xs" color={tokens.color.text.secondary}>TOTAL XP: {displayXp}</Label>
                </div>
            </div>

            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-10px) rotate(12deg); }
                }
            `}</style>
        </div>
    );
};
