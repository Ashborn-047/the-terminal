import React from 'react';
import { useGamificationStore, getLevelTitle, xpForLevel, ACHIEVEMENTS } from '../stores/gamificationStore';

/**
 * ProfilePage — per frontend_architecture.md §5 routes: /profile
 * Shows user stats, achievement gallery, and progress overview.
 */
const ProfilePage: React.FC = () => {
    const {
        level, totalXpEarned, streak, labsCompleted,
        unlockedAchievements, counters, getXPProgress
    } = useGamificationStore();
    const { current, needed, percent } = getXPProgress();

    return (
        <div className="h-full overflow-y-auto p-4 space-y-6">
            <h1 className="font-heading text-3xl uppercase text-brutal-white">Profile</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Level" value={String(level)} sub={getLevelTitle(level)} color="bg-brutal-yellow" />
                <StatCard label="Total XP" value={String(totalXpEarned)} sub={`${current}/${needed} to next`} color="bg-brutal-green" />
                <StatCard label="Streak" value={`${streak.current}🔥`} sub={`Best: ${streak.longest}`} color="bg-brutal-red" />
                <StatCard label="Labs Done" value={String(labsCompleted)} sub="labs completed" color="bg-brutal-blue" />
            </div>

            {/* XP Progress */}
            <div className="bg-brutal-dark border-3 border-brutal-white p-4">
                <h2 className="font-heading uppercase text-sm mb-2 text-brutal-white">XP to Level {level + 1}</h2>
                <div className="h-6 border-2 border-brutal-white bg-brutal-black p-[2px]">
                    <div className="h-full bg-brutal-green transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <p className="text-xs text-brutal-gray mt-1">{current} / {needed} XP ({percent}%)</p>
            </div>

            {/* Achievements */}
            <div>
                <h2 className="font-heading text-xl uppercase text-brutal-white mb-4">
                    Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.filter(a => !a.hidden).length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ACHIEVEMENTS.filter(a => !a.hidden || unlockedAchievements.includes(a.id)).map((ach) => {
                        const unlocked = unlockedAchievements.includes(ach.id);
                        const currentVal = ach.criteria.target === 'labs-completed' ? labsCompleted
                            : ach.criteria.target === 'level' ? level
                                : ach.criteria.target === 'streak' ? streak.current
                                    : (counters[ach.criteria.target] || 0);
                        const achPercent = Math.min(100, Math.round((currentVal / ach.criteria.threshold) * 100));

                        return (
                            <div
                                key={ach.id}
                                className={`border-2 p-3 ${unlocked
                                    ? 'border-brutal-green bg-brutal-dark'
                                    : 'border-brutal-gray bg-brutal-dark opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{ach.icon}</span>
                                    <span className="font-heading text-sm uppercase text-brutal-white">{ach.name}</span>
                                </div>
                                <p className="text-xs text-brutal-gray mb-2">{ach.description}</p>
                                <div className="h-2 border border-brutal-gray bg-brutal-black">
                                    <div
                                        className={`h-full ${unlocked ? 'bg-brutal-green' : 'bg-brutal-yellow'}`}
                                        style={{ width: `${achPercent}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-brutal-gray mt-1">
                                    {unlocked ? '✅ Unlocked' : `${currentVal}/${ach.criteria.threshold}`}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Simple stat card sub-component
const StatCard: React.FC<{ label: string; value: string; sub: string; color: string }> = ({ label, value, sub, color }) => (
    <div className={`${color} text-brutal-black p-4 border-3 border-brutal-black shadow-brutal`}>
        <span className="font-heading uppercase text-[10px]">{label}</span>
        <p className="font-heading text-2xl">{value}</p>
        <span className="text-[10px] opacity-70">{sub}</span>
    </div>
);

export default ProfilePage;
