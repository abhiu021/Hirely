import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume.jsx';
import UploadResumeCard from './components/UploadResumeCard.jsx';
import CheckATSScoreCard from './components/CheckATSScoreCard.jsx';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import ResumeCardItem from './components/ResumeCardItem';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [resumeList, setResumeList] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [checkingScore, setCheckingScore] = useState(false);

  useEffect(() => {
    if (user) {

      console.log('User:', user); // Log the user object
      console.log('User Role:', user.publicMetadata.role); // Log the user's role
      // Check if the user is an admin
      if (user.publicMetadata.role === 'admin') {
        navigate('/admin/dashboard'); // Redirect admins to the admin portal
      } else {
        GetResumesList(); // Fetch resumes for regular users
      }
    }
  }, [user, navigate]);

  const GetResumesList = async () => {
    setLoadingResumes(true);
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:5000/api/dashboard/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setResumeList(response.data.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resumes');
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleUpload = async (title, file) => {
    setUploadingResume(true);
    const formData = new FormData();
    formData.append('pdf_doc', file);
    formData.append('title', title);

    try {
      const token = await getToken();
      const response = await axios.post('http://localhost:5000/api/dashboard/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 201) {
        throw new Error('Failed to upload resume');
      }

      const result = response.data;
      GetResumesList(); // Refresh the resume list
      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleCheckScore = async (file, jobDescription) => {
    setCheckingScore(true);
    const formData = new FormData();
    formData.append('pdf_doc', file);
    formData.append('jobDescription', jobDescription);

    try {
      const token = await getToken();
      const response = await axios.post('http://localhost:5000/api/dashboard/check-ats-score', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to check ATS score');
      }

      const result = response.data;
      toast.success('ATS score checked successfully');

      // Convert the resume file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result.split(',')[1];
        navigate('/dashboard/ats-score-result', {
          state: { atsScore: result.data, resumeFile: base64File },
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error checking ATS score:', error);
      toast.error('Failed to check ATS score');
    } finally {
      setCheckingScore(false);
    }
  };

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Dashboard</h1>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Side - Profile Section */}
          <div className='w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex flex-col items-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                <img
                  src={user?.imageUrl}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              </div>
              <h2 className='mt-4 text-xl font-semibold text-gray-900 text-center'>{user?.fullName}</h2>
              <p className='text-sm text-gray-500 text-center mt-1'>{user?.emailAddresses[0].emailAddress}</p>
            </div>
          </div>

          {/* Right Side - Resumes Section */}
          <div className='w-full lg:w-3/4'>
            {/* Add New Card Section */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>Add New Resume</h3>
              <div className='flex gap-4 flex-wrap'>
                <AddResume />
                <UploadResumeCard onUpload={handleUpload} loading={uploadingResume} />
                <CheckATSScoreCard onCheckScore={handleCheckScore} loading={checkingScore} />
              </div>
            </div>

            {/* Recent Resumes Section */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-6'>Recent Resumes</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {loadingResumes ? (
                  [1, 2, 3, 4].map((item, index) => (
                    <div
                      key={index}
                      className='h-[280px] rounded-lg bg-gray-100 animate-pulse'
                    ></div>
                  ))
                ) : resumeList?.length > 0 ? (
                  resumeList.map((resume, index) => (
                    <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList} />
                  ))
                ) : (
                  <p className='text-gray-500'>No resumes found. Upload a resume to get started.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;