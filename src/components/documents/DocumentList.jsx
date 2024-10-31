import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2, FileText, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../shared/EmptyState';
import { DocumentSkeleton } from '../common/SkeletonLoader.jsx';

export const DocumentList = ({ theme }) => {
  const { 
    documents = [],
    isLoading, 
    error, 
    deleteDocument, 
    refreshDocuments 
  } = useDocuments();

  const [deleteDialog, setDeleteDialog] = useState({ open: false, documentId: null });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <DocumentSkeleton />;

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={refreshDocuments}
        className="mt-4"
      />
    );
  }

  if (!documents.length) {
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-none">
        <h2 className={`text-lg font-semibold ${theme.text}`}>Documents</h2>
        <DocumentUpload id="upload-trigger" theme={theme} />
      </div>

      {/* Document List */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className={`
                flex items-center justify-between p-4 rounded-lg
                border transition-colors
                ${theme.bgPrimary} ${theme.border}
                hover:border-primary/50
              `}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileText className={`h-5 w-5 ${theme.icon} flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <h3 className={`font-medium text-sm truncate ${theme.text}`}>
                    {doc.metadata.title || doc.metadata.filename}
                  </h3>
                  {doc.metadata.description && (
                    <p className={`text-sm ${theme.textMuted} truncate`}>
                      {doc.metadata.description}
                    </p>
                  )}
                  <p className={`text-xs ${theme.textMuted} mt-1`}>
                    Added {formatDate(doc.added_at)}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteDialog({ 
                  open: true, 
                  documentId: doc.document_id 
                })}
                className={`
                  flex-shrink-0 ml-2 text-destructive 
                  hover:text-destructive hover:bg-destructive/10
                `}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Delete Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ open, documentId: null })}
      >
        <DialogContent className={`${theme.bgPrimary} ${theme.border}`}>
          <DialogHeader>
            <DialogTitle className={theme.text}>Delete Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className={`text-sm ${theme.textMuted}`}>
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, documentId: null })}
                className={`${theme.border} ${theme.text}`}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteDialog.documentId && deleteDocument(deleteDialog.documentId);
                  setDeleteDialog({ open: false, documentId: null });
                }}
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