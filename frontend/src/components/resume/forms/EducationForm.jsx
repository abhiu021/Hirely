import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EducationForm = () => {
  const navigate = useNavigate();
  const [educations, setEducations] = useState([{
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    currentlyStudying: false
  }]);

  const addEducation = () => {
    setEducations([...educations, {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false
    }]);
  };

  const removeEducation = (index) => {
    const newEducations = [...educations];
    newEducations.splice(index, 1);
    setEducations(newEducations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const education of educations) {
        if (!education.school || !education.degree || !education.fieldOfStudy || !education.startDate) {
          alert('Please fill in all required fields');
          return;
        }
      }
      const response = await axios.post('http://localhost:5000/api/education', educations);
      console.log('Response received:', response.data); // Add logging here
      navigate('/resume/skills'); // Navigate to the skills form
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Education</h1>
      <form onSubmit={handleSubmit}>
        {educations.map((edu, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="School"
              value={edu.school}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[index].school = e.target.value;
                setEducations(newEdu);
              }}
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[index].degree = e.target.value;
                setEducations(newEdu);
              }}
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[index].fieldOfStudy = e.target.value;
                setEducations(newEdu);
              }}
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              type="date"
              placeholder="Start Date"
              value={edu.startDate}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[index].startDate = e.target.value;
                setEducations(newEdu);
              }}
              className="w-full p-2 border rounded-lg mb-2"
              required
            />
            <input
              type="date"
              placeholder="End Date"
              value={edu.endDate}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[index].endDate = e.target.value;
                setEducations(newEdu);
              }}
              className="w-full p-2 border rounded-lg mb-2"
            />
            <div className="flex items-center mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={edu.currentlyStudying}
                  onChange={(e) => {
                    const newEdu = [...educations];
                    newEdu[index].currentlyStudying = e.target.checked;
                    setEducations(newEdu);
                  }}
                  className="mr-2"
                />
                <span>I am currently studying here</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
        >
          Add Education
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save Education
        </button>
      </form>
    </div>
  );
};

export default EducationForm;