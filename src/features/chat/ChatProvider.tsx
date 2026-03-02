import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Message, TypingIndicator } from './bindings';
import { spacetime } from '../../spacetime';

interface ChatContextType {
    messages: Message[];
    typingUsers: TypingIndicator[];
    currentChannel: string;
    setCurrentChannel: (channel: string) => void;
    sendMessage: (content: string) => Promise<void>;
    editMessage: (messageId: bigint, content: string) => Promise<void>;
    deleteMessage: (messageId: bigint) => Promise<void>;
    startTyping: () => Promise<void>;
    stopTyping: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
    const [currentChannel, setCurrentChannel] = useState<string>('global');

    // Sync with Spacetime events via polling (or ideally via onUpdate if available)
    useEffect(() => {
        const sync = () => {
            const msgs = spacetime.getMessages(currentChannel);
            const typing = spacetime.getTypingIndicators(currentChannel);

            setMessages(prev => {
                // Simple comparison to avoid re-renders if nothing changed
                if (prev.length !== msgs.length) return msgs;
                return JSON.stringify(prev) !== JSON.stringify(msgs) ? msgs : prev;
            });
            setTypingUsers(prev => {
                if (prev.length !== typing.length) return typing;
                return JSON.stringify(prev) !== JSON.stringify(typing) ? typing : prev;
            });
        };

        sync();
        const interval = setInterval(sync, 1000); // 1s sync interval
        return () => clearInterval(interval);
    }, [currentChannel]);

    const sendMessage = useCallback(async (content: string) => {
        await spacetime.sendMessage(currentChannel, content);
    }, [currentChannel]);

    const editMessage = useCallback(async (messageId: bigint, content: string) => {
        await spacetime.editMessage(messageId, content);
    }, []);

    const deleteMessage = useCallback(async (messageId: bigint) => {
        await spacetime.deleteMessage(messageId);
    }, []);

    const startTyping = useCallback(async () => {
        await spacetime.startTyping(currentChannel);
    }, [currentChannel]);

    const stopTyping = useCallback(async () => {
        await spacetime.stopTyping();
    }, []);

    const value = useMemo(() => ({
        messages,
        typingUsers,
        currentChannel,
        setCurrentChannel,
        sendMessage,
        editMessage,
        deleteMessage,
        startTyping,
        stopTyping
    }), [messages, typingUsers, currentChannel, sendMessage, editMessage, deleteMessage, startTyping, stopTyping]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
