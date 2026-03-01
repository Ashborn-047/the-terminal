import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Welcome to the AI Linux Tutor. I can help you with commands, file system navigation, and preparing for the RHCSA. What's on your mind?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI Thinking
        setTimeout(() => {
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Processing inquiry: "${input.trim()}"... \n\nIn Linux, understanding the kernel and the shell is fundamental. Would you like to explore a specific command or concept?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMsg]);
        }, 800);
    };

    return (
        <div className="bg-brutal-dark border-3 border-brutal-white shadow-brutal flex flex-col h-full overflow-hidden">
            {/* Window Header */}
            <div className="p-4 border-b-3 border-brutal-white bg-brutal-green text-brutal-black font-heading uppercase text-xl flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
                <div className="flex items-center gap-3">
                    <TerminalIcon size={24} />
                    <span>AI_LINUX_TUTOR_V1.0</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brutal-black rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono font-bold">READY</span>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-10"
            >
                {messages.map((m) => (
                    <MessageBubble
                        key={m.id}
                        role={m.role}
                        content={m.content}
                        timestamp={m.timestamp}
                    />
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t-3 border-brutal-white bg-brutal-black/50">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="[SYSTEM_QUERY] > "
                        className="w-full bg-brutal-black border-2 border-brutal-white p-4 pl-12 text-brutal-white font-mono placeholder:text-brutal-gray/30 focus:border-brutal-green focus:outline-none transition-all shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                    />
                    <div className="absolute left-4 text-brutal-green font-mono font-bold">$</div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 bg-brutal-green text-brutal-black p-2 border-2 border-brutal-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-20 disabled:grayscale"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <div className="mt-2 text-[9px] font-mono text-brutal-gray uppercase flex justify-between px-1">
                    <span>Press ENTER to transmit</span>
                    <span>No data will be sent to external servers yet</span>
                </div>
            </div>
        </div>
    );
};
