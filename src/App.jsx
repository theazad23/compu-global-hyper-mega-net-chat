import React, { useState } from 'react';
import { 
  MessageSquare, 
  Files, 
  Palette,
  Settings,
  Download,
  RefreshCcw,
  History
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentList } from './components/documents/DocumentList';
import { ConversationList } from './components/chat/ConversationList';
import { ChatSettings } from './components/chat/ChatSettings';
import { MessageInput } from './components/chat/MessageInput';
import { MessageList } from './components/chat/MessageList';
import { useChat } from './hooks/useChat';
import { EmptyState } from './components/common/EmptyState';
import { ThemedButton } from './components/ui/button';

// Enhanced theme definitions with more complete color schemes
const themes = {
  light: {
    name: 'Light',
    preview: {
      primary: '#1a56db',
      background: '#ffffff',
      text: '#000000',
      accent: '#f3f4f6'
    },
    colors: {
      bgPrimary: 'bg-white',
      bgSecondary: 'bg-gray-50',
      bgAccent: 'bg-blue-50',
      bgHover: 'hover:bg-gray-100',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      accent: 'bg-blue-600',
      accentHover: 'hover:bg-blue-700',
      buttonHover: 'hover:bg-gray-100',
      highlight: 'bg-blue-50',
      messageUser: 'bg-blue-600 text-white',
      messageBot: 'bg-gray-100 text-gray-900',
      icon: 'text-gray-500'
    }
  },
  dark: {
    name: 'Dark',
    preview: {
      primary: '#3b82f6',
      background: '#111827',
      text: '#ffffff',
      accent: '#1f2937'
    },
    colors: {
      bgPrimary: 'bg-gray-900',
      bgSecondary: 'bg-gray-800',
      bgAccent: 'bg-gray-800',
      bgHover: 'hover:bg-gray-700',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      border: 'border-gray-700',
      accent: 'bg-blue-500',
      accentHover: 'hover:bg-blue-600',
      buttonHover: 'hover:bg-gray-700',
      highlight: 'bg-gray-700',
      messageUser: 'bg-blue-500 text-white',
      messageBot: 'bg-gray-800 text-gray-100',
      icon: 'text-gray-400'
    }
  },
  purple: {
    name: 'Purple Dream',
    preview: {
      primary: '#8b5cf6',
      background: '#0f172a',
      text: '#ffffff',
      accent: '#1e1b4b'
    },
    colors: {
      bgPrimary: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgAccent: 'bg-purple-900/50',
      bgHover: 'hover:bg-purple-800/30',
      text: 'text-purple-50',
      textSecondary: 'text-purple-200',
      textMuted: 'text-purple-300',
      border: 'border-purple-800',
      accent: 'bg-purple-500',
      accentHover: 'hover:bg-purple-600',
      buttonHover: 'hover:bg-purple-900/50',
      highlight: 'bg-purple-900/30',
      messageUser: 'bg-purple-500 text-white',
      messageBot: 'bg-purple-900/30 text-purple-50',
      icon: 'text-purple-300'
    }
  },
  green: {
    name: 'Forest',
    preview: {
      primary: '#059669',
      background: '#064e3b',
      text: '#ffffff',
      accent: '#065f46'
    },
    colors: {
      bgPrimary: 'bg-emerald-900',
      bgSecondary: 'bg-emerald-800',
      bgAccent: 'bg-emerald-800/50',
      bgHover: 'hover:bg-emerald-700/30',
      text: 'text-emerald-50',
      textSecondary: 'text-emerald-200',
      textMuted: 'text-emerald-300',
      border: 'border-emerald-700',
      accent: 'bg-emerald-500',
      accentHover: 'hover:bg-emerald-600',
      buttonHover: 'hover:bg-emerald-800/50',
      highlight: 'bg-emerald-800/30',
      messageUser: 'bg-emerald-500 text-white',
      messageBot: 'bg-emerald-900/30 text-emerald-50',
      icon: 'text-emerald-300'
    }
  },
  sunset: {
    name: 'Sunset',
    preview: {
      primary: '#f59e0b',
      background: '#7c2d12',
      text: '#ffffff',
      accent: '#9a3412'
    },
    colors: {
      bgPrimary: 'bg-orange-900',
      bgSecondary: 'bg-orange-800',
      bgAccent: 'bg-orange-800/50',
      bgHover: 'hover:bg-orange-700/30',
      text: 'text-orange-50',
      textSecondary: 'text-orange-200',
      textMuted: 'text-orange-300',
      border: 'border-orange-700',
      accent: 'bg-amber-500',
      accentHover: 'hover:bg-amber-600',
      buttonHover: 'hover:bg-orange-800/50',
      highlight: 'bg-orange-800/30',
      messageUser: 'bg-amber-500 text-white',
      messageBot: 'bg-orange-900/30 text-orange-50',
      icon: 'text-orange-300'
    }
  }
};

const ThemePreview = ({ theme, currentTheme, onClick }) => {
  const colors = themes[theme].preview;
  
  return (
    <button
      onClick={() => onClick(theme)}
      className={`
        p-4 rounded-lg border transition-all duration-200 w-full
        ${currentTheme === theme ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
      `}
      style={{ backgroundColor: colors.background }}
    >
      <div className="text-left" style={{ color: colors.text }}>
        <div className="font-medium mb-3">{themes[theme].name}</div>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.accent }} />
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.text }} />
        </div>
        <div className="mt-3 p-2 rounded" style={{ backgroundColor: colors.accent }}>
          <div className="text-xs" style={{ color: colors.text }}>Preview Text</div>
        </div>
      </div>
    </button>
  );
};

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const theme = themes[currentTheme].colors;

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
    loadConversation,
    createNewConversation
  } = useChat();

  const [chatSettings, setChatSettings] = useState({
    strategy: 'standard',
    responseFormat: 'default',
    contextMode: 'flexible'
  });

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

  const handleSendMessage = async (message) => {
    await sendMessage(message, chatSettings);
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

  return (
    <div className={`h-screen flex flex-col ${theme.bgSecondary} transition-colors duration-200`}>
      <header className={`h-16 border-b ${theme.border} ${theme.bgPrimary} flex items-center justify-between px-6 flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <MessageSquare className={`h-6 w-6 ${theme.accent} text-white rounded-lg p-1`} />
          <h1 className={`text-xl font-semibold ${theme.text}`}>AI Chat Assistant</h1>
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
        <div className={`flex flex-col border-r ${theme.border} ${theme.bgPrimary} transition-all duration-300 w-80`}>
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
        </div>

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
                  isLoading={isLoading}
                  format={chatSettings.responseFormat}
                  theme={theme}
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

      <Dialog open={isThemeOpen} onOpenChange={setIsThemeOpen}>
        <DialogContent className={`${theme.bgPrimary} ${theme.text} border ${theme.border}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${theme.text}`}>
              <Palette className="h-5 w-5" />
              Appearance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className={`text-sm font-medium ${theme.textSecondary}`}>Select Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(themes).map((themeKey) => (
                <ThemePreview
                  key={themeKey}
                  theme={themeKey}
                  currentTheme={currentTheme}
                  onClick={setCurrentTheme}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;