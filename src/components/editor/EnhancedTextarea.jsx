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
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '  ';
      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit?.();
      }
    }
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative space-y-2">
      {/* Main textarea container */}
      <div className={cn(
        "relative group rounded-xl transition-all duration-200",
        theme?.bgSecondary,
        theme?.border,
        "focus-within:ring-2 focus-within:ring-opacity-50",
        "focus-within:ring-blue-500/20",
      )}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full min-h-[100px] p-4 rounded-xl",
            "font-mono text-sm resize-none",
            "bg-transparent border-0",
            "focus:outline-none focus:ring-0",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700",
            theme?.text,
            className
          )}
          style={{
            lineHeight: '1.5',
            tabSize: 2,
          }}
        />

        {/* Copy button - only show when there's content */}
        {value && (
          <button
            onClick={handleCopy}
            type="button"
            className={cn(
              "absolute top-3 right-3",
              "p-1.5 rounded-lg",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-200",
              theme?.bgPrimary,
              theme?.border,
              `hover:${theme?.bgHover}`,
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

      {/* Keyboard shortcuts - more subtle styling */}
      <div className={cn(
        "flex items-center gap-2 px-1",
        "text-xs",
        theme?.textMuted
      )}>
        <div className="flex items-center gap-1">
          <kbd className={cn(
            "px-1.5 py-0.5 rounded-md text-[10px]",
            theme?.bgSecondary,
            theme?.border
          )}>Shift + Enter</kbd>
          <span>new line</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className={cn(
            "px-1.5 py-0.5 rounded-md text-[10px]",
            theme?.bgSecondary,
            theme?.border
          )}>Enter</kbd>
          <span>send</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className={cn(
            "px-1.5 py-0.5 rounded-md text-[10px]",
            theme?.bgSecondary,
            theme?.border
          )}>Tab</kbd>
          <span>indent</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTextarea;