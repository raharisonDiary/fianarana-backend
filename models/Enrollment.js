const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    transactionRef: { type: String, required: true },
    method: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);