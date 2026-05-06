import React, { useEffect, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { tokens, ProgressBar, Label, Mono } from './AshbornDesignSystem';
import { getXPProgress } from '../../stores/gamificationStore';

interface SuccessAnimationProps {
    active: boolean;
    duration?: number;
    onComplete?: () => void;
    xpData?: {
        oldXp: number;
        newXp: number;
        gain: number;
    };
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
    active, 
    duration = 5000, 
    onComplete,
    xpData 
}) => {
    const [visible, setVisible] = useState(active);
    const [displayXp, setDisplayXp] = useState(xpData?.oldXp || 0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (active) {
            setVisible(true);
            setDisplayXp(xpData?.oldXp || 0);
            
            // Animation sequence
            const timer = setTimeout(() => {
                setIsAnimating(true);
                if (xpData) {
                    setDisplayXp(xpData.newXp);
                }
            }, 800);

            const hideTimer = setTimeout(() => {
                setVisible(false);
                if (onComplete) onComplete();
            }, duration);
            
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        } else {
            setVisible(false);
            setIsAnimating(false);
        }
    }, [active, duration, onComplete, xpData]);

    if (!visible) return null;

    const progress = getXPProgress(displayXp);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            {/* Confetti Particles */}
            {[...Array(40)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                        top: '-20px',
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 12 + 6}px`,
                        height: `${Math.random() * 12 + 6}px`,
                        backgroundColor: [tokens.color.lime.base, '#FF0055', '#FFEE00', '#009DFF', '#FFFFFF'][Math.floor(Math.random() * 5)],
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `confetti-fall ${Math.random() * 2 + 2}s linear forwards`,
                        animationDelay: `${Math.random() * 1}s`,
                    }}
                />
            ))}

            {/* Success Shield / Logo in center */}
            <div className="bg-brutal-dark border-4 border-brutal-black p-10 shadow-brutal-lg animate-in zoom-in slide-in-from-bottom-10 duration-700 flex flex-col items-center max-w-md w-full pointer-events-auto">
                <div className="relative mb-6">
                    <Sparkles size={80} className="text-brutal-green animate-pulse" />
                    {xpData && (
                        <div className="absolute -top-2 -right-6 bg-brutal-yellow text-brutal-black px-3 py-1 font-black italic text-xl shadow-brutal rotate-12 animate-bounce">
                            +{xpData.gain} XP
                        </div>
                    )}
                </div>

                <h1 className="font-heading text-5xl text-brutal-white uppercase italic tracking-tighter mb-8 text-center leading-none">
                    EXCELLENT <br /> <span className="text-brutal-green">WORK</span>
                </h1>

                {xpData && (
                    <div className="w-full space-y-3 border-t border-white/10 pt-8 mt-4">
                        <div className="flex justify-between items-end mb-1">
                            <div className="flex flex-col">
                                <Label size="xs" color={tokens.color.text.tertiary} uppercase weight={800} style={{ fontSize: '10px', letterSpacing: '0.1em' }}>XP Elevation</Label>
                                <Mono size="sm" weight={900} color={tokens.color.lime.base} style={{ fontSize: '18px', marginTop: '-2px' }}>LEVEL {progress.level}</Mono>
                            </div>
                            <div className="text-right">
                                <Mono size="sm" weight={700} color={tokens.color.text.secondary} style={{ fontSize: '14px' }}>
                                    {Math.floor(progress.progress)} <span className="opacity-30 mx-1">/</span> {progress.needed}
                                </Mono>
                            </div>
                        </div>

                        <div className="relative h-3 bg-black/40 border border-white/10 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                            <div 
                                className="h-full bg-brutal-green transition-all duration-[2000ms] ease-out relative shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                                style={{ width: `${progress.percent}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                <div className="h-[1px] w-8 bg-white/10" />
                                <Zap size={10} className="text-brutal-yellow" />
                                Terminal Mastery
                                <Zap size={10} className="text-brutal-yellow" />
                                <div className="h-[1px] w-8 bg-white/10" />
                             </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
