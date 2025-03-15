import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
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

function CheckATSScoreCard({ onCheckScore }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckScore = async () => {
    if (!resumeFile || !jobDescription) {
      console.error('Resume file and job description are required');
      return;
    }

    setLoading(true);
    try {
      const result = await onCheckScore(resumeFile, jobDescription);
      if (result) {
        // Convert the resume file to base64 for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64File = reader.result.split(',')[1]; // Extract base64 data
          // Navigate to the ATS score result page with the score and resume file
          navigate('/dashboard/ats-score-result', {
            state: { atsScore: result.data, resumeFile: base64File },
          });
        };
        reader.readAsDataURL(resumeFile); // Read the file as base64
      }
    } catch (error) {
      console.error('Error checking ATS score:', error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <>
      {/* Check ATS Score Card */}
      <div
        className='p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-[120px] w-[200px] hover:bg-gray-50 transition-all cursor-pointer'
        onClick={() => setOpenDialog(true)}
      >
        <CheckCircle className='w-6 h-6 text-gray-500' />
        <p className='mt-2 text-sm text-gray-600'>Check ATS Score</p>
      </div>

      {/* Dialog for Checking ATS Score */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check ATS Score</DialogTitle>
            <DialogDescription>
              <div>Upload your resume and provide a job description to check the ATS score.</div>
              <Input
                type='file'
                name="pdf_doc"
                className='my-2'
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              <Input
                placeholder='Job Description'
                className='my-2'
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end gap-5'>
            <Button onClick={() => setOpenDialog(false)} variant='ghost'>
              Cancel
            </Button>
            <Button disabled={!resumeFile || !jobDescription || loading} onClick={handleCheckScore}>
              {loading ? <Loader2 className='animate-spin' /> : 'Check Score'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CheckATSScoreCard;