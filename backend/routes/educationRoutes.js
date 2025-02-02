// const express = require('express');
// const Education = require('../models/Education');
// const router = express.Router();

// // Create new education entry
// router.post('/:resumeId', async (req, res) => {
//   try {
//     const newEducation = new Education({ ...req.body, resumeId: req.params.resumeId });
//     const savedEducation = await newEducation.save();
//     res.status(201).json(savedEducation);
//   } catch (error) {
//     console.error('Error saving new education:', error);
//     res.status(500).json({ error: 'Failed to create new education' });
//   }
// });

// // Fetch all educations by resumeId
// router.get('/:resumeId', async (req, res) => {
//   try {
//     const educations = await Education.find({ resumeId: req.params.resumeId });
//     res.json(educations);
//   } catch (error) {
//     console.error('Error fetching educations:', error);
//     res.status(500).json({ error: 'Failed to fetch educations' });
//   }
// });

// module.exports = router;