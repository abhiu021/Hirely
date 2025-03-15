import AdvantagesSection from '@/components/custom/AdvantagesSection';
import BlogSection from '@/components/custom/BlogSection';
import Footer from '@/components/custom/Footer';
import Header from '@/components/custom/Header'
import Intropart from '@/components/custom/Intropart';
import ResumeBuilderSection from '@/components/custom/ResumeBuilderSection';
import ReviewsSection from '@/components/custom/ReviewsSection';
import StepsSection from '@/components/custom/StepsSection';
import { UserButton } from '@clerk/clerk-react'
// import { AtomIcon, Edit, Share2 } from 'lucide-react'
import React from "react";

function Home() {
  return (
    <div className="font-roboto min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header />
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <Intropart />
        <StepsSection />
        <ResumeBuilderSection />
        <AdvantagesSection />
        <BlogSection />
        <ReviewsSection />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
