import { apiClient } from '../client';

export const documentApi = {
  async getDocuments() {
    return apiClient.get('/documents');
  },

  async uploadDocument(formData, onProgress) {
    return apiClient.request('/document/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header - browser will set it with boundary
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      } : undefined
    });
  },

  async deleteDocument(documentId) {
    return apiClient.delete(`/document/${documentId}`);
  },

  async getDocumentMetadata(documentId) {
    return apiClient.get(`/document/${documentId}/metadata`);
  },

  async updateDocumentMetadata(documentId, metadata) {
    return apiClient.patch(`/document/${documentId}/metadata`, metadata);
  }
};