import React from 'react';
import Header from '@/components/custom/Header';
import Footer from '@/components/custom/Footer';
import AnimatedSection from '@/components/ui/animated-section';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamMember = ({ name, year, linkedin }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
    <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden" style={{maxHeight: "160px"}}>
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-4xl font-bold text-blue-600/30">{name.charAt(0)}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
      <div className="space-y-1 mb-3">
        <p className="text-gray-600 text-xs"><span className="font-medium">College:</span> Malaviya National Institute of Technology</p>
        <p className="text-gray-600 text-xs"><span className="font-medium">Year:</span> {year}</p>
      </div>
      <div className="flex space-x-2 pt-2 border-t border-gray-100">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
            <Linkedin size={16} />
          </a>
        )}
      </div>
    </div>
  </div>
);

const AboutUs = () => {
  // Team data from LinkedIn profiles
  const teamMembers = [
    {
      name: 'Mahesh Sharma',
      year: '2nd Year',
      linkedin: 'https://www.linkedin.com/in/mahesh-sharma-1b836a289/'
    },
    {
      name: 'Ravinder Singh',
      year: '2nd Year',
      linkedin: 'https://www.linkedin.com/in/ravinder-singh-629004286/'
    },
    {
      name: 'Abhinav Ukharde',
      year: '2nd Year',
      linkedin: 'https://www.linkedin.com/in/abhinav-ukharde-b3337728b/'
    },
    {
      name: 'Abhinav Gangwar',
      year: '2nd Year',
      linkedin: 'https://www.linkedin.com/in/abhinav-gangwar-b70805296/'
    }
  ];

  return (
    <div className="font-roboto min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <Header />
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection animation="fade-up" delay={100}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Meet Our Team
                  </span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-up" delay={300}>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  We're a passionate group of students dedicated to creating innovative resume solutions that help job seekers stand out.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-12 relative">
          <AnimatedSection animation="fade-up" delay={400}>
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
              The Talented People Behind Hirely
            </h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {teamMembers.map((member, index) => (
              <AnimatedSection key={member.name} animation="fade-up" delay={500 + index * 100}>
                <TeamMember {...member} />
              </AnimatedSection>
            ))}
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 relative">
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
          
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-gray-100 shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <AnimatedSection animation="fade-up" delay={300}>
              <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
                Our Mission
              </h2>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="text-gray-700 text-lg mb-6">
                At Hirely, we believe that everyone deserves access to tools that help them showcase their skills and experience effectively. Our mission is to democratize the resume creation process and empower job seekers to present themselves in the best possible light.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={500}>
              <p className="text-gray-700 text-lg mb-6">
                As students ourselves, we understand the challenges of entering the job market. That's why we've created a platform that combines cutting-edge AI technology with beautiful design to make resume creation simple, effective, and accessible to all.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-up" delay={600}>
              <div className="flex justify-center mt-8">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full" asChild>
                  <a href="/#templates">
                    Explore Our Templates
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs; 