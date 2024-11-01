import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import EnhancedTextarea from '../editor/EnhancedTextarea';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <EnhancedTextarea
        value={message}
        onChange={setMessage}
        disabled={disabled}
        theme={theme}
        onSubmit={handleSubmit}
        placeholder="Type your message..."
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