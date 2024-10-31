import React from 'react';
import { MessageSquare, Files } from 'lucide-react';
import { ThemedButton } from '../ui/button';

export const TabSelector = ({ activeTab, onTabChange, theme }) => {
  return (
    <div className="flex gap-4">
      <ThemedButton
        variant={activeTab === 'chat' ? 'default' : 'ghost'}
        size="icon"
        theme={theme}
        onClick={() => onTabChange('chat')}
      >
        <MessageSquare className="h-5 w-5" />
      </ThemedButton>
      <ThemedButton
        variant={activeTab === 'documents' ? 'default' : 'ghost'}
        size="icon"
        theme={theme}
        onClick={() => onTabChange('documents')}
      >
        <Files className="h-5 w-5" />
      </ThemedButton>
    </div>
  );
};