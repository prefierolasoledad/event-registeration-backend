const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    college: String,
    year: String,
    branch: String,
    github: String,
    linkedin: String,
    // resumeUrl: String, // Local path or cloud URL
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
