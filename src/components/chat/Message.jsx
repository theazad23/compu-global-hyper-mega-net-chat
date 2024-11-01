import React, { memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { formatTimestamp } from '../../lib/formatters';
import { MessageContent } from './MessageContent';
import { cn } from '../../lib/utils';

export const Message = memo(({ message }) => {
  const { theme } = useTheme();
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fadeIn",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser ? theme.messageUser : theme.messageBot
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <span
            className={cn(
              "text-xs",
              isUser ? "text-white/80" : theme.textMuted
            )}
          >
            {formatTimestamp(message.timestamp)}
          </span>
          <span
            className={cn(
              "text-xs font-medium capitalize ml-2",
              isUser ? "text-white/80" : theme.textMuted
            )}
          >
            {message.role}
          </span>
        </div>

        <MessageContent 
          content={message.content}
          sources={message.sources}
          isUser={isUser}
        />

        {message.metadata && message.metadata.type === 'response' && (
          <div className={`mt-2 pt-2 border-t ${theme.border} ${theme.textMuted} text-xs`}>
            Generated using {message.metadata.strategy} strategy
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Memoization check
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content
  );
});

Message.displayName = 'Message';