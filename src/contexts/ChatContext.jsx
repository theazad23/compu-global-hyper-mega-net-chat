import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { chatApi } from '../api/endpoints/chat';

const ChatContext = createContext(null);

const initialState = {
  messages: [],
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, isLoading: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload, isLoading: false };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversationId: action.payload };
    case 'CLEAR_CHAT':
      return { ...state, messages: [], currentConversationId: null };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const createNewConversation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await chatApi.createConversation();
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: response.conversation_id });
      dispatch({ type: 'SET_MESSAGES', payload: [] });
      return response.conversation_id;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const loadConversation = useCallback(async (conversationId) => {
    if (!conversationId) {
      return createNewConversation();
    }

    setLoading(true);
    try {
      const response = await chatApi.getConversationDetail(conversationId);
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationId });
      dispatch({ type: 'SET_MESSAGES', payload: response.messages || [] });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError, createNewConversation]);

  const sendMessage = useCallback(async (message, settings = {}) => {
    if (!state.currentConversationId) {
      throw new Error('No active conversation');
    }

    setLoading(true);
    try {
      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Send to API
      const response = await chatApi.continueConversation(
        state.currentConversationId,
        {
          question: message,
          ...settings
        }
      );

      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        sources: response.sources || []
      };
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [state.currentConversationId, setLoading, setError]);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await chatApi.getConversations();
      const conversations = Array.isArray(response) ? response : response.conversations || [];
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const deleteConversation = useCallback(async (conversationId) => {
    setLoading(true);
    try {
      await chatApi.deleteConversation(conversationId);
      await loadConversations();
      if (state.currentConversationId === conversationId) {
        dispatch({ type: 'CLEAR_CHAT' });
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [state.currentConversationId, setLoading, setError, loadConversations]);

  const value = {
    ...state,
    sendMessage,
    createNewConversation,
    loadConversation,
    loadConversations,
    deleteConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};