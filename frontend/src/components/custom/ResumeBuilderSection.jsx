import React from 'react';
import { Button } from '../ui/button';
import { FileTextIcon } from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';
import professionalTemplate from '../../assets/professional_template.jpg';
import minimalAtsTemplate from '../../assets/minimal-ats_template.jpg';
import modernTemplate from '../../assets/modern_template.jpg';
import { Link } from 'react-router-dom';

const TemplateCard = ({ image, name }) => (
  <div 
    className="group relative transition-all duration-300 transform hover:-translate-y-2"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-purple-600/80 opacity-0 group-hover:opacity-90 rounded-xl transition-opacity duration-300 flex items-center justify-center">
      <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20 hover:text-white" asChild>
        <Link to="/dashboard">
          <FileTextIcon className="mr-2 h-4 w-4" />
          Use Template
        </Link>
      </Button>
    </div>
    <img
      src={image}
      alt={`${name} Template`}
      className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
    />
  </div>
);

const ResumeBuilderSection = () => {
  const templates = [
    { id: 1, image: professionalTemplate, name: "Professional" },
    { id: 2, image: modernTemplate, name: "Modern" },
    { id: 3, image: minimalAtsTemplate, name: "Minimal ATS" }
  ];

  return (
    <section id="templates" className="py-24 relative overflow-hidden">
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
              Choose from our professional templates and start building your impressive resume today!
            </p>
          </AnimatedSection>
        </div>
        
        <div className="relative">
          {/* Resume Template Cards */}
          <AnimatedStagger
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
            animation="zoom-in"
            baseDelay={700}
            staggerDelay={150}
          >
            {templates.map((template) => (
              <TemplateCard key={template.id} image={template.image} name={template.name} />
            ))}
          </AnimatedStagger>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilderSection;