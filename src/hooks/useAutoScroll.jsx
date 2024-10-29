import { useEffect, useRef } from 'react';

export const useAutoScroll = (dependencies = []) => {
  const scrollRef = useRef(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (shouldScrollRef.current && scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        const isNearBottom = 
          scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 100;

        if (isNearBottom) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    }
  }, dependencies);

  const handleScroll = (event) => {
    const element = event.currentTarget;
    const isNearBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    shouldScrollRef.current = isNearBottom;
  };

  return { scrollRef, handleScroll };
};