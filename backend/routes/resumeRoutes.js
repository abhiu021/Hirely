import express from 'express';
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';

const router = express.Router();

// Create a new resume on dashboard 
// On create button click, a new resume is created
router.post('/', createResume);

// Get all resumes for the authenticated user on dashboard
// After clicking on create button fetch all available resumes for authenticated user
router.get('/', getUserResumes);

// Fetch a single resume by ID
// In (dashboard/:resumeId/edit) fetch a resume by ID
router.get('/resume/:_id/edit', getResumeById);

// Update a resume
router.put('/resume/:_id/edit', updateResume);

// Delete a resume
router.delete('/:resumeId/edit', deleteResume);

export default router;