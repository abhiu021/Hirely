import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
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
      const response = await axios.post('http://localhost:5000/api/personal', formData);
      localStorage.setItem('personalInfo', JSON.stringify(formData));
      localStorage.setItem('resumeId', response.data._id);
      navigate('/resume/experience');
    } catch (error) {
      console.error('Error saving personal info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Personal Information</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Zip"
          value={formData.zip}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Personal Info'}
        </button>
      </form>
    </div>
  );
};

export default PersonalForm;