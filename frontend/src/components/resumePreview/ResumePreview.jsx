import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaPrint, FaEdit } from 'react-icons/fa';

const ResumePreview = () => {
  const [resumeData, setResumeData] = useState({
    personal: {},
    experience: [],
    education: [],
    skills: []
  });

  useEffect(() => {
    const loadResumeData = () => {
      const personal = JSON.parse(localStorage.getItem('personalInfo')) || {};
      const experience = JSON.parse(localStorage.getItem('experience')) || [];
      const education = JSON.parse(localStorage.getItem('education')) || [];
      const skills = JSON.parse(localStorage.getItem('skills')) || [];

      setResumeData({ personal, experience, education, skills });
    };

    loadResumeData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Resume Preview</h1>
        <div className="space-x-4">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPrint className="inline mr-2" />
            Print
          </button>
          <button 
            onClick={() => {/* Download logic */}}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaDownload className="inline mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {resumeData.personal.firstName} {resumeData.personal.lastName}
          </h2>
          <p className="text-gray-600">
            {resumeData.personal.email} | {resumeData.personal.phone}
          </p>
        </div>

        {/* Experience Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Experience</h3>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold">{exp.title}</h4>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              <p className="mt-2">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold">{edu.degree}</h4>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate}
              </p>
              <p className="mt-2">{edu.description}</p>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;