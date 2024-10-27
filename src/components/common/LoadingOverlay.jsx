import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
      <LoadingSpinner size="large" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};