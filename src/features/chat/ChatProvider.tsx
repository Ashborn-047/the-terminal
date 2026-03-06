import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Message, TypingIndicator } from '../../lib/spacetime/bindings';
import { spacetime } from '../../lib/spacetime';
import { useSubscription, useSpacetimeConnection } from '../../hooks/useSpacetime';
import { useGamificationStore } from '../../stores/gamificationStore';

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
    upvoteMessage: (messageId: bigint) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentChannel, setCurrentChannel] = useState<string>('global');
    const isConnected = useSpacetimeConnection();
    const { incrementCounter, checkAchievements } = useGamificationStore();

    // Sync with Spacetime events via reactive subscriptions
    const messages = useSubscription(() => spacetime.getMessages(currentChannel), [currentChannel]);
    const typingUsers = useSubscription(() => spacetime.getTypingIndicators(currentChannel), [currentChannel]);

    const sendMessage = useCallback(async (content: string) => {
        await spacetime.sendMessage(currentChannel, content);
        incrementCounter('messages-sent');
        checkAchievements();
    }, [currentChannel, incrementCounter, checkAchievements]);

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

    const upvoteMessage = useCallback(async (messageId: bigint) => {
        await spacetime.upvoteMessage(messageId);
        incrementCounter('upvotes-received');
        checkAchievements();
    }, [incrementCounter, checkAchievements]);

    const value = useMemo(() => ({
        messages,
        typingUsers,
        currentChannel,
        setCurrentChannel,
        sendMessage,
        editMessage,
        deleteMessage,
        startTyping,
        stopTyping,
        upvoteMessage
    }), [messages, typingUsers, currentChannel, sendMessage, editMessage, deleteMessage, startTyping, stopTyping, upvoteMessage]);

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
