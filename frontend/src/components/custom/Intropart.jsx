import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { RocketIcon, RefreshCcwIcon } from 'lucide-react';
import AnimatedSection from '../ui/animated-section';

const Intropart = () => {
    const { isSignedIn } = useUser();
    
    return (
        <section className="relative overflow-hidden py-20 sm:py-28 md:py-36">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left content */}
                    <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                        <AnimatedSection animation="fade-up" delay={100}>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    Fast-Track Your Job Search
                                </span>
                            </h1>
                        </AnimatedSection>
                        
                        <AnimatedSection animation="fade-up" delay={300}>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Create an AI-Optimized Resume!</h2>
                        </AnimatedSection>
                        
                        <AnimatedSection animation="fade-up" delay={500}>
                            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                                Create the perfect ATS-friendly resume in just minutes with our intelligent AI builder
                                that optimizes your profile for job applications.
                            </p>
                        </AnimatedSection>
                        
                        <AnimatedSection animation="fade-up" delay={700}>
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Button 
                                    asChild
                                    size="lg" 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full"
                                >
                                    <Link to="/dashboard">
                                        <RocketIcon className="mr-2 h-4 w-4" />
                                        Create New Resume
                                    </Link>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    asChild
                                    size="lg" 
                                    className="border-2 border-blue-500 text-blue-600 font-medium py-2 px-6 rounded-full hover:bg-blue-50"
                                >
                                    <Link to="/dashboard">
                                        <RefreshCcwIcon className="mr-2 h-4 w-4" />
                                        Update Resume
                                    </Link>
                                </Button>
                            </div>
                        </AnimatedSection>
                    </div>
                    
                    {/* Right content - Illustration/mockup */}
                    <AnimatedSection animation="fade-left" delay={400} className="flex-1 hidden md:block">
                        <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-xl">
                            <div className="absolute top-4 left-4 right-4 h-10 bg-white/80 rounded-t-lg backdrop-blur-sm flex items-center px-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="absolute top-14 left-4 right-4 bottom-4 bg-white/30 backdrop-blur-sm rounded-b-lg flex items-center justify-center">
                                <p className="text-lg font-medium text-gray-600">Resume Builder Preview</p>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default Intropart;