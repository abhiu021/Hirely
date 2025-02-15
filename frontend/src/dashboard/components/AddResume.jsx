import React, { useState } from 'react';
import { PlusSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const onCreate = async () => {
    setLoading(true);
    const uuid = uuidv4();
    const data = {
      data: {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };

    try {
      const token = await getToken();
      const response = await axios.post('http://localhost:5000/api/dashboard/', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 201) {
        throw new Error('Failed to create resume');
      }

      const result = response.data;
      navigation(`/dashboard/resume/${result.data.documentId}/edit`);
    } catch (error) {
      console.error('Error creating resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add New Resume Card - Small Rectangle */}
      <div
        className='p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-[120px] w-[200px] hover:bg-gray-50 transition-all cursor-pointer'
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare className='w-6 h-6 text-gray-500' />
        <p className='mt-2 text-sm text-gray-600'>Add New Resume</p>
      </div>

      {/* Dialog for Creating New Resume */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <div>Add a title for your new resume</div>
              <Input
                className='my-2'
                placeholder='Ex. Full Stack Resume'
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end gap-5'>
            <Button onClick={() => setOpenDialog(false)} variant='ghost'>
              Cancel
            </Button>
            <Button disabled={!resumeTitle || loading} onClick={onCreate}>
              {loading ? <Loader2 className='animate-spin' /> : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;