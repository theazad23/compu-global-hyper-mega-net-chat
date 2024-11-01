import React from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { RESPONSE_FORMATS } from './constants';

// Helper to determine if text is code block
const isCodeBlock = (text) => {
  return text.startsWith('```') && text.endsWith('```');
};

// Helper to extract language from code block
const getCodeLanguage = (text) => {
  const firstLine = text.split('\n')[0];
  return firstLine.slice(3).trim();
};

// Helper to format code blocks
const formatCodeBlock = (text) => {
  const language = getCodeLanguage(text);
  const code = text
    .split('\n')
    .slice(1, -1)
    .join('\n');
  
  return {
    type: 'code',
    language,
    content: code
  };
};

// Process text content into structured blocks
const processContent = (text) => {
  const blocks = [];
  let currentBlock = '';
  let inCodeBlock = false;
  
  text.split('\n').forEach(line => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        currentBlock += line + '\n';
        blocks.push(formatCodeBlock(currentBlock));
        currentBlock = '';
        inCodeBlock = false;
      } else {
        // Start code block
        if (currentBlock) {
          blocks.push({
            type: 'text',
            content: currentBlock.trim()
          });
        }
        currentBlock = line + '\n';
        inCodeBlock = true;
      }
    } else {
      currentBlock += line + '\n';
    }
  });

  // Add any remaining content
  if (currentBlock) {
    blocks.push({
      type: inCodeBlock ? 'code' : 'text',
      content: currentBlock.trim()
    });
  }

  return blocks;
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
};

const MarkdownContent = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-none"
      components={{
        // Custom component overrides can be added here
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        code: ({ inline, className, children }) => {
          if (inline) {
            return <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>;
          }
          return (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className={className}>{children}</code>
            </pre>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export const formatResponse = (response, format = RESPONSE_FORMATS.MARKDOWN) => {
  if (!response) return null;

  // Handle different response formats
  switch (format) {
    case RESPONSE_FORMATS.CODE:
      return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{response}</code>
        </pre>
      );

    case RESPONSE_FORMATS.MARKDOWN:
      const blocks = processContent(response);
      
      return (
        <div className="space-y-4">
          {blocks.map((block, index) => {
            if (block.type === 'code') {
              return (
                <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className={`language-${block.language}`}>{block.content}</code>
                </pre>
              );
            }
            return <MarkdownContent key={index} content={block.content} />;
          })}
        </div>
      );

    case RESPONSE_FORMATS.PLAIN:
    default:
      return <div className="whitespace-pre-wrap">{response}</div>;
  }
};