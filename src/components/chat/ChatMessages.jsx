import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTheme } from '../../contexts/ThemeContext';
import { Message } from './Message';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronDown } from 'lucide-react';

export const ChatMessages = ({ messages }) => {
  const { theme } = useTheme();
  const parentRef = useRef(null);
  
  const { 
    scrollRef,
    handleScroll,
    scrollToBottom,
    isAutoScrollEnabled,
    userHasScrolled
  } = useAutoScroll({
    dependencies: [messages.length],
    threshold: 150,
    smoothness: 300
  });

  // Create virtual rows for messages
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height
    overscan: 5 // Number of items to render outside of view
  });

  // Memoize virtual items to prevent unnecessary re-renders
  const virtualItems = useMemo(() => 
    rowVirtualizer.getVirtualItems(),
    [messages.length, rowVirtualizer]
  );

  return (
    <div className="relative h-full" ref={scrollRef}>
      <ScrollArea 
        ref={parentRef}
        className="h-full"
        onScrollCapture={handleScroll}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {virtualItems.map(virtualRow => {
            const message = messages[virtualRow.index];
            return (
              <div
                key={message.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <Message message={message} />
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {userHasScrolled && !isAutoScrollEnabled && messages.length > 0 && (
        <button
          onClick={() => scrollToBottom(true)}
          className={`
            absolute bottom-4 right-4
            p-2 rounded-full
            ${theme.bgPrimary} ${theme.border}
            hover:${theme.bgHover} 
            transition-all transform
            shadow-lg
            flex items-center gap-2
            z-10
          `}
        >
          <ChevronDown className={`h-4 w-4 ${theme.icon}`} />
        </button>
      )}
    </div>
  );
};