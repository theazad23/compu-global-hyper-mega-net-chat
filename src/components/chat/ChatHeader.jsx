import React from 'react';
import { Settings, Download, RefreshCcw, History } from 'lucide-react';
import { ThemedButton } from '../ui/button';

export const ChatHeader = ({ 
  conversation, 
  conversationId, 
  onExport, 
  onNewChat, 
  onOpenSettings, 
  onToggleHistory,
  theme 
}) => {
  const getChatTitle = () => {
    if (!conversation) return "New Chat";
    return conversation.title || 
           (conversation.questions_asked?.[0]?.length > 40 
             ? `${conversation.questions_asked[0].substring(0, 40)}...` 
             : conversation.questions_asked?.[0]) || 
           "New Chat";
  };

  return (
    <div className={`border-b ${theme.border} ${theme.bgPrimary}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <ThemedButton
            variant="ghost"
            size="icon"
            theme={theme}
            className="lg:hidden"
            onClick={onToggleHistory}
          >
            <History className={`h-5 w-5 ${theme.icon}`} />
          </ThemedButton>
          <div className="flex flex-col">
            <h2 className={`text-lg font-semibold ${theme.text}`}>
              {getChatTitle()}
            </h2>
            <span className={`text-xs ${theme.textMuted} font-mono`}>
              ID: {conversationId ? `${conversationId.slice(0, 4)}-${conversationId.slice(-4)}` : 'New'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemedButton
            variant="ghost"
            size="icon"
            theme={theme}
            onClick={onOpenSettings}
          >
            <Settings className={`h-5 w-5 ${theme.icon}`} />
          </ThemedButton>
          <ThemedButton
            variant="ghost"
            size="icon"
            theme={theme}
            onClick={onExport}
          >
            <Download className={`h-5 w-5 ${theme.icon}`} />
          </ThemedButton>
          <ThemedButton
            variant="ghost"
            size="icon"
            theme={theme}
            onClick={onNewChat}
          >
            <RefreshCcw className={`h-5 w-5 ${theme.icon}`} />
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};