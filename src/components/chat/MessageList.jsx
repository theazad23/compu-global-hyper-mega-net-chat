import React from 'react';
import { Message } from './Message';

export const MessageList = ({ messages, format }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message}
          format={format}
        />
      ))}
    </div>
  );
};