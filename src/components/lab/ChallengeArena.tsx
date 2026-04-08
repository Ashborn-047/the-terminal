import React from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { brokenSystemLabs } from '../../data/labs/broken_systems';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

export const ChallengeArena: React.FC = () => {
    const navigate = useNavigate();
    const { level, masteryBadge } = useGamificationStore();
    
    const isLocked = level < 20;

    return (
        <div className="flex flex-col gap-6 p-8 bg-brutal-dark h-full overflow-y-auto">
            <div className="flex justify-between items-end border-b-4 border-brutal-white pb-4">
                <div>
                    <h1 className="text-4xl font-heading text-brutal-white uppercase tracking-tighter">
                        Challenge Arena
                    </h1>
                    <p className="text-brutal-gray mt-2">
                        Advanced "Broken System" scenarios for high-level mastery.
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-sm uppercase text-brutal-gray block">Mastery Rank</span>
                    <span className={cn(
                        "text-xl font-heading uppercase px-2 py-1",
                        masteryBadge === 'kernel_master' ? "bg-brutal-purple text-brutal-white" :
                        masteryBadge === 'sysad' ? "bg-brutal-red text-brutal-white" :
                        masteryBadge === 'hacker' ? "bg-brutal-green text-brutal-dark" :
                        "bg-brutal-white text-brutal-dark"
                    )}>
                        {masteryBadge === 'kernel_master' ? 'Kernel Master' : masteryBadge}
                    </span>
                </div>
            </div>

            {isLocked ? (
                <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-brutal-gray/30 p-12 text-center">
                    <span className="text-6xl mb-4">🔒</span>
                    <h2 className="text-2xl font-heading text-brutal-white uppercase">Arena Locked</h2>
                    <p className="text-brutal-gray mt-2 max-w-sm">
                        You must reach <span className="text-brutal-green underline">Level 20 (Hacker Rank)</span> to enter the Challenge Arena.
                    </p>
                    <div className="mt-8 flex gap-2 grayscale opacity-50 select-none">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-48 h-32 bg-brutal-darkBorder border-3 border-brutal-white/20" />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brokenSystemLabs.map((lab) => (
                        <button
                            key={lab.id}
                            onClick={() => navigate(`/labs/11?lab=${lab.id}`)}
                            className="group flex flex-col text-left bg-brutal-black border-4 border-brutal-white p-6 transition-all hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-0"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl">🔥</span>
                                <span className="text-xs font-mono text-brutal-green bg-brutal-green/10 px-2 py-1 border border-brutal-green/30">
                                    +{lab.xpReward} XP
                                </span>
                            </div>
                            <h3 className="text-xl font-heading text-brutal-white uppercase group-hover:text-brutal-red transition-colors">
                                {lab.title}
                            </h3>
                            <p className="text-sm text-brutal-gray mt-2 line-clamp-3">
                                {lab.description}
                            </p>
                            <div className="mt-auto pt-6 flex flex-wrap gap-2">
                                {lab.tags?.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-brutal-white/20 text-brutal-gray">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
