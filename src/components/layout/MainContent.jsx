import React from 'react';
import { ChatHeader } from '../chat/ChatHeader';
import { ChatMessages } from '../chat/ChatMessages';
import { ChatInput } from '../chat/ChatInput';
import { EmptyState } from '../shared/EmptyState';
import { MessageSquare } from 'lucide-react';

export const MainContent = ({
  messages,
  isLoading,
  onSendMessage,
  conversationId,
  selectedConversation,
  theme,
  chatSettings,
  onExport,
  onNewChat,
  onOpenSettings
}) => (
  <div className={`flex-1 flex flex-col ${theme.bgPrimary} overflow-hidden`}>
    <div className={`flex flex-col h-full ${theme.bgPrimary} rounded-lg shadow-sm border ${theme.border}`}>
      <ChatHeader 
        conversation={selectedConversation}
        conversationId={conversationId}
        onExport={onExport}
        onNewChat={onNewChat}
        onOpenSettings={onOpenSettings}
        theme={theme}
      />
      
      <div className={`flex-1 overflow-auto ${theme.bgPrimary} relative`}>
        {messages.length === 0 ? (
          <EmptyState
            title="Start a Conversation"
            description="Begin by typing a message below"
            icon={MessageSquare}
            theme={theme}
          />
        ) : (
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            format={chatSettings.responseFormat}
            theme={theme}
          />
        )}
      </div>

      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        theme={theme}
      />
    </div>
  </div>
);