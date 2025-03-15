import React from 'react';
import { 
  Shield, 
  FileCheck, 
  PanelTop, 
  Users, 
  FileText, 
  Zap 
} from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';

const AdvantageCard = ({ icon: Icon, title, description, index }) => (
  <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
    {/* Decorative number in background */}
    <div className="absolute -bottom-6 -right-6 text-9xl font-bold text-gray-50 opacity-20 select-none transition-transform duration-300 group-hover:scale-110">
      {index + 1}
    </div>
    
    {/* Icon */}
    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 mb-6 relative z-10">
      <Icon size={24} />
    </div>
    
    {/* Content */}
    <h3 className="text-xl font-semibold mb-3 relative z-10">{title}</h3>
    <p className="text-gray-600 relative z-10">{description}</p>
  </div>
);

const AdvantagesSection = () => {
  const advantages = [
    { 
      title: 'Effortless Resume Creation', 
      description: 'Create your resume quickly with pre-formatted sections and bullet points. Our AI helps you customize and optimize content.', 
      icon: FileText 
    },
    { 
      title: 'Showcase Your Portfolio', 
      description: 'Transform your resume into a stunning portfolio that highlights your work and achievements with visually appealing formats.', 
      icon: PanelTop 
    },
    { 
      title: 'Diverse Template Options', 
      description: 'Choose from a wide range of professionally designed templates to suit your personal style and career goals.', 
      icon: FileCheck 
    },
    { 
      title: 'Data Security', 
      description: 'Your privacy is our priority. All personal information is encrypted and kept confidential with industry-leading security.', 
      icon: Shield 
    },
    { 
      title: 'HR Expert Insights', 
      description: 'Access articles and templates reviewed by HR professionals for reliable job application advice and interview preparation.', 
      icon: Users 
    },
    { 
      title: 'ATS Optimization', 
      description: 'Our templates are designed to pass applicant tracking systems with optimized keywords and formatting to increase visibility.', 
      icon: Zap 
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent to-blue-50/70"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10 px-4 sm:px-6">
        <div className="text-center mb-16">
          <AnimatedSection animation="fade-up" delay={100}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              The advantages of using <span className="font-bold">Hirely</span>
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4 text-base sm:text-lg">
              Our resume builder offers powerful features to help you create professional, 
              eye-catching resumes that get noticed by employers and pass ATS scans.
            </p>
          </AnimatedSection>
        </div>
        
        <AnimatedStagger
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          animation="fade-up"
          baseDelay={400}
          staggerDelay={150}
        >
          {advantages.map((advantage, index) => (
            <AdvantageCard 
              key={index}
              title={advantage.title} 
              description={advantage.description}
              icon={advantage.icon}
              index={index}
            />
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
};

export default AdvantagesSection;