import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";

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
      console.error("Failed to create conversation:", err);
      setError("Failed to create new conversation");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConversation = useCallback(
    async (id) => {
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
        console.error("Failed to load conversation:", err);
        setError("Failed to load conversation");
      } finally {
        setIsLoading(false);
      }
    },
    [createNewConversation]
  );

  const sendMessage = useCallback(
    async (message, settings = {}) => {
      if (!conversationId) {
        setError("No active conversation");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const userMessage = {
          id: Date.now(),
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const response = await api.continueConversation(conversationId, {
          question: message,
          strategy: settings.strategy,
          response_format: settings.responseFormat,
          context_mode: settings.contextMode,
        });

        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.response,
          timestamp: new Date().toISOString(),
          metadata: response.metadata || {},
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error("Failed to send message:", err);
        setError(err.message || "Failed to send message");
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  const retryMessage = useCallback(async (messageId, content, preserveHistory = true, settings = {}) => {
      if (!conversationId) {
        setError("No active conversation");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const messageIndex = messages.findIndex((m) => m.id === messageId);
        if (messageIndex === -1) {
          throw new Error("Message not found");
        }

        const message = messages[messageIndex];
        const isUserMessage = message.role === "user";

        const questionToRetry = isUserMessage
          ? content
          : messages[messageIndex - 1]?.content;

        if (!questionToRetry) {
          throw new Error("No question found to retry");
        }

        const response = await api.continueConversation(conversationId, {
          question: questionToRetry,
          strategy: settings.strategy,
          response_format: settings.responseFormat,
          context_mode: settings.contextMode,
        });

        const updatedMessages = [...messages];
        if (isUserMessage) {
          if (messageIndex + 1 < messages.length) {
            updatedMessages[messageIndex + 1] = {
              ...updatedMessages[messageIndex + 1],
              content: response.response,
              timestamp: new Date().toISOString(),
              metadata: response.metadata || {},
            };
          }
        } else {
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            content: response.response,
            timestamp: new Date().toISOString(),
            metadata: response.metadata || {},
          };
        }

        setMessages(updatedMessages);
      } catch (err) {
        console.error("Failed to retry message:", err);
        setError(err.message || "Failed to retry message");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, messages]
  );

  const editMessage = useCallback(
    async (messageId, newContent, preserveHistory = true, settings = {}) => {
      if (!conversationId) {
        setError("No active conversation");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const messageIndex = messages.findIndex((m) => m.id === messageId);
        if (messageIndex === -1) {
          throw new Error("Message not found");
        }

        const updatedMessages = preserveHistory
          ? messages.slice(0, messageIndex + 1)
          : messages.slice(0, messageIndex);

        const response = await api.continueConversation(conversationId, {
          question: newContent,
          strategy: settings.strategy,
          response_format: settings.responseFormat,
          context_mode: settings.contextMode,
        });

        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.response,
          timestamp: new Date().toISOString(),
          metadata: response.metadata || {},
        };

        setMessages([...updatedMessages, assistantMessage]);
      } catch (err) {
        console.error("Failed to edit message:", err);
        setError(err.message || "Failed to edit message");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, messages]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
    loadConversation,
    createNewConversation,
    retryMessage,
    editMessage,
    setMessages,
  };
};