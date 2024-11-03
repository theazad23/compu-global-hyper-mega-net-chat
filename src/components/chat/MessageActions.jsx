import React, { useState } from 'react';
import { RotateCcw, PencilLine, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export const MessageActions = ({
  message,
  onEdit,
  onRetry,
  onRetryResponse,
  theme
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [preserveHistory, setPreserveHistory] = useState(true);

  const handleEdit = async () => {
    await onEdit(message.id, editedContent, preserveHistory);
    setEditDialogOpen(false);
  };

  const handleRetry = async () => {
    if (message.role === 'user') {
      await onRetry(message.id, message.content, preserveHistory);
    } else {
      await onRetryResponse(message.id, preserveHistory);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {message.role === 'user' ? (
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 text-white/60 hover:text-white hover:bg-white/10`}
            onClick={() => setEditDialogOpen(true)}
            title="Edit and resend"
          >
            <PencilLine className="h-3 w-3" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 ${theme.textMuted} hover:${theme.bgHover}`}
            onClick={handleRetry}
            title="Regenerate response"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        )}
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
    </>
  );
};