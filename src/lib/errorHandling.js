import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(message, code, meta = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.meta = meta;
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

const ErrorMessages = {
  [ErrorCodes.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ErrorCodes.API_ERROR]: 'Server error. Please try again later.',
  [ErrorCodes.VALIDATION_ERROR]: 'Invalid input. Please check your data.',
  [ErrorCodes.UPLOAD_ERROR]: 'File upload failed. Please try again.',
  [ErrorCodes.AUTH_ERROR]: 'Authentication error. Please log in again.',
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

export const handleError = (error, options = {}) => {
  const {
    silent = false,
    throwError = false,
    context = ''
  } = options;

  // Determine error type and extract message
  let errorCode = ErrorCodes.UNKNOWN_ERROR;
  let errorMessage = error.message;

  if (error instanceof AppError) {
    errorCode = error.code;
    errorMessage = error.message || ErrorMessages[error.code];
  } else if (error.name === 'NetworkError') {
    errorCode = ErrorCodes.NETWORK_ERROR;
    errorMessage = ErrorMessages[ErrorCodes.NETWORK_ERROR];
  } else if (error.name === 'ValidationError') {
    errorCode = ErrorCodes.VALIDATION_ERROR;
    errorMessage = error.message || ErrorMessages[ErrorCodes.VALIDATION_ERROR];
  }

  // Log error with context
  console.error(`Error in ${context}:`, {
    code: errorCode,
    message: errorMessage,
    originalError: error
  });

  // Show toast notification if not silent
  if (!silent) {
    toast.error(errorMessage);
  }

  // Throw error if requested
  if (throwError) {
    throw new AppError(errorMessage, errorCode, {
      originalError: error,
      context
    });
  }

  return {
    code: errorCode,
    message: errorMessage,
    originalError: error
  };
};

export const createErrorBoundary = (Component, options = {}) => {
  const {
    onError,
    fallback,
    resetKeys = []
  } = options;

  return function ErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundaryFallback
        onError={onError}
        fallback={fallback}
        resetKeys={resetKeys}
      >
        <Component {...props} />
      </ErrorBoundaryFallback>
    );
  };
};