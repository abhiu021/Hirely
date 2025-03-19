import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the resume
  resumeId: { type: String, required: true, unique: true }, // Unique ID for the resume
  userEmail: { type: String, required: true }, // Email of the user who uploaded the resume
  userName: { type: String, required: true }, // Name of the user who uploaded the resume
  personalDetails: {
    firstName: String,
    lastName: String,
    jobTitle: String,
    address: String,
    phone: String,
    email: String,
  },
  education: [
    {
      universityName: String,
      degree: String,
      major: String,
      startDate: String,
      endDate: String,
      description: String,
      
      verification: {
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected', null],
          default: null
        },
        documentUrl: String,
        submittedAt: Date,
        method: {
          type: String,
          enum: ['document', 'linkedin', null],
          default: null
        }
      }
    },
  ],
  Experience: [
    {
      title: String,
      companyName: String,
      city: String,
      state: String,
      startDate: String,
      endDate: String,
      workSummery: String,
      certificate: {
        fileUrl: String,
        fileName: String,
        uploaded: {
          type: Boolean,
          default: false
        },
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }
    },
  ],
  skills: [
    {
      name: String,
      rating: Number,
    },
  ],
  projects: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      technologies: { type: String, required: true },
      link: { type: String, default: '' },
      isVerified: { type: Boolean, default: false },
    },
  ],
  summery: { type: String }, // Summary of the resume
  themeColor: String, // Theme color for the resume
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }, // Status of the resume
  atsScore: { type: Number, min: 0, max: 100 }, // ATS Score (0-100)
  uploadDate: { type: Date, default: Date.now }, // Date when the resume was uploaded
  fileName: { type: String }, // Name of the uploaded file (e.g., resume.pdf)
  filePath: { type: String }, // Path to the uploaded file
  createdAt: { type: Date, default: Date.now }, // Timestamp when the resume was created
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;