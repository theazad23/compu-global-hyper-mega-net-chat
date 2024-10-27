import React from 'react';
import { formatResponse } from '../../utils/formatters';
import { cn } from '../../lib/utils';

export const Message = ({ message, format = 'default' }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4",
        isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
      )}>
        {formatResponse(message.content, format)}
      </div>
    </div>
  );
};