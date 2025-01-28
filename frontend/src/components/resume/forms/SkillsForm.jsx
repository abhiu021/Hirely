import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';

const SkillsForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills');
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/skills', { name: newSkill });
      console.log('Skill saved:', response.data); // Add logging here
      setSkills([...skills, response.data]);
      setNewSkill('');
      localStorage.setItem('skills', JSON.stringify([...skills, response.data]));
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`);
      const updatedSkills = skills.filter(skill => skill._id !== id);
      setSkills(updatedSkills);
      localStorage.setItem('skills', JSON.stringify(updatedSkills));
    } catch (error) {
      console.error('Error deleting skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure all skills are saved before navigating
      const savedSkills = await Promise.all(skills.map(async (skill) => {
        if (!skill._id) {
          const response = await axios.post('http://localhost:5000/api/skills', { name: skill.name });
          return response.data;
        }
        return skill;
      }));
      setSkills(savedSkills);
      localStorage.setItem('skills', JSON.stringify(savedSkills));
      navigate('/resume/preview'); // Navigate to the Preview page
    } catch (error) {
      console.error('Error saving skills:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Skills</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
            disabled={loading}
          >
            <FaPlus className="mr-2" /> Add Skill
          </button>
        </div>
        <ul>
          {skills.map((skill) => (
            <li key={skill._id || skill.name} className="flex justify-between items-center mb-2">
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill._id)}
                className="text-red-600 hover:text-red-700 flex items-center"
                disabled={loading}
              >
                <FaTrash className="mr-2" /> Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Skills'}
        </button>
      </form>
    </div>
  );
};

export default SkillsForm;