import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResumePreview = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeId = localStorage.getItem('resumeId');
        if (resumeId) {
          const personalResponse = await axios.get(`http://localhost:5000/api/personal/${resumeId}`);
          setPersonalInfo(personalResponse.data);

          const skillsResponse = await axios.get(`http://localhost:5000/api/skills/${resumeId}`);
          setSkills(skillsResponse.data);

          const experienceResponse = await axios.get(`http://localhost:5000/api/experience/${resumeId}`);
          setExperiences(experienceResponse.data);

          const educationResponse = await axios.get(`http://localhost:5000/api/education/${resumeId}`);
          setEducations(educationResponse.data);

          setLoading(false);
        } else {
          setError('Resume ID not found');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">Resume Preview</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
        <p><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
        <p><strong>Email:</strong> {personalInfo.email}</p>
        <p><strong>Phone:</strong> {personalInfo.phone}</p>
        <p><strong>Address:</strong> {personalInfo.address}, {personalInfo.city}, {personalInfo.state}, {personalInfo.zip}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <ul>
          {skills.map(skill => (
            <li key={skill._id}>{skill.name}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Experience</h2>
        {experiences.map(experience => (
          <div key={experience._id} className="mb-4">
            <p><strong>Title:</strong> {experience.title}</p>
            <p><strong>Company:</strong> {experience.company}</p>
            <p><strong>Description:</strong> {experience.description}</p>
            <p><strong>Start Date:</strong> {experience.startDate}</p>
            <p><strong>End Date:</strong> {experience.endDate}</p>
            <p><strong>Currently Working:</strong> {experience.currentlyWorking ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Education</h2>
        {educations.map(education => (
          <div key={education._id} className="mb-4">
            <p><strong>School:</strong> {education.school}</p>
            <p><strong>Degree:</strong> {education.degree}</p>
            <p><strong>Field of Study:</strong> {education.fieldOfStudy}</p>
            <p><strong>Start Date:</strong> {education.startDate}</p>
            <p><strong>End Date:</strong> {education.endDate}</p>
            <p><strong>Currently Studying:</strong> {education.currentlyStudying ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResumePreview;