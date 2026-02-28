import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Terminal, BookOpen, Award, Settings, LogOut, ChevronRight, Zap, Flame } from 'lucide-react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { useUIStore } from '../../stores/uiStore';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    locked?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, locked, onClick }) => (
    <button
        onClick={locked ? undefined : onClick}
        className={`flex items-center gap-3 w-full p-3 mb-2 font-heading uppercase text-sm border-2 transition-all ${locked
            ? 'bg-brutal-dark text-brutal-gray border-brutal-gray cursor-not-allowed opacity-50'
            : active
                ? 'bg-brutal-green text-brutal-black border-brutal-black shadow-brutal translate-x-[-2px] translate-y-[-2px]'
                : 'bg-brutal-white text-brutal-black border-brutal-black hover:bg-brutal-yellow'
            }`}
    >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {locked && <span className="text-[10px]">🔒</span>}
        {active && !locked && <ChevronRight size={16} />}
    </button>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { level, streak, getXPProgress, getTitle } = useGamificationStore();
    const { sidebarOpen } = useUIStore();
    const { current, needed, percent } = getXPProgress();
    const title = getTitle();

    const features = useFeatureAccess();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <Zap size={20} />, locked: false },
        { path: '/terminal', label: 'Terminal', icon: <Terminal size={20} />, locked: false },
        { path: '/labs', label: 'Curriculum', icon: <BookOpen size={20} />, locked: false },
        { path: '/profile', label: 'Achievements', icon: <Award size={20} />, locked: !features.achievements },
    ];

    return (
        <div className="flex h-screen w-full bg-brutal-dark text-brutal-white overflow-hidden p-4 gap-4">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex flex-col h-full transition-all`}>
                <div className="flex items-center gap-3 mb-8 p-2 border-3 border-brutal-white bg-brutal-black shadow-brutal">
                    <div className="bg-brutal-green p-2 border-2 border-brutal-black">
                        <Terminal size={24} className="text-brutal-black" />
                    </div>
                    <div>
                        <h1 className="font-heading text-xl uppercase leading-none">The</h1>
                        <h1 className="font-heading text-xl uppercase leading-none">Terminal</h1>
                    </div>
                </div>

                <nav className="flex-1">
                    {navItems.map(({ path, label, icon, locked }) => (
                        <SidebarItem
                            key={path}
                            icon={icon}
                            label={label}
                            active={location.pathname === path}
                            locked={locked}
                            onClick={() => navigate(path)}
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
                <header className="flex justify-between items-center mb-4 p-4 bg-brutal-white border-3 border-brutal-black text-brutal-black shadow-brutal">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center p-2 border-2 border-brutal-black bg-brutal-yellow font-heading uppercase text-xs min-w-[60px]">
                            <span>LVL {level}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-heading uppercase text-[10px] text-brutal-gray leading-none">{title}</span>
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-40 border-2 border-brutal-black bg-brutal-black p-[2px]">
                                    <div
                                        className="h-full bg-brutal-green transition-all duration-500"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                <span className="font-heading uppercase text-xs">{current}/{needed} XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="font-heading uppercase text-sm">guest@the-terminal</div>
                        <div className="w-10 h-10 border-2 border-brutal-black rounded-full bg-brutal-red" />
                    </div>
                </header>

                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
};
