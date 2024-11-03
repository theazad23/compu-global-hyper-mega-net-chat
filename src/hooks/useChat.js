import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      createNewConversation();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const createNewConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.createConversation();
      setConversationId(response.conversation_id);
      setMessages([]);
      return response.conversation_id;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create new conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConversation = useCallback(async (id) => {
    if (!id) {
      await createNewConversation();
      return;
    }

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
  }, [createNewConversation]);

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
        metadata: response.metadata || {}
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const retryMessage = useCallback(async (messageId, settings = {}) => {
    if (!conversationId) {
      setError('No active conversation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find the message to retry
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) {
        throw new Error('Message not found');
      }

      const message = messages[messageIndex];
      const isUserMessage = message.role === 'user';

      // If retrying a user message, we want to retry their question
      // If retrying an assistant message, we want to retry with the previous user message
      const questionToRetry = isUserMessage
        ? message.content
        : messages[messageIndex - 1]?.content;

      if (!questionToRetry) {
        throw new Error('No question found to retry');
      }

      const response = await api.continueConversation(conversationId, {
        question: questionToRetry,
        strategy: settings.strategy,
        response_format: settings.responseFormat,
        context_mode: settings.contextMode
      });

      // Remove messages after the retried message
      const updatedMessages = messages.slice(0, isUserMessage ? messageIndex : messageIndex - 1);

      // Add the new messages
      if (isUserMessage) {
        updatedMessages.push({
          id: Date.now(),
          role: 'user',
          content: questionToRetry,
          timestamp: new Date().toISOString()
        });
      }

      updatedMessages.push({
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        metadata: response.metadata || {}
      });

      setMessages(updatedMessages);

    } catch (err) {
      console.error('Failed to retry message:', err);
      setError(err.message || 'Failed to retry message');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, messages]);

  const editMessage = useCallback(async (messageId, newContent, preserveHistory = true, settings = {}) => {
    if (!conversationId) {
      setError('No active conversation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) {
        throw new Error('Message not found');
      }

      const message = messages[messageIndex];
      if (message.role !== 'user') {
        throw new Error('Can only edit user messages');
      }

      // Keep messages up to the edited message if preserving history
      // Otherwise, keep only messages before the edited message
      const updatedMessages = preserveHistory
        ? messages.slice(0, messageIndex + 1)
        : messages.slice(0, messageIndex);

      // Add the edited message
      updatedMessages.push({
        id: Date.now(),
        role: 'user',
        content: newContent,
        timestamp: new Date().toISOString()
      });

      // Get new response
      const response = await api.continueConversation(conversationId, {
        question: newContent,
        strategy: settings.strategy,
        response_format: settings.responseFormat,
        context_mode: settings.contextMode
      });

      // Add assistant's response
      updatedMessages.push({
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        metadata: response.metadata || {}
      });

      setMessages(updatedMessages);

    } catch (err) {
      console.error('Failed to edit message:', err);
      setError(err.message || 'Failed to edit message');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
    loadConversation,
    createNewConversation,
    retryMessage,
    editMessage
  };
};