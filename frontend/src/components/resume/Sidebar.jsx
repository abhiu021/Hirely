import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBriefcase, FaGraduationCap, FaTools } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSectionClick = (sectionId) => {
    navigate(`/resume/${sectionId}`);
  };

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Resume Sections</h2>
        <nav className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                location.pathname.includes(section.id)
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {section.icon}
              <span className="ml-3">{section.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const sections = [
  { id: 'personal', title: 'Personal Info', icon: <FaUser /> },
  { id: 'experience', title: 'Experience', icon: <FaBriefcase /> },
  { id: 'education', title: 'Education', icon: <FaGraduationCap /> },
  { id: 'skills', title: 'Skills', icon: <FaTools /> }
];

export default Sidebar;