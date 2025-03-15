import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';
import { Link } from 'react-router-dom';

const BlogCard = ({ title, description, id }) => (
  <Link to={`/blog/${id}`} className="group">
    <div className="flex-shrink-0 w-[350px] bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-6 overflow-hidden flex items-center justify-center relative">
        <div className="text-blue-600/20 font-bold text-5xl">BLOG</div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 group-hover:opacity-0 transition-opacity duration-300"></div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
        Read More <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </div>
  </Link>
);

const BlogSection = () => {
  const blogPosts = [
    { id: 1, title: 'How to Write a Winning Resume', description: 'Learn the key elements of a successful resume that will help you stand out from the competition.' },
    { id: 2, title: 'Top 10 Resume Mistakes to Avoid', description: 'Discover common resume mistakes that could be costing you interviews and how to fix them.' },
    { id: 3, title: 'Tailoring Your Resume for Different Jobs', description: 'Find out why customizing your resume for each application increases your chances of success.' },
    { id: 4, title: 'Showcasing Skills on Your Resume', description: 'Learn effective techniques to highlight your skills and make them stand out to potential employers.' },
    { id: 5, title: 'Crafting the Perfect Cover Letter', description: 'Understand the key components of a compelling cover letter that complements your resume.' },
    { id: 6, title: 'Acing Your Job Interview', description: 'Get practical tips and strategies for preparing for job interviews and making a great impression.' },
    { id: 7, title: 'Building a Professional Online Presence', description: 'Learn how to create a consistent personal brand across platforms to enhance your job search.' },
  ];

  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <AnimatedSection animation="fade-up" delay={100}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              Career Insights & Tips
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Explore our collection of expert articles to help you navigate your career path and land your dream job
            </p>
          </AnimatedSection>
        </div>
        
        <div className="relative">
          <AnimatedSection animation="fade-right" delay={500} className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-20 md:-translate-x-5 lg:-translate-x-7">
            <button
              onClick={scrollLeft}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
            </button>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-left" delay={500} className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-20 md:translate-x-5 lg:translate-x-7">
            <button
              onClick={scrollRight}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </button>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <div 
              ref={containerRef} 
              className="flex overflow-x-auto gap-6 pb-8 px-2 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {blogPosts.map((post, index) => (
                <AnimatedSection 
                  key={post.id} 
                  animation="zoom-in" 
                  delay={600 + index * 100}
                  duration={800}
                >
                  <BlogCard 
                    title={post.title} 
                    description={post.description} 
                    id={post.id}
                  />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
        
        <AnimatedSection animation="fade-up" delay={1200} className="text-center mt-8">
          <Link to="/blog">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8">
              View All Articles
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BlogSection;