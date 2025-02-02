// const express = require('express');
// const Experience = require('../models/Experience');
// const router = express.Router();

// // Create new experience entry
// router.post('/:resumeId', async (req, res) => {
//   try {
//     const newExperience = new Experience({ ...req.body, resumeId: req.params.resumeId });
//     const savedExperience = await newExperience.save();
//     res.status(201).json(savedExperience);
//   } catch (error) {
//     console.error('Error saving new experience:', error);
//     res.status(500).json({ error: 'Failed to create new experience' });
//   }
// });

// // Fetch all experiences by resumeId
// router.get('/:resumeId', async (req, res) => {
//   try {
//     const experiences = await Experience.find({ resumeId: req.params.resumeId });
//     res.json(experiences);
//   } catch (error) {
//     console.error('Error fetching experiences:', error);
//     res.status(500).json({ error: 'Failed to fetch experiences' });
//   }
// });

// module.exports = router;