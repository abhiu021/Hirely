import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume.jsx';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios'; // Import Axios
import ResumeCardItem from './components/ResumeCardItem';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

function Dashboard() {
  const { user } = useUser();
  const params = useParams();
  const { getToken } = useAuth();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      GetResumesList();
    }
  }, [user]);

  /**
   * Used to Get Users Resume List
   */
  const GetResumesList = async () => {
    try {
      const token = await getToken(); // Get the authorization token
      const userEmail = user.emailAddresses[0].emailAddress;
      console.log('User Email:', userEmail);
      const response = await axios.get('http://localhost:5000/api/dashboard/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data.data);
      setResumeList(response.data.data);
      console.log(resumeList.length);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to fetch resumes');
    }
  };

  useEffect(() => {
    console.log('Resume List Length:', resumeList?.length); // Log the length of the resume list
  }, [resumeList]);

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      {/* Dashboard Heading */}
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Dashboard</h1>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Side - Profile Section */}
          <div className='w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex flex-col items-center'>
              <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                <img
                  src={user?.imageUrl} // Use Clerk's user image
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
              <AddResume />
            </div>

            {/* Recent Resumes Section */}
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h3 className='text-xl font-semibold text-gray-900 mb-6'>Recent Resumes</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {resumeList?.length > 0 ? (
                  resumeList.map((resume, index) => (
                    <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList} />
                  ))
                ) : (
                  [1, 2, 3, 4].map((item, index) => (
                    <div
                      key={index}
                      className='h-[280px] rounded-lg bg-gray-100 animate-pulse'
                    ></div>
                  ))
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