import React from 'react';
import { useGamificationStore, getLevelTitle, ACHIEVEMENTS } from '../stores/gamificationStore';
import { useLabStore } from '../stores/labStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Zap, Terminal as TerminalIcon } from 'lucide-react';
import { StreakHeatmap } from '../components/gamification/StreakHeatmap';
import { SkillTree } from '../components/gamification/SkillTree';
import { QuestList } from '../components/gamification/QuestList';
import { 
    tokens, 
    StatCard, 
    ProgressBar, 
    Button, 
    Badge, 
    Card,
    Divider
} from '../components/ui/AshbornDesignSystem';

/**
 * HomePage — Dashboard: stats overview, recent activity, quick actions.
 */
const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { level, totalXpEarned, streak, unlockedAchievements, getXPProgress } = useGamificationStore();
    const { labs, progress } = useLabStore();
    const { current, needed, percent } = getXPProgress();
    const title = getLevelTitle(level);

    const labList = Object.values(labs);
    const inProgressLabs = labList.filter(l => progress[l.id]?.status === 'in-progress');
    const completedLabs = labList.filter(l => progress[l.id]?.status === 'completed');

    return (
        <div 
            className="h-full w-full overflow-y-auto"
            style={{ 
                padding: tokens.space[6],
                backgroundColor: tokens.color.bg.base,
                color: tokens.color.text.primary,
            }}
        >
            {/* Hero Banner */}
            <div 
                style={{
                    background: tokens.color.bg.surface,
                    border: `1px solid ${tokens.color.border.default}`,
                    padding: tokens.space[8],
                    marginBottom: tokens.space[6],
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 192,
                        height: 192,
                        background: tokens.color.lime.alpha[8],
                        transform: 'rotate(45deg) translate(64px, -64px)',
                        pointerEvents: 'none'
                    }} 
                />
                
                <h1 style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize['3xl'], 
                    fontWeight: tokens.fontWeight.black,
                    textTransform: 'uppercase', 
                    color: tokens.color.lime.base, 
                    marginBottom: tokens.space[1],
                    letterSpacing: tokens.letterSpacing.widest
                }}>
                    Command Center
                </h1>
                
                <p style={{ 
                    fontFamily: tokens.font.sans, 
                    fontSize: tokens.fontSize.md, 
                    color: tokens.color.text.secondary,
                    maxWidth: 512
                }}>
                    Welcome back, <span style={{ color: tokens.color.text.primary, fontWeight: tokens.fontWeight.bold }}>{title}</span>.
                    You're on Level {level} with {totalXpEarned.toLocaleString()} total XP earned.
                </p>
                
                <div style={{ marginTop: tokens.space[4], display: 'flex', gap: tokens.space[3] }}>
                    <Button 
                        variant="lime" 
                        icon={<BookOpen size={14} />}
                        onClick={() => navigate('/labs')}
                    >
                        Start a Lab
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div 
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: tokens.space[4], 
                    marginBottom: tokens.space[6] 
                }}
            >
                <StatCard label="Current Level" value={String(level)} accent="lime" icon={<Zap size={16} />} />
                <StatCard label="Total XP" value={totalXpEarned.toLocaleString()} accent="amber" icon={<Trophy size={16} />} />
                <StatCard label="Day Streak" value={String(streak.current)} accent="amber" unit="DAYS" />
                <StatCard label="Labs Completed" value={`${completedLabs.length}/${labList.length}`} accent="neutral" />
            </div>

            {/* XP Progress */}
            <Card style={{ marginBottom: tokens.space[6] }}>
                <ProgressBar 
                    value={percent} 
                    label={`Progress to Level ${level + 1}`} 
                    showValue 
                    height={4} 
                />
                <div style={{ marginTop: 8, textAlign: 'right', fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs, color: tokens.color.text.tertiary }}>
                    {current.toLocaleString()} / {needed.toLocaleString()} XP
                </div>
            </Card>

            {/* Heatmap & Quests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <StreakHeatmap />
                <QuestList />
            </div>

            {/* Skill Tree */}
            <div className="mb-6">
                <SkillTree />
            </div>

            {/* Two Column: In Progress + Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Continue Learning */}
                <Card variant="default" style={{ padding: tokens.space[5] }}>
                    <h2 style={{ 
                        fontFamily: tokens.font.sans,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.bold,
                        textTransform: 'uppercase',
                        color: tokens.color.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: tokens.space[4]
                    }}>
                        <TerminalIcon size={16} style={{ color: tokens.color.lime.base }} /> Continue Learning
                    </h2>
                    
                    {inProgressLabs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {inProgressLabs.slice(0, 3).map(lab => (
                                <button
                                    key={lab.id}
                                    onClick={() => {
                                        useLabStore.getState().startLab(lab.id);
                                        navigate(`/lab/${lab.id}`);
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        background: tokens.color.bg.surface,
                                        border: `1px solid ${tokens.color.border.default}`,
                                        padding: 12,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'border-color 0.15s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = tokens.color.lime.base}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = tokens.color.border.default}
                                >
                                    <div>
                                        <p style={{ 
                                            fontFamily: tokens.font.sans, 
                                            fontSize: tokens.fontSize.xs, 
                                            fontWeight: tokens.fontWeight.bold,
                                            textTransform: 'uppercase', 
                                            color: tokens.color.text.primary,
                                            margin: 0
                                        }}>
                                            {lab.title}
                                        </p>
                                        <p style={{ 
                                            fontFamily: tokens.font.mono, 
                                            fontSize: 9, 
                                            color: tokens.color.text.tertiary, 
                                            marginTop: 4,
                                            margin: 0
                                        }}>
                                            +{lab.xpReward} XP • {lab.type.toUpperCase()}
                                        </p>
                                    </div>
                                    <div style={{ color: tokens.color.text.tertiary }}>→</div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xs, color: tokens.color.text.tertiary }}>
                            No labs in progress. <button onClick={() => navigate('/labs')} style={{ background: 'none', border: 'none', padding: 0, color: tokens.color.lime.base, cursor: 'pointer', textDecoration: 'underline' }}>Browse curriculum →</button>
                        </p>
                    )}
                </Card>

                {/* Recent Achievements */}
                <Card variant="default" style={{ padding: tokens.space[5] }}>
                    <h2 style={{ 
                        fontFamily: tokens.font.sans,
                        fontSize: tokens.fontSize.sm,
                        fontWeight: tokens.fontWeight.bold,
                        textTransform: 'uppercase',
                        color: tokens.color.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: tokens.space[4]
                    }}>
                        <Trophy size={16} style={{ color: tokens.color.amber.base }} /> Achievements
                    </h2>
                    
                    {unlockedAchievements.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {unlockedAchievements.slice(0, 6).map(achId => {
                                const ach = ACHIEVEMENTS.find(a => a.id === achId);
                                return ach ? (
                                    <Badge key={achId} variant="amber">
                                        {ach.icon} {ach.name}
                                    </Badge>
                                ) : null;
                            })}
                        </div>
                    ) : (
                        <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.xs, color: tokens.color.text.tertiary }}>
                            No achievements unlocked yet. Complete labs to earn your first! 🏆
                        </p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default HomePage;
