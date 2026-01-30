const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Enrollment = require('./models/Enrollment');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://diary:diary1234@cluster0.q60ysss.mongodb.net/fianarana?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Mifandray amin'ny MongoDB Atlas"))
  .catch(err => console.log("❌ Erreur MongoDB:", err));

// --- MODELS ---
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pseudo: { type: String, required: true }
}));

const Course = mongoose.model('Course', new mongoose.Schema({
    title: { type: String, required: true },
    desc: String,
    price: { type: Number, default: 0 },
    image: String,
    category: String,
    lessons: { type: Array, default: [] }
}));

const Favorite = mongoose.model('Favorite', new mongoose.Schema({
    email: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}));

// --- ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, pseudo } = req.body;
        const newUser = new User({ email: email.toLowerCase().trim(), password, pseudo });
        await newUser.save();
        res.status(201).json({ success: true });
    } catch (err) { res.status(400).json({ success: false }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user && user.password === password) {
            res.json({ success: true, email: user.email, pseudo: user.pseudo });
        } else { res.status(401).json({ success: false }); }
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/courses/all', async (req, res) => {
    try {
        const courses = await Course.find().sort({ _id: -1 });
        res.json(courses);
    } catch (err) { res.status(500).send("Erreur server"); }
});

// --- ENROLLMENT LOGIC ---

// 1. Mpianatra mividy
app.post('/api/enroll', async (req, res) => {
    try {
        const { userEmail, courseId, transactionRef, method } = req.body;
        const formattedEmail = userEmail.toLowerCase().trim();

        const existing = await Enrollment.findOne({ userEmail: formattedEmail, courseId });
        if (existing) return res.status(400).json({ message: "Efa nanao fangatahana!" });

        const newEnroll = new Enrollment({ 
            userEmail: formattedEmail, 
            courseId,
            transactionRef,
            method,
            isActivated: false // MIANDRY ADMIN FOANA ETO
        });
        await newEnroll.save();
        res.status(201).json({ success: true, message: "Demande envoyée!" });
    } catch (err) { res.status(500).json({ message: "Erreur" }); }
});

// 2. My Learning (Mpianatra)
app.get('/api/my-learning/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();
        const enrollments = await Enrollment.find({ userEmail: email, isActivated: true }).populate('courseId');
        const courses = enrollments.filter(e => e.courseId != null).map(e => e.courseId);
        res.json(courses);
    } catch (err) { res.status(500).json([]); }
});

// 3. Admin: Pending Payments
app.get('/api/admin/pending-payments', async (req, res) => {
    try {
        const pending = await Enrollment.find({ isActivated: false }).populate('courseId');
        const formatted = pending.map(p => ({
            _id: p._id,
            userEmail: p.userEmail,
            courseTitle: p.courseId ? p.courseId.title : "Cours inconnu",
            transactionRef: p.transactionRef,
            method: p.method
        }));
        res.json(formatted);
    } catch (err) { res.status(500).json([]); }
});

// 4. Admin Approve
app.post('/api/admin/approve-payment', async (req, res) => {
    try {
        const { enrollId } = req.body;
        const updated = await Enrollment.findByIdAndUpdate(enrollId, { isActivated: true }, { new: true });
        if (updated) res.json({ success: true });
        else res.status(404).json({ success: false });
    } catch (err) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));