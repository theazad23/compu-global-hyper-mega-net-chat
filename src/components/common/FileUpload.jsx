import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { LoadingSpinner } from './LoadingSpinner';

export const FileUpload = ({ 
  onUpload,
  maxSize = 10485760, // 10MB
  accept = {
    'text/plain': ['.txt'],
    'application/pdf': ['.pdf'],
    'application/json': ['.json'],
    'text/markdown': ['.md'],
  },
  multiple = false,
  children 
}) => {
  const { theme } = useTheme();
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      if (multiple) {
        await Promise.all(acceptedFiles.map(file => onUpload(file)));
      } else {
        await onUpload(acceptedFiles[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }, [multiple, onUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple
  });

  // If children are provided, use them as the dropzone target
  if (children) {
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-colors duration-200 ease-in-out
          ${isDragActive ? theme.accent : theme.border}
          ${isDragReject ? 'border-red-500' : ''}
          ${theme.bgPrimary}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <LoadingSpinner size="large" />
          ) : (
            <Upload className={`h-12 w-12 ${theme.icon}`} />
          )}
          
          <div className="text-center space-y-2">
            <p className={`text-sm ${theme.text}`}>
              {isDragActive
                ? "Drop files here..."
                : "Drag & drop files here, or click to select"}
            </p>
            <p className={`text-xs ${theme.textMuted}`}>
              Maximum file size: {(maxSize / 1048576).toFixed(0)}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
          <div className="flex items-center space-x-2">
            <X className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};