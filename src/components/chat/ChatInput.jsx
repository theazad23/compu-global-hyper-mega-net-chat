import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Send, Paperclip } from 'lucide-react';
import { ThemedButton } from '../ui/button';
import { useDocuments } from '../../contexts/DocumentContext';
import { FileUpload } from '../common/FileUpload';

export const ChatInput = ({ onSend, disabled }) => {
  const { theme } = useTheme();
  const { uploadDocument } = useDocuments();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isUploading) {
      onSend(message);
      setMessage('');
    }
  }, [message, disabled, isUploading, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleUpload = useCallback(async (file) => {
    setIsUploading(true);
    try {
      await uploadDocument(file);
    } finally {
      setIsUploading(false);
    }
  }, [uploadDocument]);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={`border-t ${theme.border} ${theme.bgPrimary} p-4`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={`relative flex items-end gap-2 ${theme.bgPrimary} rounded-lg`}>
          <FileUpload onUpload={handleUpload}>
            <ThemedButton
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              disabled={disabled || isUploading}
              theme={theme}
            >
              <Paperclip className={`h-5 w-5 ${theme.icon}`} />
            </ThemedButton>
          </FileUpload>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled || isUploading}
            className={`
              flex-1 resize-none overflow-hidden
              rounded-md border p-2 
              ${theme.border} ${theme.bgPrimary} ${theme.text}
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[40px] max-h-[200px]
            `}
            rows={1}
          />

          <ThemedButton
            type="submit"
            disabled={disabled || isUploading || !message.trim()}
            theme={theme}
          >
            <Send className="h-4 w-4" />
          </ThemedButton>
        </div>
      </div>
    </form>
  );
};