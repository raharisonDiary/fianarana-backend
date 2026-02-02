/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://diary:diary1234@cluster0.q60ysss.mongodb.net/fianarana?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Mifandray amin'ny MongoDB Atlas"))
  .catch(err => console.log("❌ Erreur MongoDB:", err));

// --- 1. MODELS (Tsy maintsy faritana aloha ny Course vao ny Enrollment) ---

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

// Ity no nampiakatra ny error raha tsy hita ny model
const Enrollment = require('./models/Enrollment'); 

// --- 2. ROUTES AUTH ---

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

// --- 3. ROUTES COURSES ---

app.get('/api/courses/all', async (req, res) => {
    try {
        const courses = await Course.find().sort({ _id: -1 });
        res.json(courses); // Raha mbola [] ny valiny dia foana ny DB-nao
    } catch (err) { 
        console.log("Erreur API Courses:", err);
        res.status(500).json([]); 
    }
});

app.post('/api/courses/add', async (req, res) => {
    try {
        const { title, price, image, desc, category } = req.body;
        const newCourse = new Course({ title, desc, price: Number(price), image, category });
        await newCourse.save();
        res.status(201).json({ success: true });
    } catch (err) { res.status(400).json({ success: false }); }
});

// --- 4. ROUTES FAVORITES ---

app.post('/api/favorites/toggle', async (req, res) => {
    try {
        const { email, courseId } = req.body;
        const formattedEmail = email.toLowerCase().trim();
        const existing = await Favorite.findOne({ email: formattedEmail, courseId });
        if (existing) {
            await Favorite.deleteOne({ email: formattedEmail, courseId });
            res.json({ success: true, action: "removed" });
        } else {
            const newFav = new Favorite({ email: formattedEmail, courseId });
            await newFav.save();
            res.json({ success: true, action: "added" });
        }
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/favorites/all', async (req, res) => {
    try {
        const { email } = req.query;
        const favs = await Favorite.find({ email: email.toLowerCase().trim() }).populate('courseId');
        res.json(favs.filter(f => f.courseId).map(f => f.courseId));
    } catch (err) { res.status(500).json([]); }
});

// --- 5. LOJIKA VALIDATION (ENROLLMENT) ---

app.post('/api/enroll', async (req, res) => {
    try {
        const { userEmail, courseId, transactionRef, method } = req.body;
        const formattedEmail = userEmail.toLowerCase().trim();
        const existing = await Enrollment.findOne({ userEmail: formattedEmail, courseId });
        if (existing) return res.status(400).json({ message: "Efa miandry ianao" });

        const newEnroll = new Enrollment({ userEmail: formattedEmail, courseId, transactionRef, method, isActivated: false });
        await newEnroll.save();
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/my-learning/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();
        const enrollments = await Enrollment.find({ userEmail: email, isActivated: true }).populate('courseId');
        res.json(enrollments.filter(e => e.courseId).map(e => e.courseId));
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/admin/pending-payments', async (req, res) => {
    try {
        const pending = await Enrollment.find({ isActivated: false }).populate('courseId');
        res.json(pending.map(p => ({
            _id: p._id,
            userEmail: p.userEmail,
            courseTitle: p.courseId ? p.courseId.title : "Inconnu",
            transactionRef: p.transactionRef,
            method: p.method
        })));
    } catch (err) { res.status(500).json([]); }
});

app.post('/api/admin/approve-payment', async (req, res) => {
    try {
        const { enrollId } = req.body;
        await Enrollment.findByIdAndUpdate(enrollId, { isActivated: true });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));*/ 
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

// Enrollment Model
const Enrollment = require('./models/Enrollment'); 

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
    } catch (err) { res.status(500).json([]); }
});

app.post('/api/courses/add', async (req, res) => {
    try {
        const { title, price, image, desc, category } = req.body;
        const newCourse = new Course({ title, desc, price: Number(price), image, category });
        await newCourse.save();
        res.status(201).json({ success: true });
    } catch (err) { res.status(400).json({ success: false }); }
});

// --- ENROLLMENT & VALIDATION LOGIC ---

// 1. Mandefa fangatahana (isActivated dia FALSE foana eto)
app.post('/api/enroll', async (req, res) => {
    try {
        const { userEmail, courseId, transactionRef, method } = req.body;
        const formattedEmail = userEmail.toLowerCase().trim();
        
        const existing = await Enrollment.findOne({ userEmail: formattedEmail, courseId });
        if (existing) return res.status(400).json({ message: "Efa miandry validation ianao." });

        const newEnroll = new Enrollment({ 
            userEmail: formattedEmail, 
            courseId, 
            transactionRef, 
            method, 
            isActivated: false 
        });
        await newEnroll.save();
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 2. My Learning (Ireo manana isActivated: TRUE ihany)
app.get('/api/my-learning/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase().trim();
        const enrollments = await Enrollment.find({ userEmail: email, isActivated: true }).populate('courseId');
        const courses = enrollments.filter(e => e.courseId).map(e => e.courseId);
        res.json(courses);
    } catch (err) { res.status(500).json([]); }
});

// 3. Admin: Mijery ireo mbola FALSE ihany
app.get('/api/admin/pending-payments', async (req, res) => {
    try {
        const pending = await Enrollment.find({ isActivated: false }).populate('courseId');
        res.json(pending.map(p => ({
            _id: p._id,
            userEmail: p.userEmail,
            courseTitle: p.courseId ? p.courseId.title : "Cours inconnu",
            transactionRef: p.transactionRef,
            method: p.method
        })));
    } catch (err) { res.status(500).json([]); }
});

// 4. Admin: Validation (Ito no manova azy ho TRUE)
app.post('/api/admin/approve-payment', async (req, res) => {
    try {
        const { enrollId } = req.body;
        const updated = await Enrollment.findByIdAndUpdate(
            enrollId, 
            { isActivated: true }, 
            { new: true }
        );
        if (updated) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "ID tsy hita" });
        }
    } catch (err) { res.status(500).json({ success: false }); }
});

// Favorites
app.post('/api/favorites/toggle', async (req, res) => {
    try {
        const { email, courseId } = req.body;
        const existing = await Favorite.findOne({ email: email.toLowerCase().trim(), courseId });
        if (existing) {
            await Favorite.deleteOne({ email: email.toLowerCase().trim(), courseId });
            res.json({ success: true, action: "removed" });
        } else {
            const newFav = new Favorite({ email: email.toLowerCase().trim(), courseId });
            await newFav.save();
            res.json({ success: true, action: "added" });
        }
    } catch (err) { res.status(500).json({ success: false }); }
});

app.get('/api/favorites/all', async (req, res) => {
    try {
        const { email } = req.query;
        const favs = await Favorite.find({ email: email.toLowerCase().trim() }).populate('courseId');
        res.json(favs.filter(f => f.courseId).map(f => f.courseId));
    } catch (err) { res.status(500).json([]); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));