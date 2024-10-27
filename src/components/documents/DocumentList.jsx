import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '../ui/button';
import { Trash2, FileText, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { DocumentSkeleton } from '../common/SkeletonLoader';

export const DocumentList = () => {
  const { 
    documents = [],
    isLoading, 
    error, 
    deleteDocument, 
    refreshDocuments 
  } = useDocuments();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleDelete = async (doc) => {
    setSelectedDoc(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDoc) {
      await deleteDocument(selectedDoc.document_id);
      setDeleteDialogOpen(false);
      setSelectedDoc(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    if (error) {
      return (
        <ErrorMessage 
          message={error}
          onRetry={refreshDocuments}
          className="mt-4"
        />
      );
    }

    if (isLoading) {
      return <DocumentSkeleton />;
    }

    if (!Array.isArray(documents) || documents.length === 0) {
      return (
        <EmptyState
          title="No Documents"
          description="Upload documents to enhance the chat's knowledge."
          icon={Upload}
          actionLabel="Upload Document"
          onAction={() => document.getElementById('upload-trigger')?.click()}
        />
      );
    }

    return (
      <div className="mt-4 space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">
                  {doc.metadata.title || doc.metadata.filename}
                </h3>
                {doc.metadata.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {doc.metadata.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Added {formatDate(doc.added_at)}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(doc)}
              className="flex-shrink-0 ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        <DocumentUpload id="upload-trigger" />
      </div>

      {renderContent()}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{selectedDoc?.metadata?.title || selectedDoc?.metadata?.filename}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};