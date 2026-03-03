import React from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';

export const StreakHeatmap: React.FC = () => {
    const { streak, activityHistory } = useGamificationStore();

    // Render 35 days (5 weeks) of history
    const totalDays = 35;
    const days = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (totalDays - 1 - i));
        const dateStr = date.toISOString().split('T')[0];

        const xpEarned = activityHistory?.[dateStr] || 0;

        let intensityClass = 'bg-brutal-gray/10';
        if (xpEarned > 0) {
            if (xpEarned >= 500) intensityClass = 'bg-[#00ff9d] shadow-[0_0_8px_rgba(0,255,157,0.8)] border-[#00ff9d]';
            else if (xpEarned >= 200) intensityClass = 'bg-[#00cc7d] border-[#00cc7d]';
            else if (xpEarned >= 50) intensityClass = 'bg-[#00995e] border-[#00995e]';
            else intensityClass = 'bg-[#00663f] border-[#00663f]';
        }

        return { date: dateStr, xp: xpEarned, intensityClass };
    });

    return (
        <div className="bg-brutal-black border-3 border-brutal-green p-4 shadow-brutal">
            <h3 className="font-heading text-brutal-green text-sm uppercase mb-4 flex items-center justify-between">
                <span>Persistence Heatmap</span>
                <span className="text-[10px] bg-brutal-green text-brutal-black px-1 leading-none">{streak.current} DAY STREAK</span>
            </h3>

            <div className="grid grid-cols-7 gap-1 lg:gap-1.5 md:grid-cols-7">
                {days.map((day, i) => (
                    <div
                        key={i}
                        title={`${day.date}: ${day.xp} XP`}
                        className={`aspect-square border border-brutal-gray/30 transition-transform hover:scale-110 ${day.intensityClass}`}
                    />
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-brutal-gray uppercase font-mono">
                <span>35 Days Ago</span>
                <div className="flex items-center gap-1">
                    <span>Less</span>
                    <div className="w-2 h-2 bg-brutal-gray/10 border border-brutal-gray/30" />
                    <div className="w-2 h-2 bg-[#00663f] border border-[#00663f]" />
                    <div className="w-2 h-2 bg-[#00995e] border border-[#00995e]" />
                    <div className="w-2 h-2 bg-[#00cc7d] border border-[#00cc7d]" />
                    <div className="w-2 h-2 bg-[#00ff9d] shadow-[0_0_4px_rgba(0,255,157,0.8)] border-[#00ff9d]" />
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};
