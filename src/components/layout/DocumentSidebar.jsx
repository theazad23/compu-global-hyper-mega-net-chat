import React, { useEffect } from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FileUpload } from '../common/FileUpload';
import { FileCard } from '../common/FileCard';
import { ScrollArea } from '../ui/scroll-area';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { handleError } from '../../lib/errorHandling';
import { useSafeState } from '../../hooks/useSafeState';
import { Plus, Upload } from 'lucide-react';
import { ThemedButton } from '../ui/button';

export const DocumentSidebar = () => {
  const { theme } = useTheme();
  const {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
    fetchDocuments,
    uploadProgress
  } = useDocuments();

  const [deleteDialog, setDeleteDialog] = useSafeState({
    open: false,
    documentId: null
  });

  const [uploadDialog, setUploadDialog] = useSafeState(false);

  useEffect(() => {
    fetchDocuments().catch(error =>
      handleError(error, {
        context: 'DocumentSidebar.fetchDocuments',
        silent: false
      })
    );
  }, [fetchDocuments]);

  const handleUpload = async (file) => {
    try {
      await uploadDocument(file);
      setUploadDialog(false);
    } catch (error) {
      handleError(error, {
        context: 'DocumentSidebar.handleUpload',
        silent: false
      });
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);
      setDeleteDialog({ open: false, documentId: null });
    } catch (error) {
      handleError(error, {
        context: 'DocumentSidebar.handleDelete',
        silent: false
      });
    }
  };

  if (isLoading && !documents.length) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`
              h-24 rounded-lg animate-pulse
              ${theme.bgSecondary}
            `}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <ThemedButton
        onClick={() => setUploadDialog(true)}
        className="mb-4 w-full gap-2"
        theme={theme}
      >
        <Plus className="h-4 w-4" />
        Add Document
      </ThemedButton>

      <ScrollArea className="flex-1 -mx-4">
        <div className="px-4 space-y-3">
          {documents.map((document) => (
            <FileCard
              key={document.document_id}
              file={document}
              onDelete={() => setDeleteDialog({
                open: true,
                documentId: document.document_id
              })}
              theme={theme}
            />
          ))}
        </div>
      </ScrollArea>

      <UploadDialog
        open={uploadDialog}
        onOpenChange={setUploadDialog}
        onUpload={handleUpload}
        progress={uploadProgress}
        theme={theme}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={() => handleDelete(deleteDialog.documentId)}
        theme={theme}
      />
    </div>
  );
};

const UploadDialog = ({ open, onOpenChange, onUpload, progress, theme }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={theme.bgPrimary}>
        <DialogHeader>
          <DialogTitle className={theme.text}>Upload Document</DialogTitle>
        </DialogHeader>
        
        <FileUpload
          onUpload={onUpload}
          accept={{
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/json': ['.json'],
            'text/csv': ['.csv']
          }}
          maxSize={10485760} // 10MB
        >
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8
              ${theme.border} ${theme.bgPrimary}
              hover:${theme.bgHover}
              transition-colors
              cursor-pointer
            `}
          >
            {progress !== null ? (
              <div className="space-y-4 text-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${theme.accent} h-2.5 rounded-full`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className={`text-sm ${theme.textMuted}`}>
                  Uploading... {progress}%
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <Upload className={`h-12 w-12 mx-auto ${theme.icon}`} />
                <div>
                  <p className={`text-sm ${theme.text}`}>
                    Drop files here or click to upload
                  </p>
                  <p className={`text-xs ${theme.textMuted} mt-1`}>
                    PDF, TXT, MD, JSON, CSV (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </FileUpload>
      </DialogContent>
    </Dialog>
  );
};