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
import { Loader2 } from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '@/components/ui/animated-section';
import DashboardLayout from './components/DashboardLayout.jsx';

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
      console.log('User:', user);
      console.log('User Role:', user.publicMetadata.role);
      if (user.publicMetadata.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        GetResumesList();
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
      
      return result; // Return the entire result object to the component
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
      return null; // Return null to indicate failure
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

      return result; // Return the entire result object to the component
    } catch (error) {
      console.error('Error checking ATS score:', error);
      toast.error('Failed to check ATS score');
      return null; // Return null to indicate failure
    } finally {
      setCheckingScore(false);
    }
  };

  return (
    <DashboardLayout>
      <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
          <AnimatedSection animation="fade-up" delay={100}>
            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3'>Dashboard</h1>
            <p className="text-gray-600 mb-8">Manage your resumes and create new ones</p>
          </AnimatedSection>
          
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Left Side - Profile Section */}
            <AnimatedSection animation="fade-right" delay={200} className='w-full lg:w-1/4'>
              <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
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
            </AnimatedSection>

            {/* Right Side - Resumes Section */}
            <div className='w-full lg:w-3/4'>
              {/* Add New Card Section */}
              <AnimatedSection animation="fade-up" delay={300} className='mb-8'>
                <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>Add New Resume</h3>
                  <div className='flex gap-4 flex-wrap'>
                    <AddResume />
                    <UploadResumeCard onUpload={handleUpload} loading={uploadingResume} />
                    <CheckATSScoreCard onCheckScore={handleCheckScore} loading={checkingScore} />
                  </div>
                </div>
              </AnimatedSection>

              {/* Recent Resumes Section */}
              <AnimatedSection animation="fade-up" delay={400}>
                <div className='bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)]'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-6'>Recent Resumes</h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {loadingResumes ? (
                      <div className="col-span-full flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-600">Loading your resumes...</span>
                      </div>
                    ) : resumeList?.length > 0 ? (
                      <AnimatedStagger staggerDelay={100} baseDelay={100} className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resumeList.map((resume, index) => (
                          <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList} />
                        ))}
                      </AnimatedStagger>
                    ) : (
                      <p className='text-gray-500 col-span-full text-center py-10'>No resumes found. Create or upload a resume to get started.</p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;