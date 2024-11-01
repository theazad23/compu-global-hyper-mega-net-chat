class ApiError extends Error {
    constructor(message, status, data = null) {
      super(message);
      this.status = status;
      this.data = data;
      this.name = 'ApiError';
    }
  }
  
  class ApiClient {
    constructor(baseURL) {
      this.baseURL = baseURL;
    }
  
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
  
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });
  
        if (!response.ok) {
          const error = await response.json().catch(() => ({
            message: 'An unknown error occurred'
          }));
          
          throw new ApiError(
            error.message || `HTTP Error: ${response.status}`,
            response.status,
            error
          );
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
  
        throw new ApiError(
          error.message || 'Network error occurred',
          0
        );
      }
    }
  
    async get(endpoint, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'GET',
      });
    }
  
    async post(endpoint, data, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async put(endpoint, data, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  
    async patch(endpoint, data, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }
  
    async delete(endpoint, options = {}) {
      return this.request(endpoint, {
        ...options,
        method: 'DELETE',
      });
    }
  }
  
  export const apiClient = new ApiClient(process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000');