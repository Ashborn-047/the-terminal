import React, { useEffect, useState } from 'react';
import { spacetime } from '../../lib/spacetime';
import { WifiOff, RefreshCw } from 'lucide-react';
import { 
    tokens 
} from '../ui/AshbornDesignSystem';

export const ConnectionBanner: React.FC = () => {
    const [isConnected, setIsConnected] = useState(true); // Assume connected initially
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const status = (spacetime as any).isConnected;
            setIsConnected(status);
        };

        const interval = setInterval(checkStatus, 2000);

        spacetime.onConnect(() => {
            setIsConnected(true);
            setIsConnecting(false);
        });

        return () => clearInterval(interval);
    }, []);

    if (isConnected && !isConnecting) return null;

    const bannerColor = isConnecting ? tokens.color.amber.base : "rgb(239, 68, 68)";
    const textColor = isConnecting ? tokens.color.bg.base : tokens.color.text.primary;

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            zIndex: 1000, 
            borderBottom: `1px solid ${tokens.color.border.default}`, 
            padding: '8px 16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 16, 
            backgroundColor: bannerColor,
            color: textColor,
            transition: 'all 0.5s'
        }}>
            {isConnecting ? (
                <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span style={{ fontFamily: tokens.font.sans, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Re-integrating with Spacetime Grid...
                    </span>
                </>
            ) : (
                <>
                    <WifiOff size={16} className="animate-pulse" />
                    <span style={{ fontFamily: tokens.font.sans, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Grid Connection Interrupted. Local Cache Active.
                    </span>
                    <button
                        onClick={() => {
                            setIsConnecting(true);
                            // @ts-ignore
                            spacetime.connect();
                        }}
                        style={{
                            marginLeft: 16,
                            background: 'rgba(0,0,0,0.2)',
                            border: `1px solid rgba(255,b255,255,0.3)`,
                            color: '#fff',
                            padding: '4px 12px',
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            fontFamily: tokens.font.sans,
                            borderRadius: 2
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                    >
                        [RETRY_SYNC]
                    </button>
                </>
            )}
        </div>
    );
};
