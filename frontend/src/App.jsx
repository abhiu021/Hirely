import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import Home from './components/Home';
import Layout from './components/resume/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { LoginForm, SignupForm } from './components/auth/AuthForms';
import TemplateGallery from './components/templates/TemplateGallery';
import PersonalForm from './components/resume/forms/PersonalForm';
import ExperienceForm from './components/resume/forms/ExperienceForm';
import EducationForm from './components/resume/forms/EducationForm';
import SkillsForm from './components/resume/forms/SkillsForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;