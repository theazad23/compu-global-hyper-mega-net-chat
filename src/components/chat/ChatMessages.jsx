import React, { useEffect } from 'react';
import { Message } from './Message';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, ChevronDown } from 'lucide-react';
import { useAutoScroll } from '../../hooks/useAutoScroll';

export const ChatMessages = ({ messages, isLoading, format, theme }) => {
  const {
    scrollRef,
    handleScroll,
    scrollToBottom,
    isAutoScrollEnabled,
    userHasScrolled
  } = useAutoScroll({
    dependencies: [messages.length, isLoading], // Use messages.length instead of messages array
    threshold: 150,
    smoothness: 300
  });

  // Force scroll to bottom on new user message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      scrollToBottom(true);
    }
  }, [messages, scrollToBottom]);

  return (
    <div className="relative h-full">
      <ScrollArea 
        ref={scrollRef}
        className="h-full" 
        onScrollCapture={handleScroll}
      >
        <div className="flex flex-col space-y-4 p-4">
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message}
              format={format}
              theme={theme}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className={`max-w-[80%] rounded-lg p-4 ${theme.messageBot}`}>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className={`text-sm ${theme.textMuted}`}>
                    Assistant is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {userHasScrolled && !isAutoScrollEnabled && messages.length > 0 && (
        <button
          onClick={() => scrollToBottom(true)}
          className={`
            absolute bottom-4 right-4
            p-2 rounded-full
            ${theme.bgPrimary} ${theme.border}
            hover:${theme.bgHover} 
            transition-all transform
            shadow-lg
            flex items-center gap-2
          `}
        >
          <ChevronDown className={`h-4 w-4 ${theme.icon}`} />
        </button>
      )}
    </div>
  );
};