import React from 'react';
import { useGamificationStore, getLevelTitle, xpForLevel, ACHIEVEMENTS } from '../stores/gamificationStore';
import { useLabStore } from '../stores/labStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Flame, Zap, ChevronRight, Terminal } from 'lucide-react';

/**
 * HomePage — Dashboard: stats overview, recent activity, quick actions.
 * NO terminal here. Terminal lives at /lab/:id when a lab is active.
 */
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { level, totalXpEarned, streak, labsCompleted, unlockedAchievements, getXPProgress } = useGamificationStore();
    const { labs, progress } = useLabStore();
    const { current, needed, percent } = getXPProgress();
    const title = getLevelTitle(level);

    const labList = Object.values(labs);
    const inProgressLabs = labList.filter(l => progress[l.id]?.status === 'in-progress');
    const completedLabs = labList.filter(l => progress[l.id]?.status === 'completed');
    const availableLabs = labList.filter(l => !progress[l.id] || progress[l.id]?.status === 'available');

    return (
        <div className="h-full overflow-y-auto p-6">
            {/* Hero Banner */}
            <div className="border-3 border-brutal-green bg-brutal-black p-8 mb-6 shadow-brutal relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brutal-green/5 rotate-45 translate-x-16 -translate-y-16" />
                <h1 className="font-heading text-4xl uppercase text-brutal-green mb-2">
                    Command Center
                </h1>
                <p className="text-brutal-gray text-sm max-w-lg">
                    Welcome back, <span className="text-brutal-white font-bold">{title}</span>.
                    You're on Level {level} with {totalXpEarned} total XP earned.
                </p>
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => navigate('/labs')}
                        className="border-2 border-brutal-green text-brutal-green px-5 py-2 font-heading uppercase text-sm hover:bg-brutal-green hover:text-brutal-black transition-colors flex items-center gap-2"
                    >
                        <BookOpen size={16} /> Start a Lab
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Zap size={20} />} label="Level" value={String(level)} accent="green" />
                <StatCard icon={<Trophy size={20} />} label="Total XP" value={String(totalXpEarned)} accent="yellow" />
                <StatCard icon={<Flame size={20} />} label="Day Streak" value={String(streak.current)} accent="red" />
                <StatCard icon={<BookOpen size={20} />} label="Labs Done" value={`${completedLabs.length}/${labList.length}`} accent="white" />
            </div>

            {/* XP Progress */}
            <div className="border-3 border-brutal-white bg-brutal-black p-4 mb-6 shadow-brutal">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-heading uppercase text-xs text-brutal-gray">Progress to Level {level + 1}</span>
                    <span className="font-heading text-sm text-brutal-green">{current}/{needed} XP</span>
                </div>
                <div className="w-full h-3 bg-brutal-dark border border-brutal-white/20">
                    <div
                        className="h-full bg-brutal-green transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Two Column: In Progress + Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Continue Learning */}
                <div className="border-3 border-brutal-white bg-brutal-black p-5 shadow-brutal">
                    <h2 className="font-heading uppercase text-sm text-brutal-white mb-4 flex items-center gap-2">
                        <Terminal size={16} className="text-brutal-green" /> Continue Learning
                    </h2>
                    {inProgressLabs.length > 0 ? (
                        <div className="space-y-3">
                            {inProgressLabs.slice(0, 3).map(lab => (
                                <button
                                    key={lab.id}
                                    onClick={() => {
                                        useLabStore.getState().startLab(lab.id);
                                        navigate(`/lab/${lab.id}`);
                                    }}
                                    className="w-full text-left border-2 border-brutal-gray p-3 hover:border-brutal-green transition-colors flex items-center justify-between group"
                                >
                                    <div>
                                        <p className="font-heading uppercase text-xs text-brutal-white">{lab.title}</p>
                                        <p className="text-[10px] text-brutal-gray mt-1">+{lab.xpReward} XP • {lab.type}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-brutal-gray group-hover:text-brutal-green transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-brutal-gray text-xs">
                            No labs in progress. <button onClick={() => navigate('/labs')} className="text-brutal-green underline">Browse curriculum →</button>
                        </p>
                    )}
                </div>

                {/* Recent Achievements */}
                <div className="border-3 border-brutal-white bg-brutal-black p-5 shadow-brutal">
                    <h2 className="font-heading uppercase text-sm text-brutal-white mb-4 flex items-center gap-2">
                        <Trophy size={16} className="text-brutal-yellow" /> Achievements
                    </h2>
                    {unlockedAchievements.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {unlockedAchievements.slice(0, 6).map(achId => {
                                const ach = ACHIEVEMENTS.find(a => a.id === achId);
                                return ach ? (
                                    <div key={achId} className="border border-brutal-yellow px-3 py-1 text-sm" title={ach.description}>
                                        {ach.icon} {ach.name}
                                    </div>
                                ) : null;
                            })}
                        </div>
                    ) : (
                        <p className="text-brutal-gray text-xs">
                            No achievements unlocked yet. Complete labs to earn your first! 🏆
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; accent: string }> = ({ icon, label, value, accent }) => (
    <div className={`border-3 border-brutal-${accent} bg-brutal-black p-4 shadow-brutal`}>
        <div className={`text-brutal-${accent} mb-2`}>{icon}</div>
        <p className="font-heading text-2xl text-brutal-white">{value}</p>
        <p className="font-heading uppercase text-[10px] text-brutal-gray">{label}</p>
    </div>
);

export default HomePage;
