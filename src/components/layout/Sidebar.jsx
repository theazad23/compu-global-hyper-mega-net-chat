import React from 'react';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { DocumentList } from '../documents/DocumentList';
import { ConversationList } from '../chat/ConversationList';
import { TabSelector } from '../shared/TabSelector';

export const Sidebar = ({
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  selectedConversation,
  onSelectConversation,
  onNewChat,
  theme
}) => (
  <CollapsibleSidebar
    isOpen={isOpen}
    onToggle={onToggle}
    theme={theme}
  >
    <div className={`h-14 border-b ${theme.border} flex items-center justify-between px-4`}>
      <TabSelector 
        activeTab={activeTab}
        onTabChange={onTabChange}
        theme={theme}
      />
    </div>

    <div className={`flex-1 overflow-hidden ${theme.bgPrimary} p-4`}>
      {activeTab === 'chat' ? (
        <ConversationList
          onSelectConversation={onSelectConversation}
          currentConversationId={selectedConversation?.conversation_id}
          onNewChat={onNewChat}
          theme={theme}
        />
      ) : (
        <DocumentList theme={theme} />
      )}
    </div>
  </CollapsibleSidebar>
);