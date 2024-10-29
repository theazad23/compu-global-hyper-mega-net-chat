import React from 'react';
import { RESPONSE_FORMATS } from './constants';

export const formatResponse = (content, format) => {
  switch (format) {
    case RESPONSE_FORMATS.JSON:
      try {
        const jsonData = typeof content === 'string' ? JSON.parse(content) : content;
        return (
          <pre className="bg-secondary p-3 rounded-md overflow-x-auto">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        );
      } catch (err) {
        console.error('Failed to parse JSON response:', err);
        return <p className="whitespace-pre-wrap">{content}</p>;
      }
    
    case RESPONSE_FORMATS.MARKDOWN:
      return (
        <div className="prose prose-sm max-w-none">
          {content}
        </div>
      );
    
    case RESPONSE_FORMATS.BULLET_POINTS:
      return (
        <ul className="list-disc pl-4 space-y-2">
          {content.split('\n').map((item, index) => (
            <li key={index}>{item.replace(/^[•-]\s*/, '')}</li>
          ))}
        </ul>
      );
    
    default:
      return <p className="whitespace-pre-wrap">{content}</p>;
  }
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};
