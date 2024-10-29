import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useConversation = () => {
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadConversationDetail = useCallback(async (conversationId, messageLimit = 50) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getConversationDetail(conversationId, messageLimit);
      setConversation(response);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConversation = useCallback(async (conversationId, { title, metadata }) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.updateConversation(conversationId, { title, metadata });
      // Reload conversation details after update
      await loadConversationDetail(conversationId);
    } catch (err) {
      console.error('Error updating conversation:', err);
      setError('Failed to update conversation');
    } finally {
      setIsLoading(false);
    }
  }, [loadConversationDetail]);

  const continueConversation = useCallback(async (conversationId, message, settings = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.continueConversation(conversationId, {
        question: message,
        ...settings
      });
      // Reload conversation details after new message
      await loadConversationDetail(conversationId);
      return response;
    } catch (err) {
      console.error('Error continuing conversation:', err);
      setError('Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadConversationDetail]);

  return {
    conversation,
    isLoading,
    error,
    loadConversationDetail,
    updateConversation,
    continueConversation
  };
};