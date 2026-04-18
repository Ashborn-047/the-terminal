import React, { useState } from 'react';
import { Message } from '../../module_bindings';
import { Edit2, Trash2, Check, X, ThumbsUp, User } from 'lucide-react';
import { 
    tokens 
} from '../ui/AshbornDesignSystem';

interface MessageBubbleProps {
    message: Message & { upvotes?: number };
    isMine: boolean;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onUpvote?: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine, onEdit, onDelete, onUpvote }) => {
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
        <div style={{ 
            display: 'flex', 
            justifyContent: isMine ? 'flex-end' : 'flex-start', 
            marginBottom: tokens.space[4],
            width: '100%'
        }}>
            <div style={{ 
                maxWidth: '85%', 
                padding: tokens.space[4], 
                backgroundColor: isMine ? tokens.color.lime.alpha[8] : tokens.color.bg.surface,
                border: `1px solid ${isMine ? tokens.color.lime.base : tokens.color.border.default}`,
                borderRadius: 4,
                position: 'relative'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 8,
                    gap: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ 
                            fontFamily: tokens.font.mono, 
                            fontSize: 9, 
                            fontWeight: 700, 
                            textTransform: 'uppercase', 
                            color: isMine ? tokens.color.lime.base : tokens.color.text.tertiary 
                        }}>
                            {isMine ? 'LOCAL_NODE' : 'REMOTE_NODE'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {message.edited && (
                            <span style={{ fontSize: 8, opacity: 0.5, fontStyle: 'italic', color: tokens.color.text.tertiary }}>[MODIFIED]</span>
                        )}
                        <span style={{ fontFamily: tokens.font.mono, fontSize: 9, color: tokens.color.text.tertiary }}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{ 
                                width: '100%', 
                                backgroundColor: tokens.color.bg.base, 
                                border: `1px solid ${tokens.color.lime.base}`, 
                                padding: 8, 
                                color: tokens.color.text.primary,
                                fontFamily: tokens.font.mono,
                                fontSize: 13,
                                outline: 'none',
                                minHeight: 60,
                                borderRadius: 2
                            }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button onClick={handleCancel} style={{ background: 'none', border: 'none', color: tokens.color.text.tertiary, cursor: 'pointer' }}><X size={14} /></button>
                            <button onClick={handleSave} style={{ background: 'none', border: 'none', color: tokens.color.lime.base, cursor: 'pointer' }}><Check size={14} /></button>
                        </div>
                    </div>
                ) : (
                    <div style={{ 
                        fontFamily: tokens.font.mono, 
                        fontSize: 13, 
                        lineHeight: 1.5, 
                        color: tokens.color.text.primary,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}>
                        {message.content}
                    </div>
                )}

                {!isEditing && (
                    <div style={{ 
                        marginTop: 12, 
                        paddingTop: 8, 
                        borderTop: `1px solid ${tokens.color.bg.overlay}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={() => onUpvote?.(message.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '2px 8px',
                                background: tokens.color.bg.overlay,
                                border: `1px solid ${tokens.color.border.default}`,
                                color: tokens.color.text.secondary,
                                fontSize: 10,
                                fontFamily: tokens.font.mono,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                borderRadius: 2
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = tokens.color.lime.base;
                                e.currentTarget.style.color = tokens.color.text.primary;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = tokens.color.border.default;
                                e.currentTarget.style.color = tokens.color.text.secondary;
                            }}
                        >
                            <ThumbsUp size={10} />
                            <span>{message.upvotes || 0}</span>
                        </button>

                        {isMine && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    style={{ background: 'none', border: 'none', color: tokens.color.text.tertiary, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = tokens.color.amber.base}
                                    onMouseOut={(e) => e.currentTarget.style.color = tokens.color.text.tertiary}
                                >
                                    <Edit2 size={12} />
                                </button>
                                <button 
                                    onClick={() => onDelete(message.id)}
                                    style={{ background: 'none', border: 'none', color: tokens.color.text.tertiary, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'rgb(239, 68, 68)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = tokens.color.text.tertiary}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
