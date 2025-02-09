import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <header className="bg-white text-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="container mx-auto flex items-center justify-between py-4 px-6 relative z-10">
        <div className="flex items-center">
          <Link to={'/dashboard'}>
            <img src='/logo.svg' className='cursor-pointer' width={100} height={100} alt="Logo" />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link className="text-gray-700 hover:text-blue-600" to="/">Home</Link>
          <Link className="text-gray-700 hover:text-blue-600" to="/blog">Blog</Link>
          <Link className="text-gray-700 hover:text-blue-600" to="/about-us">About Us</Link>
          <Link className="text-gray-700 hover:text-blue-600" to="/contact-us">Contact Us</Link>
          {isSignedIn ? (
            <Link className="text-gray-700 hover:text-blue-600" to="/dashboard">Dashboard</Link>
          ) : (
            <Link className="text-gray-700 hover:text-blue-600" to="/auth/sign-in">Login</Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <div className="flex gap-2 items-center">
              <UserButton />
            </div>
          ) : (
            <Link to={'/auth/sign-in'}>
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
      
    </header>
  );
};

export default Header;