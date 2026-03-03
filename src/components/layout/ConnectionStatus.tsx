import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { spacetime } from '../../lib/spacetime';

/**
 * ConnectionStatus — per Doc 3 §6.6
 * Visual indicator for system connectivity.
 */
export const ConnectionStatus: React.FC = () => {
    const [isConnected, setIsConnected] = React.useState(spacetime.getIsConnected());

    React.useEffect(() => {
        const check = setInterval(() => {
            const current = spacetime.getIsConnected();
            if (current !== isConnected) {
                setIsConnected(current);
            }
        }, 1000);
        return () => clearInterval(check);
    }, [isConnected]);

    return (
        <div className={`flex items-center gap-2 px-3 py-1 border-2 font-mono text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isConnected ? 'bg-brutal-green text-brutal-black border-brutal-black' : 'bg-brutal-black text-brutal-yellow border-brutal-yellow'
            }`}>
            {isConnected ? (
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
