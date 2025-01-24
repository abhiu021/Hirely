// src/components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-300 text-center text-white py-20">
      <div className="container mx-auto px-6">
        <img
          src="/path-to-your-logo.png"
          alt="JobReady Logo"
          className="mx-auto w-24 mb-8"
        />
        <h1 className="text-2xl font-bold mb-2">
          Your dream job is waiting for you
        </h1>
        <p className="mb-12">All you have to do is JobReady</p>
        <div className="flex justify-center space-x-8">
          <button 
            onClick={() => navigate('/create-cv')}
            className="bg-white text-blue-900 py-4 px-8 rounded-lg shadow-md hover:bg-gray-200"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">+</span>
              <span>Build a new Resume</span>
            </div>
          </button>
          <button 
            onClick={() => navigate('/update-cv')}
            className="bg-white text-blue-900 py-4 px-8 rounded-lg shadow-md hover:bg-gray-200"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✏️</span>
              <span>Edit your old Resume</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
