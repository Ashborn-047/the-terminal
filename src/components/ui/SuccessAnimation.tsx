import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
    active: boolean;
    duration?: number;
    onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ active, duration = 3000, onComplete }) => {
    const [visible, setVisible] = useState(active);

    useEffect(() => {
        if (active) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onComplete) onComplete();
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [active, duration, onComplete]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex items-center justify-center">
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
                        backgroundColor: ['#00FF9D', '#FF0055', '#FFEE00', '#009DFF', '#FFFFFF'][Math.floor(Math.random() * 5)],
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `confetti-fall ${Math.random() * 2 + 2}s linear forwards`,
                        animationDelay: `${Math.random() * 1}s`,
                    }}
                />
            ))}

            {/* Success Shield / Logo in center */}
            <div className="bg-brutal-green border-4 border-brutal-black p-8 shadow-brutal animate-in zoom-in duration-500 flex flex-col items-center">
                <Sparkles size={80} className="text-brutal-black mb-4 animate-pulse" />
                <h1 className="font-heading text-6xl text-brutal-black uppercase italic tracking-tighter">
                    EXCELLENT WORK
                </h1>
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
