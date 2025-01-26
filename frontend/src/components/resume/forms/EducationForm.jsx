import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const EducationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState([{
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    description: ''
  }]);

  useEffect(() => {
    const savedData = localStorage.getItem('education');
    if (savedData) {
      setEducation(JSON.parse(savedData));
    }
  }, []);

  const addEducation = () => {
    setEducation([...education, {
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resumeId = localStorage.getItem('resumeId');
      await axios.post('http://localhost:5000/api/resume/education', {
        resumeId,
        education
      });

      localStorage.setItem('education', JSON.stringify(education));
      navigate('/resume/skills');
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      <form onSubmit={handleSubmit}>
        {education.map((edu, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Degree/Certificate"
                value={edu.degree}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index].degree = e.target.value;
                  setEducation(newEdu);
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index].institution = e.target.value;
                  setEducation(newEdu);
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index].startDate = e.target.value;
                  setEducation(newEdu);
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index].endDate = e.target.value;
                  setEducation(newEdu);
                }}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <textarea
              placeholder="Description"
              value={edu.description}
              onChange={(e) => {
                const newEdu = [...education];
                newEdu[index].description = e.target.value;
                setEducation(newEdu);
              }}
              className="w-full p-2 border rounded-lg mb-4"
              rows="3"
            />
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-700 flex items-center"
              disabled={education.length === 1}
            >
              <FaTrash className="mr-2" />
              Remove
            </button>
          </div>
        ))}
        
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <FaPlus className="mr-2" />
            Add Education
          </button>
          
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => navigate('/resume/experience')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg bg-blue-600 text-white ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;