import React from 'react';
import { FileTextIcon, LayoutTemplateIcon, DownloadIcon } from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';

const StepCard = ({ number, title, description, icon: Icon }) => (
  <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    {/* Step Number */}
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full h-14 w-14 flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>

    <div className="pt-8">
      <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
        <Icon size={24} />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-center">{description}</p>
    </div>
  </div>
);

const StepsSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Fill in Your Details',
      description: 'Enter your personal information, work experience, and skills. Our AI will help optimize your content.',
      icon: FileTextIcon
    },
    {
      number: 2,
      title: 'Choose a Template',
      description: 'Select from a variety of professional templates designed to impress hiring managers.',
      icon: LayoutTemplateIcon
    },
    {
      number: 3,
      title: 'Download Your Resume',
      description: 'Save your resume in PDF format, ready to help you land your dream job.',
      icon: DownloadIcon
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-blue-50/50"></div>
      
      <div className="container mx-auto text-center relative z-10 px-4 sm:px-6">
        <AnimatedSection animation="fade-up" delay={100}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
            Create your resume in 3 easy steps
          </h2>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay={300}>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-base sm:text-lg">
            Our AI-powered platform makes it simple to create a professional resume that gets noticed by employers
          </p>
        </AnimatedSection>
        
        <AnimatedStagger
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto"
          animation="fade-up"
          baseDelay={500}
          staggerDelay={200}
        >
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
};

export default StepsSection;