import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Files,
  Palette,
  Settings,
  Download,
  RefreshCcw,
  History,
  MessagesSquare
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { themes } from './config/themes';
import { DocumentList } from './components/documents/DocumentList';
import { ConversationList } from './components/chat/ConversationList';
import { ChatSettings } from './components/chat/ChatSettings';
import { MessageInput } from './components/chat/MessageInput';
import { MessageList } from './components/chat/MessageList';
import { useChat } from './hooks/useChat';
import { EmptyState } from './components/common/EmptyState';
import { ThemedButton } from './components/ui/button';
import { CollapsibleSidebar } from './components/layout/CollapsibleSidebar';
import { useLocalStorage } from './hooks/useLocalStorage';

const themeCategories = {
  base: {
    label: "Base Themes",
    themes: ["light", "dark"]
  },
  nature: {
    label: "Nature",
    themes: ["forest", "ocean", "sunset", "amber"]
  },
  colors: {
    label: "Colors",
    themes: ["purple", "rose"]
  },
  holidays: {
    label: "Holidays",
    themes: ["christmas", "halloween", "valentines", "stPatricks", "easter", "thanksgiving"]
  },
  shows: {
    label: "TV Shows & Anime",
    themes: ["simpsons", "dragonBallZ", "naruto", "akatsuki"]
  }
};

const ThemePreview = ({ theme, currentTheme, onClick }) => {
  const colors = themes[theme].preview;

  return (
    <button
      onClick={() => onClick(theme)}
      className={`
        p-3 rounded-lg border transition-all duration-200 w-full
        ${currentTheme === theme ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
        hover:scale-105 transform transition-transform
      `}
      style={{ backgroundColor: colors.background }}
    >
      <div className="text-left" style={{ color: colors.text }}>
        <div className="font-medium mb-2 text-sm">{themes[theme].name}</div>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.accent }} />
        </div>
      </div>
    </button>
  );
};

const ThemeDialog = ({ open, onOpenChange, currentTheme, onThemeChange, theme }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={`${theme.bgPrimary} ${theme.text} border ${theme.border} w-full max-w-3xl max-h-[80vh]`}>
      <DialogHeader className="px-2">
        <DialogTitle className={`flex items-center gap-2 ${theme.text}`}>
          <Palette className="h-5 w-5" />
          Appearance
        </DialogTitle>
      </DialogHeader>

      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-6 px-2 pb-4">
          {Object.entries(themeCategories).map(([categoryKey, category]) => (
            <div key={categoryKey} className="space-y-3">
              <h3 className={`text-sm font-medium ${theme.textSecondary}`}>
                {category.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-4">
                {category.themes.map((themeKey) => (
                  <ThemePreview
                    key={themeKey}
                    theme={themeKey}
                    currentTheme={currentTheme}
                    onClick={onThemeChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

const App = () => {
  const [currentTheme, setCurrentTheme] = useLocalStorage('theme', 'light');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('sidebarOpen', true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatSettings, setChatSettings] = useLocalStorage('chatSettings', {
    strategy: 'standard',
    responseFormat: 'markdown',
    contextMode: 'flexible'
  });

  const [pendingMessageId, setPendingMessageId] = useState(null);

  const theme = themes[currentTheme].colors;

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
    loadConversation,
    createNewConversation,
    retryMessage,
    editMessage,
    setMessages
  } = useChat();

  const handleRetryMessage = async (messageId, content, preserveHistory) => {
    if (!conversationId) return;

    try {
      setPendingMessageId(messageId);

      if (!preserveHistory) {
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          setMessages(messages.slice(0, messageIndex));
        }
      }

      await retryMessage(messageId, content, preserveHistory, chatSettings);
    } catch (err) {
      console.error('Error retrying message:', err);
    } finally {
      setPendingMessageId(null);
    }
  };

  const handleEditMessage = async (messageId, newContent, preserveHistory) => {
    if (!conversationId) return;

    try {
      setPendingMessageId(messageId);

      if (!preserveHistory) {
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          setMessages(messages.slice(0, messageIndex));
        }
      }

      await editMessage(messageId, newContent, preserveHistory, chatSettings);
    } catch (err) {
      console.error('Error editing message:', err);
    } finally {
      setPendingMessageId(null);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message, chatSettings);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (conversation?.conversation_id) {
      loadConversation(conversation.conversation_id);
    }
  };

  const handleNewChat = async () => {
    setSelectedConversation(null);
    await createNewConversation();
  };

  const handleExportChat = () => {
    if (!messages.length) return;

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
    a.download = `chat-history-${conversationId || 'new'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getChatTitle = () => {
    if (!selectedConversation) {
      return "New Chat";
    }
    return selectedConversation.title ||
           (selectedConversation.questions_asked?.[0]?.length > 40
             ? `${selectedConversation.questions_asked[0].substring(0, 40)}...`
             : selectedConversation.questions_asked?.[0]) ||
           "New Chat";
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${theme.bgPrimary}`}>
        <div className={`text-center ${theme.text}`}>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className={theme.textMuted}>{error}</p>
          <ThemedButton
            onClick={createNewConversation}
            theme={theme}
            className="mt-4"
          >
            Try Again
          </ThemedButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${theme.bgSecondary} transition-colors duration-200`}>
      {/* Header */}
      <header className={`h-16 border-b ${theme.border} ${theme.bgPrimary} flex items-center justify-between px-6 flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <MessagesSquare className={`h-6 w-6 ${theme.accent} text-white rounded-lg p-1`} />
          <h1 className={`text-xl font-semibold ${theme.text}`}>Chat Application</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemedButton
            variant="ghost"
            size="icon"
            theme={theme}
            onClick={() => setIsThemeOpen(true)}
            className="rounded-full"
            title="Change theme"
          >
            <Palette className={`h-5 w-5 ${theme.icon}`} />
          </ThemedButton>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <CollapsibleSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
        >
          <div className={`h-14 border-b ${theme.border} flex items-center justify-between px-4`}>
            <div className="flex gap-4">
              <ThemedButton
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="icon"
                theme={theme}
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="h-5 w-5" />
              </ThemedButton>
              <ThemedButton
                variant={activeTab === 'documents' ? 'default' : 'ghost'}
                size="icon"
                theme={theme}
                onClick={() => setActiveTab('documents')}
              >
                <Files className="h-5 w-5" />
              </ThemedButton>
            </div>
          </div>

          <div className={`flex-1 overflow-hidden ${theme.bgPrimary} p-4`}>
            {activeTab === 'chat' ? (
              <ConversationList
                onSelectConversation={handleSelectConversation}
                currentConversationId={selectedConversation?.conversation_id}
                onNewChat={handleNewChat}
                theme={theme}
              />
            ) : (
              <DocumentList theme={theme} />
            )}
          </div>
        </CollapsibleSidebar>

        <div className={`flex-1 flex flex-col ${theme.bgPrimary} overflow-hidden`}>
          <div className={`flex flex-col h-full ${theme.bgPrimary} rounded-lg shadow-sm border ${theme.border}`}>
            <div className={`border-b ${theme.border} ${theme.bgPrimary}`}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <ThemedButton
                    variant="ghost"
                    size="icon"
                    theme={theme}
                    className="lg:hidden"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className={`h-5 w-5 ${theme.icon}`} />
                  </ThemedButton>
                  <ThemedButton
                    variant="ghost"
                    size="icon"
                    theme={theme}
                    onClick={handleExportChat}
                  >
                    <Download className={`h-5 w-5 ${theme.icon}`} />
                  </ThemedButton>
                  <ThemedButton
                    variant="ghost"
                    size="icon"
                    theme={theme}
                    onClick={handleNewChat}
                  >
                    <RefreshCcw className={`h-5 w-5 ${theme.icon}`} />
                  </ThemedButton>
                </div>
              </div>
            </div>

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
                  format={chatSettings.responseFormat}
                  theme={theme}
                  onRetry={handleRetryMessage}
                  onEdit={handleEditMessage}
                  isLoading={isLoading}
                  pendingMessageId={pendingMessageId}
                />
              )}
            </div>

            <div className={`border-t ${theme.border} ${theme.bgPrimary} p-4`}>
              <MessageInput
                onSend={handleSendMessage}
                disabled={isLoading}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>

      <ChatSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={chatSettings}
        onSettingsChange={setChatSettings}
        theme={theme}
      />

      <ThemeDialog
        open={isThemeOpen}
        onOpenChange={setIsThemeOpen}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        theme={theme}
      />
    </div>
  );
};

export default App;