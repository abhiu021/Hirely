const express = require('express');
const CV = require('../models/CV');
const router = express.Router();
const multer = require('multer');

// Configure multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create new CV endpoint
router.post('/create-cv', async (req, res) => {
  try {
    console.log('Request received:', req.body); // Add logging here
    // Create a new CV with default values
    const newCV = new CV({
      title: 'Untitled CV',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the new CV to the database
    const savedCV = await newCV.save();
    console.log('New CV saved:', savedCV); // Add logging here

    // Return the created CV
    res.status(201).json(savedCV);
  } catch (error) {
    console.error('Error saving new CV:', error); // Add logging here
    res.status(500).json({ error: 'Failed to create new CV' });
  }
});

module.exports = router;