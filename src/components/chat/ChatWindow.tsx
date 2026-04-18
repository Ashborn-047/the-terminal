import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, Globe, Lock, Unlock, Hash } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../../features/chat/ChatProvider';
import { useLabStore } from '../../stores/labStore';
import { spacetime } from '../../lib/spacetime';
import { 
    tokens, 
    Card, 
    Badge 
} from '../ui/AshbornDesignSystem';

export const ChatWindow: React.FC = () => {
    const {
        messages,
        typingUsers,
        currentChannel,
        setCurrentChannel,
        sendMessage,
        startTyping,
        stopTyping
    } = useChat();

    const { getCurrentLab, progress } = useLabStore();
    const currentLab = getCurrentLab();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<any>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typingUsers]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const content = input.trim();
        setInput('');
        await sendMessage(content);
        await stopTyping();
    };

    const handleInputChange = (val: string) => {
        setInput(val);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        startTyping();
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 3000);
    };

    const isLabUnlocked = currentLab ? progress[currentLab.id]?.status === 'completed' : false;

    return (
        <Card variant="default" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
            {/* Window Header */}
            <header style={{ 
                padding: '12px 16px', 
                background: tokens.color.bg.surface, 
                borderBottom: `1px solid ${tokens.color.border.default}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TerminalIcon size={18} style={{ color: tokens.color.lime.base }} />
                    <span style={{ 
                        fontFamily: tokens.font.sans, 
                        fontSize: tokens.fontSize.xs, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: tokens.color.text.primary,
                        letterSpacing: tokens.letterSpacing.wide
                    }}>
                        Comms_Protocol_V1.5
                    </span>
                </div>

                <div style={{ display: 'flex', gap: 4, background: tokens.color.bg.overlay, padding: 2, borderRadius: 4 }}>
                    <button
                        onClick={() => setCurrentChannel('global')}
                        style={{
                            padding: '4px 12px',
                            background: currentChannel === 'global' ? tokens.color.bg.surface : 'transparent',
                            color: currentChannel === 'global' ? tokens.color.lime.base : tokens.color.text.tertiary,
                            border: 'none',
                            borderRadius: 2,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.15s'
                        }}
                    >
                        <Globe size={12} /> GLOBAL
                    </button>
                    <button
                        onClick={() => isLabUnlocked && currentLab && setCurrentChannel(`lab:${currentLab.id}`)}
                        disabled={!currentLab || !isLabUnlocked}
                        style={{
                            padding: '4px 12px',
                            background: currentChannel.startsWith('lab:') ? tokens.color.bg.surface : 'transparent',
                            color: currentChannel.startsWith('lab:') ? tokens.color.amber.base : tokens.color.text.tertiary,
                            border: 'none',
                            borderRadius: 2,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            opacity: (!currentLab || !isLabUnlocked) ? 0.3 : 1,
                            transition: 'all 0.15s'
                        }}
                    >
                        {isLabUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                        {currentLab ? `LAB: ${currentLab.title.split(' ')[0]}` : 'NO_LAB'}
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                {/* Node Sidebar */}
                <div style={{ 
                    width: 180, 
                    borderRight: `1px solid ${tokens.color.border.default}`,
                    background: 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    flexDirection: 'column'
                }} className="hidden lg:flex">
                    <div style={{ 
                        padding: '8px 12px', 
                        fontSize: 9, 
                        fontFamily: tokens.font.mono, 
                        fontWeight: 700, 
                        color: tokens.color.text.tertiary,
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${tokens.color.bg.overlay}`
                    }}>
                        Active_Nodes
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 8, 
                            padding: '6px 8px', 
                            background: 'none', 
                            border: 'none', 
                            color: tokens.color.lime.base,
                            fontSize: 10,
                            fontFamily: tokens.font.mono,
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            cursor: 'default'
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: tokens.color.lime.base, className: 'animate-pulse' }} />
                            ROOT_ADMIN
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: tokens.space[6],
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                        }}
                    >
                        {messages.length === 0 && (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15 }}>
                                <TerminalIcon size={48} style={{ color: tokens.color.text.primary }} />
                                <p style={{ fontFamily: tokens.font.mono, fontSize: 11, marginTop: 16 }}>NO TRANSMISSIONS DETECTED</p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <MessageBubble
                                key={m.id.toString()}
                                message={{
                                    ...m,
                                    id: m.id.toString(),
                                    timestamp: Number(m.timestamp)
                                } as any}
                                isMine={m.senderIdentity.toString() === spacetime.getLocalUser()?.identity.toString()}
                                onEdit={(id, content) => {}} // Hooked up in provider
                                onDelete={(id) => {}} // Hooked up in provider
                                onUpvote={(id) => spacetime.upvoteMessage(BigInt(id))}
                            />
                        ))}

                        {/* Typing indicators */}
                        {typingUsers.filter(u => u.identity.toString() !== spacetime.getLocalUser()?.identity.toString()).map(u => (
                            <div key={u.identity.toString()} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
                                <div style={{ 
                                    padding: '4px 12px', 
                                    border: `1px dashed ${tokens.color.lime.base}`, 
                                    color: tokens.color.lime.base,
                                    fontSize: 9,
                                    fontFamily: tokens.font.mono,
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    Node_{u.identity.toString().slice(0, 4)} is transmitting_data...
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <footer style={{ 
                        padding: tokens.space[4], 
                        background: tokens.color.bg.overlay, 
                        borderTop: `1px solid ${tokens.color.border.default}` 
                    }}>
                        <div style={{ position: 'relative', display: 'flex', gap: 12 }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ 
                                    position: 'absolute', 
                                    left: 14, 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    fontFamily: tokens.font.mono, 
                                    color: tokens.color.lime.base, 
                                    fontWeight: 700 
                                }}>
                                    $
                                </span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`TRANSMIT TO [#${currentChannel.toUpperCase()}] > `}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px 12px 32px',
                                        background: tokens.color.bg.base,
                                        border: `1px solid ${tokens.color.border.default}`,
                                        color: tokens.color.text.primary,
                                        fontFamily: tokens.font.mono,
                                        fontSize: 13,
                                        outline: 'none',
                                        borderRadius: 4
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = tokens.color.lime.base}
                                    onBlur={(e) => e.currentTarget.style.borderColor = tokens.color.border.default}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                style={{
                                    width: 48,
                                    height: '100%',
                                    background: tokens.color.lime.base,
                                    border: 'none',
                                    borderRadius: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    opacity: input.trim() ? 1 : 0.3,
                                    color: tokens.color.bg.base,
                                    transition: 'all 0.15s'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </Card>
    );
};
