import React, { useState } from 'react';
import { formatResponse } from '../../utils/formatters';
import { cn } from '../../lib/utils';
import { Copy, RotateCcw, PencilLine, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

export const Message = ({ 
  message, 
  format = 'default', 
  onRetry,
  onEdit,
  theme 
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [preserveHistory, setPreserveHistory] = useState(true);

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

  const handleEdit = async () => {
    await onEdit?.(message.id, editedContent, preserveHistory);
    setEditDialogOpen(false);
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
                title="Edit and resend"
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className={`${theme.bgPrimary} ${theme.border}`}>
          <DialogHeader>
            <DialogTitle className={theme.text}>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}
              rows={4}
            />
            <div className="flex items-center gap-2">
              <label className={`text-sm ${theme.text} flex items-center gap-2`}>
                <input
                  type="checkbox"
                  checked={preserveHistory}
                  onChange={(e) => setPreserveHistory(e.target.checked)}
                  className="rounded"
                />
                Preserve history
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className={`${theme.border} ${theme.text}`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!editedContent.trim()}
                className={theme.accent}
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