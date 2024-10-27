import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatSettings } from './ChatSettings';
import { useChat } from '../../hooks/useChat';
import { Settings, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { RESPONSE_FORMATS } from '../../utils/constants';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';

export const ChatWindow = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    conversationId 
  } = useChat();
  
  const [settings, setSettings] = useState({
    strategy: 'standard',
    responseFormat: RESPONSE_FORMATS.DEFAULT,
    contextMode: 'flexible'
  });
  const [showSettings, setShowSettings] = useState(false);

  // Debug log to verify conversation ID
  useEffect(() => {
    console.log('Current conversation ID:', conversationId);
  }, [conversationId]);

  const handleSend = async (message) => {
    if (!conversationId) {
      console.warn('No conversation ID available');
      return;
    }

    console.log('Sending message with settings:', {
      message,
      conversationId,
      settings
    });

    await sendMessage(message, settings);
  };

  const renderContent = () => {
    if (error) {
      return (
        <ErrorMessage 
          message={error}
          className="m-4"
          onRetry={() => window.location.reload()}
        />
      );
    }

    if (messages.length === 0) {
      return (
        <EmptyState
          title="Start a Conversation"
          description="Begin by typing a message below"
          icon={MessageSquare}
        />
      );
    }

    return (
      <MessageList 
        messages={messages} 
        format={settings.responseFormat}
      />
    );
  };

  return (
    <div className="relative flex flex-col h-[600px] bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Chat</h2>
          {conversationId && (
            <span className="text-xs text-muted-foreground">
              ID: {conversationId.slice(0, 8)}...
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {renderContent()}
        {isLoading && <LoadingOverlay message="Processing your message..." />}
      </div>

      <div className="border-t p-4">
        <MessageInput 
          onSend={handleSend} 
          disabled={isLoading || !conversationId}
          placeholder={!conversationId ? "Initializing chat..." : "Type your message..."}
        />
      </div>

      <ChatSettings 
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};