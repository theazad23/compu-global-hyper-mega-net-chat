import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ThemedButton } from '../ui/button';

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  theme
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme.bgPrimary} border ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={theme.text}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={theme.textMuted}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <ThemedButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            theme={theme}
          >
            {cancelText}
          </ThemedButton>
          
          <ThemedButton
            variant={danger ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            theme={theme}
          >
            {confirmText}
          </ThemedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};