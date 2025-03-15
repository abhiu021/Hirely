import express from 'express';
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  uploadResume,
  checkATSScore,
  calculateATSScore

} from '../controllers/resumeController.js';
import multer from 'multer';

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create a new resume
router.post('/', createResume);

router.post('/check-ats-score', upload.single('pdf_doc'),  checkATSScore);

// Upload and parse a resume
router.post('/upload', upload.single('pdf_doc'), uploadResume);

// Get all resumes for the authenticated user
router.get('/', getUserResumes);

// Fetch a single resume by ID
router.get('/resume/:_id/edit', getResumeById);

// Update a resume
router.put('/resume/:_id/edit', updateResume);

// Delete a resume
router.delete('/', deleteResume);

export default router;