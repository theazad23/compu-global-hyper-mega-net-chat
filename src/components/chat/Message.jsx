import React from 'react';
import { formatResponse } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { FileText } from 'lucide-react';

export const Message = ({ message, format = 'default', onViewSources }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4 animate-fadeIn relative z-10", 
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4 break-words",
        isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
      )}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          <span className="text-xs font-medium capitalize">
            {message.role}
          </span>
        </div>
        
        <div className="message-content overflow-hidden">
          {formatResponse(message.content, format)}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => onViewSources(message)}
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