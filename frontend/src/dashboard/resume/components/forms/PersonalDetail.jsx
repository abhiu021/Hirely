import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'; // Import Axios
import { toast } from 'sonner';

// Define the default structure for personal details
const formField = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: '',
};

function PersonalDetail({ enabledNext }) {
    const [personalDetailsList, setPersonalDetailsList] = useState([{ ...formField }]);
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

                // Set the personal details list from fetched data
                if (fetchedData?.personalDetails) {
                    setPersonalDetailsList([fetchedData.personalDetails]);
                }

                // Update the resumeInfo context with all fetched data
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
        const newEntries = personalDetailsList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setPersonalDetailsList(newEntries);
    };

    useEffect(() => {
        // Update resumeInfo only when personalDetailsList changes
        setResumeInfo(prevInfo => ({
            ...prevInfo, // Preserve existing data
            personalDetails: personalDetailsList[0] || { ...formField },
        }));
    }, [personalDetailsList, setResumeInfo]); // Add setResumeInfo to dependencies

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            data: {
                ...resumeInfo, // Preserve existing resume data
                personalDetails: personalDetailsList[0], // Update personalDetails
            },
        };

        console.log('Request data:', data);

        try {
            const id = params?.resumeId;
            const token = await getToken();
            const response = await axios.put(`http://localhost:5000/api/dashboard/resume/${id}/edit`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            enabledNext(true);
            toast("Details updated");
        } catch (error) {
            console.error('Error updating resume:', error);
            toast.error("Failed to update details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    {personalDetailsList.map((item, index) => (
                        <React.Fragment key={index}>
                            <div>
                                <label className='text-sm'>First Name</label>
                                <Input
                                    name="firstName"
                                    value={item?.firstName}
                                    required
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Last Name</label>
                                <Input
                                    name="lastName"
                                    value={item?.lastName}
                                    required
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div className='col-span-2'>
                                <label className='text-sm'>Job Title</label>
                                <Input
                                    name="jobTitle"
                                    value={item?.jobTitle}
                                    required
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div className='col-span-2'>
                                <label className='text-sm'>Address</label>
                                <Input
                                    name="address"
                                    value={item?.address}
                                    required
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Phone</label>
                                <Input
                                    name="phone"
                                    value={item?.phone}
                                    required
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Email</label>
                                <Input
                                    name="email"
                                    value={item?.email}
                                    required
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetail;