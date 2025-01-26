import React from 'react';
import PersonalForm from './forms/PersonalForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';

const FormContent = ({ activeSection }) => {
  return (
    <div className="flex-1 bg-gray-50 p-8">
      {activeSection === 'personal' && <PersonalForm />}
      {activeSection === 'experience' && <ExperienceForm />}
      {activeSection === 'education' && <EducationForm />}
      {activeSection === 'skills' && <SkillsForm />}
    </div>
  );
};

export default FormContent;