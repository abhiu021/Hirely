import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaRegCopy, FaDownload, FaStar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Your Professional Resume <br />
            <span className="text-blue-600">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build a stunning resume with our easy-to-use builder. Choose from expert-designed templates and land your dream job.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/resume" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Resume
            </Link>
            <Link 
              to="/templates" 
              className="bg-gray-100 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              View Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 text-xl" />
              <span className="ml-2 text-gray-600">4.8/5 Rating</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-gray-600">Trusted by 1M+ professionals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <FaFileAlt className="text-blue-600 text-xl" />,
    title: "Professional Templates",
    description: "Choose from our collection of ATS-friendly templates designed by experts."
  },
  {
    icon: <FaRegCopy className="text-blue-600 text-xl" />,
    title: "Easy to Customize",
    description: "Customize your resume with our intuitive drag-and-drop builder."
  },
  {
    icon: <FaDownload className="text-blue-600 text-xl" />,
    title: "Download Instantly",
    description: "Download your resume in PDF format, ready to send to employers."
  }
];

export default Home;