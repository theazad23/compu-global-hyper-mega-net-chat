import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { 
  MessageSquare, 
  Trash2, 
  Clock,
  Info,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { api } from '../../services/api';

export const ConversationList = ({ 
  onSelectConversation, 
  currentConversationId,
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
      setConversations(Array.isArray(response) ? response : response.conversations || []);
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
      fetchConversations();
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  const getFirstQuestion = (conversation) => {
    if (!conversation.questions_asked || conversation.questions_asked.length === 0) {
      return 'New Conversation';
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
        <button
          onClick={fetchConversations}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${theme.accent} text-white`}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <EmptyState
        title="No Conversations"
        description="Start a new chat to begin"
        icon={MessageSquare}
        className={`${theme.text} ${theme.textMuted}`}
      />
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.conversation_id}
            className={`
              group flex items-center p-3 rounded-lg border
              transition-colors cursor-pointer
              ${currentConversationId === conversation.conversation_id 
                ? `${theme.accent} text-white` 
                : `${theme.bgPrimary} ${theme.border} hover:${theme.bgHover}`
              }
            `}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <MessageSquare className={`h-4 w-4 ${currentConversationId === conversation.conversation_id ? 'text-white' : theme.icon}`} />
                <p className={`text-sm font-medium truncate ${currentConversationId === conversation.conversation_id ? 'text-white' : theme.text}`}>
                  {getFirstQuestion(conversation)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${currentConversationId === conversation.conversation_id ? 'text-white/80' : theme.textMuted}`}>
                  {conversation.total_messages || 0} messages
                </span>
                {conversation.last_interaction && (
                  <span className={`text-xs flex items-center gap-1 ${currentConversationId === conversation.conversation_id ? 'text-white/80' : theme.textMuted}`}>
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(conversation.last_interaction)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className={`p-2 rounded-md ${currentConversationId === conversation.conversation_id ? 'hover:bg-white/20' : theme.buttonHover}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialog({ open: true, conversationId: conversation.conversation_id });
                }}
              >
                <Trash2 className={`h-4 w-4 ${currentConversationId === conversation.conversation_id ? 'text-white' : theme.icon}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
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
              <button
                onClick={() => setDeleteDialog({ open: false, conversationId: null })}
                className={`px-4 py-2 rounded-md border ${theme.border} ${theme.text} hover:${theme.bgHover}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteDialog.conversationId)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};