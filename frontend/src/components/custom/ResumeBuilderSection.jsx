import React from 'react';
import { Button } from '../ui/button';
import { FileTextIcon } from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';

const TemplateCard = ({ template }) => (
  <div 
    className="group relative transition-all duration-300 transform hover:-translate-y-2"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-purple-600/80 opacity-0 group-hover:opacity-90 rounded-xl transition-opacity duration-300 flex items-center justify-center">
      <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20 hover:text-white">
        <FileTextIcon className="mr-2 h-4 w-4" />
        Use Template
      </Button>
    </div>
    <img
      src={`https://storage.googleapis.com/a1aa/image/template${template}.jpg`}
      alt={`Template ${template}`}
      className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
    />
  </div>
);

const ResumeBuilderSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-purple-50/50 to-transparent"></div>
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <AnimatedSection animation="fade-up" delay={100}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              Create Your Perfect Resume with Ease
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-4">
              Use our intuitive AI-powered resume builder to craft the perfect application document in just minutes. 
              With a wide range of customizable templates available, you're guaranteed to create a standout resume.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={500}>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Explore our extensive library of templates for inspiration. Start building your impressive resume today!
            </p>
          </AnimatedSection>
        </div>
        
        <div className="relative">
          {/* Resume Template Cards */}
          <AnimatedStagger
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
            animation="zoom-in"
            baseDelay={700}
            staggerDelay={150}
          >
            {[1, 2, 3, 4].map((template) => (
              <TemplateCard key={template} template={template} />
            ))}
          </AnimatedStagger>
          
          {/* View more button */}
          <AnimatedSection animation="fade-up" delay={1300} className="mt-12 text-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-8 rounded-full">
              Browse All Templates
            </Button>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilderSection;