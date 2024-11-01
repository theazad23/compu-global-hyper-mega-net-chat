import { apiClient } from '../client';

export const chatApi = {
  async createConversation() {
    return apiClient.post('/conversation/create');
  },

  async getConversations() {
    return apiClient.get('/conversations');
  },

  async getConversation(conversationId) {
    return apiClient.get(`/conversation/${conversationId}`);
  },

  async getConversationDetail(conversationId, messageLimit = 50, beforeTimestamp = null) {
    const params = new URLSearchParams({
      message_limit: messageLimit.toString()
    });
    
    if (beforeTimestamp) {
      params.append('before_timestamp', beforeTimestamp);
    }
    
    return apiClient.get(`/conversation/${conversationId}/detail?${params}`);
  },

  async updateConversation(conversationId, { title, metadata }) {
    return apiClient.patch(`/conversation/${conversationId}`, { title, metadata });
  },

  async continueConversation(conversationId, { question, strategy, responseFormat, contextMode }) {
    return apiClient.post(`/conversation/${conversationId}/continue`, {
      question,
      strategy,
      response_format: responseFormat,
      context_mode: contextMode
    });
  },

  async deleteConversation(conversationId) {
    return apiClient.delete(`/conversation/${conversationId}`);
  }
};