const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

// Create new skill endpoint
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newSkill = new Skill({ name });
    const savedSkill = await newSkill.save();
    console.log('New skill saved:', savedSkill); // Add logging here
    res.status(201).json(savedSkill);
  } catch (error) {
    console.error('Error saving new skill:', error);
    res.status(500).json({ error: 'Failed to create new skill' });
  }
});

// Fetch all skills endpoint
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Delete skill by ID endpoint
router.delete('/:id', async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

module.exports = router;