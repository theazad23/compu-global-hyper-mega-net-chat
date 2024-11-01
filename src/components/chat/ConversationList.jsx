import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { 
  MessageSquare, 
  Trash2, 
  Clock,
  RefreshCw,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';

export const ConversationList = ({ 
  onSelectConversation, 
  currentConversationId,
  onNewChat,
  theme 
}) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, conversationId: null });

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getConversations();
      const convList = Array.isArray(response) ? response : response.conversations || [];
      setConversations(convList.map(getConversationItem));
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = async (conversationId) => {
    try {
      await api.deleteConversation(conversationId);
      setDeleteDialog({ open: false, conversationId: null });
      await fetchConversations();
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
    }
  };

  const getConversationItem = (conversation) => {
    // Calculate total messages by counting questions and responses
    const questionsCount = Array.isArray(conversation.questions_asked) 
      ? conversation.questions_asked.length 
      : 0;
    
    const responsesCount = Array.isArray(conversation.responses) 
      ? conversation.responses.length 
      : 0;

    // If we have messages array, use its length
    const messagesCount = Array.isArray(conversation.messages) 
      ? conversation.messages.length 
      : 0;

    // Use the most reliable count available
    const total_messages = messagesCount > 0 
      ? messagesCount 
      : (questionsCount + responsesCount) || conversation.total_messages || 0;

    return {
      ...conversation,
      total_messages,
      // Ensure questions_asked is always an array
      questions_asked: Array.isArray(conversation.questions_asked) 
        ? conversation.questions_asked 
        : []
    };
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  const getFirstQuestion = (conversation) => {
    if (!conversation.questions_asked || conversation.questions_asked.length === 0) {
      return conversation.title || 'New Conversation';
    }
    const question = conversation.questions_asked[0];
    return question.length > 50 ? `${question.substring(0, 50)}...` : question;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${theme.text}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-full p-8 ${theme.text}`}>
        <p className="text-sm text-destructive mb-4">{error}</p>
        <Button
          onClick={fetchConversations}
          className={`flex items-center gap-2 ${theme.accent} text-white`}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Button
        onClick={onNewChat}
        className={`mb-4 w-full ${theme.accent} text-white flex items-center gap-2 justify-center`}
      >
        <Plus className="h-4 w-4" />
        New Chat
      </Button>

      {!conversations.length ? (
        <EmptyState
          title="No Conversations"
          description="Start a new chat to begin"
          icon={MessageSquare}
          theme={theme}
        />
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                className={`
                  group flex items-center justify-between p-3 rounded-lg border
                  transition-colors cursor-pointer
                  ${currentConversationId === conversation.conversation_id 
                    ? `${theme.accent} text-white` 
                    : `${theme.bgPrimary} ${theme.border} hover:${theme.bgHover}`
                  }
                `}
              >
                <div 
                  className="min-w-0 flex-1"
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare 
                      className={`h-4 w-4 ${
                        currentConversationId === conversation.conversation_id 
                          ? 'text-white' 
                          : theme.icon
                      }`} 
                    />
                    <p className={`text-sm font-medium truncate ${
                      currentConversationId === conversation.conversation_id 
                        ? 'text-white' 
                        : theme.text
                    }`}>
                      {getFirstQuestion(conversation)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${
                      currentConversationId === conversation.conversation_id 
                        ? 'text-white/80' 
                        : theme.textMuted
                    }`}>
                      {conversation.total_messages} messages
                    </span>
                    {conversation.last_interaction && (
                      <span className={`text-xs flex items-center gap-1 ${
                        currentConversationId === conversation.conversation_id 
                          ? 'text-white/80' 
                          : theme.textMuted
                      }`}>
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(conversation.last_interaction)}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({ 
                      open: true, 
                      conversationId: conversation.conversation_id 
                    });
                  }}
                  className={`
                    flex-shrink-0 opacity-0 group-hover:opacity-100 
                    text-destructive hover:text-destructive 
                    hover:bg-destructive/10 transition-opacity
                  `}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ open, conversationId: null })}
      >
        <DialogContent className={`${theme.bgPrimary} ${theme.border}`}>
          <DialogHeader>
            <DialogTitle className={theme.text}>Delete Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className={`text-sm ${theme.textMuted}`}>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, conversationId: null })}
                className={`${theme.border} ${theme.text}`}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteDialog.conversationId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
