const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  jdReference: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  suggestions: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CV', cvSchema);