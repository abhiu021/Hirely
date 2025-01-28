const express = require('express');
const Education = require('../models/Education');
const router = express.Router();

// Create new education endpoint
router.post('/', async (req, res) => {
  try {
    const educations = req.body;
    console.log('Received educations:', educations); // Add logging here
    const savedEducations = [];
    for (const edu of educations) {
      const { school, degree, fieldOfStudy, startDate, endDate, currentlyStudying } = edu;
      const newEducation = new Education({
        school,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        currentlyStudying
      });
      const savedEducation = await newEducation.save();
      console.log("Education saved: ", savedEducation);
      savedEducations.push(savedEducation);
    }
    res.status(201).json(savedEducations);
  } catch (error) {
    console.error('Error saving new education:', error);
    res.status(500).json({ error: 'Failed to create new education' });
  }
});

module.exports = router;