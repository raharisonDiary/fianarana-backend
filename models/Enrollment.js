const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    transactionRef: { type: String },
    method: { type: String },
    isActivated: { type: Boolean, default: false },
    enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);