import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkClient, requireAuth } from '@clerk/express' // Corrected Clerk middleware import
import connectDB from './db/connectDB.js';
import resumeRoutes from './routes/resumeRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import { clerkMiddleware } from '@clerk/express'
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes.js';
import axios from 'axios'; // Add this line at the top of your backend file

dotenv.config();

const app=express();
app.use(bodyParser.json());


// Middleware
app.use(cors());
app.use(clerkMiddleware())
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Make uploads folder static

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log('Connected to the database');
//   })
//   .catch((error) => {
//     console.error('Connection error:', error);
//   });

// Import routes
// const cvRoutes = require('./routes/cvRoutes');
// const skillsRoutes = require('./routes/skillsRoutes');
// const experienceRoutes = require('./routes/experienceRoutes');
// const resumeRoutes = require('./routes/resumeRoutes');
// const educationRoutes = require('./routes/educationRoutes');
// const personalRoutes = require('./routes/personalRoutes');
// const pdfRoutes = require('./routes/pdfRoutes');

// Use routes
// app.use('/api/cv', cvRoutes);
// app.use('/api/skills', skillsRoutes);
// app.use('/api/experience', experienceRoutes);
// app.use('/api/resume', resumeRoutes);
// app.use('/api/education', educationRoutes);
// app.use('/api/personal', personalRoutes);
// app.use('/api', pdfRoutes);

// Routes

app.use('/api/dashboard/', requireAuth(), resumeRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/certificates/', certificateRoutes);

app.post('/validate-link', async (req, res) => {
  const { link } = req.body;

  // Validate URL format
  try {
      new URL(link); // Throws error for invalid URLs
  } catch (error) {
      return res.status(400).json({ isValid: false, message: "Invalid URL format" });
  }

  // Check if the link is accessible
  try {
      const response = await axios.get(link, {
          timeout: 5000,
      });

      if (response.status === 200) {
          res.json({ isValid: true });
      } else {
          res.json({ isValid: false });
      }
  } catch (error) {
      console.error("Link validation failed:", error);
      res.status(500).json({ isValid: false, message: "Link validation failed" });
  }
});

  
 
//Connect to database
connectDB();  

// Start the server

app.get('/', (req, res) => {
  res.send('Server is running');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectDB();
  
});