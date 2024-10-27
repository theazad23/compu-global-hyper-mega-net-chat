import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  // Initialize conversation when the chat is first loaded
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await api.createConversation();
        console.log('Initialized conversation:', response);
        setConversationId(response.conversation_id);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to initialize chat');
      }
    };

    if (!conversationId) {
      initializeChat();
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (message, settings = {}) => {
    if (!conversationId) {
      setError('Chat not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message with conversationId:', conversationId);
      
      // Add user message to UI immediately
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send message to API
      const response = await api.ask(message, conversationId, settings);
      console.log('API response:', response);
      
      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Optional: Persist conversation ID to localStorage
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('chatConversationId', conversationId);
    }
  }, [conversationId]);

  // Optional: Restore conversation ID from localStorage
  useEffect(() => {
    const savedConversationId = localStorage.getItem('chatConversationId');
    if (savedConversationId && !conversationId) {
      setConversationId(savedConversationId);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
  };
};