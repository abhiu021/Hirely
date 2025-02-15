import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummery: '',
};

function Experience() {
    const [experinceList, setExperinceList] = useState([]);
    const params = useParams();
    const { getToken } = useAuth();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResumeData = async () => {
            setLoading(true);
            try {
                const id = params?.resumeId;
                const token = await getToken();
                const response = await axios.get(
                    `http://localhost:5000/api/dashboard/resume/${id}/edit`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('Fetched data:', response.data.data);
                if (response.data.data?.Experience) {
                    setExperinceList(response.data.data.Experience);
                }
                setResumeInfo(response.data.data);
            } catch (error) {
                console.error('Error fetching resume data:', error);
                toast.error("Failed to fetch resume details");
            } finally {
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [params, getToken, setResumeInfo]);

    const handleChange = (index, event) => {
        const newEntries = [...experinceList];
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperinceList(newEntries);
    };

    const AddNewExperience = () => {
        setExperinceList([...experinceList, { ...formField }]);
    };

    const RemoveExperience = () => {
        setExperinceList(experinceList => experinceList.slice(0, -1));
    };

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = [...experinceList];
        newEntries[index][name] = e.target.value;
        setExperinceList(newEntries);
    };

    useEffect(() => {
        setResumeInfo(prevInfo => ({
            ...prevInfo,
            Experience: experinceList,
        }));
    }, [experinceList, setResumeInfo]);

    const onSave = async () => {
        setLoading(true);
    
        // Prepare the data to match the backend's expected structure
        const data = {
            Experience: experinceList.map(({ id, ...rest }) => rest)
        };
    
        try {
            const id = params?.resumeId;
            const token = await getToken();
            console.log('Request data:', data); // Log the request payload
            const response = await axios.put(
                `http://localhost:5000/api/dashboard/resume/${id}/edit`,
                data, // Send the data directly (no nesting under `data`)
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Backend Response:', response.data);
            toast("Details updated");
        } catch (error) {
            console.error('Error updating resume:', error.response?.data || error.message);
            toast.error("Failed to update details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add Your previous Job experience</p>
                <div>
                    {experinceList.map((item, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                                <div>
                                    <label className='text-xs'>Position Title</label>
                                    <Input
                                        name="title"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.title}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Company Name</label>
                                    <Input
                                        name="companyName"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.companyName}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>City</label>
                                    <Input
                                        name="city"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.city}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>State</label>
                                    <Input
                                        name="state"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.state}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Start Date</label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.startDate}
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        onChange={(event) => handleChange(index, event)}
                                        defaultValue={item?.endDate}
                                    />
                                </div>
                                <div className='col-span-2'>
                                    <RichTextEditor
                                        index={index}
                                        defaultValue={item?.workSummery}
                                        onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Button variant="outline" onClick={AddNewExperience} className="text-primary">
                            + Add More Experience
                        </Button>
                        <Button variant="outline" onClick={RemoveExperience} className="text-primary">
                            - Remove
                        </Button>
                    </div>
                    <Button disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Experience;