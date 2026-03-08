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

// Minimal Activity Bar Item (Icon only)
const ActivityBarItem: React.FC<SidebarItemProps> = ({ icon, label, path, active, locked, requirement, onClick }) => (
    <div className="relative group w-full flex justify-center py-4">
        <button
            onClick={locked ? undefined : onClick}
            className={`relative p-2 transition-all ${locked
                ? 'text-brutal-gray/30 cursor-not-allowed'
                : active
                    ? 'text-brutal-yellow'
                    : 'text-brutal-white hover:text-brutal-green'
                }`}
        >
            <div className={`${locked ? 'opacity-30' : 'opacity-100'}`}>
                {icon}
            </div>

            {/* Active Indicator Line */}
            {active && (
                <div className="absolute left-[-16px] top-0 bottom-0 w-1 bg-brutal-yellow" />
            )}

            {/* Lock Overlay */}
            {locked && (
                <div className="absolute top-0 right-0 text-[10px] transform translate-x-1/2 -translate-y-1/2">
                    🔒
                </div>
            )}
        </button>

        {/* Hover Tooltip - always show label, plus requirement if locked */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-max bg-brutal-black border-2 border-brutal-white p-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <p className="font-heading uppercase text-sm text-brutal-white">{label}</p>
            {locked && (
                <p className="text-[10px] font-mono text-brutal-yellow mt-1">{requirement}</p>
            )}
        </div>
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
            path: '/challenge-arena',
            label: 'Challenge Arena',
            icon: <Shield size={20} />,
            locked: useGamificationStore.getState().level < 5,
            requirement: "Reach Level 5 for Arena access",
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
        <div className="flex h-screen w-full bg-brutal-dark text-brutal-white overflow-hidden p-2 gap-2">
            <DebugOverlay />

            {/* Activity Bar (Slim Global Nav) */}
            <aside className="w-16 flex flex-col items-center bg-brutal-black border-2 border-brutal-white/20 h-full py-4 z-20">
                <div className="mb-6 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-brutal-green p-2 border-2 border-brutal-black rotate-3 hover:rotate-0 transition-transform">
                        <Terminal size={20} className="text-brutal-black" />
                    </div>
                </div>

                <nav className="flex-1 w-full flex flex-col items-center gap-2">
                    {navItems.map((item) => (
                        <ActivityBarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </nav>

                {/* Bottom Activity Bar Icons */}
                <div className="w-full flex flex-col items-center gap-4 mt-auto">
                    {streak.current > 0 && (
                        <div className="relative group cursor-help">
                            <Flame size={24} className="text-brutal-yellow" />
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-max bg-brutal-black border-2 border-brutal-yellow p-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="font-heading uppercase text-sm text-brutal-yellow">
                                    {streak.current} Day Streak
                                </span>
                            </div>
                        </div>
                    )}
                    <button onClick={() => navigate('/profile')} className="relative group p-1 border-2 border-brutal-white hover:border-brutal-yellow rounded-full overflow-hidden transition-colors">
                        <div className="bg-brutal-red w-8 h-8 flex items-center justify-center text-sm">
                            👤
                        </div>
                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-max bg-brutal-black border-2 border-brutal-white p-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="font-heading uppercase text-sm text-brutal-white">Profile</span>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full min-w-0">
                {/* Integrated Compact Header */}
                <header className="flex justify-between items-center mb-2 px-4 py-2 bg-brutal-black border-2 border-brutal-white/20 shrink-0 h-14">
                    <div className="flex items-center gap-4 h-full">
                        <div className="flex items-center gap-2">
                            <span className="font-heading uppercase text-sm text-brutal-yellow tracking-wider">HERO@THE-TERMINAL</span>
                            <div className="px-2 py-0.5 bg-brutal-yellow text-brutal-black font-heading text-xs uppercase font-bold">
                                LVL {level}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 h-full">
                        <ConnectionStatus />

                        {/* Compact XP Bar */}
                        <div className="flex items-center gap-3">
                            <span className="font-heading uppercase text-[10px] text-brutal-gray hidden md:inline-block">{title}</span>
                            <div className="h-3 w-32 border border-brutal-white/30 bg-brutal-dark overflow-hidden relative">
                                <div
                                    className="h-full bg-brutal-green transition-all duration-500 absolute left-0 top-0 bottom-0"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <span className="font-mono text-xs text-brutal-white">{current}/{needed} XP</span>
                        </div>
                    </div>
                </header>

                {/* Dynamic View Context (Workspace) */}
                <div className="flex-1 overflow-hidden relative min-h-0 bg-brutal-black border-2 border-brutal-white/20">
                    {children}
                </div>
            </main>
        </div>
    );
};
