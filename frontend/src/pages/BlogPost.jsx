import React from 'react';
import Header from '@/components/custom/Header';
import Footer from '@/components/custom/Footer';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/ui/animated-section';
import { blogPosts } from '@/components/custom/BlogList';

const BlogPost = () => {
  return (
    <div className="font-roboto min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header />
      <BlogDetail />
      <Footer />
    </div>
  );
};

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(post => post.id === parseInt(id));
  
  if (!post) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="mb-8">Sorry, the blog post you're looking for doesn't exist.</p>
        <Link to="/blog">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6">
            Return to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-60 right-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection animation="fade-up" delay={100}>
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Articles
          </Link>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-blue-600" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-600" />
                  {post.readTime}
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Blog Content */}
            <div 
              className="prose prose-blue prose-lg max-w-none mb-8 prose-headings:text-gray-800 prose-headings:font-semibold prose-p:text-gray-600 prose-li:text-gray-600" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Navigation button */}
            <div className="border-t border-gray-100 pt-6 mt-8">
              <Link to="/blog">
                <Button variant="outline" className="rounded-full">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BlogPost; 