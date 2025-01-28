import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExperienceForm = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([{
    title: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false
  }]);

  const addExperience = () => {
    setExperiences([...experiences, {
      title: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false
    }]);
  };

  const removeExperience = (index) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const experience of experiences) {
        if (!experience.title || !experience.company || !experience.description || !experience.startDate) {
          alert('Please fill in all required fields');
          return;
        }
      }
      const response = await axios.post('http://localhost:5000/api/experience', experiences);
      console.log('Response received:', response.data); // Add logging here
      navigate('/resume/education'); // Replace '/education-form' with the actual path to your education form
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Experience</h1>
      <form onSubmit={handleSubmit}>
        {experiences.map((exp, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={exp.title}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[index].title = e.target.value;
                setExperiences(newExp);
              }}
              className="w-full p-2 border rounded-lg mb-2"
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
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              type="date"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[index].startDate = e.target.value;
                setExperiences(newExp);
              }}
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              type="date"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[index].endDate = e.target.value;
                setExperiences(newExp);
              }}
              className="w-full p-2 border rounded-lg mb-2"
            />
            <div className="flex items-center mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.currentlyWorking}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index].currentlyWorking = e.target.checked;
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
              required
            />
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
        >
          Add Experience
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save Experience
        </button>
      </form>
    </div>
  );
};

export default ExperienceForm;