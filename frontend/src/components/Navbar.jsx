// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">JobReady</h1>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/profile" className="hover:underline">Profile</Link></li>
          <li><Link to="/editor" className="hover:underline">CV Editor</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
