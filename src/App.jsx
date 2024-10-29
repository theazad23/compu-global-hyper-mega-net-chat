import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ChatWindow } from './components/chat/ChatWindow';
import { DocumentList } from './components/documents/DocumentList';
import { ConversationList } from './components/chat/ConversationList';
import './index.css';

const App = () => {
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <Layout>
      <div className="h-full flex relative">
        {/* Collapsible History Panel */}
        <div 
          className={`
            absolute lg:relative left-0 z-20 h-full bg-background
            transition-all duration-300 ease-in-out
            ${isHistoryOpen ? 'w-80' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'}
          `}
        >
          {/* History Content */}
          <div className={`
            h-full bg-white border-r transition-opacity duration-300
            ${isHistoryOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}
            ${isHistoryOpen ? 'visible' : 'invisible lg:visible'}
          `}>
            <div className="p-4 h-full">
              <h2 className={`
                text-lg font-semibold mb-4 transition-opacity duration-300
                ${isHistoryOpen ? 'opacity-100' : 'opacity-0'}
              `}>
                History
              </h2>
              {isHistoryOpen && (
                <ConversationList 
                  onSelectConversation={handleConversationSelect}
                  currentConversationId={currentConversation?.conversation_id}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Window */}
        <div className={`
          flex-1 min-w-0 transition-all duration-300 ease-in-out
          ${isHistoryOpen ? 'lg:ml-0' : 'lg:ml-0'}
        `}>
          <ChatWindow 
            currentConversation={currentConversation}
            onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
          />
        </div>

        {/* Documents Panel */}
        <div className="hidden lg:block w-80 min-w-80 ml-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
            <DocumentList />
          </div>
        </div>

        {/* Overlay for mobile when history is open */}
        {isHistoryOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-10"
            onClick={() => setIsHistoryOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;