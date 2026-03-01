import React from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';

/**
 * ChatPage — per Doc 3 §5.1
 * Interface for the AI Tutor. Currently a modular component-based UI.
 */
export const ChatPage: React.FC = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] p-6">
            <ChatWindow />
        </div>
    );
};

export default ChatPage;
