import { Loader2Icon, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useUser  } from '@clerk/clerk-react';
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
import { toast } from 'sonner';

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate();
  const { getToken } = useAuth();
  const [openAlert, setOpenAlert] = useState(false);
  const { user } = useUser ();
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
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer'>
      {/* Wrap only the image and title in a Link for navigation */}
      <Link to={`/dashboard/resume/${resume._id}/edit`} className='block'>
        {/* Image at the Top */}
        <div className='p-4 bg-gradient-to-r from-blue-100 to-blue-200'>
          <img
            src="/cv.png" // Replace with your image path
            alt="Resume Icon"
            className='w-full h-32 object-contain'
          />
        </div>
        </Link>
        {/* Name and Dropdown Button Below the Image */}
        <div className='p-4 flex justify-between items-center'>
          <h2 className='text-md font-semibold text-gray-800'>{resume.title}</h2>
          {/* Dropdown Button (outside the Link to prevent navigation) */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                className='p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-300'
                onClick={(e) => e.preventDefault()} // Prevent default behavior
              >
                <MoreVertical className='h-5 w-5 text-gray-600' aria-label="More options" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigation(`/dashboard/resume/${resume._id}/edit`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigation(`/my-resume/${resume._id}/view`)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigation(`/my-resume/${resume._id}/view`)}>
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenAlert(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      

      {/* Delete Confirmation Dialog */}
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
  );
}

export default ResumeCardItem;