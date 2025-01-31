import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EducationForm = () => {
  const navigate = useNavigate();
  const [educations, setEducations] = useState([]);
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    currentlyStudying: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const resumeId = localStorage.getItem('resumeId');
        if (resumeId) {
          const response = await axios.get(`http://localhost:5000/api/education/${resumeId}`);
          setEducations(response.data);
        } else {
          setError('Resume ID not found');
        }
      } catch (error) {
        console.error('Error fetching educations:', error);
        setError('Error fetching educations');
      }
    };

    fetchEducations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resumeId = localStorage.getItem('resumeId');
      if (resumeId) {
        const response = await axios.post(`http://localhost:5000/api/education/${resumeId}`, newEducation);
        setEducations([...educations, response.data]);
        setNewEducation({
          school: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          currentlyStudying: false
        });
        navigate('/resume/skills');
      } else {
        setError('Resume ID not found');
      }
    } catch (error) {
      console.error('Error saving education:', error);
      setError('Error saving education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Education</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">School</label>
          <input
            type="text"
            name="school"
            value={newEducation.school}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Degree</label>
          <input
            type="text"
            name="degree"
            value={newEducation.degree}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Field of Study</label>
          <input
            type="text"
            name="fieldOfStudy"
            value={newEducation.fieldOfStudy}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={newEducation.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={newEducation.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mb-2"
            disabled={newEducation.currentlyStudying}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            <input
              type="checkbox"
              name="currentlyStudying"
              checked={newEducation.currentlyStudying}
              onChange={handleChange}
              className="mr-2"
            />
            Currently Studying
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
      <ul>
        {educations.map((education) => (
          <li key={education._id}>
            <p><strong>School:</strong> {education.school}</p>
            <p><strong>Degree:</strong> {education.degree}</p>
            <p><strong>Field of Study:</strong> {education.fieldOfStudy}</p>
            <p><strong>Start Date:</strong> {education.startDate}</p>
            <p><strong>End Date:</strong> {education.endDate}</p>
            <p><strong>Currently Studying:</strong> {education.currentlyStudying ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EducationForm;