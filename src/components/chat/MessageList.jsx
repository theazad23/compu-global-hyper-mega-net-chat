import React, { useEffect, useRef } from "react";
import { Message } from "./Message";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2, MessageSquare } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const MessageList = ({
  messages,
  format,
  onRetry,
  onEdit,
  isLoading,
  pendingMessageId,
  theme,
}) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollElement = scrollContainerRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const displayMessages = messages.filter(message => {
    if (!pendingMessageId) return true;
    if (message.id === pendingMessageId) return false;
    return true;
  });

  if (displayMessages.length === 0) {
    return (
      <div className={`h-full ${theme?.bgPrimary || ""}`}>
        <EmptyState
          title="Start a Conversation"
          description="Begin by typing a message below"
          icon={MessageSquare}
          theme={theme}
          className="h-full"
        />
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollContainerRef} className="h-full">
      <div className="flex flex-col space-y-4 p-4">
        {displayMessages.map((message, index) => {
          const subsequentMessages = displayMessages.slice(index + 1);
          return (
            <Message
              key={message.id}
              message={message}
              format={format}
              onRetry={onRetry}
              onEdit={onEdit}
              theme={theme}
              isLoading={isLoading}
              isPending={pendingMessageId === message.id}
              previousMessage={index > 0 ? displayMessages[index - 1] : null}
              subsequentMessages={subsequentMessages}
            />
          );
        })}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className={`max-w-[80%] rounded-lg p-4 ${theme?.messageBot || ""}`}>
              <div className="flex items-center gap-2">
                <Loader2 className={`h-4 w-4 animate-spin ${theme?.text || ""}`} />
                <span className={theme?.text || ""}>
                  Assistant is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};