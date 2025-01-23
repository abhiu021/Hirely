const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: String,
  domain: String,
  company: String,
  jdReference: String,
  template: String,
  score: Number,
  suggestions: Array,
});

module.exports = mongoose.model('CV', cvSchema);
