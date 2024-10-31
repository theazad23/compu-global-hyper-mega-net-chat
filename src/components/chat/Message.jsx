import React from 'react';
import { formatResponse } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { FileText } from 'lucide-react';

export const Message = ({ message, format = 'default', onViewSources, theme }) => {
  if (!theme) {
    return null; // Early return if theme is not available
  }

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

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs",
                isUser ? "text-white/80 hover:bg-white/10" : `${theme.textMuted} hover:${theme.bgHover}`
              )}
              onClick={() => onViewSources?.(message)}
            >
              <FileText className="h-3 w-3 mr-2" />
              {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};