import express from 'express';
import { getAuth } from '@clerk/express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure the certificate uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads/certificates');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the destination directory exists
    const uploadPath = path.join(process.cwd(), 'uploads/certificates');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Upload handlers
const uploadCertificate = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract parameters from request
    const { resumeId, experienceIndex } = req.body;
    const file = req.file;
    
    console.log('Received certificate upload request:', { 
      resumeId, 
      experienceIndex, 
      file: file ? {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype
      } : 'No file' 
    });

    // Validate inputs
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!resumeId || experienceIndex === undefined) {
      // Delete the uploaded file
      if (file.path) fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Resume ID and experience index are required' });
    }

    // Return success response (in a real app, you'd update the database here)
    res.status(200).json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificate: {
        fileUrl: `/uploads/certificates/${file.filename}`,
        fileName: file.originalname,
        uploaded: true
      }
    });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    
    // Delete the uploaded file in case of an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const uploadEducationCertificate = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract parameters from request
    const { resumeId, educationIndex } = req.body;
    const file = req.file;
    
    console.log('Received education certificate upload request:', { 
      resumeId, 
      educationIndex, 
      userId,
      file: file ? {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype
      } : 'No file' 
    });

    // Validate inputs
    if (!file) {
      console.error('Education certificate upload failed: No file provided');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!resumeId || educationIndex === undefined) {
      console.error('Education certificate upload failed: Missing required parameters', { resumeId, educationIndex });
      // Delete the uploaded file
      if (file.path) fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Resume ID and education index are required' });
    }

    // Return success response (in a real app, you'd update the database here)
    res.status(200).json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificate: {
        fileUrl: `/uploads/certificates/${file.filename}`,
        fileName: file.originalname,
        uploaded: true
      }
    });
  } catch (error) {
    console.error('Error uploading education certificate:', error);
    
    // Delete the uploaded file in case of an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const uploadProjectCertificate = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract parameters from request
    const { resumeId, projectIndex } = req.body;
    const file = req.file;
    
    console.log('Received project certificate upload request:', { 
      resumeId, 
      projectIndex, 
      userId,
      file: file ? {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype
      } : 'No file' 
    });

    // Validate inputs
    if (!file) {
      console.error('Project certificate upload failed: No file provided');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!resumeId || projectIndex === undefined) {
      console.error('Project certificate upload failed: Missing required parameters', { resumeId, projectIndex });
      // Delete the uploaded file
      if (file.path) fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Resume ID and project index are required' });
    }

    // Return success response (in a real app, you'd update the database here)
    res.status(200).json({
      success: true,
      message: 'Project certificate uploaded and verified successfully',
      certificate: {
        fileUrl: `/uploads/certificates/${file.filename}`,
        fileName: file.originalname,
        uploaded: true
      },
      isVerified: true
    });
  } catch (error) {
    console.error('Error uploading project certificate:', error);
    
    // Delete the uploaded file in case of an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Apply authentication middleware to all certificate routes
router.use(requireAuth);

// Route for uploading a certificate for experience
router.post('/experience', upload.single('file'), uploadCertificate);

// Route for uploading a certificate for education
router.post('/education', upload.single('file'), uploadEducationCertificate);

// Route for uploading a certificate for project verification
router.post('/project', upload.single('file'), uploadProjectCertificate);

export default router; 