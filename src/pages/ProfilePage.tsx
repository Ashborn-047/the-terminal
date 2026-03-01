import React from 'react';
import { useGamificationStore, getLevelTitle, ACHIEVEMENTS } from '../stores/gamificationStore';
import { SkillTree } from '../components/gamification/SkillTree';
import { Leaderboard } from '../components/gamification/Leaderboard';

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
        <div className="h-full overflow-y-auto p-4 space-y-8 pb-20">
            <h1 className="font-heading text-4xl uppercase text-brutal-white italic tracking-wider">
                Agent Profile
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Level" value={String(level)} sub={getLevelTitle(level)} color="bg-brutal-yellow" />
                <StatCard label="Total XP" value={String(totalXpEarned)} sub={`${current}/${needed} to next`} color="bg-brutal-green" />
                <StatCard label="Streak" value={`${streak.current}🔥`} sub={`Best: ${streak.longest}`} color="bg-brutal-red" />
                <StatCard label="Labs Done" value={String(labsCompleted)} sub="labs completed" color="bg-brutal-blue" />
            </div>

            {/* Skill Tree Section */}
            <section>
                <h2 className="font-heading text-xl uppercase text-brutal-white mb-4 italic">Advancement Path</h2>
                <SkillTree />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Achievements */}
                <section>
                    <h2 className="font-heading text-xl uppercase text-brutal-white mb-4 italic">
                        Honors ({unlockedAchievements.length}/{ACHIEVEMENTS.filter(a => !a.hidden).length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                    className={`border-2 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${unlocked
                                        ? 'border-brutal-green bg-brutal-dark hover:scale-[1.02]'
                                        : 'border-brutal-gray bg-brutal-dark opacity-60'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{ach.icon}</span>
                                        <span className="font-heading text-sm uppercase text-brutal-white">{ach.name}</span>
                                    </div>
                                    <p className="text-[10px] text-brutal-gray mb-2 font-mono h-8 overflow-hidden">{ach.description}</p>
                                    <div className="h-1 bg-brutal-black border border-brutal-gray mb-1">
                                        <div
                                            className={`h-full ${unlocked ? 'bg-brutal-green' : 'bg-brutal-yellow'}`}
                                            style={{ width: `${achPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-[9px] text-brutal-gray font-mono">
                                        {unlocked ? '✅ TRANSMITTED' : `${currentVal}/${ach.criteria.threshold}`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Leaderboard Section */}
                <section>
                    <h2 className="font-heading text-xl uppercase text-brutal-white mb-4 italic">Global Network</h2>
                    <Leaderboard />
                </section>
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
