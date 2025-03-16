import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X, ChevronDown, Home, FileText } from 'lucide-react';
import AnimatedSection from '@/components/ui/animated-section';

const DashboardHeader = () => {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3">
      <AnimatedSection 
        animation="fade-down" 
        delay={100}
        className={`bg-white/80 backdrop-blur-lg rounded-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.1)] transition-all duration-300 max-w-6xl w-full ${
          scrolled ? 'py-1 bg-white/95' : 'py-2'
        }`}
      >
        <div className={`flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
          scrolled ? 'py-0.5' : 'py-1'
        }`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to={'/'} className="flex items-center">
              <img src='/logo.svg' className='cursor-pointer' width={scrolled ? 32 : 34} height={scrolled ? 32 : 34} alt="Hirely Logo" />
              <span className="ml-2 text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Hirely</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-5 items-center">
            <Link 
              className={`flex items-center text-sm font-medium ${
                location.pathname === '/dashboard' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              } transition duration-200`} 
              to="/dashboard"
            >
              <Home className="w-4 h-4 mr-1" />
              Dashboard
            </Link>
            
            <Link 
              className={`flex items-center text-sm font-medium ${
                location.pathname.includes('/resume') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              } transition duration-200`} 
              to="/dashboard"
            >
              <FileText className="w-4 h-4 mr-1" />
              My Resumes
            </Link>
            
            <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium" to="/blog">Blog</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex gap-3 items-center">
                <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium" to="/">Landing Page</Link>
                <div className="h-5 w-px bg-gray-200"></div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to={'/auth/sign-in'} className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium">
                  Sign In
                </Link>
                <Link to={'/auth/sign-up'}>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3 py-1 h-8 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </AnimatedSection>

      {/* Mobile menu */}
      <AnimatedSection
        animation={isMenuOpen ? "fade-up" : "fade-down"}
        className={`md:hidden fixed top-[70px] left-0 right-0 px-4 z-50 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-100 p-4 mx-auto max-w-sm">
          <nav className="flex flex-col space-y-3">
            <Link 
              className={`flex items-center py-2 px-3 rounded-md ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            
            <Link 
              className={`flex items-center py-2 px-3 rounded-md ${
                location.pathname.includes('/resume') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="w-4 h-4 mr-2" />
              My Resumes
            </Link>
            
            <Link 
              className="py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            <Link 
              className="py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md"
              to="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Landing Page
            </Link>
            
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </div>
      </AnimatedSection>
    </header>
  );
};

export default DashboardHeader; 