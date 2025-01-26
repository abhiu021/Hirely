import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-gray-800">
                            Hirely
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
                            Jobs
                        </Link>
                        <Link to="/companies" className="text-gray-600 hover:text-gray-900">
                            Companies
                        </Link>
                        <Link to="/login" className="text-gray-600 hover:text-gray-900">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;