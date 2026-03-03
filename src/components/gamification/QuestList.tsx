import React from 'react';
import { Target, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { spacetime } from '../../lib/spacetime';
import { useGamificationStore } from '../../stores/gamificationStore';

export const QuestList: React.FC = () => {
    const userQuests = spacetime.getUserQuests();
    const allQuests = spacetime.getQuests(); // Assuming this is available in index.ts
    const { xp, level } = useGamificationStore();

    if (!userQuests) {
        return (
            <div className="bg-brutal-dark border-3 border-brutal-white p-6 text-center shadow-brutal opacity-50">
                <Target size={48} className="mx-auto mb-4 text-brutal-gray" />
                <p className="font-mono text-brutal-white uppercase">No Active Quests</p>
            </div>
        );
    }

    const activeQuests = allQuests.filter((q: any) => userQuests.activeQuestIds.includes(q.id));
    const completedQuests = allQuests.filter((q: any) => userQuests.completedQuestIds.includes(q.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-2xl text-brutal-white uppercase flex items-center gap-3">
                    <Target className="text-brutal-green" /> Terminal Missions
                </h2>
                <div className="bg-brutal-green text-brutal-black px-3 py-1 font-bold border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs">
                    LEVEL {level}
                </div>
            </div>

            {/* Active Quests */}
            <div className="space-y-3" role="list" aria-label="Active Missions">
                {activeQuests.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-brutal-gray/30 text-brutal-gray font-mono text-sm text-center italic">
                        All daily missions complete! Checking for new transmissions...
                    </div>
                )}
                {activeQuests.map((quest: any) => (
                    <div
                        key={quest.id.toString()}
                        className="bg-brutal-black border-2 border-brutal-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-all cursor-pointer group"
                        onClick={() => spacetime.completeQuest(quest.id)}
                        role="listitem"
                        aria-labelledby={`quest-title-${quest.id}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 id={`quest-title-${quest.id}`} className="font-heading text-brutal-green text-lg group-hover:underline uppercase">{quest.title}</h3>
                            <div className="flex items-center gap-1 text-brutal-yellow font-bold text-xs" aria-label={`Reward: ${quest.xpReward} XP`}>
                                <Sparkles size={12} aria-hidden="true" /> +{quest.xpReward.toString()} XP
                            </div>
                        </div>
                        <p className="font-mono text-sm text-brutal-white/70 mb-4">{quest.description}</p>
                        <div className="flex justify-end">
                            <button
                                className="flex items-center gap-2 text-[10px] font-bold uppercase text-brutal-black bg-brutal-green px-4 py-2 border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                aria-label={`Complete Mission: ${quest.title}`}
                            >
                                Complete Objective <ChevronRight size={14} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Completed Section (Optional/Collapsed) */}
            {completedQuests.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-heading text-sm text-brutal-gray uppercase mb-4 opacity-50">Transmissions Received</h3>
                    <div className="space-y-2">
                        {completedQuests.slice(0, 3).map((quest: any) => (
                            <div key={quest.id.toString()} className="flex items-center gap-3 p-3 bg-brutal-white/5 border border-brutal-white/10 opacity-50 grayscale">
                                <CheckCircle2 size={16} className="text-brutal-green" />
                                <span className="font-mono text-xs text-brutal-white">{quest.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
