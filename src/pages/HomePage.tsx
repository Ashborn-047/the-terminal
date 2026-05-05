import React, { useMemo } from 'react';
import { useGamificationStore, getLevelTitle, ACHIEVEMENTS } from '../stores/gamificationStore';
import { useUIStore } from '../stores/uiStore';
import { useLabStore } from '../stores/labStore';
import { useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon } from 'lucide-react';
import { SkillTree } from '../components/gamification/SkillTree';
import { DailyQuests } from '../components/gamification/DailyQuests';
import { 
    tokens, 
    Button, 
    Card,
    Badge,
    ActivitySpark,
    XPRing,
    AchievementGrid,
    Display,
    Label,
    Mono,
    useResponsive
} from '../components/ui/AshbornDesignSystem';

/**
 * HomePage — Dashboard: stats overview, recent activity, quick actions.
 */
const HomePage: React.FC = () => {
    const { isMobile, isTablet } = useResponsive();
    const navigate = useNavigate();
    const { username } = useUIStore();
    const { level, totalXpEarned, streak, unlockedAchievements, activityHistory, getXPProgress } = useGamificationStore();
    const { labs, progress } = useLabStore();
    const { current, needed, percent } = getXPProgress();
    const title = getLevelTitle(level);

    const activityData30 = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const dateStr = date.toISOString().split('T')[0];
            return activityHistory[dateStr] || 0;
        });
    }, [activityHistory]);

    const labList = Object.values(labs);
    const inProgressLabs = labList.filter(l => progress[l.id]?.status === 'in-progress');
    const completedLabs = labList.filter(l => progress[l.id]?.status === 'completed');
    const recentActivity = useMemo(() => {
        return Object.entries(activityHistory)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 4)
            .map(([date, count]) => ({ date, count }));
    }, [activityHistory]);
    const achievementCards = useMemo(() => {
        return ACHIEVEMENTS.map((a) => ({
            id: a.id,
            icon: a.icon,
            name: a.name,
            desc: a.description,
            earned: unlockedAchievements.includes(a.id),
            xp: a.xp,
            progress: unlockedAchievements.includes(a.id) ? 100 : 0,
        }));
    }, [unlockedAchievements]);

    return (
        <div 
            style={{ 
                padding: "clamp(12px, 2.8vw, 24px)",
                backgroundColor: tokens.color.bg.base,
                color: tokens.color.text.primary,
            }}
        >
            {/* Hero Banner Section v2 — HUD Layout */}
            <div 
                style={{
                    background: tokens.color.bg.surface,
                    border: `1px solid ${tokens.color.border.strong}`,
                    padding: "clamp(14px, 2.2vw, 24px)",
                    marginBottom: tokens.space[6],
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
                className="hero-banner"
            >
                <style>{`
                    @media (min-width: 640px) {
                        .hero-banner {
                            text-align: left !important;
                            justify-content: flex-start !important;
                        }
                    }
                `}</style>
                <XPRing level={level} xpCurrent={current} xpNext={needed} size={100} accent="lime" />
                
                <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Label color={tokens.color.lime.base} size="xs" uppercase>Command Center</Label>
                        <div style={{ 
                            width: 6, height: 6, background: tokens.color.lime.base, 
                            borderRadius: "50%", animation: "al-pulse 2s infinite" 
                        }} />
                    </div>

                    <Display as="h1" size="xl" style={{ marginBottom: 6 }}>Welcome back, {username || "Learner"}</Display>
                    
                    <p style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.xs, 
                        color: tokens.color.text.secondary,
                        maxWidth: 512,
                        lineHeight: 1.5,
                        margin: 0
                    }}>
                        Agent Status: <span style={{ color: tokens.color.lime.base, fontWeight: 700 }}>{title.toUpperCase()}</span>.
                        {streak.current >= 3 ? ` Active Streak: ${streak.current} Days.` : " Maintain activity to build system synchronization."}
                        {needed - current} XP remains until next elevation.
                    </p>
                    
                    <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                        <Button 
                            variant="lime" 
                            size="sm"
                            onClick={() => navigate('/labs')}
                        >
                            ▶ Start Training
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate('/chapters')}
                            style={{ position: 'relative' }}
                        >
                            View Curriculum
                            <Badge variant="lime" style={{ position: 'absolute', top: -8, right: -8, fontSize: 8 }}>NEW</Badge>
                        </Button>
                    </div>
                </div>

                {/* Secondary XP HUD */}
                <div style={{ width: 180, flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <Label size="2xs" uppercase>XP Elevation</Label>
                        <Mono size="2xs">{current.toLocaleString()}/{needed.toLocaleString()}</Mono>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", position: 'relative' }}>
                        <div style={{ 
                            height: "100%", width: `${percent}%`, 
                            background: tokens.color.lime.base, 
                            transition: "width 0.8s ease-out" 
                        }} />
                    </div>
                </div>
            </div>

            {/* Title for Stats Grid */}
            <div style={{ marginBottom: 12 }}>
                <Display size="xs" color={tokens.color.text.tertiary}>System Diagnostics</Display>
            </div>

            {/* Stats Grid */}
            <div 
                id="dashboard-stats-grid"
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                    gap: tokens.space[isMobile ? 2 : 4], 
                    marginBottom: tokens.space[8] 
                }}
            >
                <div id="stat-level" style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: tokens.space[6] }}>
                    <Label size="2xs" uppercase style={{ marginBottom: 8, letterSpacing: tokens.letterSpacing.widest }}>Current Level</Label>
                    <Display size="xl" color={tokens.color.amber.base} style={{ lineHeight: 1 }}>{level}</Display>
                </div>
                <div id="stat-xp" style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: tokens.space[6] }}>
                    <Label size="2xs" uppercase style={{ marginBottom: 8, letterSpacing: tokens.letterSpacing.widest }}>Total XP</Label>
                    <Display size="xl" color={tokens.color.lime.base} style={{ lineHeight: 1 }}>{totalXpEarned.toLocaleString()}</Display>
                </div>
                <div id="stat-streak" style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.strong}`, padding: tokens.space[6] }}>
                    <Label size="2xs" uppercase style={{ marginBottom: 8, letterSpacing: tokens.letterSpacing.widest }}>Day Streak</Label>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <Display size="xl" color={tokens.color.amber.base} style={{ lineHeight: 1 }}>{streak.current}</Display>
                        <Label size="2xs" color={tokens.color.text.tertiary}>DAYS</Label>
                    </div>
                </div>
                <div id="stat-labs" style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.default}`, padding: tokens.space[6] }}>
                    <Label size="2xs" uppercase style={{ marginBottom: 8, letterSpacing: tokens.letterSpacing.widest }}>Labs Completed</Label>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <Display size="xl" color={tokens.color.text.primary} style={{ lineHeight: 1 }}>{completedLabs.length}</Display>
                        <Label size="2xs" color={tokens.color.text.tertiary}>/{labList.length}</Label>
                    </div>
                </div>
            </div>

            {/* Activity + Mission Board */}
            <div 
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: tokens.space[6], 
                    marginBottom: tokens.space[8] 
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[6] }}>
                    {/* Continue Learning */}
                    <Card id="continue-learning-card" variant="default" style={{ padding: 20 }}>
                        <Display size="sm" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <TerminalIcon size={18} style={{ color: tokens.color.lime.base }} /> Continue Learning
                        </Display>
                        
                        {inProgressLabs.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                            <p style={{ 
                                fontFamily: tokens.font.sans, 
                                fontSize: tokens.fontSize.xs, 
                                color: tokens.color.text.tertiary,
                                margin: 0
                            }}>
                                No labs in progress.{' '}
                                <button 
                                    onClick={() => navigate('/labs')} 
                                    style={{ 
                                        background: 'none', border: 'none', padding: 0, 
                                        color: tokens.color.lime.base, cursor: 'pointer', 
                                        textDecoration: 'underline', fontFamily: tokens.font.sans 
                                    }}
                                >
                                    Browse curriculum →
                                </button>
                            </p>
                        )}
                    </Card>

                    <Card variant="default" style={{ padding: 20 }}>
                        <Display size="xs" color={tokens.color.text.tertiary} style={{ marginBottom: 12 }}>Activity Log</Display>
                        <ActivitySpark data={activityData30} streak={streak.current} />
                        <div style={{ marginTop: 14, borderTop: `1px solid ${tokens.color.border.subtle}`, paddingTop: 10 }}>
                            <Label size="2xs" uppercase style={{ marginBottom: 8 }}>Recent Activity</Label>
                            {recentActivity.length > 0 ? recentActivity.map((a) => (
                                <div key={a.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                                    <Mono size="2xs" color={tokens.color.text.tertiary}>{a.date}</Mono>
                                    <Mono size="2xs" color={tokens.color.lime.base}>{a.count} cmds</Mono>
                                </div>
                            )) : (
                                <Mono size="2xs" color={tokens.color.text.tertiary}>No recent command activity.</Mono>
                            )}
                        </div>
                    </Card>
                </div>

                <DailyQuests />
            </div>

            {/* System Masteries - Full Width Horizontal Section */}
            <div style={{ marginBottom: tokens.space[8] }}>
                <SkillTree />
            </div>


            {/* Achievements */}
            <div className="mb-8">
                <Card variant="default" style={{ padding: 20 }}>
                    <Display size="sm" style={{ marginBottom: 16 }}>Achievements</Display>
                    <AchievementGrid achievements={achievementCards.slice(0, 6)} />
                </Card>
            </div>
        </div>
    );
};

export default HomePage;
