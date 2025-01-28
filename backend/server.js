require('events').EventEmitter.defaultMaxListeners = 20;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cvRoutes = require('./routes/cvRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const educationRoutes = require('./routes/educationRoutes');
const personalRoutes = require('./routes/personalRoutes');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

// Use routes
app.use('/api/cv', cvRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/personal', personalRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});