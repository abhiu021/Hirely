import React, { useState, useRef } from 'react';
import { Upload, File } from 'lucide-react';
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
import { toast } from 'sonner';

function UploadResumeCard({ onUpload }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const navigate = useNavigate();

  const validateFile = (file) => {
    // Check if file is a PDF or DOCX
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return 'Only PDF and DOCX files are supported';
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size should be less than 5MB';
    }
    
    return '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file);
      setFileError(error);
      setResumeFile(error ? null : file);
      
      // If no title is set yet, use the filename as the title (without extension)
      if (!resumeTitle && !error) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        setResumeTitle(fileName);
      }
    } else {
      setResumeFile(null);
      setFileError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);
      setFileError(error);
      setResumeFile(error ? null : file);
      
      // If no title is set yet, use the filename as the title (without extension)
      if (!resumeTitle && !error) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        setResumeTitle(fileName);
      }
    }
  };

  const handleBrowseClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!resumeTitle) {
      toast.error('Please enter a title for your resume');
      return;
    }

    if (!resumeFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const result = await onUpload(resumeTitle, resumeFile);
      if (result && result.data && result.data.documentId) {
        // Redirect to the form page with extracted data
        navigate(`/dashboard/resume/${result.data.documentId}/edit`, {
          state: { extractedData: result.data.extractedData },
        });
        setOpenDialog(false);
      } else {
        toast.error('Failed to process resume. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Upload Resume Card */}
      <div
        className='p-4 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center h-[120px] w-[200px] hover:bg-blue-50 transition-all duration-300 cursor-pointer group'
        onClick={() => setOpenDialog(true)}
      >
        <Upload className='w-7 h-7 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300' />
        <p className='mt-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300'>Upload Resume</p>
      </div>

      {/* Dialog for Uploading Resume */}
      <Dialog open={openDialog} onOpenChange={(open) => {
        setOpenDialog(open);
        if (!open) {
          setResumeTitle('');
          setResumeFile(null);
          setFileError('');
        }
      }}>
        <DialogContent className="bg-white rounded-xl border border-gray-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Upload Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new resume
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2 space-y-3">
            <Input
              placeholder='Ex. Full Stack Resume'
              className="w-full"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
            />
            
            {/* Drag and Drop Area */}
            <div
              ref={dropZoneRef}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : resumeFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              {resumeFile ? (
                <div className="flex flex-col items-center">
                  <File className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="link"
                    className="mt-1 p-0 h-auto text-xs text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                      setFileError('');
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs text-gray-500 mb-1">- or -</p>
                  <p className="text-xs text-blue-500 font-medium">Browse files</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports PDF, DOCX (Max 5MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
            </div>
            
            {fileError && (
              <p className="text-sm text-red-500">{fileError}</p>
            )}
          </div>
          
          <div className='flex justify-end gap-5'>
            <Button 
              onClick={() => setOpenDialog(false)} 
              variant='ghost'
              className="rounded-md hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              disabled={!resumeTitle || !resumeFile || loading || fileError} 
              onClick={handleUpload}
              className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? <Loader2 className='animate-spin mr-2' /> : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadResumeCard;