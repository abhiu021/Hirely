import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'; // Import Axios
import { toast } from 'sonner';

function Skills() {
    const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }]); // Initialize as an array
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    useEffect(() => {
        const fetchSkillsData = async () => {
            setLoading(true);
            try {
                const id = resumeId; // Get the resume ID from URL params
                const token = await getToken(); // Get the authorization token
                const response = await axios.get(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Response:', response);
                const fetchedData = response.data?.data;  
                console.log('Fetched data:', fetchedData);

                // Set the skills list from fetched data
                if (fetchedData.skills) {
                    setSkillsList(fetchedData.skills);
                }

                // Optionally set the resumeInfo context
                setResumeInfo(fetchedData);
            } catch (error) {
                console.error('Error fetching skills data:', error);
                toast.error("Failed to fetch skills details");
            } finally {
                setLoading(false);
            }
        };

        fetchSkillsData();
    }, [resumeId, getToken, setResumeInfo]); // Dependencies include resumeId and getToken

    const handleChange = (index, name, value) => {
        const newEntries = skillsList.slice();
        newEntries[index][name] = value;
        setSkillsList(newEntries);
    };

    const AddNewSkills = () => {
        setSkillsList([...skillsList, { name: '', rating: 0 }]); // Add a new skill entry
    };

    const RemoveSkills = () => {
        setSkillsList((skillsList) => skillsList.slice(0, -1)); // Remove the last skill entry
    };

    const onSave = async () => {
        setLoading(true);
        const data = {
            data: {
                skills: skillsList.map(({ id, ...rest }) => rest) // Exclude id if present
            }
        };

        try {
            const id = resumeId;
            const token = await getToken();
            console.log('Request data:', data);
            console.log(id);
            const response = await axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, data, {
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
        setResumeInfo({
            ...resumeInfo,
            skills: skillsList
        });
    }, [skillsList, setResumeInfo]);

    return (
        <div className='p-4 sm:p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Skills</h2>
            <p>Add Your top professional key skills</p>

            <div className="mt-4">
                {Array.isArray(skillsList) && skillsList.map((item, index) => (
                    <div key={index} className='flex flex-col sm:flex-row justify-between mb-2 border rounded-lg p-3 gap-3'>
                        <div className="w-full sm:w-2/3">
                            <label className='text-xs'>Name</label>
                            <Input className="w-full"
                                defaultValue={item.name}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col w-full sm:w-1/3 mt-2 sm:mt-0">
                            <label className='text-xs mb-1'>Proficiency</label>
                            <div className="max-w-[150px]">
                                <Rating 
                                    style={{ maxWidth: '150px' }} 
                                    value={item.rating}
                                    onChange={(v) => handleChange(index, 'rating', v)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col sm:flex-row justify-between mt-4 gap-2'>
                <div className='flex flex-col sm:flex-row gap-2'>
                    <Button variant="outline" onClick={AddNewSkills} className="text-primary w-full sm:w-auto"> + Add More Skill</Button>
                    <Button variant="outline" onClick={RemoveSkills} className="text-primary w-full sm:w-auto"> - Remove</Button>
                </div>
                <Button disabled={loading} onClick={onSave} className="w-full sm:w-auto mt-2 sm:mt-0">
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export default Skills;