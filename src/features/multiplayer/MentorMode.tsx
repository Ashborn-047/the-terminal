import React, { useEffect, useState } from 'react';
import { spacetime } from '../../lib/spacetime';
import { cn } from '../../utils/cn';

interface MentorModeProps {
    sessionTarget?: string;
    isActive: boolean;
}

export const MentorMode: React.FC<MentorModeProps> = ({ sessionTarget, isActive }) => {
    const [observers, setObservers] = useState<string[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        console.log(`[MENTOR] Mentor Mode active. Target: ${sessionTarget || 'Broadcasting'}`);
        setIsStreaming(true);

        const handleNewObserver = (userId: string) => {
            setObservers(prev => Array.from(new Set([...prev, userId])));
        };

        // In a non-mock environment, we would bind to SpacetimeDB events here
        // spacetime.conn?.reducers.onBroadcastTerminalStream(...)
        // spacetime.conn?.events.onJoinMentorSession(handleNewObserver)

        return () => {
            setIsStreaming(false);
        };
    }, [isActive, sessionTarget]);

    if (!isActive) return null;

    return (
        <div className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-2",
            "bg-brutal-black border-2 shadow-brutal-sm transition-colors",
            sessionTarget ? "border-brutal-green text-brutal-green" : "border-brutal-purple text-brutal-purple"
        )}>
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
                </span>
                <span className="font-mono text-sm uppercase font-bold tracking-wider">
                    {sessionTarget ? `OBSERVING: ${sessionTarget}` : 'BROADCASTING'}
                </span>
            </div>
            
            {!sessionTarget && observers.length > 0 && (
                <div className="ml-4 pl-4 border-l-2 border-current flex items-center gap-2">
                    <span className="text-xl">👁️</span>
                    <span className="font-mono text-sm font-bold">{observers.length} Mentors Viewing</span>
                </div>
            )}
        </div>
    );
};
