import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Message, TypingIndicator } from '../../module_bindings';
import { spacetimeClient } from '../../utils/spacetimeClient';
import { useGamificationStore } from '../../stores/gamificationStore';

interface ChatContextType {
    messages: Message[];
    typingUsers: TypingIndicator[];
    currentChannel: string;
    setCurrentChannel: (channel: string) => void;
    sendMessage: (content: string) => Promise<void>;
    editMessage: (messageId: string, content: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
    startTyping: () => Promise<void>;
    stopTyping: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
    const [currentChannel, setCurrentChannel] = useState<string>('global');

    // Sync with simulated Spacetime events via polling (to mimic subscriptions)
    useEffect(() => {
        const sync = () => {
            const msgs = spacetimeClient.getMessages(currentChannel);
            const typing = spacetimeClient.getTypingIndicators(currentChannel);

            // Only update if changed to avoid unnecessary re-renders
            setMessages(prev => JSON.stringify(prev) !== JSON.stringify(msgs) ? msgs : prev);
            setTypingUsers(prev => JSON.stringify(prev) !== JSON.stringify(typing) ? typing : prev);
        };

        sync();
        const interval = setInterval(sync, 1000); // 1s sync interval
        return () => clearInterval(interval);
    }, [currentChannel]);

    const sendMessage = useCallback(async (content: string) => {
        await spacetimeClient.send_message(currentChannel, content);
    }, [currentChannel]);

    const editMessage = useCallback(async (messageId: string, content: string) => {
        await spacetimeClient.edit_message(messageId, content);
    }, []);

    const deleteMessage = useCallback(async (messageId: string) => {
        await spacetimeClient.delete_message(messageId);
    }, []);

    const startTyping = useCallback(async () => {
        await spacetimeClient.start_typing(currentChannel);
    }, [currentChannel]);

    const stopTyping = useCallback(async () => {
        await spacetimeClient.stop_typing();
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
