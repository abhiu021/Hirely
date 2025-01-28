const express = require('express');
const Personal = require('../models/Personal');
const router = express.Router();

// Create new personal information endpoint
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, zip } = req.body;
    console.log('Request received:', req.body); // Add logging here

    // Create a new personal information with the provided values
    const newPersonal = new Personal({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip
    });

    // Save the new personal information to the database
    const savedPersonal = await newPersonal.save();
    console.log('New personal information saved:', savedPersonal); // Add logging here

    // Return the created personal information
    res.status(201).json(savedPersonal);
  } catch (error) {
    console.error('Error saving new personal information:', error); // Add logging here
    res.status(500).json({ error: 'Failed to create new personal information' });
  }
});

// Fetch all personal information entries endpoint
router.get('/', async (req, res) => {
  try {
    const personalInfo = await Personal.find();
    res.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal information:', error); // Add logging here
    res.status(500).json({ error: 'Failed to fetch personal information' });
  }
});

// Fetch personal information by ID endpoint
router.get('/:id', async (req, res) => {
  try {
    const personalInfo = await Personal.findById(req.params.id);
    if (!personalInfo) {
      return res.status(404).json({ error: 'Personal information not found' });
    }
    res.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal information:', error); // Add logging here
    res.status(500).json({ error: 'Failed to fetch personal information' });
  }
});

// Update personal information by ID endpoint
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, zip } = req.body;
    const updatedPersonal = await Personal.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, address, city, state, zip, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedPersonal) {
      return res.status(404).json({ error: 'Personal information not found' });
    }
    res.json(updatedPersonal);
  } catch (error) {
    console.error('Error updating personal information:', error); // Add logging here
    res.status(500).json({ error: 'Failed to update personal information' });
  }
});

// Delete personal information by ID endpoint
router.delete('/:id', async (req, res) => {
  try {
    const deletedPersonal = await Personal.findByIdAndDelete(req.params.id);
    if (!deletedPersonal) {
      return res.status(404).json({ error: 'Personal information not found' });
    }
    res.json({ message: 'Personal information deleted successfully' });
  } catch (error) {
    console.error('Error deleting personal information:', error); // Add logging here
    res.status(500).json({ error: 'Failed to delete personal information' });
  }
});

module.exports = router;