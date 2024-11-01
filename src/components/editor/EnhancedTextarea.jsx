import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const EnhancedTextarea = ({ 
  value, 
  onChange, 
  placeholder = "Type your message...", 
  disabled = false,
  className,
  theme,
  onSubmit
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleKeyDown = (e) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '  '; // 2 spaces for indentation
      
      // Update the text value with indentation
      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);
      
      // Move cursor after indentation
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    
    // Handle enter with shift for new line, enter alone for submit
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit?.();
      }
    }
  };

  const handleCopy = async (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 flex gap-2">
        {value && (
          <button
            onClick={handleCopy}
            type="button" // Explicitly set button type to prevent form submission
            className={cn(
              "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              theme?.textMuted
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full min-h-[100px] p-3 rounded-lg font-mono text-sm resize-none",
          "border focus:outline-none focus:ring-2 focus:ring-blue-500",
          "placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700",
          "pr-20", // Space for the copy button
          theme?.bgPrimary,
          theme?.border,
          theme?.text,
          className
        )}
        style={{
          lineHeight: '1.5',
          tabSize: 2,
        }}
      />
      
      <div className={cn(
        "text-xs mt-2",
        theme?.textMuted
      )}>
        <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 mr-1">Shift + Enter</kbd>
        for new line,
        <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 mx-1">Enter</kbd>
        to send,
        <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 mx-1">Tab</kbd>
        to indent
      </div>
    </div>
  );
};

export default EnhancedTextarea;