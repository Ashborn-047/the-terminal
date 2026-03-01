import React, { useState } from 'react';
import { useUIStore } from '../stores/uiStore';

/**
 * SettingsPage — per Doc 3 §5.2
 * User preferences: username, theme, notification settings.
 */
export const SettingsPage: React.FC = () => {
    const { username, setUsername, highContrast, toggleHighContrast, setOnboardingStep } = useUIStore();
    const [tempUsername, setTempUsername] = useState(username);
    const [isEditing, setIsEditing] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSaveUsername = () => {
        const trimmed = tempUsername.trim();
        if (trimmed.length >= 3 && trimmed.length <= 20 && /^[a-zA-Z0-9_]+$/.test(trimmed)) {
            setUsername(trimmed);
            setIsEditing(false);
            setSaveMessage('Username updated!');
            setTimeout(() => setSaveMessage(''), 3000);
        } else {
            alert('Invalid username. 3-20 chars, alphanumeric + underscores.');
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure? This will reset your progress and return you to onboarding.")) {
            localStorage.clear();
            setOnboardingStep(0);
            window.location.href = '/';
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl uppercase mb-8 text-brutal-white italic tracking-wider">
                System Settings
            </h1>

            <div className="grid gap-6">
                {/* Profile Section */}
                <section className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal">
                    <h2 className="font-heading text-xl uppercase mb-4 text-brutal-green">User Profile</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-brutal-white border-2 border-brutal-black flex items-center justify-center text-4xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            👤
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-brutal-gray font-mono uppercase">Current Identity</div>
                            {isEditing ? (
                                <div className="flex gap-2 items-center mt-1">
                                    <input
                                        type="text"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value)}
                                        className="bg-brutal-black border-2 border-brutal-white p-1 text-brutal-green font-mono text-xl focus:border-brutal-green focus:outline-none"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSaveUsername}
                                        className="bg-brutal-green text-brutal-black px-3 py-1 font-heading uppercase border-2 border-brutal-black text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => { setIsEditing(false); setTempUsername(username); }}
                                        className="text-brutal-white font-mono text-xs underline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-heading text-brutal-white">{username}</div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-xs font-mono text-brutal-blue hover:text-white underline"
                                    >
                                        [Edit]
                                    </button>
                                </div>
                            )}
                            {saveMessage && <div className="text-brutal-green text-xs font-mono mt-1 italic">{saveMessage}</div>}
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal">
                    <h2 className="font-heading text-xl uppercase mb-4 text-brutal-blue">Appearance</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-brutal-black border-2 border-brutal-gray">
                            <span className="font-mono text-sm">Active Theme: Neo-Brutalist</span>
                            <div className="flex gap-2">
                                <div className="w-4 h-4 bg-brutal-green border border-brutal-white"></div>
                                <div className="w-4 h-4 bg-brutal-blue border border-brutal-white"></div>
                                <div className="w-4 h-4 bg-brutal-red border border-brutal-white"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 cursor-pointer" onClick={toggleHighContrast}>
                            <div className={`w-10 h-5 border-2 border-brutal-white relative transition-colors ${highContrast ? 'bg-brutal-green' : 'bg-brutal-black'}`}>
                                <div className={`absolute top-0 bottom-0 w-4 bg-brutal-white transition-all ${highContrast ? 'right-0' : 'left-0'}`}></div>
                            </div>
                            <span className="text-xs font-heading uppercase text-brutal-white">High Contrast Mode</span>
                        </div>
                    </div>
                </section>

                {/* System Section */}
                <section className="bg-brutal-dark border-3 border-brutal-red p-6 shadow-brutal">
                    <h2 className="font-heading text-xl uppercase mb-4 text-brutal-red">Danger Zone</h2>
                    <p className="text-xs text-brutal-gray mb-4 font-mono">
                        Resetting your session will wipe all local data, labs completed, and XP earned.
                    </p>
                    <button
                        onClick={handleReset}
                        className="bg-brutal-red text-brutal-white px-6 py-2 font-heading uppercase border-2 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-colors active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        Reset Initial Session
                    </button>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
