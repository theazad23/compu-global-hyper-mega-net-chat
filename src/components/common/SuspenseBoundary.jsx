import React, { Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';

const DefaultFallback = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`
      w-full h-full flex items-center justify-center
      ${theme.bgPrimary}
    `}>
      <LoadingSpinner size="large" />
    </div>
  );
};

export const SuspenseBoundary = ({
  children,
  fallback = <DefaultFallback />,
  minDuration = 500 // Minimum loading duration to prevent flashing
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Higher-order component for easy wrapping
export const withSuspense = (Component, options = {}) => {
  return function WithSuspense(props) {
    return (
      <SuspenseBoundary 
        fallback={options.fallback}
        minDuration={options.minDuration}
      >
        <Component {...props} />
      </SuspenseBoundary>
    );
  };
};

// Combine error and suspense boundaries
export const withBoundaries = (Component, options = {}) => {
  return withErrorBoundary(
    withSuspense(Component, options),
    options
  );
};