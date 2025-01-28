import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import TemplateGallery from './components/TemplateGallery';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PersonalForm from './components/resume/forms/PersonalForm';
import ExperienceForm from './components/resume/forms/ExperienceForm';
import EducationForm from './components/resume/forms/EducationForm';
import SkillsForm from './components/resume/forms/SkillsForm';
import Preview from './components/resume/Preview';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/resume/*" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="personal" />} />
            <Route path="personal" element={<PersonalForm />} />
            <Route path="experience" element={<ExperienceForm />} />
            <Route path="education" element={<EducationForm />} />
            <Route path="skills" element={<SkillsForm />} />
            <Route path="preview" element={<Preview />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;