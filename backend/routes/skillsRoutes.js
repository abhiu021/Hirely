const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
});

// Add a new skill
router.post('/', async (req, res) => {
  try {
    const { skill } = req.body;
    const newSkill = new Skill({ skill });
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Error saving skill', error });
  }
});

// Delete a skill
router.delete('/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error });
  }
});

module.exports = router;