import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';

const ReviewCard = ({ name, review, rating }) => (
  <div className="flex-shrink-0 w-[350px] bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group">
    {/* Decorative quote mark */}
    <div className="absolute -bottom-6 -right-6 text-gray-100 opacity-30">
      <Quote size={80} />
    </div>
    
    {/* Rating */}
    <div className="flex items-center mb-4 relative z-10">
      <div className="flex text-yellow-400 mr-2">
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" className="mr-0.5" />
        ))}
      </div>
    </div>
    
    {/* Review text */}
    <p className="text-gray-700 mb-6 relative z-10 italic">{review}</p>
    
    {/* Reviewer name */}
    <h3 className="text-lg font-semibold relative z-10 group-hover:text-blue-600 transition-colors duration-300">
      {name}
    </h3>
  </div>
);

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      review: '"Hirely made creating my resume so easy and fast. The AI suggestions were spot-on and helped me land interviews at top companies!"',
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 5,
      review: '"The templates are beautiful and professional. I received compliments from recruiters about how well-designed my resume was."',
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: 5,
      review: '"I love how easy it is to customize my resume with Hirely. In less than an hour, I had a polished, professional document."',
    },
    {
      id: 4,
      name: 'Emily Johnson',
      rating: 5,
      review: '"The AI optimization feature helped me tailor my resume for different job applications. I started getting callbacks right away!"',
    },
    {
      id: 5,
      name: 'David Wilson',
      rating: 5,
      review: '"Hirely helped me land my dream job after months of searching. The ATS-friendly templates made all the difference."',
    },
    {
      id: 6,
      name: 'Sarah Davis',
      rating: 5,
      review: '"The customer support team went above and beyond to help me perfect my resume. They genuinely care about your success."',
    },
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
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <AnimatedSection animation="fade-up" delay={100}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              What Our Users Say
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Thousands of job seekers have used Hirely to create professional resumes and land their dream jobs
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
              {reviews.map((review, index) => (
                <AnimatedSection 
                  key={review.id} 
                  animation="zoom-in" 
                  delay={600 + index * 100}
                  duration={800}
                >
                  <ReviewCard
                    name={review.name}
                    review={review.review}
                    rating={review.rating}
                  />
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
        
        <AnimatedSection 
          animation="fade-up" 
          delay={1200} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mt-16 max-w-4xl mx-auto text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to create your perfect resume?</h3>
          <p className="mb-6 opacity-90">Join thousands of successful job seekers who have already advanced their careers with Hirely</p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-8 rounded-full transition-colors duration-300">
            Get Started Now — It's Free
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ReviewsSection;