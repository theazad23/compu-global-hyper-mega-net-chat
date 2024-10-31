import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { ThemedButton } from '../ui/button';
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

export const DocumentUpload = ({ id, theme }) => {
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
        <ThemedButton 
          id={id} 
          variant="outline" 
          theme={theme}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </ThemedButton>
      </DialogTrigger>
      <DialogContent className={`${theme.bgPrimary} ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={theme.text}>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="file" className={theme.text}>File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={isLoading}
              className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title" className={theme.text}>Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              disabled={isLoading}
              className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className={theme.text}>Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Document description (optional)"
              disabled={isLoading}
              className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <ThemedButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              theme={theme}
            >
              Cancel
            </ThemedButton>
            <ThemedButton
              type="submit"
              disabled={isLoading || !file || !title}
              theme={theme}
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
            </ThemedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};