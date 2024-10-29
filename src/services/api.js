const API_BASE_URL = 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred'
    }));
    throw new ApiError(error.message || 'API request failed', response.status);
  }
  const data = await response.json();
  return data;
};

export const api = {
  async createConversation() {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/create`, {
        method: 'POST',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  },

  async getConversations() {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  },

  async getConversation(conversationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  },

  async getConversationDetail(conversationId, messageLimit = 50, beforeTimestamp = null) {
    try {
      const params = new URLSearchParams({
        message_limit: messageLimit.toString()
      });
      if (beforeTimestamp) {
        params.append('before_timestamp', beforeTimestamp);
      }
      const response = await fetch(
        `${API_BASE_URL}/conversation/${conversationId}/detail?${params}`
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Get conversation detail error:', error);
      throw error;
    }
  },

  async updateConversation(conversationId, { title, metadata }) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, metadata })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update conversation error:', error);
      throw error;
    }
  },

  async continueConversation(conversationId, requestBody) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conversation/${conversationId}/continue`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Continue conversation error:', error);
      throw error;
    }
  },

  async deleteConversation(conversationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete conversation error:', error);
      throw error;
    }
  },

  async ask(requestBody) {
    try {
      console.log('Sending request with body:', requestBody);
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Ask question error:', error);
      throw error;
    }
  },

  async uploadDocument(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/document/upload`, {
        method: 'POST',
        body: formData,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  },

  async getDocuments() {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  },

  async deleteDocument(docId) {
    try {
      const response = await fetch(`${API_BASE_URL}/document/${docId}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }
};