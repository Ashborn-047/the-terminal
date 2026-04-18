import React from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';
import { 
    tokens, 
    Card, 
    Badge 
} from '../ui/AshbornDesignSystem';

export const StreakHeatmap: React.FC = () => {
    const { streak, activityHistory } = useGamificationStore();

    // Render 35 days (5 weeks) of history
    const totalDays = 35;
    const days = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (totalDays - 1 - i));
        const dateStr = date.toISOString().split('T')[0];

        const xpEarned = activityHistory?.[dateStr] || 0;

        let bgColor = "rgba(255,255,255,0.03)";
        let borderColor = tokens.color.border.subtle;
        let glow = "none";

        if (xpEarned > 0) {
            borderColor = "transparent";
            if (xpEarned >= 500) {
                bgColor = tokens.color.lime.base;
                glow = `0 0 10px ${tokens.color.lime.alpha[48]}`;
            } else if (xpEarned >= 200) {
                bgColor = tokens.color.lime.alpha[72];
            } else if (xpEarned >= 50) {
                bgColor = tokens.color.lime.alpha[48];
            } else {
                bgColor = tokens.color.lime.alpha[24];
            }
        }

        return { date: dateStr, xp: xpEarned, bgColor, borderColor, glow };
    });

    return (
        <Card variant="default" style={{ padding: tokens.space[4] }}>
            <h3 style={{ 
                fontFamily: tokens.font.sans, 
                fontSize: tokens.fontSize.xs, 
                fontWeight: tokens.fontWeight.bold,
                textTransform: 'uppercase', 
                color: tokens.color.text.secondary,
                marginBottom: tokens.space[4],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <span>Persistence Heatmap</span>
                <Badge variant="amber" style={{ fontSize: 9 }}>
                    {streak.current} DAY STREAK
                </Badge>
            </h3>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 4 
            }}>
                {days.map((day, i) => (
                    <div
                        key={i}
                        title={`${day.date}: ${day.xp} XP`}
                        style={{
                            aspectRatio: '1/1',
                            backgroundColor: day.bgColor,
                            border: `1px solid ${day.borderColor}`,
                            boxShadow: day.glow,
                            transition: 'transform 0.15s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ))}
            </div>

            <div style={{ 
                marginTop: 16, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                fontSize: 9, 
                color: tokens.color.text.tertiary, 
                textTransform: 'uppercase', 
                fontFamily: tokens.font.mono 
            }}>
                <span>Past 35 Days</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>Less</span>
                    <div style={{ width: 8, height: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${tokens.color.border.subtle}` }} />
                    <div style={{ width: 8, height: 8, background: tokens.color.lime.alpha[24] }} />
                    <div style={{ width: 8, height: 8, background: tokens.color.lime.alpha[48] }} />
                    <div style={{ width: 8, height: 8, background: tokens.color.lime.alpha[72] }} />
                    <div style={{ width: 8, height: 8, background: tokens.color.lime.base, boxShadow: `0 0 4px ${tokens.color.lime.alpha[48]}` }} />
                    <span>More</span>
                </div>
            </div>
        </Card>
    );
};
