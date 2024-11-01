import React, { useState } from 'react';
import { formatResponse } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { Copy, RotateCcw, PencilLine, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';

export const Message = ({ message, format = 'default', onRetry, onEdit, theme }) => {
  if (!theme) {
    return null;
  }

  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  
  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex w-full mb-4 animate-fadeIn relative z-10", 
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4 break-words",
        isUser ? theme.messageUser : theme.messageBot
      )}>
        {/* Message content */}
        <div className={cn(
          "message-content overflow-hidden",
          isUser ? "text-white" : theme.text
        )}>
          {formatResponse(message.content, format)}
        </div>

        {/* Footer with datetime and actions */}
        <div className={cn(
          "mt-3 pt-3 border-t flex items-center justify-between",
          isUser ? "border-white/10" : "border-gray-200/20"
        )}>
          {/* Datetime */}
          <span className={cn(
            "flex items-center gap-1 text-xs",
            isUser ? "text-white/60" : theme.textMuted
          )}>
            <Clock className="h-3 w-3" />
            {formatDateTime(message.timestamp)}
          </span>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {isUser ? (
              // Edit button for user messages
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6",
                  "text-white/60 hover:text-white hover:bg-white/10"
                )}
                onClick={() => onEdit?.(message)}
                title="Edit and resend"
              >
                <PencilLine className="h-3 w-3" />
              </Button>
            ) : (
              // Copy and retry buttons for assistant messages
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6",
                    theme.textMuted,
                    `hover:${theme.bgHover}`
                  )}
                  onClick={handleCopy}
                  title="Copy message"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6",
                    theme.textMuted,
                    `hover:${theme.bgHover}`
                  )}
                  onClick={() => onRetry?.(message)}
                  title="Retry message"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};