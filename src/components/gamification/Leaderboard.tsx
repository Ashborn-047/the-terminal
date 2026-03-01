import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';

/**
 * Leaderboard — per Doc 3 §6.6
 * Global rankings UI.
 * Currently mock data since SpacetimeDB accounts are on hold.
 */
export const Leaderboard: React.FC = () => {
    const mockRankings = [
        { rank: 1, name: 'RootMaster', level: 42, xp: 12500, isSelf: false },
        { rank: 2, name: 'KernelPanic', level: 38, xp: 11200, isSelf: false },
        { rank: 3, name: 'SudoSu', level: 35, xp: 9800, isSelf: false },
        { rank: 4, name: 'BashHero', level: 31, xp: 8400, isSelf: false },
        { rank: 124, name: 'You (Local)', level: 5, xp: 1200, isSelf: true },
    ];

    return (
        <div className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-brutal-white pb-4">
                <Trophy className="text-brutal-yellow" />
                <h2 className="font-heading text-xl uppercase text-brutal-white">Global Leaderboard</h2>
            </div>

            <div className="space-y-3 font-mono">
                {mockRankings.map((r) => (
                    <div
                        key={r.rank}
                        className={`flex items-center gap-4 p-3 border-2 transition-all ${r.isSelf
                                ? 'bg-brutal-yellow border-brutal-black text-brutal-black scale-[1.02] shadow-brutal'
                                : 'bg-brutal-black border-brutal-white text-brutal-white opacity-80'
                            }`}
                    >
                        <div className="w-8 flex justify-center font-bold italic">
                            #{r.rank}
                        </div>

                        <div className="flex-1 flex items-center gap-3">
                            {r.rank === 1 ? <Trophy size={16} className="text-brutal-yellow" /> : <User size={16} />}
                            <span className="font-heading uppercase text-sm truncate">{r.name}</span>
                        </div>

                        <div className="flex flex-col items-end min-w-[60px]">
                            <span className="text-[10px] uppercase opacity-60">Level</span>
                            <span className="text-sm font-bold">{r.level}</span>
                        </div>

                        <div className="flex flex-col items-end min-w-[70px] hidden sm:flex">
                            <span className="text-[10px] uppercase opacity-60">XP</span>
                            <span className="text-sm font-bold">{r.xp}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-3 bg-brutal-blue/20 border-2 border-brutal-blue text-[10px] text-brutal-blue font-mono uppercase text-center">
                SpacetimeDB synchronization required for real-time rankings
            </div>
        </div>
    );
};
