import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ErrorMessage = ({ 
  message, 
  variant = "default",
  className,
  onRetry
}) => {
  const variants = {
    default: {
      container: "bg-destructive/10 border-destructive/20",
      icon: "text-destructive",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-600",
    },
  };

  return (
    <div className={cn(
      "rounded-lg border p-4",
      variants[variant].container,
      className
    )}>
      <div className="flex items-start gap-3">
        {variant === 'warning' ? (
          <AlertTriangle className={cn("h-5 w-5", variants[variant].icon)} />
        ) : (
          <XCircle className={cn("h-5 w-5", variants[variant].icon)} />
        )}
        <div className="flex-1">
          <p className="text-sm text-foreground">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-primary hover:text-primary/90"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};