import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Initialize form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/resume/personal', formData);
      localStorage.setItem('personalInfo', JSON.stringify(formData));
      localStorage.setItem('resumeId', response.data.resumeId);
      navigate('/resume/experience');
    } catch (error) {
      console.error('Error saving personal info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Personal Information</h2>
      <div className="grid grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        className="w-full p-2 border rounded-lg"
      />
      
      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        
        <div className="space-x-4">
          <button
            type="submit"
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
    </form>
  );
};

export default PersonalForm;