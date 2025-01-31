const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

// Create new skill entry
router.post('/:resumeId', async (req, res) => {
  try {
    const { name } = req.body;
    const newSkill = new Skill({ name, resumeId: req.params.resumeId });
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    console.error('Error saving new skill:', error);
    res.status(500).json({ error: 'Failed to create new skill' });
  }
});

// Fetch all skills by resumeId
router.get('/:resumeId', async (req, res) => {
  try {
    const skills = await Skill.find({ resumeId: req.params.resumeId });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

module.exports = router;