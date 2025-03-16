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
    <div className='bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:shadow-[0_12px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1'>
      {/* Wrap only the image and title in a Link for navigation */}
      <Link to={`/dashboard/resume/${resume._id}/edit`} className='block'>
        {/* Image at the Top */}
        <div className='p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 relative overflow-hidden'>
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-200/40 rounded-full blur-xl"></div>
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-200/40 rounded-full blur-xl"></div>
          <img
            src="/cv.png"
            alt="Resume Icon"
            className='w-full h-32 object-contain relative z-10'
          />
        </div>
      </Link>
      
      {/* Name and Dropdown Button Below the Image */}
      <div className='p-4 flex justify-between items-center border-t border-gray-100'>
        <h2 className='text-md font-semibold text-gray-800 truncate'>{resume.title}</h2>
        {/* Dropdown Button (outside the Link to prevent navigation) */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              className='p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 text-gray-500 hover:text-gray-700'
              onClick={(e) => e.preventDefault()} // Prevent default behavior
            >
              <MoreVertical className='h-4 w-4' aria-label="More options" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              className="flex items-center text-sm cursor-pointer" 
              onClick={() => navigation(`/dashboard/resume/${resume._id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center text-sm cursor-pointer" 
              onClick={() => navigation(`/my-resume/${resume._id}/view`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center text-sm cursor-pointer" 
              onClick={() => navigation(`/my-resume/${resume._id}/view`)}
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center text-sm cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={() => setOpenAlert(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openAlert}>
        <AlertDialogContent className="bg-white rounded-xl border border-gray-100 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete your resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setOpenAlert(false)}
              className="rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete} 
              disabled={loading}
              className="rounded-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {loading ? <Loader2Icon className='animate-spin mr-2' /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCardItem;