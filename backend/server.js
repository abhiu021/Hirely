const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cvRoutes = require('./routes/cvRoutes');
const path = require('path');
const fs = require('fs');
const skillsRoutes = require('./routes/skillsRoutes');
const resumeRoutes = require('./routes/resumeRoutes'); // Add this

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
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Example Route
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack Backend!!');
});

// Routes
app.use('/api/skills', skillsRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/resume', resumeRoutes); // Add this route

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
