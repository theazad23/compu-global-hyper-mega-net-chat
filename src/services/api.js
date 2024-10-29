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
  console.log('Raw API Response:', data);
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
      console.log('Fetching documents...');
      const response = await fetch(`${API_BASE_URL}/documents`);
      const data = await handleResponse(response);
      // Log the structure of the response
      console.log('Response structure:', {
        hasDocuments: 'documents' in data,
        keys: Object.keys(data),
        type: typeof data,
        isArray: Array.isArray(data)
      });
      return data;
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