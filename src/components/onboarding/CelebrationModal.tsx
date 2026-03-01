import React from 'react';

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
        <div className="fixed inset-0 bg-brutal-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-brutal-dark border-3 border-brutal-green p-8 max-w-md w-full text-center shadow-brutal animate-pulse-once">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="font-heading text-2xl uppercase text-brutal-green mb-2">{title}</h2>
                <p className="text-brutal-white text-sm mb-4">{message}</p>

                <div className="flex flex-col gap-4 mb-6 items-center">
                    <div className="inline-block bg-brutal-green text-brutal-black px-4 py-2 border-2 border-brutal-black font-heading text-lg">
                        +{xpEarned} XP
                    </div>

                    {levelUp && (
                        <div className="bg-brutal-yellow text-brutal-black px-4 py-1 border-2 border-brutal-black font-heading uppercase text-xs animate-bounce">
                            Leveled Up to {levelUp}!
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onContinue}
                        className="w-full bg-brutal-green text-brutal-black border-2 border-brutal-black py-3 font-heading uppercase text-sm hover:brightness-110 transition-all"
                    >
                        Continue Learning →
                    </button>
                    <button
                        onClick={onDashboard}
                        className="w-full border-2 border-brutal-white text-brutal-white py-3 font-heading uppercase text-sm hover:bg-brutal-white hover:text-brutal-black transition-colors"
                    >
                        View Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
