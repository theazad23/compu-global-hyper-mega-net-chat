import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';
import { 
  MessageSquare, 
  History, 
  RefreshCcw, 
  Download, 
  FileText,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RESPONSE_FORMATS, PROMPT_STRATEGIES, CONTEXT_MODES } from '../../utils/constants';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

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
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [showSourcesDialog, setShowSourcesDialog] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSend = async (message) => {
    if (!conversationId) {
      console.warn('No conversation ID available');
      return;
    }
    await sendMessage(message, settings);
  };

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

  const handleViewSources = (message) => {
    if (message.sources && message.sources.length > 0) {
      setSelectedSources(message.sources);
      setShowSourcesDialog(true);
    }
  };

  const handleNewChat = () => {
    if (window.confirm('Start a new chat? This will clear the current conversation.')) {
      window.location.reload();
    }
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
        onViewSources={handleViewSources}
        isLoading={isLoading}
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b flex-none bg-white relative z-[51]">
        {/* Top bar with title and actions */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Chat</h2>
            {conversationId && (
              <span className="text-xs text-muted-foreground">
                ID: {conversationId.slice(0, 8)}...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              title="View History"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportChat}
              title="Export Chat"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              title="New Chat"
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Settings bar */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Strategy</span>
            <Select 
              value={settings.strategy}
              onValueChange={(value) => handleSettingChange('strategy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROMPT_STRATEGIES).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Format</span>
            <Select
              value={settings.responseFormat}
              onValueChange={(value) => handleSettingChange('responseFormat', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RESPONSE_FORMATS).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Context</span>
            <Select
              value={settings.contextMode}
              onValueChange={(value) => handleSettingChange('contextMode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONTEXT_MODES).map(([key, value]) => (
                  <SelectItem key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative z-[1]">
        {renderContent()}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 flex-none bg-white relative z-[2]">
        <MessageInput 
          onSend={handleSend} 
          disabled={isLoading || !conversationId}
          placeholder={!conversationId ? "Initializing chat..." : "Type your message..."}
        />
      </div>

      {/* Sources Dialog */}
      <Dialog open={showSourcesDialog} onOpenChange={setShowSourcesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Referenced Sources</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4">
            {selectedSources.map((source, index) => (
              <div 
                key={index} 
                className="p-4 bg-secondary rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">
                    {source.title || 'Untitled Source'}
                  </h4>
                  {source.relevance && (
                    <span className="text-xs text-muted-foreground">
                      Relevance: {Math.round(source.relevance * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 break-words">
                  {source.content || source.text}
                </p>
                {source.document_id && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Document ID: {source.document_id}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chat History</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-4 p-4">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user' ? 'bg-primary/10' : 'bg-secondary'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium capitalize">{msg.role}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};