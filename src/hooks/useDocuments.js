import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getDocuments();
      console.log('Raw response in hook:', response); // Log the raw response

      // Handle different possible response structures
      let docs = [];
      if (Array.isArray(response)) {
        docs = response;
      } else if (response.documents && Array.isArray(response.documents)) {
        docs = response.documents;
      } else if (typeof response === 'object' && response !== null) {
        // If response is an object but not in expected format,
        // try to convert it to an array
        docs = Object.values(response);
      }

      console.log('Processed documents:', docs); // Log the processed documents
      setDocuments(docs);
    } catch (err) {
      console.error('Error in fetchDocuments:', err);
      setError('Failed to fetch documents');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.uploadDocument(formData);
      await fetchDocuments();
    } catch (err) {
      setError('Failed to upload document');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (docId) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.deleteDocument(docId);
      await fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments,
  };
};