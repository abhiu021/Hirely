const express = require('express');
const Experience = require('../models/Experience');
const router = express.Router();

// Create new experience endpoint
router.post('/', async (req, res) => {
  try {
    const experiences = req.body;
    console.log('Received experiences:', experiences); // Add logging here
    const savedExperiences = [];
    for (const exp of experiences) {
      const { title, company, description, startDate, endDate, currentlyWorking } = exp;
      const newExperience = new Experience({
        title,
        company,
        description,
        startDate,
        endDate,
        currentlyWorking
      });
      const savedExperience = await newExperience.save();
      savedExperiences.push(savedExperience);
    }
    res.status(201).json(savedExperiences);
  } catch (error) {
    console.error('Error saving new experience:', error);
    res.status(500).json({ error: 'Failed to create new experience' });
  }
});

// Fetch all experience entries endpoint
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Fetch experience by ID endpoint
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// Update experience by ID endpoint
router.put('/:id', async (req, res) => {
  try {
    const { title, company, description, startDate, endDate, currentlyWorking } = req.body;
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      { title, company, description, startDate, endDate, currentlyWorking, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// Delete experience by ID endpoint
router.delete('/:id', async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

module.exports = router;