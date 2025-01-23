const express = require('express');
const CV = require('../models/CV');
const router = express.Router();

// Create new CV
router.post('/create', async (req, res) => {
  try {
    const cv = new CV(req.body);
    await cv.save();
    res.status(201).json(cv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update existing CV
router.put('/update/:id', async (req, res) => {
  try {
    const cv = await CV.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get suggestions for CV analysis
router.post('/analyze', (req, res) => {
  const { domain, company } = req.body;
  // Dummy suggestions logic
  const suggestions = [
    `Focus on ${domain} skills.`,
    `Include more information about ${company}.`,
  ];
  res.json({ suggestions });
});

module.exports = router;
