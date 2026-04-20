import React from 'react';
import { useGamificationStore, getLevelTitle, ACHIEVEMENTS } from '../stores/gamificationStore';
import { useUIStore } from '../stores/uiStore';
import { 
    tokens, 
    Card, 
    XPRing,
    SkillRadar,
    AchievementGrid,
    ActivitySpark,
    Display,
    Label,
    Mono
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

    // Mapping achievements to the format required by AchievementGrid
    const mappedAchievements = ACHIEVEMENTS.filter(a => !a.hidden || unlockedAchievements.includes(a.id)).map(ach => ({
        id: ach.id,
        icon: ach.icon,
        name: ach.name,
        desc: ach.description,
        earned: unlockedAchievements.includes(ach.id),
        xp: ach.xp,
        progress: Math.min(100, Math.round(((ach.criteria.target === 'labs-completed' ? labsCompleted
            : ach.criteria.target === 'level' ? level
                : ach.criteria.target === 'streak' ? streak.current
                    : (counters[ach.criteria.target] || 0)) / ach.criteria.threshold) * 100))
    }));

    // Mock skills for the radar (ideally derived from lab categories)
    const mockSkills = {
        filesystem: Math.min(100, (labsCompleted / 10) * 100),
        permissions: Math.min(100, (counters['permissions-fix'] || 0) * 20),
        networking: 0,
        scripting: 0,
        processes: 0
    };

    return (
        <div style={{ color: tokens.color.text.primary, height: '100%', overflow: 'auto' }}>
            {/* Identity Hero v2 */}
            <div style={{ padding: "clamp(14px, 3vw, 28px) clamp(14px, 3vw, 28px) 0", borderBottom: `1px solid ${tokens.color.border.strong}`, background: tokens.color.bg.surface }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                    {/* Large Avatar */}
                    <div style={{ 
                        width: 72, height: 72, 
                        background: tokens.color.lime.base, 
                        display: "flex", alignItems: "center", justifyContent: "center", 
                        fontFamily: tokens.font.sans, fontSize: "28px", fontWeight: 800, 
                        color: tokens.color.text.inverse, flexShrink: 0, position: "relative" 
                    }}>
                        {username?.[0]?.toUpperCase() || 'H'}
                        <div style={{ 
                            position: "absolute", bottom: 4, right: 4, 
                            width: 10, height: 10, borderRadius: "50%", 
                            background: tokens.color.lime.base, border: `2px solid ${tokens.color.bg.surface}`, 
                            animation: "al-pulse 2s infinite" 
                        }} />
                    </div>

                    {/* Identity block */}
                    <div style={{ flex: 1 }}>
                        <Label color={tokens.color.lime.base} style={{ marginBottom: 4 }}>Agent Profile</Label>
                        <Display size="lg">{username || "UNKNOWN_AGENT"}</Display>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                            <div style={{ 
                                background: tokens.color.amber.base, 
                                padding: "2px 8px", 
                                fontFamily: tokens.font.mono, fontSize: "10px", fontWeight: 800, 
                                color: tokens.color.text.inverse, letterSpacing: ".08em" 
                            }}>
                                LVL {level}
                            </div>
                            <span style={{ fontFamily: tokens.font.sans, fontSize: "12px", color: tokens.color.text.secondary }}>{getLevelTitle(level)}</span>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: tokens.color.text.tertiary }} />
                            <span style={{ fontFamily: tokens.font.mono, fontSize: "11px", color: tokens.color.text.tertiary }}>System Sync Active</span>
                        </div>
                    </div>

                    {/* XP Ring on the right */}
                    <XPRing level={level} xpCurrent={current} xpNext={needed} size={84} accent="amber" />
                </div>

                {/* Quick stat row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 0, borderTop: `1px solid ${tokens.color.border.subtle}` }}>
                    {[
                        { label: "Total XP", value: totalXpEarned.toLocaleString(), color: tokens.color.lime.base },
                        { label: "Labs Done", value: labsCompleted, color: tokens.color.text.secondary },
                        { label: "Streak", value: `${streak.current}d`, color: tokens.color.amber.base },
                        { label: "Achievements", value: unlockedAchievements.length, color: tokens.color.text.secondary },
                    ].map((s, i, arr) => (
                        <div key={s.label} style={{ 
                            flex: 1, padding: "12px 0 12px", 
                            borderRight: i < arr.length - 1 ? `1px solid ${tokens.color.border.subtle}` : "none", 
                            paddingLeft: 16 
                        }}>
                            <Label style={{ marginBottom: 2 }}>{s.label}</Label>
                            <span style={{ 
                                fontFamily: tokens.font.display, 
                                fontSize: "20px", 
                                color: s.color, 
                                letterSpacing: "-0.01em" 
                            }}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: "clamp(12px, 2.5vw, 24px) clamp(12px, 3vw, 28px)" }}>
                {/* Two Column Section */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24, alignItems: "start" }}>
                    {/* Skill Radar */}
                    <div style={{ background: tokens.color.bg.surface, border: `1px solid ${tokens.color.border.strong}`, padding: "16px 20px" }}>
                        <Label style={{ marginBottom: 16 }}>Skill Profile</Label>
                        <SkillRadar skills={mockSkills} size={220} />
                    </div>

                    {/* Activity Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <Card variant="default" style={{ padding: "14px 16px" }}>
                            <ActivitySpark data={[]} streak={streak.current} />
                        </Card>
                        
                        <Card variant="default" style={{ padding: "14px 16px" }}>
                            <Label style={{ marginBottom: 12 }}>System Status</Label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "11px", color: tokens.color.text.secondary }}>Filesystem Expertise</span>
                                    <Mono size="10px" color={tokens.color.lime.base}>{labsCompleted > 5 ? 'High' : labsCompleted > 0 ? 'Nominal' : 'Low'}</Mono>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "11px", color: tokens.color.text.secondary }}>Kernel Interaction</span>
                                    <Mono size="10px" color={tokens.color.amber.base}>Nominal</Mono>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "11px", color: tokens.color.text.secondary }}>Network Routing</span>
                                    <Mono size="10px" color={tokens.color.text.tertiary}>Locked</Mono>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Achievements Section */}
                <div style={{ marginBottom: 24 }}>
                    <Label style={{ marginBottom: 16, display: 'block' }}>Achievements ({unlockedAchievements.length} earned)</Label>
                    <AchievementGrid achievements={mappedAchievements} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
