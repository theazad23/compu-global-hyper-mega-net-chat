import React from 'react';
import { FileQuestion } from 'lucide-react';
import { ThemedButton } from '../ui/button';

export const EmptyState = ({
  title,
  description,
  icon: Icon = FileQuestion,
  actionLabel,
  onAction,
  theme,
  className
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center
      h-full p-8 text-center
      ${className}
    `}>
      <Icon className={`h-12 w-12 ${theme.textMuted} mb-4`} />
      
      <h3 className={`text-lg font-semibold ${theme.text}`}>
        {title}
      </h3>
      
      <p className={`text-sm ${theme.textMuted} mt-1 mb-4`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <ThemedButton
          onClick={onAction}
          theme={theme}
        >
          {actionLabel}
        </ThemedButton>
      )}
    </div>
  );
};