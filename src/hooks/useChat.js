import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const createNewConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.createConversation();
      setConversationId(response.conversation_id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create new conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConversation = useCallback(async (id) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getConversationDetail(id);
      setConversationId(id);
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message, settings = {}) => {
    if (!conversationId) {
      setError('No active conversation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await api.continueConversation(conversationId, {
        question: message,
        strategy: settings.strategy,
        response_format: settings.responseFormat,
        context_mode: settings.contextMode
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        sources: response.sources || []
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
    loadConversation,
    createNewConversation
  };
};
