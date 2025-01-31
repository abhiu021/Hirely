const express = require('express');
const router = express.Router();
const Personal = require('../models/Personal');

// Create new personal information entry
router.post('/', async (req, res) => {
  try {
    const personalInfo = new Personal(req.body);
    await personalInfo.save();
    res.status(201).json({ resumeId: personalInfo._id });
  } catch (error) {
    console.error('Error saving personal information:', error);
    res.status(500).json({ error: 'Failed to create personal information' });
  }
});

// Fetch personal information by ID
router.get('/:id', async (req, res) => {
  try {
    const personalInfo = await Personal.findById(req.params.id);
    if (!personalInfo) {
      return res.status(404).json({ error: 'Personal information not found' });
    }
    res.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal information:', error);
    res.status(500).json({ error: 'Failed to fetch personal information' });
  }
});

module.exports = router;