import React from 'react';
import Header from '@/components/custom/Header';
import Footer from '@/components/custom/Footer';
import BlogDetail from '@/components/custom/BlogDetail';

const BlogPost = () => {
  return (
    <div className="font-roboto min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header />
      <div className="pt-20">
        <BlogDetail />
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost; 