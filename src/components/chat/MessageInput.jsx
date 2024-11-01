import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import EnhancedTextarea from '../editor/EnhancedTextarea';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <EnhancedTextarea
        value={message}
        onChange={setMessage}
        disabled={disabled}
        theme={theme}
        onSubmit={handleSubmit}
        placeholder="Type your message..."
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