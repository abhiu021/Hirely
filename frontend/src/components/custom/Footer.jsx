import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';
import AnimatedSection from '../ui/animated-section';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Function to handle smooth scrolling to templates section
  const scrollToTemplates = (e) => {
    e.preventDefault();
    
    if (isHomePage) {
      // If on home page, scroll to templates section
      const templatesSection = document.getElementById('templates');
      if (templatesSection) {
        templatesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on any other page, navigate to home page templates section
      window.location.href = '/#templates';
    }
  };
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Company Info */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div>
              <div className="flex items-center mb-6">
                <img src='/logo.svg' className='w-10 h-10 mr-2' alt="Hirely Logo" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Hirely</span>
              </div>
              <p className="text-gray-300 mb-6">
                We help job seekers create professional resumes and cover letters that get noticed by employers.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Instagram size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Quick Links */}
          <AnimatedSection animation="fade-up" delay={200}>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Blog
                  </Link>
                </li>
                <li>
                  <a 
                    href={isHomePage ? "#templates" : "/#templates"} 
                    onClick={scrollToTemplates}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center cursor-pointer"
                  >
                    <ChevronRight size={14} className="mr-1" /> Resume Templates
                  </a>
                </li>
                <li>
                  <Link to="/about-us" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> About Us
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Bottom section */}
        <AnimatedSection animation="fade-up" delay={300} className="pt-6 border-t border-gray-700 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-gray-400 text-sm">
            © {currentYear} Hirely. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            Made with ❤️ for job seekers worldwide
          </p>
        </AnimatedSection>
      </div>
    </footer>
  );
};

export default Footer;