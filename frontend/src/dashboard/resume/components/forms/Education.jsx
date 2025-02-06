import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'sonner';

function Education() {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const { getToken } = useAuth(); 
  const [educationalList, setEducationalList] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchEducationData = async () => {
      setLoading(true);
      try {
        const id = params?.resumeId; // Get the resume ID from URL params
        const token = await getToken(); // Get the authorization token
        const response = await axios.get(`http://localhost:5000/api/dashboard/resume/${id}/edit`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response);
        const fetchedData = response.data?.data;  
        console.log('Fetched data:', fetchedData);

        // Set the educational list from fetched data
        if (fetchedData.education) {
          setEducationalList(fetchedData.education);
        }

        // Optionally set the resumeInfo context
        setResumeInfo(fetchedData);
      } catch (error) {
        console.error('Error fetching education data:', error);
        toast.error("Failed to fetch education details");
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, [params, getToken, setResumeInfo]); // Dependencies include params and getToken

  const handleChange = (event, index) => {
    const newEntries = educationalList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([...educationalList, {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const RemoveEducation = () => {
    setEducationalList((educationalList) => educationalList.slice(0, -1));
  };

  const onSave = async () => {
    setLoading(true);
    const data = {
      data: {
        education: educationalList.map(({ id, ...rest }) => rest) // Exclude id if present
      }
    };

    try {
      const id = params?.resumeId;
      const token = await getToken();
      console.log('Request data:', data);
      console.log(id);
      const response = await axios.put(`http://localhost:5000/api/dashboard/resume/${id}/edit`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      toast("Details updated");
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error("Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update resumeInfo only when educationalList changes
    setResumeInfo(prevInfo => ({
      ...prevInfo,
      education: educationalList
    }));
  }, [educationalList, setResumeInfo]); 

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      <div>
        {Array.isArray(educationalList) && educationalList.map((item, index) => (
          <div key={index}>
            <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
              <div className='col-span-2'>
                <label>University Name</label>
                <Input name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName}
                />
              </div>
              <div>
                <label>Degree</label>
                <Input name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree}
                />
              </div>
              <div>
                <label>Major</label>
                <Input name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major}
                />
              </div>
              <div>
                <label>Start Date</label>
                <Input type="date" name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.startDate}
                />
              </div>
              <div>
                <label>End Date</label>
                <Input type="date" name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate}
                />
              </div>
              <div className='col-span-2'>
                <label>Description</label>
                <Textarea name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewEducation} className="text-primary"> + Add More Education</Button>
          <Button variant="outline" onClick={RemoveEducation} className="text-primary"> - Remove</Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Education;