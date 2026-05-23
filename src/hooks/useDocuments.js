import { useState, useCallback, useEffect } from 'react';
import documentService from '../api/documentService';

/**
 * Custom hook for managing document state via API.
 */
export default function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const data = await documentService.getAllDocuments();
        setDocuments(data);
        if (data.length > 0) setActiveDoc(data[0]);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const addDocument = useCallback(async (newDocData) => {
    try {
      const addedDoc = await documentService.addDocument(newDocData);
      setDocuments((prev) => [addedDoc, ...prev]);
      setActiveDoc(addedDoc);
      return addedDoc;
    } catch (error) {
      console.error("Failed to add document:", error);
      throw error;
    }
  }, []);

  const removeDocument = useCallback(async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setActiveDoc((current) => (current?.id === id ? null : current));
    } catch (error) {
      console.error("Failed to delete document:", error);
      throw error;
    }
  }, []);

  const selectActiveDoc = useCallback((doc) => {
    setActiveDoc(doc);
  }, []);

  return {
    documents,
    activeDoc,
    isLoading,
    addDocument,
    removeDocument,
    selectActiveDoc,
  };
}
