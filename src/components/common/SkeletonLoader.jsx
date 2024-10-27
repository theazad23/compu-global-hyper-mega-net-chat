import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

export const MessageSkeleton = () => {
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
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
};

export const DocumentSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};