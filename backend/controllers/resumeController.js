import { getAuth, requireAuth } from '@clerk/express';
import Resume from '../models/Resume.js';

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
import { clerkClient } from '@clerk/express'; 
export const getUserResumes = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request
    const { userId } = getAuth(req);
    
    // Fetch the user details from Clerk using the userId
    const user = await clerkClient.users.getUser (userId);

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

    if(!updateData){
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
    
    const {id}  = req.body;
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