const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    transactionRef: { type: String }, // Laharan'ny SMS (Réf)
    method: { type: String },         // mvola, orange, airtel
    isActivated: { type: Boolean, default: false }, // 'false' aloha satria miandry ny admin
    enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);