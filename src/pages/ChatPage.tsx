import React from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * ChatPage — per Doc 3 §5.1
 * Interface for the AI Tutor. Currently a modular component-based UI.
 */
import { ChatProvider } from '../features/chat/ChatProvider';

export const ChatPage: React.FC = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] p-6">
            <ErrorBoundary section="AI Tutor">
                <ChatProvider>
                    <ChatWindow />
                </ChatProvider>
            </ErrorBoundary>
        </div>
    );
};

export default ChatPage;
