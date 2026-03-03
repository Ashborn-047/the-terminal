import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Terminal, BookOpen, Award, Settings, LogOut, ChevronRight, Zap, Flame, BookText, MessageSquare, Shield } from 'lucide-react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { useUIStore } from '../../stores/uiStore';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { ConnectionStatus } from './ConnectionStatus';
import { DebugOverlay } from '../debug/DebugOverlay';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
    locked?: boolean;
    requirement?: string;
    progress?: { current: number; total: number };
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, active, locked, requirement, progress, onClick }) => (
    <div className="relative group">
        <button
            onClick={locked ? undefined : onClick}
            className={`flex items-center gap-3 w-full p-3 mb-1 font-heading uppercase text-sm border-2 transition-all ${locked
                ? 'bg-brutal-dark text-brutal-gray/50 border-brutal-gray/30 cursor-not-allowed'
                : active
                    ? 'bg-brutal-green text-brutal-black border-brutal-black shadow-brutal translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-brutal-white text-brutal-black border-brutal-black hover:bg-brutal-yellow hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
        >
            <div className={`${locked ? 'opacity-30' : 'opacity-100'}`}>{icon}</div>
            <span className="flex-1 text-left">{label}</span>
            {locked && <span className="text-[10px] animate-pulse">🔒</span>}
            {active && !locked && <ChevronRight size={16} />}
        </button>

        {locked && (
            <div className="px-3 pb-2 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-mono uppercase text-brutal-gray">
                    <span>{requirement}</span>
                    {progress && <span>{progress.current}/{progress.total}</span>}
                </div>
                {progress && (
                    <div className="h-1 w-full bg-brutal-black border border-brutal-gray/30">
                        <div
                            className="h-full bg-brutal-blue transition-all duration-500"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        )}

        {/* Tooltip on Hover for locked items */}
        {locked && (
            <div className="absolute left-full ml-4 top-0 w-48 bg-brutal-black border-2 border-brutal-white p-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-brutal">
                <p className="text-[10px] font-mono text-brutal-green uppercase mb-1">Access Restricted</p>
                <p className="text-xs text-brutal-white">{requirement}</p>
            </div>
        )}
    </div>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { level, streak, getXPProgress, getTitle } = useGamificationStore();
    const { sidebarOpen, username } = useUIStore();
    const { current, needed, percent } = getXPProgress();
    const title = getTitle();

    const features = useFeatureAccess();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <Zap size={20} />, locked: false },
        { path: '/terminal', label: 'Terminal', icon: <Terminal size={20} />, locked: false },
        { path: '/labs', label: 'Curriculum', icon: <BookOpen size={20} />, locked: false },
        {
            path: '/commands',
            label: 'Commands',
            icon: <BookText size={20} />,
            locked: !features.commandReference,
            requirement: "Complete 5 labs to unlock docs",
            progress: { current: Math.min(5, useGamificationStore.getState().labsCompleted), total: 5 }
        },
        {
            path: '/chat',
            label: 'AI Tutor',
            icon: <MessageSquare size={20} />,
            locked: !features.chat,
            requirement: "Complete 3 labs for AI assistance",
            progress: { current: Math.min(3, useGamificationStore.getState().labsCompleted), total: 3 }
        },
        {
            path: '/profile',
            label: 'Achievements',
            icon: <Award size={20} />,
            locked: !features.achievements,
            requirement: "Complete 2 labs to view medals",
            progress: { current: Math.min(2, useGamificationStore.getState().labsCompleted), total: 2 }
        },
        {
            path: '/prep-zone',
            label: 'RHCSA Prep',
            icon: <Shield size={20} />,
            locked: useGamificationStore.getState().level < 5,
            requirement: "Reach Level 5 for certification prep",
            progress: { current: Math.min(5, useGamificationStore.getState().level), total: 5 }
        },
        {
            path: '/settings',
            label: 'Settings',
            icon: <Settings size={20} />,
            locked: !features.settings,
            requirement: "Reach Level 3 to customize system",
            progress: { current: Math.min(3, useGamificationStore.getState().level), total: 3 }
        },
    ];

    return (
        <div className="flex h-screen w-full bg-brutal-dark text-brutal-white overflow-hidden p-4 gap-4">
            <DebugOverlay />
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex flex-col h-full transition-all`}>
                <div className="flex items-center gap-3 mb-8 p-2 border-3 border-brutal-white bg-brutal-black shadow-brutal -rotate-1 hover:rotate-0 transition-transform cursor-pointer">
                    <div className="bg-brutal-green p-2 border-2 border-brutal-black">
                        <Terminal size={24} className="text-brutal-black" />
                    </div>
                    <div>
                        <h1 className="font-heading text-xl uppercase leading-none">The</h1>
                        <h1 className="font-heading text-xl uppercase leading-none">Terminal</h1>
                    </div>
                </div>

                <nav className="flex-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </nav>

                {/* Streak display */}
                {streak.current > 0 && (
                    <div className="mb-4 p-3 border-2 border-brutal-yellow bg-brutal-black">
                        <div className="flex items-center gap-2">
                            <Flame size={20} className="text-brutal-yellow" />
                            <span className="font-heading uppercase text-sm text-brutal-yellow">
                                {streak.current} Day Streak
                            </span>
                        </div>
                        {streak.longest > streak.current && (
                            <span className="text-xs text-brutal-gray mt-1 block">Best: {streak.longest}</span>
                        )}
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex justify-start mb-2">
                    <ConnectionStatus />
                </div>
                <header className="flex justify-between items-center mb-4 p-4 bg-brutal-white border-3 border-brutal-black text-brutal-black shadow-brutal">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center p-2 border-2 border-brutal-black bg-brutal-yellow font-heading uppercase text-xs min-w-[60px] rotate-2 hover:rotate-0 transition-transform">
                            <span>LVL {level}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-heading uppercase text-[10px] text-brutal-gray leading-none">{title}</span>
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-40 border-2 border-brutal-black bg-brutal-black p-0 overflow-hidden">
                                    <div
                                        className="h-full bg-brutal-green brutal-stripes border-r border-brutal-white transition-all duration-500"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                <span className="font-heading uppercase text-xs">{current}/{needed} XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="font-heading uppercase text-sm">{username}@the-terminal</div>
                        <div className="w-10 h-10 border-2 border-brutal-black rounded-full bg-brutal-red flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            👤
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden grid-background border-3 border-brutal-white shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]">
                    {children}
                </div>
            </main>
        </div>
    );
};
