const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Skill', skillSchema);