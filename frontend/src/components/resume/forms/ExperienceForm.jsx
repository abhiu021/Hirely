import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const ExperienceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([{
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  useEffect(() => {
    const savedData = localStorage.getItem('experience');
    if (savedData) {
      setExperiences(JSON.parse(savedData));
    }
  }, []);

  const addExperience = () => {
    setExperiences([...experiences, {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resumeId = localStorage.getItem('resumeId');
      const response = await axios.post('http://localhost:5000/api/resume/experience', {
        resumeId,
        experiences
      });

      localStorage.setItem('experience', JSON.stringify(experiences));
      navigate('/resume/education');
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
      <form onSubmit={handleSubmit}>
        {experiences.map((exp, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[index].title = e.target.value;
                  setExperiences(newExp);
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[index].company = e.target.value;
                  setExperiences(newExp);
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[index].location = e.target.value;
                setExperiences(newExp);
              }}
              className="w-full p-2 border rounded-lg mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[index].startDate = e.target.value;
                  setExperiences(newExp);
                }}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="date"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[index].endDate = e.target.value;
                  setExperiences(newExp);
                }}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index].current = e.target.checked;
                    if (e.target.checked) {
                      newExp[index].endDate = '';
                    }
                    setExperiences(newExp);
                  }}
                  className="mr-2"
                />
                <span>I currently work here</span>
              </label>
            </div>

            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[index].description = e.target.value;
                setExperiences(newExp);
              }}
              className="w-full p-2 border rounded-lg mb-4"
              rows="4"
            />

            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700 flex items-center"
              disabled={experiences.length === 1}
            >
              <FaTrash className="mr-2" />
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <FaPlus className="mr-2" />
            Add Experience
          </button>

          <div className="space-x-4">
            <button
              type="button"
              onClick={() => navigate('/resume/personal')}
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

export default ExperienceForm;