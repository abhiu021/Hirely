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
                <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-32 pb-12'>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatedSection animation="fade-up" delay={100} className="mb-8">
                            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'>Resume Builder</h1>
                            <p className="text-gray-600 mt-2">Create a professional resume that stands out</p>
                        </AnimatedSection>

                        {loading ? (
                            <AnimatedSection animation="fade-up" delay={200} className="flex items-center justify-center h-64 bg-white/50 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                                <span className="ml-3 text-gray-600 font-medium">Loading your resume...</span>
                            </AnimatedSection>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                <AnimatedSection animation="fade-right" delay={200} className="h-full">
                                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.09)] transition-all duration-300">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resume Details</h2>
                                        <FormSection />
                                    </div>
                                </AnimatedSection>
                                
                                <AnimatedSection animation="fade-left" delay={300} className="h-full">
                                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.09)] transition-all duration-300 sticky top-32">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
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