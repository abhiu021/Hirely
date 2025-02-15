import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <header className="bg-white text-black relative shadow-sm">
      {/* Header Content */}
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to={'/dashboard'}>
            <img src='/logo.svg' className='cursor-pointer' width={60} height={60} alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4 items-center">
          <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm" to="/">Home</Link>
          <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm" to="/blog">Blog</Link>
          <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm" to="/about-us">About Us</Link>
          <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm" to="/contact-us">Contact Us</Link>
          {isSignedIn ? (
            <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm" to="/dashboard">Dashboard</Link>
          ) : (
            <Link className="text-gray-700 hover:text-blue-600 transition duration-200 text-sm" to="/auth/sign-in">Login</Link>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {isSignedIn ? (
            <div className="flex gap-2 items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Link to={'/auth/sign-in'}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;