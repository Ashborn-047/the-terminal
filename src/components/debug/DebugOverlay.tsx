import React, { useState } from 'react';
import { useVFSStore } from '../../stores/vfsStore';
import { useGamificationStore } from '../../stores/gamificationStore';
import { useLabStore } from '../../stores/labStore';
import { useUIStore } from '../../stores/uiStore';
import { spacetimeClient } from '../../utils/spacetimeClient';

export const DebugOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'vfs' | 'stores' | 'logs' | 'security' | 'backend'>('vfs');
    const [logs, setLogs] = useState<any[]>([]);

    const { snapshot } = useVFSStore();
    const gamification = useGamificationStore();
    const lab = useLabStore();
    const ui = useUIStore();

    React.useEffect(() => {
        if (isVisible && activeTab === 'logs') {
            const interval = setInterval(() => {
                const storedLogs = JSON.parse(localStorage.getItem('the-terminal-logs') || '[]');
                setLogs(storedLogs.reverse());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isVisible, activeTab]);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 z-50 bg-brutal-yellow border-2 border-brutal-black p-2 font-heading text-[10px] uppercase shadow-brutal hover:bg-brutal-white transition-colors rotate-3 hover:rotate-0"
            >
                🪲 Debug
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brutal-black/80 backdrop-blur-sm p-8">
            <div className="bg-brutal-white border-4 border-brutal-black w-full max-w-4xl h-full max-h-[80vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b-4 border-brutal-black bg-brutal-yellow">
                    <h2 className="font-heading text-2xl uppercase italic text-brutal-black">System Inspector</h2>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="bg-brutal-red border-2 border-brutal-black p-1 w-8 h-8 flex items-center justify-center font-bold"
                    >
                        X
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b-4 border-brutal-black">
                    <button
                        onClick={() => setActiveTab('vfs')}
                        className={`flex-1 p-3 font-heading uppercase transition-colors ${activeTab === 'vfs' ? 'bg-brutal-black text-brutal-white' : 'hover:bg-brutal-gray/20'}`}
                    >
                        VFS Snapshot
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`flex-1 p-3 font-heading uppercase transition-colors ${activeTab === 'stores' ? 'bg-brutal-black text-brutal-white' : 'hover:bg-brutal-gray/20'}`}
                    >
                        State Stores
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex-1 p-3 font-heading uppercase transition-colors ${activeTab === 'logs' ? 'bg-brutal-black text-brutal-white' : 'hover:bg-brutal-gray/20'}`}
                    >
                        Recent Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 p-3 font-heading uppercase transition-colors ${activeTab === 'security' ? 'bg-brutal-black text-brutal-white' : 'hover:bg-brutal-gray/20'}`}
                    >
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('backend')}
                        className={`flex-1 p-3 font-heading uppercase transition-colors ${activeTab === 'backend' ? 'bg-brutal-black text-brutal-white' : 'hover:bg-brutal-gray/20'}`}
                    >
                        Backend
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 bg-brutal-dark text-brutal-green font-mono text-xs">
                    {activeTab === 'vfs' && (
                        <pre>{JSON.stringify(snapshot, null, 2)}</pre>
                    )}
                    {activeTab === 'stores' && (
                        <div className="flex flex-col gap-6">
                            <section>
                                <h3 className="text-brutal-yellow mb-2 uppercase border-b border-brutal-yellow/30 pb-1">Gamification</h3>
                                <pre>{JSON.stringify({
                                    xp: gamification.xp,
                                    level: gamification.level,
                                    streak: gamification.streak,
                                    labsCompleted: gamification.labsCompleted,
                                    achievements: gamification.unlockedAchievements
                                }, null, 2)}</pre>
                            </section>
                            <section>
                                <h3 className="text-brutal-cyan mb-2 uppercase border-b border-brutal-cyan/30 pb-1">UI State</h3>
                                <pre>{JSON.stringify({
                                    username: ui.username,
                                    onboardingStep: ui.onboardingStep,
                                    sidebarOpen: ui.sidebarOpen
                                }, null, 2)}</pre>
                            </section>
                            <section>
                                <h3 className="text-brutal-green mb-2 uppercase border-b border-brutal-green/30 pb-1">Lab State</h3>
                                <pre>{JSON.stringify({
                                    currentLabId: lab.currentLabId,
                                    progress: lab.progress
                                }, null, 2)}</pre>
                            </section>
                        </div>
                    )}
                    {activeTab === 'logs' && (
                        <div className="flex flex-col gap-2">
                            {logs.map((log: any, i: number) => (
                                <div key={i} className="border-b border-brutal-gray/20 pb-2">
                                    <span className="text-brutal-gray">[{log.timestamp}]</span>{' '}
                                    <span className={log.level === 'ERROR' ? 'text-brutal-red' : log.level === 'WARN' ? 'text-brutal-yellow' : 'text-brutal-cyan'}>
                                        {log.level}
                                    </span>{' '}
                                    <span className="text-brutal-white">[SID:{log.sessionId}]</span>{' '}
                                    <span className="text-brutal-white">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div className="flex flex-col gap-6">
                            <section>
                                <h3 className="text-brutal-red mb-2 uppercase border-b border-brutal-red/30 pb-1">Security Score</h3>
                                <div className="text-4xl font-heading mb-2">
                                    {Math.max(0, 100 - (logs.filter(l => l.level === 'SECURITY').length * 5))}/100
                                </div>
                                <p className="text-brutal-gray text-xs">Score decreases by 5 points for every security event logged.</p>
                            </section>
                            <section>
                                <h3 className="text-brutal-yellow mb-2 uppercase border-b border-brutal-yellow/30 pb-1">Security Audit Log</h3>
                                <div className="flex flex-col gap-2">
                                    {logs.filter(l => l.level === 'SECURITY').map((log: any, i: number) => (
                                        <div key={i} className="border-l-2 border-brutal-red pl-2 py-1 bg-brutal-red/10">
                                            <span className="text-brutal-gray">[{log.timestamp}]</span>{' '}
                                            <span className="text-brutal-red font-bold">{log.message}</span>
                                        </div>
                                    ))}
                                    {logs.filter(l => l.level === 'SECURITY').length === 0 && (
                                        <p className="text-brutal-gray italic">No security events recorded.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                    {activeTab === 'backend' && (
                        <div className="flex flex-col gap-6">
                            <section>
                                <h3 className="text-brutal-yellow mb-2 uppercase border-b border-brutal-yellow/30 pb-1">Table: User</h3>
                                <pre>{JSON.stringify(spacetimeClient.getUser(spacetimeClient.identity), null, 2)}</pre>
                            </section>
                            <section>
                                <h3 className="text-brutal-cyan mb-2 uppercase border-b border-brutal-cyan/30 pb-1">Table: UserProgress</h3>
                                <pre>{JSON.stringify(spacetimeClient.getProgress(spacetimeClient.identity), null, 2)}</pre>
                            </section>
                            <section>
                                <h3 className="text-brutal-green mb-2 uppercase border-b border-brutal-green/30 pb-1">Table: Message (Global)</h3>
                                <pre>{JSON.stringify(spacetimeClient.getMessages('global').slice(-5), null, 2)}</pre>
                            </section>
                            <section>
                                <h3 className="text-brutal-yellow mb-2 uppercase border-b border-brutal-yellow/30 pb-1">Table: TypingIndicator (Global)</h3>
                                <pre>{JSON.stringify(spacetimeClient.getTypingIndicators('global'), null, 2)}</pre>
                            </section>
                            <section>
                                <h3 className="text-brutal-gray mb-2 uppercase border-b border-brutal-gray/30 pb-1">Table: OnlinePresence</h3>
                                <pre>{JSON.stringify(spacetimeClient.getOnlineUsers(), null, 2)}</pre>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-2 bg-brutal-gray text-brutal-black font-heading text-[10px] uppercase text-center border-t-2 border-brutal-black">
                    Doc 8 Compliant Debugger v1.0
                </div>
            </div>
        </div>
    );
};
