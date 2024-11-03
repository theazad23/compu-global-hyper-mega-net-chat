import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Copy, RotateCcw, PencilLine, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { formatResponse } from '../../utils/formatters';

export const Message = ({
  message,
  format = 'default',
  onRetry,
  onEdit,
  theme,
  isLoading,
  previousMessage,
  subsequentMessages = [],
  isPending
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [preserveHistory, setPreserveHistory] = useState(true);
  const [hasConflictingChanges, setHasConflictingChanges] = useState(false);

  useEffect(() => {
    setEditedContent(message.content);
  }, [message.content]);

  useEffect(() => {
    setHasConflictingChanges(subsequentMessages.length > 0 && !preserveHistory);
  }, [subsequentMessages, preserveHistory]);

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

  const handleRetry = async () => {
    if (isLoading) return;

    try {
      if (isUser) {
        await onRetry?.(message.id, message.content, preserveHistory);
      } else {
        if (previousMessage?.role === 'user') {
          await onRetry?.(previousMessage.id, previousMessage.content, preserveHistory);
        }
      }
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleEdit = async () => {
    if (isLoading) return;

    try {
      setEditDialogOpen(false);
      await onEdit?.(message.id, editedContent, preserveHistory);
    } catch (error) {
      console.error('Edit failed:', error);
      setEditDialogOpen(true);
    }
  };

  const shouldDim = isPending || (isLoading && message.id === undefined);

  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-fadeIn relative z-10",
        isUser ? "justify-end" : "justify-start",
        shouldDim && "opacity-50"
      )}
    >
      <div 
        className={cn(
          "max-w-[80%] rounded-lg p-4 break-words",
          isUser ? theme.messageUser : theme.messageBot
        )}
      >
        <div className={cn(
          "message-content overflow-hidden",
          isUser ? "text-white" : theme.text
        )}>
          {formatResponse(message.content, format)}
        </div>

        <div className={cn(
          "mt-3 pt-3 border-t flex items-center justify-between",
          isUser ? "border-white/10" : "border-gray-200/20"
        )}>
          <span className={cn(
            "flex items-center gap-1 text-xs",
            isUser ? "text-white/60" : theme.textMuted
          )}>
            <Clock className="h-3 w-3" />
            {formatDateTime(message.timestamp)}
          </span>

          <div className="flex items-center gap-1">
            {isUser ? (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6",
                  "text-white/60 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setEditDialogOpen(true)}
                disabled={isLoading}
                title="Edit message"
              >
                <PencilLine className="h-3 w-3" />
              </Button>
            ) : (
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
                  disabled={isLoading}
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
                  onClick={handleRetry}
                  disabled={isLoading}
                  title="Regenerate response"
                >
                  <RotateCcw className={cn(
                    "h-3 w-3",
                    isPending && "animate-spin"
                  )} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!isLoading) {
            setEditDialogOpen(open);
            if (open) {
              setEditedContent(message.content);
              setPreserveHistory(true);
            }
          }
        }}
      >
        <DialogContent
          className={`${theme.bgPrimary} ${theme.border}`}
          onInteractOutside={(e) => {
            if (isLoading) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className={theme.text}>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={cn(
                "w-full min-h-[100px] p-3 rounded-lg resize-none",
                theme.bgPrimary,
                theme.border,
                theme.text,
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
              disabled={isLoading}
              placeholder="Edit your message..."
            />

            <div className="space-y-2">
              <label className={`flex items-center gap-2 ${theme.text}`}>
                <input
                  type="checkbox"
                  checked={preserveHistory}
                  onChange={(e) => setPreserveHistory(e.target.checked)}
                  className="rounded"
                  disabled={isLoading}
                />
                Preserve conversation history
              </label>

              {hasConflictingChanges && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-yellow-500/10 text-yellow-500">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Warning: This will remove subsequent messages in the conversation.
                    Enable "Preserve conversation history" to keep them.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className={`${theme.border} ${theme.text}`}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editedContent.trim() || isLoading}
                className={cn(theme.accent, "min-w-[100px]")}
              >
                Save & Resend
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};