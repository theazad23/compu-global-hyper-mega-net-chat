import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return <ErrorDisplay 
      error={this.state.error}
      errorInfo={this.state.errorInfo}
      onReset={() => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        this.props.onReset?.();
      }}
    />;
  }
}

const ErrorDisplay = ({ error, errorInfo, onReset }) => {
  const { theme } = useTheme();

  return (
    <div className={`h-full flex items-center justify-center p-4 ${theme.bgPrimary}`}>
      <div className={`
        max-w-md w-full mx-auto p-6 rounded-lg
        border ${theme.border} ${theme.bgSecondary}
      `}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`
            h-12 w-12 rounded-full
            ${theme.bgAccent} ${theme.text}
            flex items-center justify-center
          `}>
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h1 className={`text-xl font-semibold ${theme.text}`}>
              Something went wrong
            </h1>
            <p className={`text-sm ${theme.textMuted}`}>
              {error?.message || 'An unexpected error occurred'}
            </p>
          </div>

          <div className="space-y-4 w-full">
            {process.env.NODE_ENV === 'development' && errorInfo && (
              <details className="mt-4">
                <summary className={`
                  cursor-pointer text-sm ${theme.textMuted}
                  hover:${theme.textSecondary}
                `}>
                  Show error details
                </summary>
                <pre className={`
                  mt-2 p-4 rounded-lg text-xs overflow-auto
                  ${theme.bgPrimary} ${theme.text}
                  max-h-[200px]
                `}>
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2 justify-center">
              <button
                onClick={onReset}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md
                  ${theme.accent} text-white
                  hover:${theme.accentHover}
                  transition-colors
                `}
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Higher-order component for easy wrapping
export const withErrorBoundary = (Component, options = {}) => {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundaryFallback onReset={options.onReset}>
        <Component {...props} />
      </ErrorBoundaryFallback>
    );
  };
};

export default ErrorBoundaryFallback;