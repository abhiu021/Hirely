import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UploadResumeCard({ onUpload }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setLoading(true);
    try {
      const result = await onUpload(resumeTitle, resumeFile);
      if (result) {
        // Redirect to the form page with extracted data
        navigate(`/dashboard/resume/${result.data.documentId}/edit`, {
          state: { extractedData: result.data.extractedData },
        });
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <>
      {/* Upload Resume Card */}
      <div
        className='p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-[120px] w-[200px] hover:bg-gray-50 transition-all cursor-pointer'
        onClick={() => setOpenDialog(true)}
      >
        <Upload className='w-6 h-6 text-gray-500' />
        <p className='mt-2 text-sm text-gray-600'>Upload Resume</p>
      </div>

      {/* Dialog for Uploading Resume */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogDescription>
              <div>Add a title for your new resume</div>
              <Input
                className='my-2'
                placeholder='Ex. Full Stack Resume'
                onChange={(e) => setResumeTitle(e.target.value)}
              />
              <Input
                type='file'
                name="pdf_doc"
                className='my-2'
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end gap-5'>
            <Button onClick={() => setOpenDialog(false)} variant='ghost'>
              Cancel
            </Button>
            <Button disabled={!resumeTitle || !resumeFile || loading} onClick={handleUpload}>
              {loading ? <Loader2 className='animate-spin' /> : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadResumeCard;