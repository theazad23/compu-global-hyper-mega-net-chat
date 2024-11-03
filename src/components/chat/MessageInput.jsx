import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MessageInput = ({ onSend, disabled, theme }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your message..."
        className={cn(
          "w-full min-h-[100px] p-3 rounded-lg resize-none",
          "font-mono text-sm",
          theme?.bgSecondary,
          theme?.border,
          theme?.text,
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "disabled:opacity-50"
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            theme?.accent,
            theme?.accentHover,
            "transition-all duration-200",
            "disabled:opacity-50"
          )}
        >
          <span className="text-white">Send</span>
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
};