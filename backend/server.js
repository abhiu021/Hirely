import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { requireAuth } from '@clerk/express'; // Corrected Clerk middleware import
import connectDB from './db/connectDB.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app=express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/files', express.static('files')); // Make folder static

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

app.use('/api/dashboard', requireAuth(), resumeRoutes);



//Connect to database
connectDB();

// Start the server

app.get('/', (req, res) => {
  res.send('Server is running');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});