import React, { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { 
  MessageSquare, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Info,
  Clock,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { EmptyState } from '../common/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConversationDetail } from './ConversationDetail';

const ITEMS_PER_PAGE = 10;

export const ConversationList = ({ onSelectConversation, currentConversationId }) => {
  // Basic state
  const [conversations, setConversations] = useState([]);
  const [metadata, setMetadata] = useState({
    total: 0,
    returned: 0,
    offset: 0,
    limit: ITEMS_PER_PAGE
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, conversationId: null });
  const [viewingConversation, setViewingConversation] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'last_interaction',
    order: 'desc'
  });

  // Auto-refresh setup
  useEffect(() => {
    const interval = setInterval(() => {
      if (!deleteDialog.open && !viewingConversation) {
        fetchConversations(metadata.offset);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [metadata.offset, deleteDialog.open, viewingConversation]);

  const fetchConversations = async (offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getConversations({
        limit: ITEMS_PER_PAGE,
        offset,
        sortBy: sortConfig.sortBy,
        order: sortConfig.order
      });
      
      setConversations(response.conversations);
      setMetadata(response.metadata);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [sortConfig]);

  const handleDelete = async (conversationId) => {
    try {
      await api.deleteConversation(conversationId);
      setDeleteDialog({ open: false, conversationId: null });
      fetchConversations(metadata.offset);
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
    }
  };

  const handlePageChange = (newOffset) => {
    fetchConversations(newOffset);
  };

  const handleSortChange = (field) => {
    setSortConfig(prev => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (err) {
      console.error('Error formatting timestamp:', err);
      return timestamp;
    }
  };

  const getFirstQuestion = (conversation) => {
    if (!conversation.questions_asked || conversation.questions_asked.length === 0) {
      return 'New Conversation';
    }
    const question = conversation.questions_asked[0];
    return question.length > 50 ? `${question.substring(0, 50)}...` : question;
  };

  if (isLoading && !conversations.length) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-sm text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchConversations()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <EmptyState
        title="No Conversations"
        description="Start a new chat to begin"
        icon={MessageSquare}
        className="h-full"
      />
    );
  }

  const totalPages = Math.ceil(metadata.total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(metadata.offset / ITEMS_PER_PAGE) + 1;

  return (
    <div className="h-full flex flex-col">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${sortConfig.sortBy === 'last_interaction' ? 'bg-secondary' : ''}`}
          onClick={() => handleSortChange('last_interaction')}
        >
          Last Active
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${sortConfig.sortBy === 'total_interactions' ? 'bg-secondary' : ''}`}
          onClick={() => handleSortChange('total_interactions')}
        >
          Most Active
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.conversation_id}
              className={`
                group flex items-center p-2 rounded-lg border hover:bg-secondary/50 
                transition-colors
                ${currentConversationId === conversation.conversation_id ? 'border-primary bg-secondary' : 'border-transparent'}
              `}
            >
              <div 
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => onSelectConversation?.(conversation)}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm font-medium truncate">
                    {getFirstQuestion(conversation)}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {conversation.total_interactions || 0} messages
                  </span>
                  {conversation.last_interaction && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(conversation.last_interaction)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="View Details"
                  onClick={() => setViewingConversation(conversation.conversation_id)}
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({ 
                      open: true, 
                      conversationId: conversation.conversation_id 
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t mt-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(metadata.offset - ITEMS_PER_PAGE)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(metadata.offset + ITEMS_PER_PAGE)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ open, conversationId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, conversationId: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteDialog.conversationId && handleDelete(deleteDialog.conversationId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conversation Detail Dialog */}
      <ConversationDetail
        conversationId={viewingConversation}
        onClose={() => setViewingConversation(null)}
        onUpdate={() => fetchConversations(metadata.offset)}
      />
    </div>
  );
};