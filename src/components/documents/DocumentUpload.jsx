import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { ErrorMessage } from '../common/ErrorMessage';

export const DocumentUpload = ({ id }) => {
  const { uploadDocument, isLoading } = useDocuments();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!file || !title) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      await uploadDocument(formData);
      
      // Reset form and close dialog
      setFile(null);
      setTitle('');
      setDescription('');
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id={id} variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          {error && (
            <ErrorMessage 
              message={error}
              onRetry={() => setError(null)}
            />
          )}
          
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Document description (optional)"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !file || !title}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>

          {isLoading && (
            <LoadingOverlay message="Uploading document..." />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
