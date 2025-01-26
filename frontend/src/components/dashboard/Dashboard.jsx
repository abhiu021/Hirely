import React from 'react';

const Dashboard = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Resumes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">{resume.title}</h3>
              <p className="text-gray-600 mb-4">Last edited: {resume.lastEdited}</p>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-700">Edit</button>
                <button className="text-blue-600 hover:text-blue-700">Download</button>
                <button className="text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const resumes = [
  {
    id: 1,
    title: "Software Developer Resume",
    lastEdited: "2024-03-15"
  },
  // Add more resumes...
];

export default Dashboard;