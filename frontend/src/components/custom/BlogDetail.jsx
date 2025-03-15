import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import AnimatedSection from '../ui/animated-section';
import { blogPosts } from './BlogList';

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

  // Find related posts (same category, exclude current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
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
                  
                  <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-8 overflow-hidden flex items-center justify-center relative">
                    <div className="text-blue-600/20 font-bold text-4xl sm:text-6xl">BLOG</div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5"></div>
                  </div>
                </div>
                
                {/* Blog Content */}
                <div 
                  className="prose prose-blue prose-lg max-w-none mb-8 prose-headings:text-gray-800 prose-headings:font-semibold prose-p:text-gray-600 prose-li:text-gray-600" 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Navigation buttons */}
                <div className="border-t border-gray-100 pt-6 mt-8 flex flex-wrap justify-between gap-4">
                  <Link to="/blog">
                    <Button variant="outline" className="rounded-full">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                    </Button>
                  </Link>
                  
                  {relatedPosts.length > 0 && (
                    <Link to={`/blog/${relatedPosts[0].id}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
                        Read Related Article
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fade-left" delay={300}>
              {/* Author */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{post.author}</div>
                    <div className="text-sm text-gray-600">Content Writer</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Expert in career development and resume optimization with several years of experience helping job seekers land their dream roles.
                </p>
              </div>
              
              {/* Categories */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Link to="/blog" className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                    Resume Tips
                  </Link>
                  <Link to="/blog" className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                    Job Application
                  </Link>
                  <Link to="/blog" className="text-xs font-medium text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors">
                    Interviews
                  </Link>
                  <Link to="/blog" className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">
                    Cover Letters
                  </Link>
                  <Link to="/blog" className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                    Personal Branding
                  </Link>
                </div>
              </div>
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(relatedPost => (
                      <Link 
                        key={relatedPost.id} 
                        to={`/blog/${relatedPost.id}`}
                        className="block p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {relatedPost.date}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 