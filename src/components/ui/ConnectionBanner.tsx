import React, { useEffect, useState } from 'react';
import { spacetime } from '../../lib/spacetime';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const ConnectionBanner: React.FC = () => {
    const [isConnected, setIsConnected] = useState(true); // Assume connected initially
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        // Simple polling/event check for connection status
        // In a real SpacetimeDB app, we'd listen to onConnect/onDisconnect
        const checkStatus = () => {
            // @ts-ignore - access private isConnected for UI purposes if needed, 
            // or better yet, add a public getter to SpacetimeService
            const status = (spacetime as any).isConnected;
            setIsConnected(status);
        };

        const interval = setInterval(checkStatus, 2000);

        // Listen for specific spacetime events if we added them
        spacetime.onConnect(() => {
            setIsConnected(true);
            setIsConnecting(false);
        });

        return () => clearInterval(interval);
    }, []);

    if (isConnected && !isConnecting) return null;

    return (
        <div className={`relative w-full z-[100] border-b-4 border-brutal-black p-2 flex items-center justify-center gap-4 transition-all duration-500 ${isConnecting ? 'bg-brutal-yellow' : 'bg-brutal-red'
            } animate-in slide-in-from-top`}>
            {isConnecting ? (
                <>
                    <RefreshCw size={20} className="animate-spin text-brutal-black" />
                    <span className="font-heading uppercase text-sm tracking-wider text-brutal-black">
                        Reconnecting to SpacetimeDB...
                    </span>
                </>
            ) : (
                <>
                    <WifiOff size={20} className="text-brutal-white animate-pulse" />
                    <span className="font-heading uppercase text-sm tracking-wider text-brutal-white">
                        Connection Lost. Using Offline Cache.
                    </span>
                    <button
                        onClick={() => {
                            setIsConnecting(true);
                            // @ts-ignore
                            spacetime.connect();
                        }}
                        className="ml-4 bg-brutal-white border-2 border-brutal-black px-3 py-1 text-xs font-bold uppercase hover:bg-brutal-green transition-colors"
                    >
                        Retry Now
                    </button>
                </>
            )}
        </div>
    );
};
