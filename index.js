const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

const Enrollment = mongoose.model('Enrollment', new mongoose.Schema({
    userEmail: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now }
}));

// --- ROUTES AUTH ---

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

// --- ROUTES COURSES ---

app.post('/api/courses/add', async (req, res) => {
    try {
        const { title, price, image, desc, category } = req.body;
        const newCourse = new Course({
            title,
            desc,
            price: Number(price),
            image,
            category,
            lessons: []
        });
        await newCourse.save();
        res.status(201).json({ success: true, message: "Course added!" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.get('/api/courses/all', async (req, res) => {
    try {
        const courses = await Course.find().sort({ _id: -1 });
        res.json(courses);
    } catch (err) { res.status(500).send("Erreur server"); }
});

// --- ROUTES FAVORITES ---

app.post('/api/favorites/toggle', async (req, res) => {
    try {
        const { email, courseId } = req.body;
        const formattedEmail = email.toLowerCase().trim();
        const existing = await Favorite.findOne({ email: formattedEmail, courseId });
        if (existing) {
            await Favorite.deleteOne({ email: formattedEmail, courseId });
            return res.json({ success: true, action: "removed" });
        } else {
            const newFav = new Favorite({ email: formattedEmail, courseId });
            await newFav.save();
            return res.json({ success: true, action: "added" });
        }
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/favorites/all', async (req, res) => {
    try {
        const { email } = req.query;
        const favs = await Favorite.find({ email: email.toLowerCase().trim() }).populate('courseId');
        const courses = favs.filter(f => f.courseId).map(f => f.courseId);
        res.json(courses);
    } catch (err) { res.status(500).json([]); }
});

// --- ROUTES ENROLLMENT (MY LEARNING) ---

app.post('/api/enroll', async (req, res) => {
    try {
        const { userEmail, courseId } = req.body;
        const formattedEmail = userEmail.toLowerCase().trim();

        // Jereo raha efa nividy izy
        const existing = await Enrollment.findOne({ userEmail: formattedEmail, courseId });
        if (existing) {
            return res.status(400).json({ message: "Efa nividy ity cours ity ianao!" });
        }

        const newEnroll = new Enrollment({ userEmail: formattedEmail, courseId });
        await newEnroll.save();
        res.status(201).json({ success: true, message: "Tafiditra ao amin'ny fianaranao!" });
    } catch (err) {
        res.status(500).json({ message: "Erreur tamin'ny fividianana" });
    }
});

app.get('/api/my-learning/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();
        const enrollments = await Enrollment.find({ userEmail: email }).populate('courseId');
        
        // Sivanina mba tsy hisy cours efa voafafa (null)
        const courses = enrollments
            .filter(e => e.courseId != null)
            .map(e => e.courseId);
            
        res.json(courses);
    } catch (err) {
        res.status(500).json([]);
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend mandeha amin'ny port ${PORT}`));