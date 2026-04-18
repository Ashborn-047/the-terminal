import React from 'react';
import { useGamificationStore, getLevelTitle, ACHIEVEMENTS } from '../stores/gamificationStore';
import { useUIStore } from '../stores/uiStore';
import { SkillTree } from '../components/gamification/SkillTree';
import { Leaderboard } from '../components/gamification/Leaderboard';
import { StreakHeatmap } from '../components/gamification/StreakHeatmap';
import { 
    tokens, 
    Card, 
    Badge, 
    StatCard, 
    ProgressBar 
} from '../components/ui/AshbornDesignSystem';

/**
 * ProfilePage — shows user stats, achievement gallery, and progress overview.
 */
const ProfilePage: React.FC = () => {
    const { username } = useUIStore();
    const {
        level, totalXpEarned, streak, labsCompleted,
        unlockedAchievements, counters, getXPProgress
    } = useGamificationStore();
    const { current, needed, percent } = getXPProgress();

    return (
        <div style={{ 
            height: '100%', 
            overflowY: 'auto', 
            padding: tokens.space[8], 
            backgroundColor: tokens.color.bg.base,
            color: tokens.color.text.primary,
            paddingBottom: 80
        }}>
            <h1 style={{ 
                fontFamily: tokens.font.sans, 
                fontSize: tokens.fontSize['3xl'], 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                color: tokens.color.text.primary, 
                letterSpacing: tokens.letterSpacing.widest,
                marginBottom: tokens.space[8],
                fontStyle: 'italic'
            }}>
                Agent Profile: <span style={{ color: tokens.color.lime.base }}>{username}</span>
            </h1>

            {/* Stats Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: tokens.space[4], 
                marginBottom: tokens.space[8] 
            }}>
                <StatCard label="Current Level" value={String(level)} sub={getLevelTitle(level)} accent="lime" />
                <StatCard label="Total Experience" value={totalXpEarned.toLocaleString()} sub={`${current}/${needed} XP`} accent="amber" />
                <StatCard label="Current Streak" value={`${streak.current} Days`} sub={`Best: ${streak.longest}`} accent="amber" />
                <StatCard label="Labs Completed" value={String(labsCompleted)} sub="certified labs" accent="neutral" />
            </div>

            <section style={{ marginBottom: tokens.space[10] }}>
                <h2 style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize.lg, 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    color: tokens.color.text.secondary, 
                    marginBottom: tokens.space[6],
                    letterSpacing: tokens.letterSpacing.wide
                }}>
                    Advancement Path
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[6] }}>
                    <SkillTree />
                    <StreakHeatmap />
                </div>
            </section>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr',
                gap: tokens.space[10] 
            }} className="lg:grid-cols-2">
                {/* Achievements */}
                <section>
                    <h2 style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.lg, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: tokens.color.text.secondary, 
                        marginBottom: tokens.space[6],
                        letterSpacing: tokens.letterSpacing.wide
                    }}>
                        Honors ({unlockedAchievements.length}/{ACHIEVEMENTS.filter(a => !a.hidden).length})
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: tokens.space[3] }} className="md:grid-cols-2">
                        {ACHIEVEMENTS.filter(a => !a.hidden || unlockedAchievements.includes(a.id)).map((ach) => {
                            const unlocked = unlockedAchievements.includes(ach.id);
                            const currentVal = ach.criteria.target === 'labs-completed' ? labsCompleted
                                : ach.criteria.target === 'level' ? level
                                    : ach.criteria.target === 'streak' ? streak.current
                                        : (counters[ach.criteria.target] || 0);
                            const achPercent = Math.min(100, Math.round((currentVal / ach.criteria.threshold) * 100));

                            return (
                                <Card
                                    key={ach.id}
                                    variant="default"
                                    style={{ 
                                        opacity: unlocked ? 1 : 0.6,
                                        borderColor: unlocked ? tokens.color.amber.base : tokens.color.border.default,
                                        transition: 'transform 0.2s',
                                        padding: tokens.space[4]
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <span style={{ fontSize: 24 }}>{ach.icon}</span>
                                        <span style={{ 
                                            fontFamily: tokens.font.sans, 
                                            fontSize: tokens.fontSize.xs, 
                                            fontWeight: 700, 
                                            textTransform: 'uppercase', 
                                            color: tokens.color.text.primary 
                                        }}>
                                            {ach.name}
                                        </span>
                                    </div>
                                    <p style={{ 
                                        fontSize: 10, 
                                        color: tokens.color.text.tertiary, 
                                        marginBottom: 12, 
                                        fontFamily: tokens.font.sans,
                                        height: 32,
                                        overflow: 'hidden',
                                        lineHeight: 1.4
                                    }}>
                                        {ach.description}
                                    </p>
                                    <ProgressBar 
                                        value={achPercent} 
                                        height={3} 
                                        variant={unlocked ? "lime" : "amber"} 
                                    />
                                    <div style={{ 
                                        marginTop: 8, 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        fontFamily: tokens.font.mono,
                                        fontSize: 8,
                                        color: tokens.color.text.tertiary
                                    }}>
                                        <span>{unlocked ? '✅ SYSTEM SYNCED' : `${currentVal} / ${ach.criteria.threshold}`}</span>
                                        <span>{achPercent}%</span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Leaderboard Section */}
                <section>
                    <h2 style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.lg, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: tokens.color.text.secondary, 
                        marginBottom: tokens.space[6],
                        letterSpacing: tokens.letterSpacing.wide
                    }}>
                        Global Network
                    </h2>
                    <Leaderboard />
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
