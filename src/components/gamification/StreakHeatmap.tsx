import React from 'react';
import { useGamificationStore } from '../../stores/gamificationStore';

export const StreakHeatmap: React.FC = () => {
    const { streak } = useGamificationStore();

    // Simulate a 30-day history based on the current streak
    const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];

        // If it's today and we have a streak, it's active
        // If it's within the 'current' streak range back from lastActivityDate, it's active
        let isActive = false;
        if (streak.lastActivityDate) {
            const lastDate = new Date(streak.lastActivityDate);
            const currentDate = new Date(dateStr);
            const diffDays = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
            if (diffDays >= 0 && diffDays < streak.current) {
                isActive = true;
            }
        }

        return { date: dateStr, isActive };
    });

    return (
        <div className="bg-brutal-black border-3 border-brutal-green p-4 shadow-brutal">
            <h3 className="font-heading text-brutal-green text-sm uppercase mb-4 flex items-center justify-between">
                <span>Persistence Heatmap</span>
                <span className="text-[10px] bg-brutal-green text-brutal-black px-1 leading-none">{streak.current} DAY STREAK</span>
            </h3>

            <div className="grid grid-cols-10 gap-1 lg:grid-cols-15">
                {days.map((day, i) => (
                    <div
                        key={i}
                        title={day.date}
                        className={`aspect-square border border-brutal-gray/30 transition-transform hover:scale-110 ${day.isActive ? 'bg-brutal-green shadow-[0_0_8px_rgba(0,255,157,0.5)]' : 'bg-brutal-gray/10'
                            }`}
                    />
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-brutal-gray uppercase font-mono">
                <span>30 Days Ago</span>
                <div className="flex items-center gap-1">
                    <span>Less</span>
                    <div className="w-2 h-2 bg-brutal-gray/10 border border-brutal-gray/30" />
                    <div className="w-2 h-2 bg-brutal-green/50 border border-brutal-green" />
                    <div className="w-2 h-2 bg-brutal-green border border-brutal-white shadow-[0_0_5px_rgba(0,255,157,0.8)]" />
                    <span>More</span>
                </div>
                <span>Today</span>
            </div>
        </div>
    );
};
