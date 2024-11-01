import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({ className, theme, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        theme?.bgSecondary || 'bg-muted',
        className
      )}
      {...props}
    />
  );
};

export const DocumentSkeleton = ({ theme, count = 3 }) => {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "flex items-center gap-4 p-4 border rounded-lg",
            theme?.border,
            theme?.bgPrimary
          )}
        >
          {/* Icon placeholder */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg",
            theme?.bgSecondary
          )}>
            <Skeleton className="w-full h-full" theme={theme} />
          </div>
          
          {/* Content placeholders */}
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" theme={theme} />
            <Skeleton className="h-3 w-3/4" theme={theme} />
          </div>
          
          {/* Action button placeholder */}
          <Skeleton 
            className="h-8 w-8 rounded-md flex-shrink-0" 
            theme={theme}
          />
        </div>
      ))}
    </div>
  );
};

export const MessageSkeleton = ({ theme }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex w-full max-w-[80%]",
            i % 2 === 0 ? "justify-end ml-auto" : "justify-start"
          )}
        >
          <Skeleton className="h-16 w-full rounded-lg" theme={theme} />
        </div>
      ))}
    </div>
  );
};