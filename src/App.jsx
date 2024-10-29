import React from 'react';
import { Layout } from './components/layout/Layout';
import { ChatWindow } from './components/chat/ChatWindow';
import { DocumentList } from './components/documents/DocumentList';
import './index.css';

const App = () => {
  return (
    <Layout>
      <div className="h-full grid lg:grid-cols-3 gap-8">
        {/* Main Chat Window */}
        <div className="lg:col-span-2 min-h-0 flex flex-col">
          <ChatWindow />
        </div>

        {/* Sidebar with Documents */}
        <div className="lg:col-span-1 min-h-0 flex flex-col">
          <div className="bg-white p-6 rounded-lg border shadow-sm flex-1 overflow-hidden">
            <DocumentList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;