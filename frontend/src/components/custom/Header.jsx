import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X, Home } from 'lucide-react';
import AnimatedSection from '../ui/animated-section';

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToTemplates = (e) => {
    e.preventDefault();
    const templatesSection = document.getElementById('templates');
    if (templatesSection) {
      templatesSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMenuOpen) {
      toggleMenu();
    }
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
                location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              } transition duration-200`} 
              to="/"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium" to="/blog">Blog</Link>
            <a 
              href="#templates" 
              onClick={scrollToTemplates}
              className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium cursor-pointer"
            >
              Resume Templates
            </a>
            <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium" to="/about-us">About Us</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex gap-3 items-center">
                <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium" to="/dashboard">Dashboard</Link>
                <div className="h-5 w-px bg-gray-200"></div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to={'/auth/sign-in'} className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium">
                  Sign In
                </Link>
                <Link to={'/dashboard'}>
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

      {/* Mobile Menu */}
      <AnimatedSection
        animation={isMenuOpen ? "fade-up" : "fade-down"}
        delay={0}
        duration={300}
        className={`absolute top-20 left-4 right-4 md:hidden bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 py-3 px-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none transform -translate-y-4"
        }`}
      >
        <nav className="flex flex-col space-y-3">
          <Link 
            className={`flex items-center text-sm font-medium ${
              location.pathname === '/' 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-blue-600'
            } transition duration-200`} 
            to="/" 
            onClick={toggleMenu}
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium flex items-center" to="/blog" onClick={toggleMenu}>
            Blog
          </Link>
          <a 
            href="#templates"
            onClick={scrollToTemplates}
            className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium flex items-center cursor-pointer"
          >
            Resume Templates
          </a>
          <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium flex items-center" to="/about-us" onClick={toggleMenu}>
            About Us
          </Link>
          
          {isSignedIn ? (
            <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium flex items-center" to="/dashboard" onClick={toggleMenu}>
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col space-y-2 pt-1">
              <Link to={'/auth/sign-in'} className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm font-medium" onClick={toggleMenu}>
                Sign In
              </Link>
              <Link to={'/dashboard'} onClick={toggleMenu}>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full rounded-full text-xs h-8">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </AnimatedSection>
    </header>
  );
};

export default Header;