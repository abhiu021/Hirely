import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useUser, useAuth } from '@clerk/clerk-react'; // Add useAuth
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const { user } = useUser();
    const { getToken } = useAuth(); // Get the getToken function
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const onCreate = async () => {
        setLoading(true);
        const uuid = uuidv4();
        const data = {
            data: {
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
            },
        };

        console.log('Request data:', data); // Log the request data

        try {
            const token = await getToken(); // Get the Clerk session token
            console.log('Session token:', token); // Log the session token
            console.log('Creating resume...:', data);
            const response = await axios.post('http://localhost:5000/api/dashboard/', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the session token
                },
            });

            if (response.status !== 201) {
                throw new Error('Failed to create resume');
            }

            const result = response.data; // Parse the response
            console.log('Resume created:', result.data.documentId);

            // Navigate to the edit page
            navigation(`/dashboard/resume/${result.data.documentId}/edit`);
        } catch (error) {
            console.error('Error creating resume:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <div
                className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <div>Add a title for your new resume</div>
                            <Input
                                className='my-2'
                                placeholder='Ex. Full Stack Resume'
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant='ghost'>
                                Cancel
                            </Button>
                            <Button disabled={!resumeTitle || loading} onClick={onCreate}>
                                {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;