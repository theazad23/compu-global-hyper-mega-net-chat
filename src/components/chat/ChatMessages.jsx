import React from 'react';
import { Message } from './Message';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2 } from 'lucide-react';

export const ChatMessages = ({ messages, isLoading, format, theme }) => {
  return (
    <ScrollArea className="h-full">
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
  );
};