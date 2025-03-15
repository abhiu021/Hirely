import express from 'express';
import { isAdmin } from '../middleware/isAdmin.js';
import { clerkClient } from '@clerk/express';
import {
  getAllResumes,
  downloadResume,
  bulkDownloadResumes,
  deleteResume,
  bulkDeleteResumes,
} from '../controllers/adminController.js';

const router = express.Router();

// Fetch all users (admin-only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const response = await clerkClient.users.getUserList(); // Fetch all users from Clerk
    const users = response.data;

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullName: user.fullName || 'N/A',
      email: user.emailAddresses?.[0]?.emailAddress || 'N/A',
      role: user.publicMetadata?.role || 'user',
    }));

    res.status(200).json({ data: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch a single user (admin-only)
router.get('/users/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await clerkClient.users.getUser(userId); // Fetch the user from Clerk
    res.status(200).json({
      data: {
        id: user.id,
        fullName: user.fullName || 'N/A',
        email: user.emailAddresses?.[0]?.emailAddress || 'N/A',
        role: user.publicMetadata?.role || 'user',
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new user (admin-only)
router.post('/users', isAdmin, async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Validate input
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the user in Clerk
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ')[1],
      publicMetadata: { role },
    });

    res.status(201).json({ message: 'User created successfully', data: user });
  } catch (error) {
    console.error('Error creating user:', error);

    // Return specific error messages
    let errorMessage = 'Failed to create user';
    if (error.errors) {
      errorMessage = error.errors.map((err) => err.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({ message: errorMessage });
  }
});

// Update a user (admin-only)
router.put('/users/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, role } = req.body;

    // Update the user in Clerk
    await clerkClient.users.updateUser(userId, {
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ')[1],
      publicMetadata: { role },
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a user (admin-only)
router.delete('/users/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    await clerkClient.users.deleteUser(userId); // Delete the user from Clerk
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all resumes (admin-only)
router.get('/resumes', isAdmin, getAllResumes);

// Download a single resume
router.get('/resumes/:resumeId/download', isAdmin, downloadResume);

// Bulk download resumes
router.post('/resumes/bulk-download', isAdmin, bulkDownloadResumes);

// Delete a single resume
router.delete('/resumes/:resumeId', isAdmin, deleteResume);

// Bulk delete resumes
router.post('/resumes/bulk-delete', isAdmin, bulkDeleteResumes);

export default router;