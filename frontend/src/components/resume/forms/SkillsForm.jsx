import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SkillsForm = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const resumeId = localStorage.getItem('resumeId');
        if (resumeId) {
          const response = await axios.get(`http://localhost:5000/api/skills/${resumeId}`);
          setSkills(response.data);
        } else {
          setError('Resume ID not found');
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Error fetching skills');
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setLoading(true);
    try {
      const resumeId = localStorage.getItem('resumeId');
      if (resumeId) {
        const response = await axios.post(`http://localhost:5000/api/skills/${resumeId}`, { name: newSkill });
        setSkills([...skills, response.data]);
        setNewSkill('');
      } else {
        setError('Resume ID not found');
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      setError('Error saving skill');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    navigate('/resume/preview');
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Skills</h1>
      <form onSubmit={handleAddSkill}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Add Skill'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </form>
      <ul>
        {skills.map(skill => (
          <li key={skill._id}>{skill.name}</li>
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

export default SkillsForm;