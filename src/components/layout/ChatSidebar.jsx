import React, { useEffect, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useChat } from '../../contexts/ChatContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageSquare, Trash2, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ThemedButton } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { handleError } from '../../lib/errorHandling';
import { useSafeState } from '../../hooks/useSafeState';
import { cn } from '../../lib/utils';

export const ChatSidebar = () => {
  const { theme } = useTheme();
  const { 
    conversations,
    currentConversationId,
    loadConversations,
    deleteConversation,
    createNewConversation,
    isLoading
  } = useChat();
  
  const [deleteDialog, setDeleteDialog] = useSafeState({
    open: false,
    conversationId: null
  });

  useEffect(() => {
    loadConversations().catch(error => 
      handleError(error, { 
        context: 'ChatSidebar.loadConversations',
        silent: false 
      })
    );
  }, [loadConversations]);

  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: conversations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5
  });

  const handleDelete = async (conversationId) => {
    try {
      await deleteConversation(conversationId);
      setDeleteDialog({ open: false, conversationId: null });
    } catch (error) {
      handleError(error, {
        context: 'ChatSidebar.handleDelete',
        silent: false
      });
    }
  };

  const getFirstQuestion = useMemo(() => (conversation) => {
    if (!conversation.questions_asked?.length) {
      return conversation.title || 'New Conversation';
    }
    const question = conversation.questions_asked[0];
    return question.length > 50 ? `${question.substring(0, 50)}...` : question;
  }, []);

  if (isLoading && !conversations.length) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`
              h-20 rounded-lg animate-pulse
              ${theme.bgSecondary}
            `}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <ThemedButton
        onClick={createNewConversation}
        className="mb-4 w-full gap-2"
        theme={theme}
      >
        <Plus className="h-4 w-4" />
        New Chat
      </ThemedButton>

      <ScrollArea ref={parentRef} className="flex-1 -mx-4">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const conversation = conversations[virtualRow.index];
            return (
              <div
                key={conversation.conversation_id}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`
                }}
                className="px-4"
              >
                <div
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-lg border",
                    "transition-colors duration-200 cursor-pointer",
                    currentConversationId === conversation.conversation_id
                      ? `${theme.accent} text-white`
                      : `${theme.bgPrimary} ${theme.border} hover:${theme.bgHover}`
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className={cn(
                        "h-4 w-4",
                        currentConversationId === conversation.conversation_id
                          ? "text-white"
                          : theme.icon
                      )} />
                      <p className={cn(
                        "text-sm font-medium truncate",
                        currentConversationId === conversation.conversation_id
                          ? "text-white"
                          : theme.text
                      )}>
                        {getFirstQuestion(conversation)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-xs",
                        currentConversationId === conversation.conversation_id
                          ? "text-white/80"
                          : theme.textMuted
                      )}>
                        {conversation.total_messages} messages
                      </span>
                      {conversation.last_interaction && (
                        <span className={cn(
                          "text-xs flex items-center gap-1",
                          currentConversationId === conversation.conversation_id
                            ? "text-white/80"
                            : theme.textMuted
                        )}>
                          <Clock className="h-3 w-3" />
                          {format(new Date(conversation.last_interaction), 'PPp')}
                        </span>
                      )}
                    </div>
                  </div>

                  <ThemedButton
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDialog({
                        open: true,
                        conversationId: conversation.conversation_id
                      });
                    }}
                    className={cn(
                      "flex-shrink-0 opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-200",
                      "text-destructive hover:text-destructive",
                      "hover:bg-destructive/10"
                    )}
                    theme={theme}
                  >
                    <Trash2 className="h-4 w-4" />
                  </ThemedButton>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        onConfirm={() => handleDelete(deleteDialog.conversationId)}
        theme={theme}
      />
    </div>
  );
};