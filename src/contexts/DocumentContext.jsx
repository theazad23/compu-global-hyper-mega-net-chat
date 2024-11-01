import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { documentApi } from '../api/endpoints/documents';

const DocumentContext = createContext(null);

const initialState = {
  documents: [],
  isLoading: false,
  error: null,
  uploadProgress: null
};

const documentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload, isLoading: false };
    case 'ADD_DOCUMENT':
      return { 
        ...state, 
        documents: [...state.documents, action.payload],
        isLoading: false 
      };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        isLoading: false
      };
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const documents = await documentApi.getDocuments();
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const uploadDocument = useCallback(async (file, metadata) => {
    setLoading(true);
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 });
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const document = await documentApi.uploadDocument(formData, (progress) => {
        dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
      });

      dispatch({ type: 'ADD_DOCUMENT', payload: document });
      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: null });
      return document;
    } catch (error) {
      setError(error.message);
      dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: null });
      throw error;
    }
  }, [setLoading, setError]);

  const deleteDocument = useCallback(async (documentId) => {
    setLoading(true);
    try {
      await documentApi.deleteDocument(documentId);
      dispatch({ type: 'REMOVE_DOCUMENT', payload: documentId });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const value = {
    ...state,
    fetchDocuments,
    uploadDocument,
    deleteDocument
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};