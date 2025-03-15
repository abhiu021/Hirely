import { clerkClient } from '@clerk/express';
import { getAuth } from '@clerk/express';
import Resume from '../models/Resume.js';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PdfReader } from 'pdfreader';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { extractTextFromPdf, extractTextFromDocx, parseResumeText, parseResumeWithAI, mapParsedDataToSchema } from '../utils/pdfParser.js';
import pdfParse from 'pdf-parse';


dotenv.config();
// Ensure the 'uploads' directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to avoid conflicts
  },
});


// Create a new resume
export const createResume = async (req, res) => {
  try {
    // console.log('Request data:', req.body); // Log the request data
    const { title, resumeId, userEmail, userName } = req.body.data; // Extract from nested "data" object
    console.log('Request data:'); // Log the request data
    // Validate input
    if (!title || !resumeId || !userEmail || !userName) {
      console.log('All fields are required');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new resume
    const newResume = new Resume({
      title,
      resumeId,
      userEmail,
      userName,
    });

    // Save to database
    await newResume.save();

    // Return the created resume with documentId
    res.status(201).json({
      message: 'Resume created successfully',
      data: {
        documentId: newResume._id, // Return the MongoDB document ID
      },
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all resumes for the authenticated user
export const getUserResumes = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request
    const { userId } = getAuth(req);

    // Fetch the user details from Clerk using the userId
    const user = await clerkClient.users.getUser(userId);

    // Check if the user has email addresses
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return res.status(400).json({ message: 'User  email not found.' });
    }

    // Get the user's primary email
    const userEmail = user.emailAddresses[0].emailAddress;

    // Find resumes by user email
    const resumes = await Resume.find({ userEmail });
    // console.log('Resumes:', resumes); // Log the found resumes

    // Check if resumes were found
    if (!resumes.length) {
      return res.status(404).json({ message: 'No resumes found for this user.' });
    }

    // Return the found resumes
    res.status(200).json({ data: resumes }); // Wrap in a data object for consistency
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const id = req.params; // Get the ID from the request parameters

    // Find the resume by ID
    const resume = await Resume.findById(id); // Use findById to fetch a specific resume

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({ data: resume }); // Return the resume data in a structured format
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a resume
export const updateResume = async (req, res) => {
  try {
    console.log('hi'); // Log the request data
    const id = req.params; // Get the resume ID from the request parameters
    const updateData = req.body.data; // Get the update data from the request body
    console.log('Request data:', updateData); // Log the request data
    console.log('Resume ID:', id); // Log the resume ID

    // Validate the resumeId if necessary
    if (!id) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }

    if (!updateData) {
      return res.status(400).json({ message: 'Update data is required' });
    }

    // Find and update the resume
    const updatedResume = await Resume.findByIdAndUpdate(
      id, // Use the correct method
      { $set: updateData }, // Use $set to update only the fields provided
      { new: true } // Return the updated document and run validators
    );

    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({ message: 'Resume updated successfully', resume: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {

    const { id } = req.body;
    console.log(id)

    // Find and delete the resume
    const deletedResume = await Resume.findByIdAndDelete(id);

    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const upload = multer({ storage });

// Upload and parse a resume

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const uploadResume = async (req, res) => {
  try {
    const { userId } = req.auth; // Get the user ID from the request
    const user = await clerkClient.users.getUser(userId); // Fetch user details from Clerk

    console.log('Authenticated User:', user); // Log the authenticated user

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title } = req.body;
    const file = req.file;

    // Check if file is uploaded
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the uploaded file
    const fileBuffer = fs.readFileSync(file.path);
    const fileExtension = path.extname(file.originalname).toLowerCase();    let text;

    // Extract text based on file type
    if (fileExtension === '.pdf') {
      text = await extractTextFromPdf(fileBuffer);
    } else if (fileExtension === '.docx') {
      text = await extractTextFromDocx(fileBuffer);
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Only PDF and DOCX are allowed.' });
    }

    // Use Google Generative AI to parse the resume
    const parsedData = await parseResumeWithAI(text);

    // Map parsed data to resume schema
    const resumeData = mapParsedDataToSchema(parsedData);

    // Create a new resume in the database
    const newResume = new Resume(resumeData);

    // Save the resume to the database
    await newResume.save();

    // Delete the uploaded file after processing
    fs.unlinkSync(file.path);

    // Return the created resume with extracted data
    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      data: {
        documentId: newResume._id,
        extractedData: newResume,
      },
    });
  } catch (error) {
    console.error('Error uploading resume:', error);

    // Delete the uploaded file in case of an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to calculate ATS score
export const calculateATSScore = async (resumeText, jobDescription) => {
  const inputPrompt = `
    You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in the tech industry. Your primary task is to evaluate resumes based on the provided job description.

    Responsibilities:
    1. Assess resumes with a high degree of accuracy against the job description.
    2. Identify and highlight missing keywords crucial for the role.
    3. Provide a percentage match score reflecting the resume's alignment with the job requirements on the scale of 1-100.
    4. Offer detailed feedback for improvement to help candidates stand out.

    Resume: ${resumeText}
    Job Description: ${jobDescription}

    I want the response in the following strict JSON format:
    {
      "jobDescriptionMatch": "A percentage score (1-100) indicating how well the resume matches the job description.",
      "missingKeywords": ["List", "of", "missing", "keywords"],
      "profileSummary": "A brief summary of the candidate's profile.",
      "personalizedSuggestions": ["List", "of", "personalized", "suggestions"],
      "applicationSuccessRate": "A percentage score (1-100) indicating the likelihood of success."
    }

    Do not include any additional text or explanations outside the JSON format.
  `;

  try {
    const result = await model.generateContent(inputPrompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean the response to extract only the JSON part
    const jsonStartIndex = responseText.indexOf('{');
    const jsonEndIndex = responseText.lastIndexOf('}');
    const jsonString = responseText.slice(jsonStartIndex, jsonEndIndex + 1);

    // Parse the cleaned JSON string
    const atsScore = JSON.parse(jsonString);
    return atsScore;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error('Failed to generate content. Please try again later.');
  }
};

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath); // Read the file from disk
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Route to check ATS score
export const checkATSScore = async (req, res) => {
  try {
    const { file } = req; // Resume file uploaded by the user
    const { jobDescription } = req.body; // Job description from the request body

    // Validate inputs
    if (!file || !jobDescription) {
      return res.status(400).json({ message: 'Resume file and job description are required' });
    }

    // Extract text from the resume PDF
    const resumeText = await extractTextFromPDF(file.path);

    // Calculate ATS score
    const atsScore = await calculateATSScore(resumeText, jobDescription);
    console.log('ATS Score:', atsScore);

    // Return the ATS score
    res.status(200).json({
      message: 'ATS score calculated successfully',
      data: {
        atsScore, // Numerical score between 1 and 100
      },
    });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};