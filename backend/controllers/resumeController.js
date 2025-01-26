const Resume = require('../models/Resume');

const savePersonalInfo = async (req, res) => {
  try {
    const resume = new Resume({
      personal: req.body
    });
    
    await resume.save();
    res.status(201).json({ resumeId: resume._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  savePersonalInfo
};