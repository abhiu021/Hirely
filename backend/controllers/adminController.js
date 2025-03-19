import Resume from '../models/Resume.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import archiver from 'archiver';

// Fetch all resumes with filters and search
export const getAllResumes = async (req, res) => {
    try {
      const { search, user, uploadDate, status, atsScoreMin, atsScoreMax } = req.query;
  
      // Log the received query parameters
      console.log('Query Parameters:', {
        search,
        user,
        uploadDate,
        status,
        atsScoreMin,
        atsScoreMax,
      });
  
      // Build the filter object
      const filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
        ];
      }
      if (user) filter.userName = user;
      if (uploadDate) filter.uploadDate = { $gte: new Date(uploadDate) };
      if (status) filter.status = status;
      if (atsScoreMin && atsScoreMax) {
        filter.atsScore = { $gte: parseFloat(atsScoreMin), $lte: parseFloat(atsScoreMax) };
      }
  
      // Log the final filter object
      console.log('Final Filter:', filter);
  
      // Fetch resumes from the database
      const resumes = await Resume.find(filter);
  
      // Log the fetched resumes
      console.log('Fetched Resumes:', resumes);
  
      // Always return an array, even if empty
      res.status(200).json({ data: resumes || [] });
    } catch (error) {
      console.error('Error fetching resumes:', error);
      res.status(500).json({ message: 'Internal server error', data: [] });
    }
  };

// Download a single resume
export const downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find the resume in the database
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if the file exists
    const filePath = path.join('uploads', resume.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send the file for download
    res.download(filePath, resume.fileName);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bulk download resumes
export const bulkDownloadResumes = async (req, res) => {
  try {
    const { resumeIds } = req.body;

    // Validate input
    if (!resumeIds || !Array.isArray(resumeIds)) {
      return res.status(400).json({ message: 'Invalid resume IDs' });
    }

    // Fetch resumes from the database
    const resumes = await Resume.find({ _id: { $in: resumeIds } });

    // Check if all files exist
    const missingFiles = resumes.filter((resume) => !fs.existsSync(path.join('uploads', resume.fileName)));
    if (missingFiles.length > 0) {
      return res.status(404).json({ message: 'Some files are missing' });
    }

    // Create a zip file for bulk download
    const zipFilePath = path.join('uploads', `resumes-${uuidv4()}.zip`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.download(zipFilePath, 'resumes.zip', () => {
        fs.unlinkSync(zipFilePath); // Delete the zip file after download
      });
    });

    archive.pipe(output);
    resumes.forEach((resume) => {
      archive.file(path.join('uploads', resume.fileName), { name: resume.fileName });
    });
    archive.finalize();
  } catch (error) {
    console.error('Error bulk downloading resumes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a single resume
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find and delete the resume
    const resume = await Resume.findByIdAndDelete(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Delete the file from the uploads folder
    const filePath = path.join('uploads', resume.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bulk delete resumes
export const bulkDeleteResumes = async (req, res) => {
  try {
    const { resumeIds } = req.body;

    // Validate input
    if (!resumeIds || !Array.isArray(resumeIds)) {
      return res.status(400).json({ message: 'Invalid resume IDs' });
    }

    // Fetch and delete resumes
    const resumes = await Resume.find({ _id: { $in: resumeIds } });
    await Resume.deleteMany({ _id: { $in: resumeIds } });

    // Delete files from the uploads folder
    resumes.forEach((resume) => {
      const filePath = path.join('uploads', resume.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.status(200).json({ message: `${resumes.length} resumes deleted successfully` });
  } catch (error) {
    console.error('Error bulk deleting resumes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};