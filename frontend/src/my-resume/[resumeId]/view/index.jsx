import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'; // Import Axios
import { RWebShare } from 'react-web-share';
import { toast } from 'sonner';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState('modern');
    const params = useParams();
    const { getToken } = useAuth();

    const resumeId = params.resumeId; // Extract resumeId from params

    const templates = {
        modern: 'Modern Template',
        minimal: 'Minimal ATS',
        professional: 'Professional'
    };

    const GetResumeInfo = async () => {
        setLoading(true);
        try {
            const token = await getToken(); // Get the authorization token
            const response = await axios.get(`http://localhost:5000/api/dashboard/resume/${resumeId}/edit`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data.data);
            setResumeInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching resume data:', error);
            toast.error("Failed to fetch resume details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetResumeInfo();
    }, [resumeId]);

    const HandleDownload = () => {
        window.print();
    };

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div id="no-print">
                <Header />

                <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                    <h2 className='text-center text-2xl font-medium'>
                        Congrats! Your Ultimate AI generates Resume is ready!
                    </h2>
                    <p className='text-center text-gray-400'>
                        Now you are ready to download your resume and you can share a unique resume URL with your friends and family.
                    </p>
                    <div className='flex justify-between items-center px-44 my-10'>
                        <Button onClick={HandleDownload}>Download</Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    {templates[activeTemplate]}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.entries(templates).map(([key, value]) => (
                                    <DropdownMenuItem
                                        key={key}
                                        onClick={() => setActiveTemplate(key)}
                                    >
                                        {value}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <RWebShare
                            data={{
                                text: "Hello Everyone, This is my resume please open the URL to see it",
                                url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                                title: `${resumeInfo?.firstName} ${resumeInfo?.lastName}'s resume`,
                            }}
                            onClick={() => console.log("shared successfully!")}
                        >
                            <Button>Share</Button>
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                <div id="print-area">
                    <ResumePreview template={activeTemplate} />
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;