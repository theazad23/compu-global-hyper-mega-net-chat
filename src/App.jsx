import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { ThemeSelector } from './components/settings/ThemeSelector';
import { ChatSettings } from './components/settings/ChatSettings';
import { useChat } from './hooks/useChat';
import { themes } from './config/themes';

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const theme = themes[currentTheme].colors;
  
  const {
    messages,
    isLoading,
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

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (conversation?.conversation_id) {
      loadConversation(conversation.conversation_id);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${theme.bgSecondary}`}>
      <Header 
        onThemeClick={() => setIsThemeOpen(true)}
        theme={theme}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onNewChat={createNewConversation}
          theme={theme}
        />
        
        <MainContent 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          conversationId={conversationId}
          selectedConversation={selectedConversation}
          theme={theme}
          chatSettings={chatSettings}
          onExport={handleExportChat}
          onNewChat={createNewConversation}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      <ThemeSelector
        open={isThemeOpen}
        onOpenChange={setIsThemeOpen}
        currentTheme={currentTheme}
        onThemeSelect={setCurrentTheme}
        theme={theme}
      />
      
      <ChatSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={chatSettings}
        onSettingsChange={setChatSettings}
        theme={theme}
      />
    </div>
  );
};

export default App;