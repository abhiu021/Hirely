
import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';



const Intropart = () => {
    return (
        <section className="bg-white text-black relative overflow-hidden">
            <div className="container mx-auto text-center py-48 relative z-10"> {/* Increased py-32 to py-48 */}
                <h1 className="text-4xl font-bold mb-4">Fast-Track Your Job Search</h1>
                <h2 className="text-4xl font-bold mb-2">Create an AI-Optimized Resume!</h2>
                <p className="text-sm text-gray-700 mb-8">Create the perfect ATS-friendly resume in just minutes with a smart AI builder</p>
                <div className="space-x-4">
                    <Button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700">Create New Resume</Button>
                    <Button variant="outline" className="bg-white text-blue-600 border border-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-100">Update Resume</Button>
                </div>
            </div>
        </section>
    );
};

export default Intropart;