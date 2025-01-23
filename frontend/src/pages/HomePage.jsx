// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-300 text-center text-white py-20">
      <div className="container mx-auto px-6">
        <img
          src="/assets/logo.png"
          alt="JobReady Logo"
          className="mx-auto w-24 mb-8"
        />
        <h1 className="text-2xl font-bold mb-2">
          Your dream job is waiting for you
        </h1>
        <p className="mb-12">All you have to do is JobReady</p>
        <div className="flex justify-center space-x-8">
          <Link to="/editor">
            <button className="bg-white text-blue-900 py-4 px-8 rounded-lg shadow-md hover:bg-gray-200">
              Build a new Resume
            </button>
          </Link>
          <Link to="/editor">
            <button className="bg-white text-blue-900 py-4 px-8 rounded-lg shadow-md hover:bg-gray-200">
              Edit your old Resume
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

