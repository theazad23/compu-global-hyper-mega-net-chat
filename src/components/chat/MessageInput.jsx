import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send } from 'lucide-react';

export const MessageInput = ({ onSend, disabled, theme }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
      <Button 
        type="submit" 
        disabled={disabled || !message.trim()}
        className={`${theme.accent} ${theme.accentHover} text-white px-4 py-2 rounded-md`}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};