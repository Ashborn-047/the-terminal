import React from 'react';

/**
 * CelebrationModal — per user_onboarding.md §3.4
 * Shown when user completes their first lab (or any significant milestone).
 */
interface CelebrationModalProps {
    title: string;
    message: string;
    xpEarned: number;
    onContinue: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
    title, message, xpEarned, onContinue
}) => {
    return (
        <div className="fixed inset-0 bg-brutal-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-brutal-dark border-3 border-brutal-green p-8 max-w-md w-full text-center shadow-brutal animate-pulse-once">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="font-heading text-2xl uppercase text-brutal-green mb-2">{title}</h2>
                <p className="text-brutal-white text-sm mb-4">{message}</p>

                <div className="inline-block bg-brutal-green text-brutal-black px-4 py-2 border-2 border-brutal-black font-heading text-lg mb-6">
                    +{xpEarned} XP
                </div>

                <button
                    onClick={onContinue}
                    className="w-full border-2 border-brutal-white text-brutal-white py-3 font-heading uppercase hover:bg-brutal-white hover:text-brutal-black transition-colors"
                >
                    Continue Learning →
                </button>
            </div>
        </div>
    );
};
