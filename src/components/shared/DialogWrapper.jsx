import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export const DialogWrapper = ({ 
  open, 
  onOpenChange, 
  title, 
  children, 
  theme,
  icon: Icon 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme.bgPrimary} ${theme.text} border ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme.text}`}>
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};