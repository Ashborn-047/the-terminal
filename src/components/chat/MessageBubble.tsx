import React from 'react';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[85%] p-4 border-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isUser
                    ? 'bg-brutal-white text-brutal-black border-brutal-black'
                    : 'bg-brutal-black text-brutal-green border-brutal-green'
                }`}>
                <div className="flex justify-between items-center mb-2 gap-4">
                    <span className={`font-heading text-[10px] uppercase tracking-widest ${isUser ? 'text-brutal-gray' : 'text-brutal-green/70'}`}>
                        {role}
                    </span>
                    {timestamp && (
                        <span className="font-mono text-[9px] opacity-50 uppercase">
                            [{timestamp}]
                        </span>
                    )}
                </div>
                <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>
            </div>
        </div>
    );
};
