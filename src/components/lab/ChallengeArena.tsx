import React from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { brokenSystemLabs } from '../../data/labs/broken_systems';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

export const ChallengeArena: React.FC = () => {
    const navigate = useNavigate();
    const { level, masteryBadge } = useGamificationStore();
    


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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brokenSystemLabs.map((lab) => {
                    const isLabLocked = lab.requiredLevel && level < lab.requiredLevel;

                    return (
                        <button
                            key={lab.id}
                            onClick={() => !isLabLocked && navigate(`/labs/11?lab=${lab.id}`)}
                            disabled={isLabLocked}
                            className={cn(
                                "group flex flex-col text-left border-4 p-6 transition-all",
                                isLabLocked
                                    ? "bg-brutal-darkBorder border-brutal-gray/30 opacity-60 cursor-not-allowed grayscale"
                                    : "bg-brutal-black border-brutal-white hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-0"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4 w-full">
                                <span className="text-3xl">{isLabLocked ? '🔒' : '🔥'}</span>
                                {isLabLocked ? (
                                    <span className="text-xs font-heading text-brutal-red bg-brutal-red/10 px-2 py-1 border border-brutal-red/30">
                                        REQUIRES Lvl {lab.requiredLevel}
                                    </span>
                                ) : (
                                    <span className="text-xs font-mono text-brutal-green bg-brutal-green/10 px-2 py-1 border border-brutal-green/30">
                                        +{lab.xpReward} XP
                                    </span>
                                )}
                            </div>
                            <h3 className={cn(
                                "text-xl font-heading uppercase transition-colors",
                                isLabLocked ? "text-brutal-gray" : "text-brutal-white group-hover:text-brutal-red"
                            )}>
                                {lab.title}
                            </h3>
                            <p className="text-sm text-brutal-gray mt-2 line-clamp-3">
                                {isLabLocked ? "This high-level scenario is currently locked." : lab.description}
                            </p>
                            <div className="mt-auto pt-6 flex flex-wrap gap-2">
                                {lab.tags?.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-brutal-white/20 text-brutal-gray">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
