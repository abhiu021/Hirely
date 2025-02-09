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
    <div className="font-roboto">
      <Header />
      <div className="">
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
