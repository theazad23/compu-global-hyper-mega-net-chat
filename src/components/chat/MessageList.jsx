import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { MessageSquare } from 'lucide-react';

export const MessageList = ({ messages, format, onViewSources, isLoading, theme }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollElement = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={`h-full ${theme?.bgPrimary || ''}`}>
        <EmptyState
          title="Start a Conversation"
          description="Begin by typing a message below"
          icon={MessageSquare}
          theme={theme}
          className="h-full"
        />
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollContainerRef} className="h-full">
      <div className="flex flex-col space-y-4 p-4">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message}
            format={format}
            onViewSources={onViewSources}
            theme={theme}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className={`max-w-[80%] rounded-lg p-4 ${theme?.messageBot || ''}`}>
              <div className="flex items-center gap-2">
                <Loader2 className={`h-4 w-4 animate-spin ${theme?.text || ''}`} />
                <span className={theme?.text || ''}>
                  Assistant is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};