import React, { useState } from 'react';
import { ThemedButton } from '../ui/button';
import { Send } from 'lucide-react';

export const ChatInput = ({ onSend, disabled, theme }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`border-t ${theme.border} ${theme.bgPrimary} p-4`}>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className={`
            flex-1 rounded-md border p-2 
            ${theme.border} ${theme.bgPrimary} ${theme.text}
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <ThemedButton 
          type="submit" 
          disabled={disabled || !message.trim()}
          theme={theme}
        >
          <Send className="h-4 w-4" />
        </ThemedButton>
      </div>
    </form>
  );
};