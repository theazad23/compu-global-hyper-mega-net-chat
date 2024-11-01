import React, { useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { MessageSquare } from 'lucide-react';

export const ChatContainer = ({
  onExport,
  onNewChat,
  onOpenSettings,
}) => {
  const { 
    messages, 
    isLoading, 
    error, 
    currentConversationId,
    sendMessage,
    loadConversation 
  } = useChat();
  const { theme } = useTheme();

  useEffect(() => {
    if (currentConversationId) {
      loadConversation(currentConversationId);
    }
  }, [currentConversationId, loadConversation]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <ErrorMessage 
          message={error}
          onRetry={() => loadConversation(currentConversationId)}
        />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full ${theme.bgPrimary} overflow-hidden`}>
      <ChatHeader
        onExport={onExport}
        onNewChat={onNewChat}
        onOpenSettings={onOpenSettings}
      />
      
      <div className="flex-1 overflow-hidden relative">
        {isLoading && !messages.length ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Start a Conversation"
            description="Begin by typing a message below"
          />
        ) : (
          <ChatMessages messages={messages} />
        )}
      </div>

      <ChatInput 
        onSend={sendMessage}
        disabled={isLoading}
      />
    </div>
  );
};