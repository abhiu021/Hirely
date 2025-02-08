import { Loader2Icon, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios'; // Import Axios
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GlobalApi from './../../../service/GlobalApi';
import { toast } from 'sonner';

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate();
  const { getToken } = useAuth();
  const [openAlert, setOpenAlert] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      console.log('Token:', token);
      console.log('Resume ID:', resume._id);
      const response = await axios.delete('http://localhost:5000/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { id: resume._id },
      });
    
      toast('Resume Deleted!');
      refreshData();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error("Failed to delete resume");
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  return (
    <div>
      <Link to={`/dashboard/resume/${resume._id}/edit`}>
        <div className='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[280px] rounded-t-lg border-t-4'
          style={{ borderColor: resume?.themeColor }}>
          <div className='flex items-center justify-center h-[180px]'>
            <img src="/cv.png" width={80} height={80} alt="Resume Icon" />
          </div>
        </div>
      </Link>
      <div className='border p-3 flex justify-between text-white rounded-b-lg shadow-lg'
        style={{ background: resume?.themeColor }}>
        <h2 className='text-sm text-black'>{resume.title}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className='h-4 w-4 cursor-pointer' aria-label="More options" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigation(`/dashboard/resume/${resume._id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation(`/my-resume/${resume._id}/view`)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation(`/my-resume/${resume._id}/download`)}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your resume.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
                {loading ? <Loader2Icon className='animate-spin' /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCardItem;