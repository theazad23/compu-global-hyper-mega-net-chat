import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '../ui/button';

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = FileQuestion,
  theme,
  className = ''
}) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-8 text-center
        ${theme?.bgPrimary || ''} 
        ${className}
      `}
    >
      <Icon 
        className={`
          h-12 w-12 
          ${theme?.textMuted || 'text-muted-foreground/50'} 
          mb-4
        `} 
      />
      <h3 className={`text-lg font-semibold ${theme?.text || ''}`}>
        {title}
      </h3>
      <p className={`
        text-sm 
        ${theme?.textMuted || 'text-muted-foreground'} 
        mt-1 mb-4
      `}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className={theme?.accent}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};