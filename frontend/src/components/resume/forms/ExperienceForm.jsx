import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExperienceForm = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const resumeId = localStorage.getItem('resumeId');
        if (resumeId) {
          const response = await axios.get(`http://localhost:5000/api/experience/${resumeId}`);
          setExperiences(response.data);
        } else {
          setError('Resume ID not found');
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setError('Error fetching experiences');
      }
    };

    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resumeId = localStorage.getItem('resumeId');
      if (resumeId) {
        const response = await axios.post(`http://localhost:5000/api/experience/${resumeId}`, newExperience);
        setExperiences([...experiences, response.data]);
        setNewExperience({
          title: '',
          company: '',
          description: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false
        });
      } else {
        setError('Resume ID not found');
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      setError('Error saving experience');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    navigate('/resume/education');
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Experience</h1>
      <form onSubmit={handleAddExperience}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={newExperience.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            name="company"
            value={newExperience.company}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={newExperience.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={newExperience.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={newExperience.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
            disabled={newExperience.currentlyWorking}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            <input
              type="checkbox"
              name="currentlyWorking"
              checked={newExperience.currentlyWorking}
              onChange={handleChange}
              className="mr-2"
            />
            Currently Working
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Experience'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
      <ul>
        {experiences.map((experience) => (
          <li key={experience._id}>
            <p><strong>Title:</strong> {experience.title}</p>
            <p><strong>Company:</strong> {experience.company}</p>
            <p><strong>Description:</strong> {experience.description}</p>
            <p><strong>Start Date:</strong> {experience.startDate}</p>
            <p><strong>End Date:</strong> {experience.endDate}</p>
            <p><strong>Currently Working:</strong> {experience.currentlyWorking ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Next
      </button>
    </div>
  );
};

export default ExperienceForm;