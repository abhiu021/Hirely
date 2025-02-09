    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import React, { useContext, useEffect, useState } from 'react';
    import RichTextEditor from '../RichTextEditor';
    import { ResumeInfoContext } from '@/context/ResumeInfoContext';
    import { useParams } from 'react-router-dom';
    import { toast } from 'sonner';
    import { useAuth } from '@clerk/clerk-react';
    import axios from 'axios'; // Import Axios
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
            // Fetch resume data when the component mounts
            const fetchResumeData = async () => {
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

                    // Set the experience list from fetched data
                    if (fetchedData.Experience) {
                        setExperinceList(fetchedData.Experience);
                    }

                    // Optionally set the resumeInfo context
                    setResumeInfo(fetchedData);
                } catch (error) {
                    console.error('Error fetching resume data:', error);
                    toast.error("Failed to fetch resume details");
                } finally {
                    setLoading(false);
                }
            };

            fetchResumeData();
        }, [params, getToken, setResumeInfo]); // Dependencies include params and getToken

        const handleChange = (index, event) => {
            const newEntries = experinceList.slice();
            const { name, value } = event.target;
            newEntries[index][name] = value;
            console.log(newEntries);
            setExperinceList(newEntries);
        };

        const AddNewExperience = () => {
            setExperinceList([...experinceList, { ...formField }]); // Add a new experience entry
        };

        const RemoveExperience = () => {
            setExperinceList(experinceList => experinceList.slice(0, -1)); // Remove the last experience entry
        };

        const handleRichTextEditor = (e, name, index) => {
            const newEntries = experinceList.slice();
            newEntries[index][name] = e.target.value;
            setExperinceList(newEntries);
        };

        useEffect(() => {
            // Update resumeInfo only when experinceList changes
            setResumeInfo(prevInfo => ({
                ...prevInfo,
                Experience: experinceList
            }));
        }, [experinceList, setResumeInfo]); // Add setResumeInfo to dependencies

        const onSave = async () => {
            setLoading(true);
            const data = {
                data: {
                    Experience: experinceList.map(({ id, ...rest }) => rest) // Exclude id if present
                }
            };

            console.log(experinceList);

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
                                        <Input name="title"
                                            onChange={(event) => handleChange(index, event)}
                                            defaultValue={item?.title}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-xs'>Company Name</label>
                                        <Input name="companyName"
                                            onChange={(event) => handleChange(index, event)}
                                            defaultValue={item?.companyName} />
                                    </div>
                                    <div>
                                        <label className='text-xs'>City</label>
                                        <Input name="city"
                                            onChange={(event) => handleChange(index, event)}
                                            defaultValue={item?.city} />
                                    </div>
                                    <div>
                                        <label className='text-xs'>State</label>
                                        <Input name="state"
                                            onChange={(event) => handleChange(index, event)}
                                            defaultValue={item?.state}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-xs'>Start Date</label>
                                        <Input type="date"
                                            name="startDate"
                                            onChange={(event) => handleChange(index, event)}
                                            defaultValue={item?.startDate} />
                                    </div>
                                    <div>
                                        <label className='text-xs'>End Date</label>
                                        <Input type="date" name="endDate"
                                            onChange={(event) => handleChange(index, event)}
                                            defaultValue={item?.endDate}
                                        />
                                    </div>
                                    <div className='col-span-2'>
                                        {/* Work Summery  */}
                                        <RichTextEditor
                                            index={index}
                                            defaultValue={item?.workSummery}
                                            onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <Button variant="outline" onClick={AddNewExperience} className="text-primary"> + Add More Experience</Button>
                            <Button variant="outline" onClick={RemoveExperience} className="text-primary"> - Remove</Button>

                        </div>
                        <Button disabled={loading} onClick={() => onSave()}>
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    export default Experience