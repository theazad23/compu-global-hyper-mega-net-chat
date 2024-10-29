import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Pencil, Save, X, MessageSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useConversation } from '../../hooks/useConversation';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ConversationDetail = ({
  conversationId,
  onClose,
  onUpdate
}) => {
  const {
    conversation,
    isLoading,
    error,
    loadConversationDetail,
    updateConversation
  } = useConversation();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (conversationId) {
      loadConversationDetail(conversationId);
    }
  }, [conversationId, loadConversationDetail]);

  useEffect(() => {
    if (conversation?.title) {
      setTitle(conversation.title);
    }
  }, [conversation]);

  const handleSave = async () => {
    await updateConversation(conversationId, { title });
    setIsEditing(false);
    onUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!conversation) return null;

  return (
    <Dialog open={!!conversationId} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Conversation title"
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <DialogTitle className="flex items-center gap-2">
                  {conversation.title || 'Untitled Conversation'}
                </DialogTitle>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {conversation.total_messages} messages
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Started {format(new Date(conversation.created_at), 'PPp')}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`
                  rounded-lg p-4
                  ${message.role === 'user' ? 'bg-primary/10' : 'bg-secondary'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium capitalize">{message.role}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), 'pp')}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.metadata && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {message.metadata.type === 'response' && (
                        <>Response generated using {message.metadata.strategy} strategy</>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};