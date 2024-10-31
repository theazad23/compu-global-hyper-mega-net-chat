import { useEffect, useRef, useState, useCallback } from 'react';

export const useAutoScroll = ({
  enabled = true,
  threshold = 100,
  smoothness = 300,
  dependencies = []
}) => {
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  // Get the scrollable element
  const getScrollElement = useCallback(() => {
    if (!scrollRef.current) return null;
    return scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') || scrollRef.current;
  }, []);

  // Check if element is near bottom
  const checkIfNearBottom = useCallback(() => {
    const element = getScrollElement();
    if (!element) return false;
    
    const { scrollHeight, scrollTop, clientHeight } = element;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Handle scroll events
  const handleScroll = useCallback((event) => {
    if (!enabled) return;

    const element = event.target;
    const { scrollHeight, scrollTop, clientHeight } = element;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const nearBottom = distanceFromBottom <= threshold;

    setIsNearBottom(nearBottom);
    setAutoScroll(nearBottom);
    setUserHasScrolled(true);
  }, [enabled, threshold]);

  // Scroll to bottom implementation
  const scrollToBottom = useCallback((force = false) => {
    const element = getScrollElement();
    if (!element || (!force && !autoScroll)) return;

    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: smoothness > 0 ? 'smooth' : 'auto'
      });
    });
  }, [autoScroll, smoothness, getScrollElement]);

  // Handle automatic scrolling when dependencies change
  useEffect(() => {
    if (!enabled) return;

    // If this is the first load (user hasn't scrolled yet)
    // or if we're near the bottom, scroll down
    if (!userHasScrolled || isNearBottom) {
      scrollToBottom(true);
    }
  }, [...dependencies, enabled]);

  // Reset user scroll state when conversation changes
  useEffect(() => {
    setUserHasScrolled(false);
    setAutoScroll(true);
    setIsNearBottom(true);
  }, [dependencies[0]]); // Assuming first dependency is conversation ID or messages array

  const toggleAutoScroll = useCallback(() => {
    setAutoScroll(prev => !prev);
  }, []);

  return {
    scrollRef,
    handleScroll,
    scrollToBottom,
    toggleAutoScroll,
    isAutoScrollEnabled: autoScroll,
    isNearBottom,
    userHasScrolled
  };
};