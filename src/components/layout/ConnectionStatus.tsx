import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * ConnectionStatus — per Doc 3 §6.6
 * Visual indicator for system connectivity.
 * Currently hardcoded to LOCAL since SpacetimeDB is on hold.
 */
export const ConnectionStatus: React.FC = () => {
    // This will eventually consume a state from useSpacetimeDB()
    const isOnline = false;

    return (
        <div className={`flex items-center gap-2 px-3 py-1 border-2 font-mono text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isOnline ? 'bg-brutal-green text-brutal-black border-brutal-black' : 'bg-brutal-black text-brutal-yellow border-brutal-yellow'
            }`}>
            {isOnline ? (
                <>
                    <Wifi size={12} />
                    <span>SYSTEM ONLINE (CLOUD)</span>
                </>
            ) : (
                <>
                    <WifiOff size={12} />
                    <span>LOCAL DISK MODE (SIMULATED)</span>
                </>
            )}
        </div>
    );
};
