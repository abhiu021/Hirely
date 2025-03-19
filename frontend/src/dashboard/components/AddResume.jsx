import React, { useState } from 'react';
import { Loader2, PlusSquare } from 'lucide-react';
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
      console.log('Token:', token);
      const response = await axios.post('https://hirely-78iq.onrender.com/api/dashboard/', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response);

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
        className='p-4 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center h-[120px] w-[200px] hover:bg-blue-50 transition-all duration-300 cursor-pointer group'
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare className='w-7 h-7 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300' />
        <p className='mt-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300'>Add New Resume</p>
      </div>

      {/* Dialog for Creating New Resume */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-xl border border-gray-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Create New Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new resume
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <Input
              className='w-full'
              placeholder='Ex. Full Stack Resume'
              onChange={(e) => setResumeTitle(e.target.value)}
            />
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
              disabled={!resumeTitle || loading} 
              onClick={onCreate}
              className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? <Loader2 className='animate-spin mr-2' /> : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;