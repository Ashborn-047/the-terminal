import React from 'react';
import { Trophy, Medal, User, WifiOff } from 'lucide-react';
import { useSubscription, useSpacetimeConnection } from '../../hooks/useSpacetime';
import { spacetime } from '../../lib/spacetime';
import { useGamificationStore } from '../../stores/gamificationStore';
import { 
    tokens, 
    Card, 
    Badge 
} from '../ui/AshbornDesignSystem';

/**
 * Leaderboard — Global rankings UI.
 * Connects to SpacetimeDB for real-time ranking.
 */
export const Leaderboard: React.FC = () => {
    const isConnected = useSpacetimeConnection();
    const liveRankings = useSubscription(() => spacetime.getLeaderboard());
    const { level, totalXpEarned } = useGamificationStore();

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
            isSelf: false 
        }))
        : mockRankings;

    return (
        <Card variant="default" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            {/* Grid background effect */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                opacity: 0.05, 
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(${tokens.color.text.secondary} 1px, transparent 1px)`, 
                backgroundSize: '20px 20px' 
            }} />

            <div style={{ 
                padding: tokens.space[5], 
                borderBottom: `1px solid ${tokens.color.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Trophy size={18} style={{ color: tokens.color.amber.base }} />
                    <h2 style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.md, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: tokens.color.text.primary,
                        margin: 0 
                    }}>
                        Global Ranking
                    </h2>
                </div>
                {!isConnected && (
                    <Badge variant="amber">
                        <WifiOff size={10} style={{ marginRight: 4 }} /> OFFLINE
                    </Badge>
                )}
            </div>

            <div style={{ padding: tokens.space[4], display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}>
                {displayRankings.slice(0, 10).map((r) => (
                    <div
                        key={r.rank}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: '10px 16px',
                            background: r.isSelf ? tokens.color.amber.alpha[8] : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${r.isSelf ? tokens.color.amber.base : tokens.color.border.default}`,
                            borderRadius: 4,
                            transition: 'all 0.15s'
                        }}
                    >
                        <div style={{ 
                            width: 24, 
                            fontFamily: tokens.font.mono, 
                            fontSize: 12, 
                            fontWeight: 700, 
                            color: r.rank <= 3 ? tokens.color.amber.base : tokens.color.text.tertiary,
                            fontStyle: 'italic'
                        }}>
                            #{r.rank}
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                            {r.rank === 1 ? <Trophy size={14} style={{ color: tokens.color.amber.base }} /> :
                                r.rank === 2 ? <Medal size={14} style={{ color: '#E2E8F0' }} /> :
                                    r.rank === 3 ? <Medal size={14} style={{ color: '#F59E0B' }} /> :
                                        <User size={14} style={{ color: tokens.color.text.tertiary }} />}
                            <span style={{ 
                                fontFamily: tokens.font.sans, 
                                fontSize: tokens.fontSize.xs, 
                                fontWeight: 600, 
                                textTransform: 'uppercase', 
                                color: r.isSelf ? tokens.color.amber.base : tokens.color.text.primary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {r.name}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 40 }}>
                                <span style={{ fontSize: 8, textTransform: 'uppercase', color: tokens.color.text.tertiary, fontWeight: 700 }}>LVL</span>
                                <span style={{ fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 700 }}>{r.level}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 60 }} className="hidden sm:flex">
                                <span style={{ fontSize: 8, textTransform: 'uppercase', color: tokens.color.text.tertiary, fontWeight: 700 }}>TOTAL XP</span>
                                <span style={{ fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 700 }}>{r.xp.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!isConnected && (
                <div style={{ 
                    padding: '8px 16px', 
                    background: tokens.color.bg.overlay, 
                    borderTop: `1px solid ${tokens.color.border.default}`,
                    fontSize: 9,
                    fontFamily: tokens.font.mono,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    color: tokens.color.text.tertiary,
                    letterSpacing: 1
                }}>
                    REAL-TIME SYNC DISABLED — VIEWING LOCAL CACHE
                </div>
            )}
        </Card>
    );
};
