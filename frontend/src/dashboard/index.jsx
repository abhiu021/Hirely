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
      const token = await getToken();  // Get the authorization token
      // console.log('Token:', token);
      const userEmail= user.emailAddresses[0].emailAddress;
      console.log('User Email:', userEmail);
      const response = await axios.get('http://localhost:5000/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(response.data.data);
      setResumeList(response.data.data);
      console.log(resumeList.length);
      
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error("Failed to fetch resumes");
    }
    
  }

  useEffect(() => {
    console.log('Resume List Length:', resumeList?.length); // Log the length of the resume list
  }, [resumeList]);
  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>
      <div className='grid grid-cols-2 
      md:grid-cols-3 lg:grid-cols-5 gap-5
      mt-10
      '>
        <AddResume />
        {resumeList?.length > 0 ? resumeList.map((resume, index) => (
          <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList} />
        )) :
          [1, 2, 3, 4].map((item, index) => (
            <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard