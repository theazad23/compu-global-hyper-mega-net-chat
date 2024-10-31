import React from 'react';
import { formatResponse } from '../../utils/formatters';
import { cn } from '../../lib/utils';

export const Message = ({ message, format = 'default', theme }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4 animate-fadeIn relative z-10", 
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4 break-words",
        isUser ? theme.messageUser : theme.messageBot
      )}>
        <div className="flex justify-between items-start mb-2">
          <span className={cn(
            "text-xs", 
            isUser ? "text-white/80" : theme.textMuted
          )}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          <span className={cn(
            "text-xs font-medium capitalize",
            isUser ? "text-white/80" : theme.textMuted
          )}>
            {message.role}
          </span>
        </div>
        
        <div className={cn(
          "message-content overflow-hidden",
          isUser ? "text-white" : theme.text
        )}>
          {formatResponse(message.content, format)}
        </div>
      </div>
    </div>
  );
};