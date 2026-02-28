import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';

/**
 * WelcomeModal — per user_onboarding.md §5.1
 * First-time experience: username input + welcome message.
 * Since we don't have SpacetimeDB yet, we store locally.
 */
interface WelcomeModalProps {
    onComplete: (username: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

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
        onComplete(trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div className="fixed inset-0 bg-brutal-black/95 flex items-center justify-center z-50 p-4">
            <div className="bg-brutal-dark border-3 border-brutal-white p-8 max-w-lg w-full shadow-brutal">
                {/* ASCII Art Logo */}
                <pre className="text-brutal-green font-mono text-xs mb-6 leading-tight">
                    {`  _____ _            _____                   _             _ 
 |_   _| |__   ___  |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
   | | | '_ \\ / _ \\   | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
   | | | | | |  __/   | |  __/ |  | | | | | | | | | | (_| | |
   |_| |_| |_|\\___|   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|`}
                </pre>

                <h1 className="font-heading text-3xl uppercase mb-2 text-brutal-white">
                    Welcome, Learner
                </h1>
                <p className="mb-6 text-brutal-gray text-sm">
                    You're about to begin your journey to Linux mastery. Choose a name to get started.
                </p>

                <div className="mb-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="enter_username"
                        className="w-full bg-brutal-black border-2 border-brutal-white p-3 text-brutal-green font-mono placeholder:text-brutal-gray/40 focus:border-brutal-green focus:outline-none"
                        autoFocus
                        maxLength={20}
                    />
                    {error && <p className="text-brutal-red text-xs mt-1">{error}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!username.trim()}
                    className="w-full border-3 border-brutal-green text-brutal-green py-3 font-heading uppercase hover:bg-brutal-green hover:text-brutal-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Initialize Session →
                </button>

                <p className="mt-4 text-[10px] text-brutal-gray text-center">
                    Your progress is saved locally. No account required.
                </p>
            </div>
        </div>
    );
};
