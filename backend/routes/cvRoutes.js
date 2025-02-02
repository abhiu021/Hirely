// const express = require('express');
// const multer = require('multer');
// const CV = require('../models/CV');
// const router = express.Router();

// // Configure multer
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Analyze CV endpoint
// router.post('/analyze', upload.single('file'), async (req, res) => {
//   try {
//     const { domain, company, jobDescription } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Mock ATS analysis (replace with actual analysis logic)
//     const atsScore = Math.floor(Math.random() * 100);
//     const extractedProjects = [
//       { title: "Project 1", description: "Description 1" },
//       { title: "Project 2", description: "Description 2" }
//     ];
//     const suggestions = [
//       `Add more ${domain} specific keywords`,
//       `Include experience with ${company} technologies`,
//       'Quantify achievements'
//     ];

//     // Save to database
//     const newCV = new CV({
//       domain,
//       company,
//       jdReference: jobDescription,
//       filePath: file.path,
//       score: atsScore,
//       suggestions
//     });

//     await newCV.save();

//     res.json({
//       success: true,
//       atsScore,
//       extractedProjects,
//       suggestions,
//       cvId: newCV._id
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;