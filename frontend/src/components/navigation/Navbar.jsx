import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Resume Builder</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/templates" className="text-gray-700 hover:text-gray-900">Templates</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
            <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;