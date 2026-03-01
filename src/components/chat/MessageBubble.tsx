import React, { useState } from 'react';
import { Message } from '../../module_bindings';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isMine: boolean;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);

    const handleSave = () => {
        if (editContent.trim() && editContent !== message.content) {
            onEdit(message.id, editContent);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(message.content);
        setIsEditing(false);
    };

    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4 group`}>
            <div className={`max-w-[85%] p-4 border-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isMine
                ? 'bg-brutal-green text-brutal-black border-brutal-black'
                : 'bg-brutal-dark text-brutal-white border-brutal-white'
                }`}>
                <div className="flex justify-between items-center mb-2 gap-4">
                    <span className={`font-heading text-[10px] uppercase tracking-widest ${isMine ? 'text-brutal-black/70' : 'text-brutal-white/70'}`}>
                        {message.sender === 'guest-identity' ? 'YOU' : 'OTHER_USER'}
                    </span>
                    <div className="flex items-center gap-2">
                        {message.edited && (
                            <span className="text-[8px] opacity-50 uppercase font-mono">(edited)</span>
                        )}
                        <span className="font-mono text-[9px] opacity-70 uppercase">
                            [{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                        </span>
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-brutal-black/10 border-2 border-brutal-black p-2 font-mono text-sm focus:outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={handleCancel} className="p-1 hover:bg-brutal-red/20"><X size={14} /></button>
                            <button onClick={handleSave} className="p-1 hover:bg-brutal-black/20"><Check size={14} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </div>
                )}

                {isMine && !isEditing && (
                    <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-brutal-white text-brutal-black border-2 border-brutal-black p-1 hover:bg-brutal-yellow transition-colors"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button
                            onClick={() => onDelete(message.id)}
                            className="bg-brutal-white text-brutal-black border-2 border-brutal-black p-1 hover:bg-brutal-red transition-colors"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
