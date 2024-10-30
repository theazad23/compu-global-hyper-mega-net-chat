import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ChatWindow } from './components/chat/ChatWindow';
import { DocumentList } from './components/documents/DocumentList';
import { ConversationList } from './components/chat/ConversationList';
import EnhancedLayout from './components/layout/CollapsibleLayout.jsx';
import './index.css';

const App = () => {
  const [currentConversation, setCurrentConversation] = useState(null);

  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <Layout>
      <EnhancedLayout
        historyPanel={
          <div className="p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">History</h2>
            <ConversationList 
              onSelectConversation={handleConversationSelect}
              currentConversationId={currentConversation?.conversation_id}
            />
          </div>
        }
        documentsPanel={
          <div className="p-4 h-full">
            <DocumentList />
          </div>
        }
      >
        <ChatWindow 
          currentConversation={currentConversation}
        />
      </EnhancedLayout>
    </Layout>
  );
};

export default App;