import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';
import AnimatedSection from '@/components/ui/animated-section';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';

function EditResume() {
    const {resumeId} = useParams();
    const [resumeInfo, setResumeInfo] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetResumeInfo();
    }, []);

    const GetResumeInfo = () => {
        setLoading(true);
        GlobalApi.GetResumeById(resumeId).then(resp => {
            console.log(resp.data.data);
            setResumeInfo(resp.data.data);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching resume:", error);
            setLoading(false);
        });
    }

    return (
        <DashboardLayout>
            <ResumeInfoContext.Provider value={{resumeInfo, setResumeInfo}}>
                <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24'>
                    <div className="container mx-auto px-4 sm:px-6 py-8">
                        <AnimatedSection animation="fade-up" delay={100} className="mb-6">
                            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'>Resume Builder</h1>
                            <p className="text-gray-600 mt-2">Create a professional resume that stands out</p>
                        </AnimatedSection>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading your resume...</span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <AnimatedSection animation="fade-right" delay={200} className="h-full">
                                    <div className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
                                        <FormSection />
                                    </div>
                                </AnimatedSection>
                                
                                <AnimatedSection animation="fade-left" delay={300} className="h-full">
                                    <div className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 sticky top-24">
                                        <ResumePreview />
                                    </div>
                                </AnimatedSection>
                            </div>
                        )}
                    </div>
                </div>
            </ResumeInfoContext.Provider>
        </DashboardLayout>
    )
}

export default EditResume