import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, Globe, Lock, Unlock } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../../features/chat/ChatProvider';
import { useLabStore } from '../../stores/labStore';

export const ChatWindow: React.FC = () => {
    const {
        messages,
        typingUsers,
        currentChannel,
        setCurrentChannel,
        sendMessage,
        editMessage,
        deleteMessage,
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

    const isLabUnlocked = currentLab ? true : false; // For simulation, current lab is unlocked

    return (
        <div className="bg-brutal-dark border-3 border-brutal-white shadow-brutal flex flex-col h-full overflow-hidden">
            {/* Window Header */}
            <div className="p-4 border-b-3 border-brutal-white bg-brutal-green text-brutal-black font-heading uppercase text-xl flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
                <div className="flex items-center gap-3">
                    <TerminalIcon size={24} />
                    <span>SYSTEM_COMM_V1.1</span>
                </div>

                {/* Channel Toggle */}
                <div className="flex gap-2 bg-brutal-black/10 p-1 border-2 border-brutal-black">
                    <button
                        onClick={() => setCurrentChannel('global')}
                        className={`px-3 py-1 flex items-center gap-2 text-xs font-bold transition-all ${currentChannel === 'global' ? 'bg-brutal-black text-brutal-green' : 'hover:bg-brutal-black/20'}`}
                    >
                        <Globe size={14} /> GLOBAL
                    </button>
                    <button
                        onClick={() => currentLab && setCurrentChannel(`lab:${currentLab.id}`)}
                        disabled={!currentLab}
                        className={`px-3 py-1 flex items-center gap-2 text-xs font-bold transition-all ${currentChannel.startsWith('lab:') ? 'bg-brutal-black text-brutal-green' : 'hover:bg-brutal-black/20 disabled:opacity-30'}`}
                    >
                        {isLabUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                        {currentLab ? `LAB: ${currentLab.title.split(' ')[0]}` : 'NO LAB'}
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-2 grid-background"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-brutal-white font-mono">
                        <TerminalIcon size={48} className="mb-4" />
                        <p>NO TRANSMISSIONS IN THIS CHANNEL</p>
                    </div>
                )}
                {messages.map((m) => (
                    <MessageBubble
                        key={m.id}
                        message={m}
                        isMine={m.sender === 'guest-identity'}
                        onEdit={editMessage}
                        onDelete={deleteMessage}
                    />
                ))}

                {/* Typing indicators */}
                {typingUsers.filter(u => u.identity !== 'guest-identity').map(u => (
                    <div key={u.identity} className="flex justify-start">
                        <div className="bg-brutal-dark/50 text-brutal-green border-2 border-brutal-green border-dashed p-2 text-[10px] font-mono uppercase flex items-center gap-2">
                            User_{u.identity.slice(0, 4)} is typing
                            <span className="flex gap-1">
                                <span className="w-1 h-1 bg-brutal-green rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-brutal-green rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1 h-1 bg-brutal-green rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t-3 border-brutal-white bg-brutal-black/50">
                <div className="relative flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`[CHANNEL: ${currentChannel.toUpperCase()}] > `}
                            className="w-full bg-brutal-black border-2 border-brutal-white p-4 pl-12 text-brutal-white font-mono placeholder:text-brutal-gray/30 focus:border-brutal-green focus:outline-none transition-all shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brutal-green font-mono font-bold">$</div>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="w-12 h-14 flex items-center justify-center bg-brutal-green text-brutal-black border-3 border-brutal-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-20 disabled:grayscale"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};
