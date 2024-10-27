import React from 'react';
import { Layout } from './components/layout/Layout';
import { ChatWindow } from './components/chat/ChatWindow';
import { DocumentList } from './components/documents/DocumentList';
import './index.css';

const App = () => {
  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chat Window */}
        <div className="lg:col-span-2 lg:max-h-[800px]">
          <ChatWindow />
        </div>

        {/* Sidebar with Documents */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <DocumentList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;