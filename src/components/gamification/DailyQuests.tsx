import React, { useEffect } from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { Target, CheckCircle2, Gift } from 'lucide-react';

export const DailyQuests: React.FC = () => {
    const { dailyQuests, generateDailyQuests, claimQuestReward } = useGamificationStore();

    useEffect(() => {
        generateDailyQuests();
    }, [generateDailyQuests]);

    return (
        <div className="bg-brutal-black border-3 border-brutal-white p-6 shadow-brutal flex flex-col h-full">
            <div className="flex items-center justify-between gap-3 mb-6 border-b-2 border-brutal-white pb-4">
                <div className="flex items-center gap-3">
                    <Target className="text-brutal-pink" />
                    <h2 className="font-heading text-xl uppercase text-brutal-white">Daily Quests</h2>
                </div>
                <div className="text-[10px] font-mono text-brutal-white/50 bg-brutal-dark px-2 py-1 border border-brutal-gray/30 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                    RESETS AT MIDNIGHT
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {dailyQuests.map((quest) => {
                    const percent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

                    return (
                        <div
                            key={quest.id}
                            className={`p-4 border-2 transition-all relative overflow-hidden group ${quest.claimed
                                    ? 'bg-brutal-dark/50 border-brutal-gray/30 opacity-60 grayscale'
                                    : quest.completed
                                        ? 'bg-brutal-green/10 border-brutal-green'
                                        : 'bg-brutal-dark border-brutal-white hover:border-brutal-pink'
                                }`}
                        >
                            {!quest.claimed && quest.completed && (
                                <div className="absolute inset-0 bg-brutal-green/10 pointer-events-none stripes-bg mix-blend-overlay opacity-20" />
                            )}

                            <div className="relative z-10 flex justify-between items-start mb-2">
                                <div>
                                    <h3 className={`font-heading text-sm uppercase ${quest.claimed ? 'text-brutal-gray' : 'text-brutal-white'}`}>
                                        {quest.title}
                                    </h3>
                                    <div className="text-[10px] font-mono text-brutal-gray mt-1">
                                        Reward: <span className="text-brutal-yellow">+{quest.xpReward} XP</span>
                                    </div>
                                </div>

                                {quest.claimed ? (
                                    <CheckCircle2 size={24} className="text-brutal-gray" />
                                ) : quest.completed ? (
                                    <button
                                        onClick={() => claimQuestReward(quest.id)}
                                        className="bg-brutal-green text-brutal-black border-2 border-brutal-black px-3 py-1 font-heading text-xs uppercase hover:bg-brutal-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 active:translate-y-0 active:shadow-none"
                                    >
                                        <Gift size={14} />
                                        Claim
                                    </button>
                                ) : (
                                    <div className="text-xs font-mono text-brutal-white">
                                        {quest.progress} / {quest.target}
                                    </div>
                                )}
                            </div>

                            {!quest.claimed && (
                                <div className="h-2 w-full bg-brutal-black border border-brutal-gray relative mt-3">
                                    <div
                                        className={`h-full transition-all duration-500 ${quest.completed ? 'bg-brutal-green' : 'bg-brutal-pink'}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {dailyQuests.length === 0 && (
                    <div className="text-center text-brutal-gray/50 py-8 font-mono text-sm">
                        Loading daily assignments...
                    </div>
                )}
            </div>
        </div>
    );
};
