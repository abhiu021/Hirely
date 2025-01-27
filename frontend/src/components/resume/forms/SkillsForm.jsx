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
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      localStorage.setItem('skills', JSON.stringify(updatedSkills));
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    localStorage.setItem('skills', JSON.stringify(updatedSkills));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resumeId = localStorage.getItem('resumeId');
      await axios.post('http://localhost:5000/api/resume/skills', {
        resumeId,
        skills
      });
      localStorage.setItem('skills', JSON.stringify(skills));
      localStorage.setItem('resumeId', resumeId);
      navigate('/resume/preview');
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Failed to save skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      
      {/* Add Skill Form */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter a skill"
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleAddSkill}
          disabled={loading || !newSkill.trim()}
          className={`px-6 py-2 rounded-lg ${
            loading || !newSkill.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {loading ? 'Adding...' : 'Add Skill'}
        </button>
      </div>

      {/* Skills List */}
      <div className="space-y-2 mb-8">
        {skills.map((skill, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>{skill.skill || skill}</span>
            <button
              onClick={() => handleRemoveSkill(index)}
              disabled={loading}
              className={`text-red-600 hover:text-red-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Form Controls */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() => navigate('/resume/education')}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
