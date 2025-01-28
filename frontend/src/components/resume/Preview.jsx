import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Preview = () => {
  const [personalInfo, setPersonalInfo] = useState(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const resumeId = localStorage.getItem('resumeId');
        if (resumeId) {
          const response = await axios.get(`http://localhost:5000/api/personal/${resumeId}`);
          setPersonalInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching personal information:', error);
      }
    };

    fetchPersonalInfo();
  }, []);

  if (!personalInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Personal Information Preview</h1>
      <div className="mb-4">
        <strong>First Name:</strong> {personalInfo.firstName}
      </div>
      <div className="mb-4">
        <strong>Last Name:</strong> {personalInfo.lastName}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {personalInfo.email}
      </div>
      <div className="mb-4">
        <strong>Phone:</strong> {personalInfo.phone}
      </div>
      <div className="mb-4">
        <strong>Address:</strong> {personalInfo.address}
      </div>
      <div className="mb-4">
        <strong>City:</strong> {personalInfo.city}
      </div>
      <div className="mb-4">
        <strong>State:</strong> {personalInfo.state}
      </div>
      <div className="mb-4">
        <strong>Zip:</strong> {personalInfo.zip}
      </div>
    </div>
  );
};

export default Preview;