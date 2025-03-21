import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from '../../../../../service/AIModal';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const prompt = "Job Title: {jobTitle} , Depends on job title give me list of summery for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summery and experience_level Field in JSON Format";

function Summery({ enabledNext }) {
    const { getToken } = useAuth();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summery, setSummery] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchResumeData = async () => {
            setLoading(true);
            try {
                const id = params?.resumeId; // Get the resume ID from URL params
                const token = await getToken(); // Get the authorization token
                const response = await axios.get(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Response:', response);
                // Assuming the response structure is { data: { summery: ... } }
                const fetchedData = response.data?.data;
                console.log('Fetched data:', fetchedData);
                setSummery(fetchedData.summery || ''); // Set the fetched summary directly

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

    useEffect(() => {
        setResumeInfo((prevInfo) => ({
            ...prevInfo,
            summery: summery
        }));
    }, [summery, setResumeInfo]);

    const GenerateSummeryFromAI = async () => {
        setLoading(true);
        try {
            const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
            const result = await AIChatSession.sendMessage(PROMPT);
            const parsedResult = JSON.parse(result.response.text());
            setAiGenerateSummeryList(parsedResult);
        } catch (error) {
            console.error('Error generating summary:', error);
            toast.error("Failed to generate summary");
        } finally {
            setLoading(false);
        }
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            data: {
                summery: summery
            }
        };
        try {
            const id = params?.resumeId;
            const token = await getToken();
            const response = await axios.put(`https://hirely-78iq.onrender.com/api/dashboard/resume/${id}/edit`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response', response);
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
        <div>
            <div className='p-4 sm:p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summery</h2>
                <p>Add Summery for your job title</p>

                <form className='mt-5 sm:mt-7' onSubmit={onSave}>
                    <div className='flex flex-col sm:flex-row justify-between gap-2 sm:items-end'>
                        <label className="font-medium text-sm">Add Summery</label>
                        <Button variant="outline" onClick={GenerateSummeryFromAI}
                            type="button" size="sm" className="border-primary text-primary flex gap-2 w-full sm:w-auto" disabled={loading}>
                            <Brain className='h-4 w-4' /> Generate from AI
                        </Button>
                    </div>
                    <Textarea className="mt-3 sm:mt-5" required
                        value={summery}
                        onChange={(e) => setSummery(e.target.value)}
                        rows={6}
                    />
                    <div className='mt-2 flex justify-end'>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>

            {aiGeneratedSummeryList && (
                <div className='my-5'>
                    <h2 className='font-bold text-lg'>Suggestions</h2>
                    {aiGeneratedSummeryList.map((item, index) => (
                        <div key={index}
                            onClick={() => setSummery(item?.summary)}
                            className='p-4 sm:p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                            <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
                            <p className="text-sm sm:text-base">{item?.summary}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Summery;
