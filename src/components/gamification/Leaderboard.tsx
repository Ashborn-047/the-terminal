import React from 'react';
import { Trophy, Medal, User, WifiOff } from 'lucide-react';
import { useSubscription, useSpacetimeConnection } from '../../hooks/useSpacetime';
import { spacetime } from '../../lib/spacetime';
import { useGamificationStore } from '../../stores/gamificationStore';

/**
 * Leaderboard — per Doc 3 §6.6
 * Global rankings UI.
 * Connects to SpacetimeDB for real-time ranking.
 */
export const Leaderboard: React.FC = () => {
    const isConnected = useSpacetimeConnection();
    const liveRankings = useSubscription(() => spacetime.getLeaderboard());
    const { xp, level, totalXpEarned } = useGamificationStore(); // Local user stats

    // Fallback data when offline
    const mockRankings = [
        { rank: 1, name: 'RootMaster', level: 42, xp: 12500, isSelf: false },
        { rank: 2, name: 'KernelPanic', level: 38, xp: 11200, isSelf: false },
        { rank: 3, name: 'SudoSu', level: 35, xp: 9800, isSelf: false },
        { rank: 4, name: 'BashHero', level: 31, xp: 8400, isSelf: false },
        { rank: 124, name: 'You (Local)', level: level, xp: totalXpEarned, isSelf: true },
    ];

    const displayRankings = isConnected && liveRankings && liveRankings.length > 0
        ? liveRankings.map((r: any, index: number) => ({
            rank: index + 1,
            name: r.username || 'Unknown',
            level: r.level ? Number(r.level) : 1,
            xp: r.totalXp ? Number(r.totalXp) : 0,
            isSelf: false // We need a way to identify self from SpacetimeDB identity later
        }))
        : mockRankings;

    return (
        <div className="bg-brutal-dark border-3 border-brutal-white p-6 shadow-brutal relative overflow-hidden">
            {/* Grid background effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(var(--color-brutal-white) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative z-10 flex items-center justify-between gap-3 mb-6 border-b-2 border-brutal-white pb-4">
                <div className="flex items-center gap-3">
                    <Trophy className="text-brutal-yellow" />
                    <h2 className="font-heading text-xl uppercase text-brutal-white">Global Leaderboard</h2>
                </div>
                {!isConnected && (
                    <div className="flex items-center gap-2 text-[10px] font-mono bg-brutal-red text-brutal-white px-2 py-1 border border-brutal-black font-bold uppercase">
                        <WifiOff size={10} /> Offline Mode
                    </div>
                )}
            </div>

            <div className="relative z-10 space-y-3 font-mono">
                {displayRankings.slice(0, 10).map((r) => (
                    <div
                        key={r.rank}
                        className={`flex items-center gap-4 p-3 border-2 transition-all ${r.isSelf
                            ? 'bg-brutal-yellow border-brutal-black text-brutal-black scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-brutal-black border-brutal-white text-brutal-white opacity-80'
                            }`}
                    >
                        <div className="w-8 flex justify-center font-bold italic">
                            #{r.rank}
                        </div>

                        <div className="flex-1 flex items-center gap-3">
                            {r.rank === 1 ? <Trophy size={16} className="text-brutal-yellow" /> :
                                r.rank === 2 ? <Medal size={16} className="text-slate-300" /> :
                                    r.rank === 3 ? <Medal size={16} className="text-amber-600" /> :
                                        <User size={16} />}
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

            {!isConnected && (
                <div className="relative z-10 mt-6 p-3 bg-brutal-blue/20 border-2 border-brutal-blue text-[10px] text-brutal-blue font-mono uppercase text-center">
                    SpacetimeDB synchronization required for real-time rankings
                </div>
            )}
        </div>
    );
};
