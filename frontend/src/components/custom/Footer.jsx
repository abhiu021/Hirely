import React from 'react';
import { Button } from '../ui/button';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, ChevronRight } from 'lucide-react';
import AnimatedSection, { AnimatedStagger } from '../ui/animated-section';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
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
                <a href="https://facebook.com" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  <Instagram size={20} />
                </a>
                <a href="https://linkedin.com" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
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
                  <a href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> About Us
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Blog
                  </a>
                </li>
                <li>
                  <a href="/templates" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Resume Templates
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Pricing
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </AnimatedSection>
          
          {/* Legal */}
          <AnimatedSection animation="fade-up" delay={300}>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <ChevronRight size={14} className="mr-1" /> Cookie Policy
                  </a>
                </li>
              </ul>
              
              {/* Contact Info */}
              <h3 className="text-lg font-semibold mt-6 mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Phone size={16} className="mr-2 mt-1 text-gray-400" />
                  <span className="text-gray-300">(123) 456-7890</span>
                </li>
                <li className="flex items-start">
                  <Mail size={16} className="mr-2 mt-1 text-gray-400" />
                  <a href="mailto:info@hirely.com" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">info@hirely.com</a>
                </li>
              </ul>
            </div>
          </AnimatedSection>
          
          {/* Newsletter */}
          <AnimatedSection animation="fade-up" delay={400}>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Subscribe to Newsletter</h3>
              <p className="text-gray-300 mb-4">
                Get the latest resume tips and career advice delivered to your inbox.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-r-md rounded-l-none px-3">
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Bottom section */}
        <AnimatedSection animation="fade-up" delay={500} className="pt-6 border-t border-gray-700 text-center sm:flex sm:justify-between sm:text-left">
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