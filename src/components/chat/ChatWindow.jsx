import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ThemedButton } from '../ui/button';
import { EmptyState } from '../common/EmptyState';
import { 
  MessageSquare, 
  History, 
  RefreshCcw, 
  Download, 
  Settings,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export const ChatWindow = ({ 
  messages,
  isLoading,
  error,
  onSendMessage,
  onNewChat,
  conversationId,
  currentConversation,
  onToggleHistory,
  settings,
  onOpenSettings,
  theme
}) => {
  const handleExportChat = () => {
    const chatHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
    
    const blob = new Blob([JSON.stringify(chatHistory, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${conversationId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatConversationId = (id) => {
    if (!id) return '';
    const first4 = id.slice(0, 4);
    const last4 = id.slice(-4);
    return `${first4}-${last4}`;
  };

  const getConversationTitle = () => {
    if (currentConversation?.title) {
      return currentConversation.title;
    }
    if (currentConversation?.questions_asked?.[0]) {
      const firstQuestion = currentConversation.questions_asked[0];
      return firstQuestion.length > 40 
        ? `${firstQuestion.substring(0, 40)}...` 
        : firstQuestion;
    }
    return 'New Chat';
  };

  return (
    <div className={`flex flex-col h-full ${theme.bgPrimary} rounded-lg shadow-sm border ${theme.border}`}>
      {/* Header */}
      <div className={`border-b ${theme.border} ${theme.bgPrimary}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <ThemedButton
              variant="ghost"
              size="icon"
              onClick={onToggleHistory}
              className="lg:hidden"
              theme={theme}
            >
              <History className={`h-5 w-5 ${theme.icon}`} />
            </ThemedButton>
            <div className="flex flex-col">
              <h2 className={`text-lg font-semibold ${theme.text}`}>
                {getConversationTitle()}
              </h2>
              {conversationId && (
                <span className={`text-xs ${theme.textMuted} font-mono`}>
                  ID: {formatConversationId(conversationId)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemedButton
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              theme={theme}
            >
              <Settings className={`h-5 w-5 ${theme.icon}`} />
            </ThemedButton>
            <ThemedButton
              variant="ghost"
              size="icon"
              onClick={handleExportChat}
              theme={theme}
            >
              <Download className={`h-5 w-5 ${theme.icon}`} />
            </ThemedButton>
            <ThemedButton
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              theme={theme}
            >
              <RefreshCcw className={`h-5 w-5 ${theme.icon}`} />
            </ThemedButton>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className={`flex-1 overflow-auto ${theme.bgPrimary} relative`}>
        {messages.length === 0 ? (
          <EmptyState
            title="Start a Conversation"
            description="Begin by typing a message below"
            icon={MessageSquare}
            theme={theme}
          />
        ) : (
          <MessageList
            messages={messages}
            format={settings.responseFormat}
            isLoading={isLoading}
            theme={theme}
          />
        )}
      </div>

      {/* Input Area */}
      <div className={`border-t ${theme.border} ${theme.bgPrimary} p-4`}>
        <MessageInput
          onSend={onSendMessage}
          disabled={isLoading || !conversationId}
          theme={theme}
        />
      </div>
    </div>
  );
};